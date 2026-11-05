const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { sendContactInquiry, sendClientMessage } = require('../services/email');
const { addInquiryLead } = require('../services/crm');
const { requireLogin } = require('../middleware/auth');

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
    const saved = await pool.query(
      'INSERT INTO contact_inquiries (name, email, message) VALUES ($1, $2, $3) RETURNING id, created_at',
      [name.trim(), email.trim(), message.trim()]
    );
    // Best-effort — add them to Contacts and the Pipeline in the admin portal
    const row = saved && saved.rows && saved.rows[0];
    if (row && row.id) {
      addInquiryLead({ id: row.id, name: name.trim(), email: email.trim(), message: message.trim(), created_at: row.created_at })
        .catch(err => console.error('[contact] Could not add lead to contacts:', err.message));
    }
    // Best-effort — a GHL failure must never break the form response
    sendContactInquiry({ name: name.trim(), email: email.trim(), message: message.trim() })
      .catch(err => console.error('[contact] Email notification failed:', err.message));
    res.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Logged-in clients: the "Send a Message" form on the portal's Contact Us page.
// Emails hello@ with the client's name/business; Reply goes straight to the client.
router.post('/client', requireLogin, async (req, res) => {
  const subject = (req.body.subject || '').trim();
  const message = (req.body.message || '').trim();
  if (!subject || !message) {
    return res.status(400).json({ error: 'Please fill in both fields.' });
  }
  try {
    let name = req.user.name || '';
    let email = req.user.email || '';
    let businessName = req.user.business_name || '';
    try {
      const r = await pool.query('SELECT name, email, business_name FROM clients WHERE id = $1', [req.user.id]);
      if (r.rows[0]) {
        name = r.rows[0].name || name;
        email = r.rows[0].email || email;
        businessName = r.rows[0].business_name || businessName;
      }
    } catch (_) { /* fall back to what's in the login token */ }

    await sendClientMessage({ name, businessName, email, subject, message });
    res.json({ success: true });
  } catch (err) {
    console.error('[contact] Client portal message failed:', err.message);
    res.status(500).json({ error: "Your message didn't send. Please email hello@dfymarketinggroup.com or call (530) 753-2013." });
  }
});

module.exports = router;
