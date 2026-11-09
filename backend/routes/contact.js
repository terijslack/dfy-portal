const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { sendContactInquiry, sendClientMessage } = require('../services/email');
const { addInquiryLead, addGbpAuditLead, addGuideLead } = require('../services/crm');
const gbpAuditEmail = require('../services/gbpAuditEmail');
const guideEmail = require('../services/guideEmail');
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
    // Best-effort — an email failure must never break the form response
    sendContactInquiry({ name: name.trim(), email: email.trim(), message: message.trim() })
      .catch(err => console.error('[contact] Email notification failed:', err.message));
    res.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Free Google Business Profile audit form on /landing (replaces the GoHighLevel
// "GBP Survey" and its workflows). Saves the request, adds the person to
// Contacts + Pipeline (New Lead, $800, source "GBP Audit"), emails them the
// thank-you email and emails hello@.
const MAX_LEN = { name: 120, business_name: 160, email: 200, phone: 40, gbp_link: 500, notes: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Light spam guard: this form emails whatever address is typed in, so stop
// one visitor from sending more than a handful in a short time.
const recent = new Map(); // ip -> [timestamps]
const LIMIT = 5, WINDOW_MS = 60 * 60 * 1000;
function tooMany(ip) {
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter(t => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > LIMIT;
}

router.post('/gbp-audit', async (req, res) => {
  const body = req.body || {};
  // Hidden "company_website" field: people never see it, bots fill it in
  if (body.company_website) return res.json({ success: true });

  const f = {};
  for (const k of Object.keys(MAX_LEN)) f[k] = String(body[k] || '').trim().slice(0, MAX_LEN[k]);
  if (!f.name || !f.business_name || !f.email) {
    return res.status(400).json({ error: 'Please fill in your name, business name and email.' });
  }
  if (!EMAIL_RE.test(f.email)) {
    return res.status(400).json({ error: 'Please check your email address.' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'unknown';
  if (tooMany(`audit:${ip}`)) {
    return res.status(429).json({ error: "We've already got your request. If you need us sooner, email hello@dfymarketinggroup.com or call (530) 753-2013." });
  }

  try {
    const saved = await pool.query(
      `INSERT INTO gbp_audit_requests (name, business_name, email, phone, gbp_link, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [f.name, f.business_name, f.email, f.phone || null, f.gbp_link || null, f.notes || null]
    );
    const row = saved && saved.rows && saved.rows[0];
    const request = { ...f, id: row && row.id, created_at: row && row.created_at };

    // Best-effort — none of these may break the form for the visitor
    addGbpAuditLead(request)
      .catch(err => console.error('[gbp-audit] Could not add lead to contacts:', err.message));
    gbpAuditEmail.sendThankYou(request)
      .catch(err => console.error('[gbp-audit] Thank-you email failed:', err.response?.data?.error?.message || err.message));
    gbpAuditEmail.sendTeamAlert(request)
      .catch(err => console.error('[gbp-audit] Team alert failed:', err.response?.data?.error?.message || err.message));

    res.json({ success: true });
  } catch (err) {
    console.error('[gbp-audit] Could not save request:', err.message);
    res.status(500).json({ error: "Something went wrong. Please try again, or email hello@dfymarketinggroup.com." });
  }
});

// Free guide form ("7 Proven Posts Any Trade Can Steal") on /free and
// /free-guide (replaces the GoHighLevel form and its "Guide download"
// workflow). Saves the request, adds the person to Contacts + Pipeline (New
// Lead, source "Free guide"), emails them the guide, and returns the download
// link so the page can show it right away.
router.post('/guide', async (req, res) => {
  const body = req.body || {};
  if (body.company_website) return res.json({ success: true, downloadUrl: guideEmail.GUIDE_PATH });

  const name = String(body.name || '').trim().slice(0, MAX_LEN.name);
  const email = String(body.email || '').trim().slice(0, MAX_LEN.email);
  const page = String(body.page || '').trim().slice(0, 40) || null;
  if (!name || !email) {
    return res.status(400).json({ error: 'Please fill in your name and email.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please check your email address.' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip || 'unknown';
  if (tooMany(`guide:${ip}`)) {
    // They already have it: just hand over the link again
    return res.json({ success: true, downloadUrl: guideEmail.GUIDE_PATH });
  }

  try {
    const saved = await pool.query(
      'INSERT INTO guide_requests (name, email, page) VALUES ($1, $2, $3) RETURNING id, created_at',
      [name, email, page]
    );
    const row = saved && saved.rows && saved.rows[0];
    const request = { name, email, page, id: row && row.id, created_at: row && row.created_at };

    addGuideLead(request)
      .catch(err => console.error('[guide] Could not add lead to contacts:', err.message));
    guideEmail.sendGuide(request)
      .catch(err => console.error('[guide] Guide email failed:', err.response?.data?.error?.message || err.message));

    res.json({ success: true, downloadUrl: guideEmail.GUIDE_PATH });
  } catch (err) {
    console.error('[guide] Could not save request:', err.message);
    res.status(500).json({ error: "Something went wrong. Please try again, or email hello@dfymarketinggroup.com." });
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
