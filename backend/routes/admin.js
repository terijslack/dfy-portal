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
const { syncClient, describeError } = require('../services/metricoolSync');
const router = express.Router();
const { Pool } = require('pg');
const { requireAdmin } = require('../middleware/auth');
const { planTier, accountStatus, PRIORITIES } = require('../config/accounts');
const { syncAll } = require('../services/crm');
const { logForClient } = require('../services/activity');
const { SOCIAL_PLATFORMS, ALLOWED_PLATFORMS, platformName } = require('../config/socialPlatforms');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// admin_notes: private notes only admins can see (added in database/migrate.js;
// never returned by any client-facing route)

// Business-profile fields the admin can edit. These live in the same tables the
// client's /profile page reads and writes, so there is only ever one copy of the data.
const CLIENT_FIELDS = ['name', 'email', 'business_name', 'admin_notes', 'priority', 'metricool_blog_id', 'metricool_not_needed'];
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
  name: 'Contact name', email: 'Login email', business_name: 'Business name', metricool_blog_id: 'Metricool brand ID', metricool_not_needed: "Doesn't use Metricool", industry: 'Industry',
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

// GET /api/admin/dashboard — everything across all clients that needs DFY,
// in one place. Dates are judged in Pacific time (DFY's day).
router.get('/dashboard', requireAdmin, async (req, res) => {
  const TZ = 'America/Los_Angeles';
  const who = `COALESCE(NULLIF(c.business_name, ''), c.name, c.email)`;
  const postCols = `p.id, p.client_id, ${who} AS client, c.email AS client_email, p.caption, p.platform, p.networks, p.scheduled_date, p.scheduled_time,
                    p.status, p.change_notes, p.media, p.metricool_error, p.revised_at,
                    COALESCE(p.revised_at, p.created_at) AS sent_at, p.updated_at`;
  const nlCols = `n.id, n.client_id, ${who} AS client, c.email AS client_email, n.title, n.subject, n.send_date, n.status, n.change_notes,
                  n.revised_at, n.approved_at, COALESCE(n.revised_at, n.created_at) AS sent_at, n.updated_at`;
  const today = `(NOW() AT TIME ZONE '${TZ}')::date`;
  try {
    const q = sql => pool.query(sql).then(r => r.rows);
    const [postChanges, nlChanges, nlReady, mcErrors, postsWaiting, nlWaiting, comingPosts, comingNl, activity, missed, unlinked] = await Promise.all([
      q(`SELECT ${postCols} FROM posts p JOIN clients c ON c.id = p.client_id
         WHERE p.status = 'changes_requested' ORDER BY p.scheduled_date ASC NULLS LAST`),
      q(`SELECT ${nlCols} FROM newsletters n JOIN clients c ON c.id = n.client_id
         WHERE n.status = 'changes_requested' ORDER BY n.send_date ASC NULLS LAST`),
      q(`SELECT ${nlCols} FROM newsletters n JOIN clients c ON c.id = n.client_id
         WHERE n.status = 'approved' ORDER BY n.send_date ASC NULLS LAST`),
      q(`SELECT ${postCols} FROM posts p JOIN clients c ON c.id = p.client_id
         WHERE p.metricool_error IS NOT NULL AND p.status = 'approved' ORDER BY p.scheduled_date ASC`),
      q(`SELECT ${postCols} FROM posts p JOIN clients c ON c.id = p.client_id
         WHERE p.status = 'pending' AND (p.scheduled_date IS NULL OR p.scheduled_date >= ${today})
         ORDER BY p.scheduled_date ASC NULLS LAST, p.scheduled_time ASC NULLS LAST`),
      q(`SELECT ${nlCols} FROM newsletters n JOIN clients c ON c.id = n.client_id
         WHERE n.status = 'pending' ORDER BY n.send_date ASC NULLS LAST`),
      q(`SELECT ${postCols} FROM posts p JOIN clients c ON c.id = p.client_id
         WHERE p.status IN ('approved', 'scheduled', 'queued')
           AND p.scheduled_date BETWEEN ${today} AND ${today} + 6
         ORDER BY p.scheduled_date, p.scheduled_time NULLS LAST`),
      q(`SELECT ${nlCols} FROM newsletters n JOIN clients c ON c.id = n.client_id
         WHERE n.status IN ('approved', 'sent') AND n.send_date BETWEEN ${today} AND ${today} + 6
         ORDER BY n.send_date`),
      q(`SELECT a.id, a.type, a.body, a.created_at, cl.id AS client_id,
                COALESCE(NULLIF(cl.business_name, ''), cl.name, ct.name) AS client
         FROM contact_activity a
         JOIN contacts ct ON ct.id = a.contact_id
         JOIN clients cl ON cl.id = COALESCE(ct.client_id, ct.account_id)
         WHERE a.type = 'client' AND cl.is_admin = false
         ORDER BY a.created_at DESC LIMIT 20`),
      // Drafts whose date passed without approval in the last 2 weeks — these never went out
      q(`SELECT ${postCols} FROM posts p JOIN clients c ON c.id = p.client_id
         WHERE p.status IN ('pending', 'changes_requested') AND p.scheduled_date < ${today}
           AND p.scheduled_date >= ${today} - 14
         ORDER BY p.scheduled_date DESC`),
      // Paying clients whose account isn't linked to a Metricool brand — their
      // drafts would never reach their portal
      q(`SELECT c.id AS client_id, ${who} AS client, c.email AS client_email, c.created_at
         FROM clients c
         WHERE c.is_admin = false AND COALESCE(c.metricool_blog_id, '') = '' AND c.metricool_not_needed IS NOT TRUE
           AND c.subscription_status IN ('active', 'past_due', 'cancelling')
         ORDER BY ${who}`),
    ]);
    const todayStr = (await q(`SELECT ${today}::text AS d`))[0].d;
    // Waiting on the client and going out within 2 days → at risk of never posting
    const soon = d => d && String(d instanceof Date ? d.toISOString() : d).slice(0, 10) <= addDays(todayStr, 1);
    res.json({
      today: todayStr,
      needs_you: {
        post_changes: postChanges.filter(p => !p.scheduled_date || String(p.scheduled_date instanceof Date ? p.scheduled_date.toISOString() : p.scheduled_date).slice(0, 10) >= todayStr),
        newsletter_changes: nlChanges, newsletters_ready: nlReady, schedule_errors: mcErrors, missed, unlinked,
      },
      at_risk: { posts: postsWaiting.filter(p => soon(p.scheduled_date)), newsletters: nlWaiting.filter(n => soon(n.send_date)) },
      waiting: { posts: postsWaiting.filter(p => !soon(p.scheduled_date)), newsletters: nlWaiting.filter(n => !soon(n.send_date)) },
      coming_up: { posts: comingPosts, newsletters: comingNl },
      activity,
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ error: 'Could not load the dashboard.' });
  }
});

