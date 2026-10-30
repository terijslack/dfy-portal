// routes/admin.js — Admin-only routes (only you can access these)
// GET    /api/admin/clients                    → Accounts list: business, status, priority, city, plan
// GET    /api/admin/clients/:id                → one account: profile, plan, people, brand, socials, deals, timeline
// PUT    /api/admin/clients/:id                → edit account info, priority, business profile, internal notes
// POST   /api/admin/clients/:id/notes          → add an internal note to the account timeline
// POST   /api/admin/clients/:id/messages       → send a message / yes-no question to their dashboard
// DELETE /api/admin/clients/:id/messages/:mid  → take back a message they haven't answered
// POST   /api/admin/clients/:id/people         → add a person to the account (new, or link an existing contact)
// DELETE /api/admin/clients/:id/people/:pid    → unlink a person from the account
// GET    /api/admin/clients/:id/posts          → get all posts for a specific client
// POST   /api/admin/posts                      → create a new post for a client
// PUT    /api/admin/posts/:id                  → edit a post (e.g. after client requests changes)
// DELETE /api/admin/posts/:id                  → delete a post
//
// "Clients" in the code = "Accounts" on screen: one per paying business.

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { requireAdmin } = require('../middleware/auth');
const { planTier, accountStatus, PRIORITIES } = require('../config/accounts');
const { syncAll } = require('../services/crm');
const { logForClient } = require('../services/activity');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// admin_notes: private notes only admins can see (added in database/migrate.js;
// never returned by any client-facing route)

// Business-profile fields the admin can edit. These live in the same tables the
// client's /profile page reads and writes, so there is only ever one copy of the data.
const CLIENT_FIELDS = ['name', 'email', 'business_name', 'admin_notes', 'priority', 'metricool_blog_id'];
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
const LABELS = {
  name: 'Contact name', email: 'Login email', business_name: 'Business name', metricool_blog_id: 'Metricool brand ID', industry: 'Industry',
  website: 'Website', phone: 'Phone', address: 'Address', city: 'City', state: 'State', zip: 'ZIP',
  business_email: 'Business email', timezone: 'Time zone', brand_voice: 'Brand voice',
  target_audience: 'Target audience', content_themes: 'Customer pain points',
  unique_selling_point: 'What makes them different', avoid_content: 'Topics to avoid',
  primary_goal: 'Main goal', additional_notes: 'Additional notes', social_notes: 'Notes about their social accounts',
  referral_source: 'How they heard about us',
};

// Keep contacts/timeline current before showing accounts; never block the page on it
async function synced(req, res, next) {
  try { await syncAll(); } catch (err) { console.error('CRM sync error:', err.message); }
  next();
}

const withAccountInfo = c => ({ ...c, plan_tier: planTier(c.plan), ...accountStatus(c) });

