// routes/auth.js — Handles login, logout, forgot/reset password
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const { requireLogin } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Add reset token columns if they don't exist yet
pool.query(`
  ALTER TABLE clients
    ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
    ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP
`).catch(err => console.error('Migration error (reset cols):', err.message));

// ─── Nodemailer transporter ────────────────────────────────────────────────
function makeTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.leadconnectorhq.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

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
  res.json({ success: true });
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
    res.json({ user: client });
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

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = makeTransporter();
      await transporter.sendMail({
        from: `"Done For You Marketing" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: client.email,
        subject: 'Reset your password',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1F3D2C;">
            <p style="font-size:16px;">Hi ${client.name},</p>
            <p style="font-size:15px;">We received a request to reset your password for your DFY Marketing client portal.</p>
            <p style="margin:32px 0;">
              <a href="${resetLink}"
                style="background:#2D6B4F;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;">
                Reset my password
              </a>
            </p>
            <p style="font-size:13px;color:#6B756B;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } else {
      console.warn('[forgot-password] SMTP not configured — reset link:', resetLink);
    }

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
