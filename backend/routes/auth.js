// routes/auth.js — Handles login and logout
// POST /api/auth/login  → checks email + password, returns a token
// POST /api/auth/logout → clears the token cookie
// GET  /api/auth/me     → returns the logged-in user's info

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { requireLogin } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Look up the client by email
    const result = await pool.query(
      'SELECT * FROM clients WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    const client = result.rows[0];

    if (!client) {
      // Don't tell them specifically that the email doesn't exist — security best practice
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare the entered password against the stored hash
    const passwordMatch = await bcrypt.compare(password, client.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Create a JWT token that expires in 7 days
    // This is what proves they're logged in on future requests
    const token = jwt.sign(
      { id: client.id, email: client.email, name: client.name, is_admin: client.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store the token in a cookie (httpOnly = JS can't read it = more secure)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    res.json({
      success: true,
      user: { id: client.id, name: client.name, email: client.email, is_admin: client.is_admin }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // delete the cookie
  res.json({ success: true });
});

// GET /api/auth/me — returns logged-in user info (used by frontend to check if logged in)
router.get('/me', requireLogin, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