// GET /api/admin/clients — the Accounts list
router.get('/clients', requireAdmin, synced, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id, c.name, c.email, c.business_name, c.created_at,
        c.plan, c.status, c.subscription_status, c.priority,
        o.city, o.state,
        o.updated_at AS profile_updated_at,
        (${KEY_PROFILE_FIELDS.map(f => `(CASE WHEN COALESCE(o.${f}::text, '') <> '' THEN 1 ELSE 0 END)`).join(' + ')}) AS profile_filled,
        ${KEY_PROFILE_FIELDS.length} AS profile_total,
        (SELECT COUNT(*) FROM social_accounts s WHERE s.client_id = c.id) AS social_count,
        (SELECT COUNT(*) FROM posts p WHERE p.client_id = c.id) AS total_posts,
        (SELECT COUNT(*) FROM posts p WHERE p.client_id = c.id AND p.status = 'pending') AS pending,
        (SELECT COUNT(*) FROM posts p WHERE p.client_id = c.id AND p.status = 'approved') AS approved,
        (SELECT COUNT(*) FROM posts p WHERE p.client_id = c.id AND p.status = 'changes_requested') AS changes_requested,
        (SELECT MAX(a.created_at) FROM contact_activity a JOIN contacts ct ON ct.id = a.contact_id
           WHERE ct.client_id = c.id OR ct.account_id = c.id) AS last_activity
      FROM clients c
      LEFT JOIN client_onboarding o ON o.client_id = c.id
      WHERE c.is_admin = false
      ORDER BY COALESCE(c.business_name, c.name)
    `);

    res.json({ clients: result.rows.map(withAccountInfo) });
  } catch (err) {
    console.error('Admin get clients error:', err);
    res.status(500).json({ error: 'Could not load accounts.' });
  }
});

// GET /api/admin/clients/:id — everything we know about one account
router.get('/clients/:id', requireAdmin, synced, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });

  try {
    const [clientRes, profileRes, socialsRes, peopleRes, activityRes, dealsRes, messagesRes] = await Promise.all([
      pool.query(
        `SELECT id, name, email, business_name, created_at, plan, status, subscription_status,
                billing_date, subscription_start_date, stripe_customer_id, admin_notes, priority,
                metricool_blog_id
         FROM clients WHERE id = $1 AND is_admin = false`,
        [id]
      ),
      pool.query('SELECT * FROM client_onboarding WHERE client_id = $1', [id]),
      pool.query(
        `SELECT platform, username, profile_url, connected_at
         FROM social_accounts WHERE client_id = $1 ORDER BY connected_at ASC`,
        [id]
      ),
      pool.query(
        `SELECT id, name, email, phone, job_title, source, client_id, account_id
         FROM contacts WHERE client_id = $1 OR account_id = $1
         ORDER BY (client_id IS NOT NULL) DESC, name`,
        [id]
      ),
      pool.query(
        `SELECT a.id, a.type, a.body, a.created_at, ct.name AS person
         FROM contact_activity a JOIN contacts ct ON ct.id = a.contact_id
         WHERE ct.client_id = $1 OR ct.account_id = $1
         ORDER BY a.created_at DESC, a.id DESC LIMIT 300`,
        [id]
      ),
      pool.query(
        `SELECT o.id, o.title, o.stage, o.value, o.source, o.stage_changed_at, ct.name AS person
         FROM opportunities o JOIN contacts ct ON ct.id = o.contact_id
         WHERE ct.client_id = $1 OR ct.account_id = $1
         ORDER BY o.created_at DESC`,
        [id]
      ),
      pool.query(
        `SELECT id, body, ask, response, reply, responded_at, created_at
         FROM client_messages WHERE client_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [id]
      ),
    ]);

    const client = clientRes.rows[0];
    if (!client) return res.status(404).json({ error: 'Account not found.' });

    const p = profileRes.rows[0] || {};
    const profile = {};
    PROFILE_FIELDS.forEach(f => { profile[f] = p[f] ?? null; });
    profile.platforms = p.platforms || [];
    profile.updated_at = p.updated_at || null;

    const people = peopleRes.rows;
    res.json({
      client: withAccountInfo(client),
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
      people,
      contact_id: (people.find(x => x.client_id === id) || {}).id || null,
      activity: activityRes.rows,
      deals: dealsRes.rows,
      messages: messagesRes.rows,
    });
  } catch (err) {
    console.error('Admin get client error:', err);
    res.status(500).json({ error: 'Could not load account.' });
  }
});

// PUT /api/admin/clients/:id — edit an account. Only fields included in the request
// are changed. Plan and billing are not editable here because they must stay in
// step with Stripe.
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
  if ('priority' in body) {
    body.priority = clean(body.priority);
    if (body.priority && !PRIORITIES.includes(body.priority)) {
      return res.status(400).json({ error: 'Priority must be high, medium or low.' });
    }
  }
  if ('email' in body) {
    const email = (body.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    body.email = email;
  }

  const db = await pool.connect();
  let changed = [];
  try {
    const before = (await db.query(
      `SELECT c.*, o.* FROM clients c LEFT JOIN client_onboarding o ON o.client_id = c.id
       WHERE c.id = $1 AND c.is_admin = false`, [id]
    )).rows[0];
    if (!before) return res.status(404).json({ error: 'Account not found.' });

    if ('email' in body) {
      const dupe = await db.query('SELECT id FROM clients WHERE email = $1 AND id != $2', [body.email, id]);
      if (dupe.rows.length) return res.status(409).json({ error: 'That email is already used by another account.' });
    }

    const norm = v => (v === null || v === undefined ? '' : String(v).trim());
    changed = [...clientUpdates, ...profileUpdates].filter(f => norm(clean(body[f])) !== norm(before[f]));

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
    return res.status(500).json({ error: 'Could not save changes.' });
  } finally {
    db.release();
  }

  // Timeline entries for what we changed (after responding; never blocks the save)
  try {
    const shown = changed.filter(f => LABELS[f]);
    if (shown.length) await logForClient(id, 'dfy', `DFY updated their profile: ${shown.map(f => LABELS[f]).join(', ')}`);
    if (changed.includes('priority')) await logForClient(id, 'system', `Priority set to ${body.priority ? body.priority[0].toUpperCase() + body.priority.slice(1) : 'none'}`);
  } catch (err) {
    console.error('Admin update timeline error:', err.message);
  }
});

// POST /api/admin/clients/:id/notes — internal note on the account timeline
router.post('/clients/:id/notes', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const text = typeof req.body?.body === 'string' ? req.body.body.trim() : '';
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  if (!text) return res.status(400).json({ error: 'Write a note first.' });
  try {
    const exists = await pool.query('SELECT 1 FROM clients WHERE id = $1 AND is_admin = false', [id]);
    if (!exists.rows.length) return res.status(404).json({ error: 'Account not found.' });
    await logForClient(id, 'note', text);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin account note error:', err);
    res.status(500).json({ error: 'Could not save note.' });
  }
});