function addDays(ymd, n) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

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
        (SELECT COUNT(*) FROM newsletters n WHERE n.client_id = c.id AND n.status = 'approved') AS nl_approved,
        (SELECT COUNT(*) FROM newsletters n WHERE n.client_id = c.id AND n.status = 'changes_requested') AS nl_changes,
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
                metricool_blog_id, metricool_not_needed, notify_approvals, notify_reminders,
                (mailchimp_api_key IS NOT NULL) AS mailchimp_connected, mailchimp_list_name,
                newsletter_synced_at, newsletter_error
         FROM clients WHERE id = $1 AND is_admin = false`,
        [id]
      ),
      pool.query('SELECT * FROM client_onboarding WHERE client_id = $1', [id]),
      pool.query(
        `SELECT platform, username, profile_url, completed, connected_at
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
      social_platforms: SOCIAL_PLATFORMS,
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

// ── Newsletter results (Mailchimp) ──────────────────────────────────────────
// PUT /api/admin/clients/:id/mailchimp — { apiKey } connects their Mailchimp
// account (key checked with Mailchimp, then stored encrypted) and pulls results.
router.put('/clients/:id/mailchimp', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const key = typeof req.body?.apiKey === 'string' ? req.body.apiKey.trim() : '';
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  if (!key || key.length > 200) return res.status(400).json({ error: 'Paste their Mailchimp API key.' });
  try {
    const exists = await pool.query('SELECT 1 FROM clients WHERE id = $1 AND is_admin = false', [id]);
    if (!exists.rows.length) return res.status(404).json({ error: 'Account not found.' });
    const mc = require('../services/mailchimpStats');
    const info = await mc.connect(id, key);
    const result = await mc.syncNewsletter(id);
    await logForClient(id, 'system', `Mailchimp connected for newsletter results (audience: ${info.audience})`);
    res.json({ success: true, ...info, sends: result.sends ?? 0, error: result.error || null });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/clients/:id/mailchimp — forget their key (results already saved stay)
router.delete('/clients/:id/mailchimp', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  try {
    await require('../services/mailchimpStats').disconnect(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not disconnect.' });
  }
});

// POST /api/admin/clients/:id/newsletter-sync — pull their newsletter results now
router.post('/clients/:id/newsletter-sync', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  try {
    const result = await require('../services/mailchimpStats').syncNewsletter(id);
    if (result.skipped) return res.status(400).json({ error: 'Connect their Mailchimp account first.' });
    if (result.error) return res.status(502).json({ error: result.error });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: `Could not update results: ${err.message}` });
  }
});

