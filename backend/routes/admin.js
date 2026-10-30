// routes/admin.js — Admin-only routes (only you can access these)
// GET  /api/admin/clients          → list all clients with plan, status, profile progress, post stats
// GET  /api/admin/clients/:id      → one client's full record (account, business profile, socials, brand assets)
// PUT  /api/admin/clients/:id      → edit a client's account info and business profile
// GET  /api/admin/clients/:id/posts → get all posts for a specific client
// POST /api/admin/posts            → create a new post for a client
// PUT  /api/admin/posts/:id        → edit a post (e.g. after client requests changes)
// DELETE /api/admin/posts/:id      → delete a post

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { requireAdmin } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// admin_notes: private notes only admins can see (added in database/migrate.js;
// never returned by any client-facing route)

// Business-profile fields the admin can edit. These live in the same tables the
// client's /profile page reads and writes, so there is only ever one copy of the data.
const CLIENT_FIELDS = ['name', 'email', 'business_name', 'admin_notes'];
const PROFILE_FIELDS = [
  'industry', 'website', 'phone', 'address', 'city', 'state', 'zip',
  'business_email', 'timezone', 'brand_voice', 'target_audience', 'content_themes',
  'unique_selling_point', 'avoid_content', 'primary_goal', 'additional_notes',
  'social_notes', 'referral_source',
];
// Fields used to show how complete a client's profile is
const KEY_PROFILE_FIELDS = [
  'industry', 'website', 'phone', 'brand_voice', 'target_audience',
  'content_themes', 'unique_selling_point', 'primary_goal',
];

