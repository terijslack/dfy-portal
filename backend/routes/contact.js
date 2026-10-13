const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { sendContactInquiry } = require('../services/email');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
})();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    await pool.query(
      'INSERT INTO contact_inquiries (name, email, message) VALUES ($1, $2, $3)',
      [name.trim(), email.trim(), message.trim()]
    );
    // Best-effort — a GHL failure must never break the form response
    sendContactInquiry({ name: name.trim(), email: email.trim(), message: message.trim() })
      .catch(err => console.error('[contact] Email notification failed:', err.message));
    res.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
