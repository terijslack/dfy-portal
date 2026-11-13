// routes/auth.js — Handles login, logout, forgot/reset password
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordReset } = require('../services/email');
const { Pool } = require('pg');
const { requireLogin } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Add reset token columns if they don't exist yet
pool.query(`
  ALTER TABLE clients
    ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR,
    ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP
`).catch(err => console.error('Migration error (reset cols):', err.message));

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM clients WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    const client = result.rows[0];

    if (!client) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, client.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: client.id, email: client.email, name: client.name, is_admin: client.is_admin, business_name: client.business_name || null },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: { id: client.id, name: client.name, email: client.email, is_admin: client.is_admin, business_name: client.business_name || null }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('admin_token');
  res.json({ success: true });
});

// ── One login: admin ↔ DFY's own client account ───────────────────────────
// The admin can open the client portal as DFY's own client account (the row
// with is_house_account = TRUE) without a second login. The admin's own
// session is parked in an admin_token cookie so "Back to admin" can restore it.
const cookieOpts = maxAge => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge });
const WEEK = 7 * 24 * 60 * 60 * 1000;

function verify(token) {
  try { return jwt.verify(token, process.env.JWT_SECRET); } catch { return null; }
}

// POST /api/auth/house-view — admin switches to DFY's client account
router.post('/house-view', requireLogin, async (req, res) => {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Admin access only.' });
  try {
    const house = (await pool.query(
      'SELECT id, name, email, business_name FROM clients WHERE is_house_account = TRUE AND NOT COALESCE(is_admin, FALSE) ORDER BY id LIMIT 1'
    )).rows[0];
    if (!house) return res.status(404).json({ error: "DFY's own client account isn't set up yet." });

    const token = jwt.sign(
      { id: house.id, email: house.email, name: house.name, is_admin: false, business_name: house.business_name || null, admin_id: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('admin_token', req.cookies.token, cookieOpts(WEEK));
    res.cookie('token', token, cookieOpts(WEEK));
    res.json({ success: true, redirect: '/dashboard' });
  } catch (err) {
    console.error('House view error:', err);
    res.status(500).json({ error: 'Could not switch. Try again.' });
  }
});

// POST /api/auth/back-to-admin — return from DFY's client account to the admin
router.post('/back-to-admin', async (req, res) => {
  const admin = verify(req.cookies?.admin_token);
  if (!admin || !admin.is_admin) {
    res.clearCookie('admin_token');
    return res.status(401).json({ error: 'Please log in again.', redirect: '/login' });
  }
  try {
    // Still an admin? (in case access was removed since)
    const row = (await pool.query('SELECT is_admin FROM clients WHERE id = $1', [admin.id])).rows[0];
    if (!row || !row.is_admin) {
      res.clearCookie('admin_token');
      return res.status(403).json({ error: 'Admin access only.', redirect: '/login' });
    }
    res.cookie('token', req.cookies.admin_token, cookieOpts(WEEK));
    res.clearCookie('admin_token');
    res.json({ success: true, redirect: '/admin/dashboard' });
  } catch (err) {
    console.error('Back to admin error:', err);
    res.status(500).json({ error: 'Could not switch back. Try again.' });
  }
});

// GET /api/auth/me
router.get('/me', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, is_admin, business_name FROM clients WHERE id = $1',
      [req.user.id]
    );
    const client = result.rows[0];
    if (!client) return res.status(401).json({ error: 'Account not found.' });
    // viewing_as_admin: the admin is looking at DFY's own client account
    res.json({ user: { ...client, viewing_as_admin: Boolean(req.user.admin_id) } });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Could not load user.' });
  }
});

// POST /api/auth/forgot-password
// Takes an email, generates a reset token, and emails a link
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const result = await pool.query(
      'SELECT * FROM clients WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    // Always respond with success — don't reveal whether email exists
    if (!result.rows[0]) {
      return res.json({ success: true });
    }

    const client = result.rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      'UPDATE clients SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [token, expires, client.id]
    );

    const appUrl = process.env.APP_URL || 'https://dfymarketinggroup.com';
    const resetLink = `${appUrl}/reset-password.html?token=${token}`;

await sendPasswordReset(client.email, resetLink);
    res.json({ success: true });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

// POST /api/auth/reset-password
// Validates the token and updates the password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM clients
       WHERE password_reset_token = $1
         AND password_reset_expires > NOW()`,
      [token]
    );

    if (!result.rows[0]) {
      return res.status(400).json({ error: 'This reset link is invalid or has expired.' });
    }

    const client = result.rows[0];
    const hashed = await bcrypt.hash(password, 12);

    await pool.query(
      `UPDATE clients
       SET password = $1, password_reset_token = NULL, password_reset_expires = NULL
       WHERE id = $2`,
      [hashed, client.id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

module.exports = router;
