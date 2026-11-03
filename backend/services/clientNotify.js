// services/clientNotify.js — Emails clients (from Frankie) when something needs
// their OK, if they've left that turned on in Account → Email notifications.
//
//   "Ready for your review" — one email listing everything new that's waiting.
//     We wait until nothing new has come in for 10 minutes, so a batch of posts
//     added together arrives as a single email.
//   "Goes out tomorrow" — one reminder the day before, for anything still not
//     approved.
// Only sends 8 AM–8 PM Pacific, only to active clients. Runs every 10 minutes.

const { Pool } = require('pg');
const mailer = require('./mailer');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const APP_URL = () => process.env.APP_URL || 'https://dfymarketinggroup.com';
const TZ = 'America/Los_Angeles';
const BATCH_QUIET_MINUTES = 10;

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const NET = { instagram: 'Instagram', facebook: 'Facebook', twitter: 'X', linkedin: 'LinkedIn', tiktok: 'TikTok', youtube: 'YouTube', gmb: 'Google', pinterest: 'Pinterest', threads: 'Threads', bluesky: 'Bluesky' };
const nets = p => String(p.networks || p.platform || '').split(',').filter(Boolean).map(n => NET[n] || n).join(' + ') || 'Social';
const ymd = d => (d instanceof Date ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : String(d || '').slice(0, 10));
const dayLabel = d => (d ? new Date(`${ymd(d)}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' }) : '');
const clock = t => {
  if (!t) return '';
  const [h, m] = String(t).split(':').map(Number);
  return new Date(2000, 0, 1, h, m || 0).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};
const firstName = c => String(c.name || '').trim().split(/\s+/)[0] || 'there';
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function pacificNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const today = `${parts.year}-${parts.month}-${parts.day}`;
  const t = new Date(`${today}T12:00:00Z`); t.setUTCDate(t.getUTCDate() + 1);
  return { hour: Number(parts.hour), today, tomorrow: t.toISOString().slice(0, 10) };
}

// ─── Email layout ───────────────────────────────────────────────────────────

function postRow(p) {
  const img = (Array.isArray(p.media) ? p.media : []).find(m => m && m.type !== 'video' && /^https:\/\//.test(m.url || ''));
  const cap = String(p.caption || '');
  return `
    <tr>
      <td style="padding:10px 0;border-top:1px solid #E6E1D6;width:64px;vertical-align:top;">
        ${img ? `<img src="${esc(img.url)}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;object-fit:cover;border-radius:6px;">`
              : `<div style="width:56px;height:56px;border-radius:6px;background:#EFEBDF;"></div>`}
      </td>
      <td style="padding:10px 0 10px 12px;border-top:1px solid #E6E1D6;vertical-align:top;font-size:14px;line-height:1.5;color:#1F3D2C;">
        <strong>${esc(nets(p))} post</strong> · ${esc(dayLabel(p.scheduled_date))}${p.scheduled_time ? ` at ${esc(clock(p.scheduled_time))}` : ''}
        ${p.revised_at ? '<br><span style="color:#2D6B4F;">Updated based on your notes</span>' : ''}
        ${cap ? `<br><span style="color:#6B756B;">${esc(cap.slice(0, 110))}${cap.length > 110 ? '…' : ''}</span>` : ''}
      </td>
    </tr>`;
}

function newsletterRow(n) {
  return `
    <tr>
      <td style="padding:10px 0;border-top:1px solid #E6E1D6;width:64px;vertical-align:top;">
        <div style="width:56px;height:56px;border-radius:6px;background:#EFEBDF;color:#6B756B;font-size:11px;font-weight:700;text-align:center;line-height:56px;">EMAIL</div>
      </td>
      <td style="padding:10px 0 10px 12px;border-top:1px solid #E6E1D6;vertical-align:top;font-size:14px;line-height:1.5;color:#1F3D2C;">
        <strong>${esc(n.title)}</strong>${n.send_date ? ` · sends ${esc(dayLabel(n.send_date))}` : ''}
        ${n.revised_at ? '<br><span style="color:#2D6B4F;">Updated based on your notes</span>' : ''}
        ${n.subject ? `<br><span style="color:#6B756B;">Subject: ${esc(n.subject)}</span>` : ''}
      </td>
    </tr>`;
}

function layout({ client, heading, intro, posts, newsletters, buttonLabel, buttonPath }) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;background:#F5F2EA;color:#1F3D2C;">
    <p style="font-size:15px;margin:0 0 6px;">Hi ${esc(firstName(client))},</p>
    <h2 style="font-size:20px;margin:0 0 8px;color:#1F3D2C;">${heading}</h2>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#444;">${intro}</p>
    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;padding:0 14px;margin:0 0 20px;" cellpadding="0" cellspacing="0">
      <tr><td colspan="2" style="padding:0 14px;"><table style="width:100%;border-collapse:collapse;">
        ${newsletters.map(newsletterRow).join('')}${posts.map(postRow).join('')}
      </table></td></tr>
    </table>
    <a href="${APP_URL()}/login?next=${encodeURIComponent(buttonPath)}" style="display:inline-block;background:#2D6B4F;color:#F5F2EA;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">${buttonLabel}</a>
    <p style="font-size:15px;line-height:1.6;margin:22px 0 0;color:#444;">Thanks!<br>Frankie<br><span style="color:#6B756B;">Done For You Marketing</span></p>
    <p style="font-size:12px;color:#9AA199;margin:24px 0 0;">You're getting this because email notifications are on for your client portal.
      <a href="${APP_URL()}/login?next=%2Faccount" style="color:#9AA199;">Change your email settings</a>.</p>
  </div>`;
}

// ─── Finding what to send ───────────────────────────────────────────────────

const ACTIVE = `c.is_admin = false AND c.email IS NOT NULL AND COALESCE(c.subscription_status, '') IN ('active', 'past_due', 'cancelling')`;

async function readyBatches(today) {
  const posts = (await pool.query(
    `SELECT p.*, COALESCE(p.revised_at, p.updated_at, p.created_at) AS entered_at
     FROM posts p JOIN clients c ON c.id = p.client_id
     WHERE ${ACTIVE} AND c.notify_approvals AND p.status = 'pending' AND p.client_notified_at IS NULL
       AND (p.scheduled_date IS NULL OR p.scheduled_date >= $1::date)`, [today])).rows;
  const nls = (await pool.query(
    `SELECT n.*, COALESCE(n.revised_at, n.updated_at, n.created_at) AS entered_at
     FROM newsletters n JOIN clients c ON c.id = n.client_id
     WHERE ${ACTIVE} AND c.notify_approvals AND n.status = 'pending' AND n.client_notified_at IS NULL`)).rows;
  return group(posts, nls);
}

async function reminderBatches(tomorrow) {
  const posts = (await pool.query(
    `SELECT p.* FROM posts p JOIN clients c ON c.id = p.client_id
     WHERE ${ACTIVE} AND c.notify_reminders AND p.status IN ('pending', 'changes_requested')
       AND p.scheduled_date = $1::date AND p.client_reminded_at IS NULL
       AND (p.client_notified_at IS NULL OR p.client_notified_at < NOW() - interval '6 hours')`, [tomorrow])).rows;
  const nls = (await pool.query(
    `SELECT n.* FROM newsletters n JOIN clients c ON c.id = n.client_id
     WHERE ${ACTIVE} AND c.notify_reminders AND n.status IN ('pending', 'changes_requested')
       AND n.send_date = $1::date AND n.client_reminded_at IS NULL
       AND (n.client_notified_at IS NULL OR n.client_notified_at < NOW() - interval '6 hours')`, [tomorrow])).rows;
  return group(posts, nls);
}

function group(posts, nls) {
  const by = new Map();
  for (const p of posts) { if (!by.has(p.client_id)) by.set(p.client_id, { posts: [], newsletters: [] }); by.get(p.client_id).posts.push(p); }
  for (const n of nls) { if (!by.has(n.client_id)) by.set(n.client_id, { posts: [], newsletters: [] }); by.get(n.client_id).newsletters.push(n); }
  for (const b of by.values()) b.posts.sort((a, z) => `${ymd(a.scheduled_date)} ${a.scheduled_time || ''}`.localeCompare(`${ymd(z.scheduled_date)} ${z.scheduled_time || ''}`));
  return by;
}

function whatsWaiting(b) {
  const parts = [];
  if (b.newsletters.length) parts.push(b.newsletters.length === 1 ? 'your newsletter' : plural(b.newsletters.length, 'newsletter', 'newsletters'));
  if (b.posts.length) parts.push(plural(b.posts.length, 'post', 'posts'));
  return parts.join(' and ');
}
const reviewPath = b => (b.posts.length ? '/posts?view=approval' : '/newsletter?view=approval');

async function clientRow(id) {
  return (await pool.query('SELECT id, name, email, business_name FROM clients WHERE id = $1', [id])).rows[0];
}

async function mark(table, column, ids) {
  if (ids.length) await pool.query(`UPDATE ${table} SET ${column} = NOW() WHERE id = ANY($1::int[])`, [ids]);
}

// ─── Run ────────────────────────────────────────────────────────────────────

let running = false;
async function runClientNotifications({ force = false } = {}) {
  if (running || !mailer.isConfigured()) return { skipped: true };
  const { hour, today, tomorrow } = pacificNow();
  if (!force && (hour < 8 || hour >= 20)) return { skipped: 'quiet hours' };
  running = true;
  const sent = { ready: 0, reminders: 0 };
  try {
    // 1. Ready for review — wait for a quiet spell so a batch lands as one email
    for (const [clientId, b] of await readyBatches(today)) {
      const newest = Math.max(...[...b.posts, ...b.newsletters].map(x => new Date(x.entered_at).getTime()));
      if (!force && Date.now() - newest < BATCH_QUIET_MINUTES * 60 * 1000) continue;
      const c = await clientRow(clientId);
      const what = whatsWaiting(b);
      const total = b.posts.length + b.newsletters.length;
      try {
        await mailer.sendMail({
          to: c.email,
          subject: `${what.charAt(0).toUpperCase() + what.slice(1)} ${total === 1 ? 'is' : 'are'} ready for your review`,
          html: layout({
            client: c,
            heading: `${what.charAt(0).toUpperCase() + what.slice(1)} ${total === 1 ? 'is' : 'are'} ready for your review`,
            intro: 'Take a look when you have a minute. Approve it as is, or tell us what to change and we\'ll take care of it.',
            posts: b.posts, newsletters: b.newsletters, buttonLabel: 'Review and approve', buttonPath: reviewPath(b),
          }),
        });
        await mark('posts', 'client_notified_at', b.posts.map(p => p.id));
        await mark('newsletters', 'client_notified_at', b.newsletters.map(n => n.id));
        sent.ready++;
        console.log(`✅ Client notified (${what}) → client ${clientId}`);
      } catch (err) {
        console.error(`[clientNotify] ready email failed for client ${clientId}:`, err.response?.data?.error?.message || err.message);
      }
    }

    // 2. Day-before reminders (from 9 AM)
    if (force || hour >= 9) {
      for (const [clientId, b] of await reminderBatches(tomorrow)) {
        const c = await clientRow(clientId);
        const what = whatsWaiting(b);
        const total = b.posts.length + b.newsletters.length;
        try {
          await mailer.sendMail({
            to: c.email,
            subject: `Reminder: ${what} ${total === 1 ? 'goes' : 'go'} out tomorrow and still ${total === 1 ? 'needs' : 'need'} your OK`,
            html: layout({
              client: c,
              heading: `${what.charAt(0).toUpperCase() + what.slice(1)} ${total === 1 ? 'goes' : 'go'} out tomorrow`,
              intro: `${total === 1 ? 'It hasn\'t' : 'These haven\'t'} been approved yet. If you don't approve by then, ${total === 1 ? 'it won\'t' : 'they won\'t'} go out, so we can't post on your behalf.`,
              posts: b.posts, newsletters: b.newsletters, buttonLabel: 'Review now', buttonPath: reviewPath(b),
            }),
          });
          await mark('posts', 'client_reminded_at', b.posts.map(p => p.id));
          await mark('newsletters', 'client_reminded_at', b.newsletters.map(n => n.id));
          sent.reminders++;
          console.log(`✅ Client reminded (${what}) → client ${clientId}`);
        } catch (err) {
          console.error(`[clientNotify] reminder failed for client ${clientId}:`, err.response?.data?.error?.message || err.message);
        }
      }
    }
    return sent;
  } finally {
    running = false;
  }
}

function startClientNotifications(intervalMs = 10 * 60 * 1000) {
  if (!mailer.isConfigured()) { console.log('ℹ️  Client email notifications off (email not set up)'); return null; }
  setTimeout(() => runClientNotifications().catch(e => console.error('[clientNotify]', e.message)), 60 * 1000);
  const t = setInterval(() => runClientNotifications().catch(e => console.error('[clientNotify]', e.message)), intervalMs);
  t.unref?.();
  console.log('✅ Client email notifications on (every 10 min, 8 AM–8 PM Pacific)');
  return t;
}

module.exports = { runClientNotifications, startClientNotifications, pacificNow };
