// middleware/activityLog.js — Records what clients do in their portal on their
// account timeline in the admin.
//
// It watches the client-facing save/upload/approve requests and, only after one
// succeeds, adds a plain-English line like "Updated their business profile:
// Phone, Website". The routes themselves don't change. To record a new kind of
// client action, add one entry to RULES below.

const jwt = require('jsonwebtoken');
const { pool } = require('../services/crm');
const { logForClient } = require('../services/activity');

const LABELS = {
  name: 'Name', email: 'Login email', business_name: 'Business name',
  industry: 'Industry', website: 'Website', phone: 'Phone', location: 'Location',
  address: 'Address', city: 'City', state: 'State', zip: 'ZIP', business_email: 'Business email',
  timezone: 'Time zone', platforms: 'Platforms', social_notes: 'Notes about their social accounts',
  brand_voice: 'Brand voice', target_audience: 'Target audience', content_themes: 'Customer pain points',
  unique_selling_point: 'What makes them different', avoid_content: 'Topics to avoid',
  primary_goal: 'Main goal', additional_notes: 'Additional notes', referral_source: 'How they heard about us',
};
const PLATFORM = p => ({ instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', linkedin: 'LinkedIn',
  twitter: 'X (Twitter)', x: 'X (Twitter)', youtube: 'YouTube', google: 'Google Business Profile', gbp: 'Google Business Profile',
}[String(p || '').toLowerCase()] || p);

const norm = v => (v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v).trim());
const short = (s, n = 140) => { s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

// Which fields in the request actually changed compared with before
function changedFields(body, before) {
  return Object.keys(LABELS).filter(f => f in (body || {}) && norm(body[f]) !== norm(before ? before[f] : null));
}

async function postSummary(postId) {
  const p = (await pool.query('SELECT platform, scheduled_date FROM posts WHERE id = $1', [postId])).rows[0];
  if (!p) return 'a post';
  const day = p.scheduled_date ? new Date(p.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '';
  return `the ${PLATFORM(p.platform)} post${day ? ` for ${day}` : ''}`;
}

const RULES = [
  {
    method: 'POST', path: /^\/api\/onboarding\/?$/,
    snapshot: id => pool.query('SELECT * FROM client_onboarding WHERE client_id = $1', [id]).then(r => r.rows[0] || null),
    describe: ({ req, before }) => {
      const f = changedFields(req.body, before);
      return f.length ? `Updated their business profile: ${f.map(k => LABELS[k]).join(', ')}` : null;
    },
  },
  {
    method: 'PUT', path: /^\/api\/account\/profile\/?$/,
    snapshot: id => pool.query('SELECT name, email, business_name FROM clients WHERE id = $1', [id]).then(r => r.rows[0] || null),
    describe: ({ req, before }) => {
      const f = changedFields(req.body, before).filter(k => ['name', 'email', 'business_name'].includes(k));
      return f.length ? `Updated their account: ${f.map(k => LABELS[k]).join(', ')}` : null;
    },
  },
  { method: 'POST', path: /^\/api\/onboarding\/brand-identity-mode\/?$/,
    describe: ({ req }) => req.body.mode === 'import' ? 'Chose to have us pull their brand from their website' : 'Chose to set up their brand themselves' },
  { method: 'POST', path: /^\/api\/brand-assets\/logo\/?$/, describe: () => 'Uploaded a new logo' },
  { method: 'POST', path: /^\/api\/brand-assets\/content\/?$/,
    describe: ({ req }) => `Uploaded ${req.file && /^video\//.test(req.file.mimetype) ? 'a video' : 'a photo or file'} to their brand library` },
  { method: 'DELETE', path: /^\/api\/brand-assets\/content\/?$/, describe: () => 'Removed a file from their brand library' },
  { method: 'POST', path: /^\/api\/brand-assets\/import-url\/?$/,
    describe: ({ req }) => `Asked us to pull their brand from ${short(req.body.url, 80)}` },
  { method: 'POST', path: /^\/api\/brand-assets\/colors\/?$/,
    describe: ({ req }) => `Set their brand colors: ${(req.body.colors || []).join(', ') || 'none'}` },
  { method: 'POST', path: /^\/api\/brand-assets\/typography\/?$/,
    describe: ({ req }) => `Set their brand fonts: ${[req.body.heading_font && `headings ${req.body.heading_font}`, req.body.body_font && `body ${req.body.body_font}`].filter(Boolean).join(', ') || 'cleared'}` },
  { method: 'PUT', path: /^\/api\/socials\/([^/]+)\/?$/,
    // Never log the password field
    describe: ({ req, m }) => `Connected ${PLATFORM(decodeURIComponent(m[1]))}${req.body.username ? ` (${short(req.body.username, 60)})` : ''}` },
  { method: 'DELETE', path: /^\/api\/socials\/([^/]+)\/?$/, describe: ({ m }) => `Disconnected ${PLATFORM(decodeURIComponent(m[1]))}` },
  { method: 'POST', path: /^\/api\/posts\/(\d+)\/approve\/?$/, describe: async ({ m }) => `Approved ${await postSummary(m[1])}` },
  { method: 'POST', path: /^\/api\/posts\/(\d+)\/request-changes\/?$/,
    describe: async ({ req, m }) => `Asked for changes to ${await postSummary(m[1])}: “${short(req.body.notes)}”` },
  { method: 'POST', path: /^\/api\/account\/change-plan\/?$/, describe: ({ req }) => `Changed their plan to ${req.body.new_plan}` },
  { method: 'POST', path: /^\/api\/account\/pause-plan\/?$/, describe: () => 'Paused their plan' },
  { method: 'POST', path: /^\/api\/account\/resume-plan\/?$/, describe: () => 'Resumed their plan' },
  { method: 'POST', path: /^\/api\/account\/cancel-plan\/?$/, describe: () => 'Cancelled their plan (ends at the end of the billing period)' },
  { method: 'POST', path: /^\/api\/plan-ended\/restart\/?$/, describe: ({ req }) => `Started checkout to restart on ${req.body.plan || 'a plan'}` },
];

function activityLog() {
  return async (req, res, next) => {
    let rule, m;
    for (const r of RULES) {
      if (r.method === req.method && (m = req.path.match(r.path))) { rule = r; break; }
    }
    if (!rule) return next();

    let user;
    try { user = jwt.verify(req.cookies?.token, process.env.JWT_SECRET); } catch (_) { return next(); }
    if (!user || user.is_admin) return next();

    let before = null;
    if (rule.snapshot) before = await rule.snapshot(user.id).catch(() => null);

    res.on('finish', () => {
      if (res.statusCode < 200 || res.statusCode >= 300) return;
      Promise.resolve()
        .then(() => rule.describe({ req, before, m }))
        .then(body => body && logForClient(user.id, 'client', body))
        .catch(err => console.error('[activity] could not record client action:', err.message));
    });
    next();
  };
}

module.exports = { activityLog, RULES, changedFields };