// GET /api/admin/clients — list all clients with plan, status, profile progress and post counts
router.get('/clients', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id, c.name, c.email, c.business_name, c.created_at,
        c.plan, c.status, c.subscription_status,
        o.updated_at AS profile_updated_at,
        (${KEY_PROFILE_FIELDS.map(f => `(CASE WHEN COALESCE(o.${f}::text, '') <> '' THEN 1 ELSE 0 END)`).join(' + ')}) AS profile_filled,
        ${KEY_PROFILE_FIELDS.length} AS profile_total,
        (SELECT COUNT(*) FROM social_accounts s WHERE s.client_id = c.id) AS social_count,
        (SELECT COUNT(*) FROM posts p WHERE p.client_id = c.id) AS total_posts,
        (SELECT COUNT(*) FROM posts p WHERE p.client_id = c.id AND p.status = 'pending') AS pending,
        (SELECT COUNT(*) FROM posts p WHERE p.client_id = c.id AND p.status = 'approved') AS approved,
        (SELECT COUNT(*) FROM posts p WHERE p.client_id = c.id AND p.status = 'changes_requested') AS changes_requested
      FROM clients c
      LEFT JOIN client_onboarding o ON o.client_id = c.id
      WHERE c.is_admin = false
      ORDER BY COALESCE(c.business_name, c.name)
    `);

    res.json({ clients: result.rows });
  } catch (err) {
    console.error('Admin get clients error:', err);
    res.status(500).json({ error: 'Could not load clients.' });
  }
});

// GET /api/admin/clients/:id — everything we know about one client
router.get('/clients/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });

  try {
    const [clientRes, profileRes, socialsRes, contactRes] = await Promise.all([
      pool.query(
        `SELECT id, name, email, business_name, created_at, plan, status, subscription_status,
                billing_date, subscription_start_date, stripe_customer_id, admin_notes
         FROM clients WHERE id = $1 AND is_admin = false`,
        [id]
      ),
      pool.query('SELECT * FROM client_onboarding WHERE client_id = $1', [id]),
      pool.query(
        `SELECT platform, username, profile_url, connected_at
         FROM social_accounts WHERE client_id = $1 ORDER BY connected_at ASC`,
        [id]
      ),
      pool.query('SELECT id FROM contacts WHERE client_id = $1', [id]).catch(() => ({ rows: [] })),
    ]);

    const client = clientRes.rows[0];
    if (!client) return res.status(404).json({ error: 'Client not found.' });

    const p = profileRes.rows[0] || {};
    const profile = {};
    PROFILE_FIELDS.forEach(f => { profile[f] = p[f] ?? null; });
    profile.platforms = p.platforms || [];
    profile.updated_at = p.updated_at || null;

    res.json({
      client,
      profile,
      brand_assets: {
        logo_url: p.logo_url || null,
        content_urls: p.content_urls || [],
        brand_colors: p.brand_colors || [],
        brand_typography: p.brand_typography || {},
        brand_website_url: p.brand_website_url || null,
        brand_import_mode: p.brand_import_mode || p.brand_identity_mode || null,
      },
      // Passwords are never sent to the browser, not even to admins
      socials: socialsRes.rows,
      contact_id: contactRes.rows[0] ? contactRes.rows[0].id : null,
    });
  } catch (err) {
    console.error('Admin get client error:', err);
    res.status(500).json({ error: 'Could not load client.' });
  }
});

// PUT /api/admin/clients/:id — edit a client's info and business profile.
// Only fields included in the request are changed. Plan and billing are not
// editable here because they must stay in step with Stripe.
router.put('/clients/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });

  const body = req.body || {};
  const clean = v => (typeof v === 'string' ? (v.trim() || null) : v ?? null);

  const clientUpdates = CLIENT_FIELDS.filter(f => f in body);
  const profileUpdates = PROFILE_FIELDS.filter(f => f in body);

  if ('name' in body && !clean(body.name)) {
    return res.status(400).json({ error: 'Name cannot be empty.' });
  }
  if ('email' in body) {
    const email = (body.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    body.email = email;
  }

  const db = await pool.connect();
  try {
    const exists = await db.query('SELECT id FROM clients WHERE id = $1 AND is_admin = false', [id]);
    if (!exists.rows.length) return res.status(404).json({ error: 'Client not found.' });

    if ('email' in body) {
      const dupe = await db.query('SELECT id FROM clients WHERE email = $1 AND id != $2', [body.email, id]);
      if (dupe.rows.length) return res.status(409).json({ error: 'That email is already used by another account.' });
    }

    await db.query('BEGIN');

    if (clientUpdates.length) {
      const sets = clientUpdates.map((f, i) => `${f} = $${i + 1}`).join(', ');
      await db.query(
        `UPDATE clients SET ${sets} WHERE id = $${clientUpdates.length + 1}`,
        [...clientUpdates.map(f => clean(body[f])), id]
      );
    }

    if (profileUpdates.length) {
      // Make sure the client has a profile row, then update only the fields sent
      await db.query(
        `INSERT INTO client_onboarding (client_id, completed_at, updated_at)
         VALUES ($1, NOW(), NOW()) ON CONFLICT (client_id) DO NOTHING`,
        [id]
      );
      const sets = profileUpdates.map((f, i) => `${f} = $${i + 1}`).join(', ');
      await db.query(
        `UPDATE client_onboarding SET ${sets}, updated_at = NOW() WHERE client_id = $${profileUpdates.length + 1}`,
        [...profileUpdates.map(f => clean(body[f])), id]
      );
    }

    await db.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {});
    console.error('Admin update client error:', err);
    res.status(500).json({ error: 'Could not save changes.' });
  } finally {
    db.release();
  }
});

// GET /api/admin/clients/:id/posts — get all posts for one specific client
router.get('/clients/:id/posts', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE client_id = $1 ORDER BY scheduled_date ASC',
      [req.params.id]
    );

    res.json({ posts: result.rows });
  } catch (err) {
    console.error('Admin get posts error:', err);
    res.status(500).json({ error: 'Could not load posts.' });
  }
});

// POST /api/admin/posts — create a new post for a client
router.post('/posts', requireAdmin, async (req, res) => {
  const { client_id, caption, platform, scheduled_date } = req.body;

  if (!client_id || !caption || !platform || !scheduled_date) {
    return res.status(400).json({ error: 'client_id, caption, platform, and scheduled_date are all required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO posts (client_id, caption, platform, scheduled_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [client_id, caption, platform, scheduled_date]
    );

    res.json({ success: true, post: result.rows[0] });
  } catch (err) {
    console.error('Admin create post error:', err);
    res.status(500).json({ error: 'Could not create post.' });
  }
});

// PUT /api/admin/posts/:id — edit a post (after client requests changes)
router.put('/posts/:id', requireAdmin, async (req, res) => {
  const { caption, platform, scheduled_date, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE posts 
       SET caption = COALESCE($1, caption),
           platform = COALESCE($2, platform),
           scheduled_date = COALESCE($3, scheduled_date),
           status = COALESCE($4, status),
           change_notes = NULL,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [caption, platform, scheduled_date, status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.json({ success: true, post: result.rows[0] });
  } catch (err) {
    console.error('Admin update post error:', err);
    res.status(500).json({ error: 'Could not update post.' });
  }
});

// DELETE /api/admin/posts/:id — delete a post
router.delete('/posts/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete post error:', err);
    res.status(500).json({ error: 'Could not delete post.' });
  }
});

module.exports = router;