// POST /api/admin/clients/:id/email — { subject, body } emails the client from
// Frankie (services/clientEmail.js) and adds it to their timeline.
router.post('/clients/:id/email', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const subject = typeof req.body?.subject === 'string' ? req.body.subject.trim() : '';
  const body = typeof req.body?.body === 'string' ? req.body.body.trim() : '';
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  if (!subject) return res.status(400).json({ error: 'Add a subject line.' });
  if (subject.length > 150) return res.status(400).json({ error: 'Keep the subject under 150 characters.' });
  if (!body) return res.status(400).json({ error: 'Write the email first.' });
  if (body.length > 5000) return res.status(400).json({ error: 'Keep it under 5,000 characters.' });
  try {
    const client = (await pool.query('SELECT email FROM clients WHERE id = $1 AND is_admin = false', [id])).rows[0];
    if (!client || !client.email) return res.status(404).json({ error: 'Account not found.' });
    const { sendClientEmail } = require('../services/clientEmail');
    await sendClientEmail({ to: client.email, subject, body });
    await logForClient(id, 'dfy', `DFY emailed them (${client.email}): “${subject}”`);
    res.json({ success: true, to: client.email });
  } catch (err) {
    console.error('Admin email client error:', err.message);
    res.status(502).json({ error: `Email not sent: ${err.message}` });
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

// PUT /api/admin/clients/:id/socials/:platform — mark a platform as connected on
// their behalf, for when they've granted us access but never ticked it off in
// their own portal. { profile_url } optional.
router.put('/clients/:id/socials/:platform', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const platform = String(req.params.platform || '').toLowerCase();
  const url = typeof req.body?.profile_url === 'string' ? req.body.profile_url.trim() : '';
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  if (!ALLOWED_PLATFORMS.includes(platform)) return res.status(400).json({ error: 'Invalid platform.' });
  if (url.length > 500) return res.status(400).json({ error: 'That link is too long.' });

  try {
    const exists = await pool.query('SELECT 1 FROM clients WHERE id = $1 AND is_admin = false', [id]);
    if (!exists.rows.length) return res.status(404).json({ error: 'Account not found.' });

    const saved = await pool.query('SELECT platform, completed FROM social_accounts WHERE client_id = $1', [id]);
    const already = saved.rows.find(r => r.platform === platform);
    if (!already && saved.rows.length >= 4) {
      return res.status(400).json({ error: 'This account already has 4 platforms. Remove one first.' });
    }

    await pool.query(
      `INSERT INTO social_accounts (client_id, platform, username, profile_url, completed)
       VALUES ($1, $2, $3, $4, true)
       ON CONFLICT (client_id, platform)
       DO UPDATE SET completed    = true,
                     profile_url  = COALESCE(NULLIF($4, ''), social_accounts.profile_url),
                     username     = COALESCE(NULLIF($4, ''), NULLIF(social_accounts.username, ''), $3),
                     connected_at = NOW()`,
      [id, platform, platformName(platform), url || null]
    );

    // Only worth a timeline entry the first time it's marked connected
    if (!already || !already.completed) {
      await logForClient(id, 'dfy', `DFY marked ${platformName(platform)} as connected`);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Admin mark social error:', err);
    res.status(500).json({ error: 'Could not mark that as connected.' });
  }
});

// DELETE /api/admin/clients/:id/socials/:platform — take a platform off the account
router.delete('/clients/:id/socials/:platform', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const platform = String(req.params.platform || '').toLowerCase();
  if (!id) return res.status(400).json({ error: 'Invalid client id.' });
  try {
    const r = await pool.query(
      'DELETE FROM social_accounts WHERE client_id = $1 AND platform = $2 RETURNING platform',
      [id, platform]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'That platform isn\'t on this account.' });
    await logForClient(id, 'dfy', `DFY removed ${platformName(platform)} from this account`);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin remove social error:', err);
    res.status(500).json({ error: 'Could not remove that platform.' });
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

// POST /api/admin/clients/:id/metricool-sync — pull this client's posts from Metricool now
router.post('/clients/:id/metricool-sync', requireAdmin, async (req, res) => {
  try {
    const result = await syncClient(req.params.id);
    if (result.skipped) {
      return res.status(400).json({ error: 'Add their Metricool brand ID (Account tab) and the Metricool API keys in Railway first.' });
    }
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Admin Metricool sync error:', describeError(err));
    res.status(502).json({ error: `Metricool said: ${describeError(err)}` });
  }
});

// POST /api/admin/clients/:id/stats-sync — pull this client's analytics numbers from Metricool now.
// Returns what came back for each metric, so a missing platform is easy to spot.
router.post('/clients/:id/stats-sync', requireAdmin, async (req, res) => {
  try {
    const { syncStats } = require('../services/metricoolStats');
    // The button always pulls the full ~7 months, so newly added metrics fill in history too
    const result = await syncStats(req.params.id, { days: 200 });
    if (result.skipped) {
      return res.status(400).json({ error: 'Add their Metricool brand ID (Account tab) and the Metricool API keys in Railway first.' });
    }
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Admin stats sync error:', err.message);
    res.status(502).json({ error: `Could not update numbers: ${err.message}` });
  }
});

// POST /api/admin/test-email — send a test email to hello@ to check the Gmail setup
router.post('/test-email', requireAdmin, async (req, res) => {
  const mailer = require('../services/mailer');
  if (!mailer.isConfigured()) return res.status(400).json({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON is not set in Railway.' });
  try {
    const sent = await mailer.sendMail({
      to: mailer.TEAM(),
      subject: 'Test from the DFY portal',
      html: '<div style="font-family:Inter,Arial,sans-serif;max-width:480px;padding:24px;background:#F5F2EA;color:#1F3D2C;"><h2 style="margin:0 0 8px;">Email is working</h2><p style="margin:0;color:#444;">The client portal can now send email through Google Workspace. Change requests and newsletter approvals will arrive here.</p></div>',
    });
    res.json({ success: true, to: mailer.TEAM(), from: mailer.FROM(), id: sent.id });
  } catch (err) {
    const g = err.response?.data;
    res.status(502).json({ error: (g && (g.error_description || g.error?.message || g.error)) || err.message });
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