// POST /api/admin/clients/:id/messages — { body, ask } shows a message on the
// client's dashboard under "From your marketing team". ask = true asks them for
// a yes / no answer; otherwise they just tap "Got it".
router.post('/clients/:id/messages', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const text = typeof req.body?.body === 'string' ? req.body.body.trim() : '';
  const ask = !!req.body?.ask;
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  if (!text) return res.status(400).json({ error: 'Write a message first.' });
  if (text.length > 2000) return res.status(400).json({ error: 'Keep it under 2,000 characters.' });
  try {
    const exists = await pool.query('SELECT 1 FROM clients WHERE id = $1 AND is_admin = false', [id]);
    if (!exists.rows.length) return res.status(404).json({ error: 'Account not found.' });
    await pool.query('INSERT INTO client_messages (client_id, body, ask) VALUES ($1, $2, $3)', [id, text, ask]);
    await logForClient(id, 'dfy', `DFY sent ${ask ? 'a yes/no question' : 'a message'} to their dashboard: “${text.length > 140 ? text.slice(0, 139) + '…' : text}”`);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin send message error:', err);
    res.status(500).json({ error: 'Could not send message.' });
  }
});

// DELETE /api/admin/clients/:id/messages/:mid — take back a message they haven't answered yet
router.delete('/clients/:id/messages/:mid', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const mid = parseInt(req.params.mid, 10);
  if (!id || !mid) return res.status(400).json({ error: 'Invalid id.' });
  try {
    const r = await pool.query(
      'DELETE FROM client_messages WHERE id = $1 AND client_id = $2 AND responded_at IS NULL RETURNING id',
      [mid, id]
    );
    if (!r.rows.length) return res.status(400).json({ error: 'Already answered, so it can\'t be taken back.' });
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete message error:', err);
    res.status(500).json({ error: 'Could not remove message.' });
  }
});

// POST /api/admin/clients/:id/people — { contact_id } links an existing contact;
// { name, email, phone, job_title } adds a new person to the account
router.post('/clients/:id/people', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const b = req.body || {};
  const clean = v => (typeof v === 'string' ? (v.trim() || null) : null);
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  try {
    const acct = (await pool.query('SELECT business_name, name FROM clients WHERE id = $1 AND is_admin = false', [id])).rows[0];
    if (!acct) return res.status(404).json({ error: 'Account not found.' });
    const business = acct.business_name || acct.name;

    let personId;
    if (b.contact_id) {
      const r = await pool.query(
        `UPDATE contacts SET account_id = $1, company = COALESCE(company, $3), updated_at = NOW()
         WHERE id = $2 AND client_id IS NULL RETURNING id, name`,
        [id, parseInt(b.contact_id, 10), business]
      );
      if (!r.rows.length) return res.status(400).json({ error: 'That contact can\'t be linked (it may be another client\'s login).' });
      personId = r.rows[0].id;
      await logForClient(id, 'system', `${r.rows[0].name} added to this account`);
    } else {
      const name = clean(b.name);
      const email = clean(b.email)?.toLowerCase() || null;
      if (!name) return res.status(400).json({ error: 'Name is required.' });
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
      if (email) {
        const dupe = await pool.query('SELECT id FROM contacts WHERE LOWER(email) = $1', [email]);
        if (dupe.rows.length) return res.status(409).json({ error: 'A contact with that email already exists — link them instead.' });
      }
      const r = await pool.query(
        `INSERT INTO contacts (name, email, phone, job_title, company, source, account_id)
         VALUES ($1, $2, $3, $4, $5, 'Added by admin', $6) RETURNING id`,
        [name, email, clean(b.phone), clean(b.job_title), business, id]
      );
      personId = r.rows[0].id;
      await logForClient(id, 'system', `${name}${clean(b.job_title) ? ` (${clean(b.job_title)})` : ''} added to this account`);
    }
    res.json({ success: true, id: personId });
  } catch (err) {
    console.error('Admin add person error:', err);
    res.status(500).json({ error: 'Could not add person.' });
  }
});

// DELETE /api/admin/clients/:id/people/:pid — unlink (the contact itself is kept)
router.delete('/clients/:id/people/:pid', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pid = parseInt(req.params.pid, 10);
  if (!id || !pid) return res.status(400).json({ error: 'Invalid id.' });
  try {
    const r = await pool.query(
      'UPDATE contacts SET account_id = NULL, updated_at = NOW() WHERE id = $1 AND account_id = $2 RETURNING name',
      [pid, id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'That person isn\'t linked to this account.' });
    await logForClient(id, 'system', `${r.rows[0].name} removed from this account`);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin unlink person error:', err);
    res.status(500).json({ error: 'Could not remove person.' });
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
    const day = new Date(scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    logForClient(client_id, 'dfy', `DFY sent a ${platform} post for ${day} for their approval`)
      .catch(e => console.error('Post timeline error:', e.message));
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
    const post = result.rows[0];
    const day = post.scheduled_date ? new Date(post.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '';
    logForClient(post.client_id, 'dfy', `DFY updated the ${post.platform} post${day ? ` for ${day}` : ''}${status ? ` (status: ${status.replace('_', ' ')})` : ''}`)
      .catch(e => console.error('Post timeline error:', e.message));
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
