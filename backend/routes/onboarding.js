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

pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS social_notes TEXT`)
  .catch(() => {});

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
  const {
    industry, website, phone, location,
    platforms, social_notes, brand_voice, target_audience,
    content_themes, avoid_content,
    primary_goal, additional_notes, referral_source
  } = req.body;

  try {
    await pool.query(`
      INSERT INTO client_onboarding
        (client_id, industry, website, phone, location, platforms, social_notes,
         brand_voice, target_audience, content_themes, avoid_content, primary_goal,
         additional_notes, referral_source, completed_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, NOW(), NOW())
      ON CONFLICT (client_id) DO UPDATE SET
        industry = EXCLUDED.industry,
        website = EXCLUDED.website,
        phone = EXCLUDED.phone,
        location = EXCLUDED.location,
        platforms = EXCLUDED.platforms,
        social_notes = EXCLUDED.social_notes,
        brand_voice = EXCLUDED.brand_voice,
        target_audience = EXCLUDED.target_audience,
        content_themes = EXCLUDED.content_themes,
        avoid_content = EXCLUDED.avoid_content,
        primary_goal = EXCLUDED.primary_goal,
        additional_notes = EXCLUDED.additional_notes,
        referral_source = EXCLUDED.referral_source,
        updated_at = NOW()
    `, [
      clientId, industry, website, phone, location,
      JSON.stringify(platforms || []), social_notes || null,
      brand_voice, target_audience, content_themes, avoid_content,
      primary_goal, additional_notes, referral_source
    ]);

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
