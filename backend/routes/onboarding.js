// routes/onboarding.js — Saves and retrieves client onboarding intake data
// POST /api/onboarding — save intake form (requires auth)
// GET  /api/onboarding — get saved intake (requires auth)

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { syncContactToGHL } = require('../services/ghl');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create table on startup if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS client_onboarding (
    id SERIAL PRIMARY KEY,
    client_id INTEGER UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
    industry VARCHAR(255),
    website VARCHAR(500),
    phone VARCHAR(50),
    location VARCHAR(255),
    platforms JSONB DEFAULT '[]',
    social_notes TEXT,
    brand_voice VARCHAR(100),
    target_audience TEXT,
    content_themes TEXT,
    avoid_content TEXT,
    primary_goal VARCHAR(100),
    additional_notes TEXT,
    referral_source VARCHAR(255),
    completed_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`).catch(err => console.error('Onboarding table init error:', err));

pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS social_notes TEXT`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS address VARCHAR(255)`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS city VARCHAR(100)`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS state VARCHAR(100)`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS zip VARCHAR(20)`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS business_email VARCHAR(255)`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS timezone VARCHAR(100)`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS brand_identity_mode TEXT`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS unique_selling_point TEXT`).catch(() => {});

// Middleware: require valid JWT cookie
function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid session' });
  }
}

// POST /api/onboarding — save/update intake form data
router.post('/', requireAuth, async (req, res) => {
  const clientId = req.user.id;
  const body = req.body || {};

  // Only save the fields this request actually sent. The onboarding form and the
  // profile page each send a different set of fields; saving one must not blank out
  // answers that only the other one collects (e.g. referral_source, platforms).
  const FIELDS = [
    'industry', 'website', 'phone', 'location', 'address', 'city', 'state', 'zip',
    'business_email', 'timezone', 'platforms', 'social_notes', 'brand_voice',
    'target_audience', 'content_themes', 'unique_selling_point', 'avoid_content',
    'primary_goal', 'additional_notes', 'referral_source',
  ];
  const sent = FIELDS.filter(f => f in body);
  const value = f => f === 'platforms'
    ? JSON.stringify(body.platforms || [])
    : (typeof body[f] === 'string' ? (body[f].trim() || null) : (body[f] ?? null));

  try {
    const cols = sent.join(', ');
    const placeholders = sent.map((_, i) => `$${i + 2}`).join(', ');
    const updates = sent.map(f => `${f} = EXCLUDED.${f}`).concat('updated_at = NOW()').join(', ');
    await pool.query(
      `INSERT INTO client_onboarding (client_id${sent.length ? ', ' + cols : ''}, completed_at, updated_at)
       VALUES ($1${sent.length ? ', ' + placeholders : ''}, NOW(), NOW())
       ON CONFLICT (client_id) DO UPDATE SET ${updates}`,
      [clientId, ...sent.map(value)]
    );

    res.json({ success: true });

    // Fire-and-forget GHL sync — errors are logged but never exposed to the client
    try {
      const [clientRes, socialsRes] = await Promise.all([
        pool.query('SELECT id, name, email, business_name FROM clients WHERE id = $1', [clientId]),
        pool.query('SELECT platform, username FROM social_accounts WHERE client_id = $1', [clientId]),
      ]);
      const client = clientRes.rows[0];
      if (client) {
        syncContactToGHL(client, req.body, socialsRes.rows).catch(err =>
          console.error('GHL sync error:', err.message)
        );
      }
    } catch (ghlSetupErr) {
      console.error('GHL sync setup error:', ghlSetupErr.message);
    }

  } catch (err) {
    console.error('Onboarding save error:', err);
    res.status(500).json({ error: 'Could not save onboarding data.' });
  }
});

// POST /api/onboarding/brand-identity-mode — save mode choice ('self' or 'import')
router.post('/brand-identity-mode', requireAuth, async (req, res) => {
  const { mode } = req.body;
  if (!['self', 'import'].includes(mode)) return res.status(400).json({ error: 'Invalid mode.' });
  try {
    await pool.query(
      `INSERT INTO client_onboarding (client_id, brand_identity_mode, completed_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       ON CONFLICT (client_id) DO UPDATE SET brand_identity_mode = $2, updated_at = NOW()`,
      [req.user.id, mode]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Brand identity mode save error:', err.message);
    res.status(500).json({ error: 'Could not save.' });
  }
});

// GET /api/onboarding — retrieve saved intake
router.get('/', requireAuth, async (req, res) => {
  const clientId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM client_onboarding WHERE client_id = $1',
      [clientId]
    );
    res.json({ onboarding: result.rows[0] || null });
  } catch (err) {
    console.error('Onboarding fetch error:', err);
    res.status(500).json({ error: 'Could not load onboarding data.' });
  }
});

module.exports = router;
