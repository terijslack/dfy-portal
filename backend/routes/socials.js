// routes/socials.js — Social account connections per client
// GET  /api/socials        → returns saved social accounts for logged-in client
// PUT  /api/socials        → save/update social accounts (array of up to 4)
// DELETE /api/socials/:platform → remove a connected account

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { requireLogin } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ALLOWED_PLATFORMS = ['instagram', 'facebook', 'linkedin', 'tiktok', 'twitter'];

// Create table if it doesn't exist yet
pool.query(`
  CREATE TABLE IF NOT EXISTS social_accounts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(255) NOT NULL,
    profile_url VARCHAR(500),
    connected_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(client_id, platform)
  )
`).catch(err => console.error('social_accounts table init error:', err));

// GET /api/socials
router.get('/', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT platform, username, profile_url, connected_at FROM social_accounts WHERE client_id = $1 ORDER BY connected_at ASC',
      [req.user.id]
    );
    res.json({ accounts: result.rows });
  } catch (err) {
    console.error('Get socials error:', err);
    res.status(500).json({ error: 'Could not load social accounts.' });
  }
});

// PUT /api/socials/:platform — save or update a single account
router.put('/:platform', requireLogin, async (req, res) => {
  const platform = req.params.platform.toLowerCase();
  if (!ALLOWED_PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: 'Invalid platform.' });
  }

  const { username, profile_url } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    // Check they don't already have 4 different platforms connected
    const existing = await pool.query(
      'SELECT platform FROM social_accounts WHERE client_id = $1',
      [req.user.id]
    );
    const platforms = existing.rows.map(r => r.platform);
    if (!platforms.includes(platform) && platforms.length >= 4) {
      return res.status(400).json({ error: 'You can connect up to 4 accounts. Remove one first.' });
    }

    await pool.query(
      `INSERT INTO social_accounts (client_id, platform, username, profile_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (client_id, platform)
       DO UPDATE SET username = $3, profile_url = $4, connected_at = NOW()`,
      [req.user.id, platform, username.trim(), profile_url || null]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Save social error:', err);
    res.status(500).json({ error: 'Could not save account.' });
  }
});

// DELETE /api/socials/:platform — disconnect an account
router.delete('/:platform', requireLogin, async (req, res) => {
  const platform = req.params.platform.toLowerCase();
  try {
    await pool.query(
      'DELETE FROM social_accounts WHERE client_id = $1 AND platform = $2',
      [req.user.id, platform]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Delete social error:', err);
    res.status(500).json({ error: 'Could not remove account.' });
  }
});

module.exports = router;
