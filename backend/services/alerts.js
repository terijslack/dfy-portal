// services/alerts.js — Emails to the DFY team (hello@) when a client acts in
// their portal and DFY needs to do something:
//   - asked for changes to a post          → revise it in Metricool
//   - asked for changes to a newsletter    → upload a revised version
//   - approved a newsletter                → send it
// (Approved posts are scheduled in Metricool automatically, so no email.)
// Best-effort: an email problem never breaks what the client was doing.

const { Pool } = require('pg');
const mailer = require('./mailer');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const APP_URL = () => process.env.APP_URL || 'https://dfymarketinggroup.com';

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const day = d => (d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }) : '');
const time = t => {
  if (!t) return '';
  const [h, m] = String(t).split(':').map(Number);
  return new Date(2000, 0, 1, h, m || 0).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};
const NET = { instagram: 'Instagram', facebook: 'Facebook', twitter: 'X', linkedin: 'LinkedIn', tiktok: 'TikTok', youtube: 'YouTube', gmb: 'Google', pinterest: 'Pinterest', threads: 'Threads', bluesky: 'Bluesky' };
const nets = p => String(p.networks || p.platform || '').split(',').filter(Boolean).map(n => NET[n] || n).join(' + ');

async function client(clientId) {
  return (await pool.query('SELECT id, name, email, business_name FROM clients WHERE id = $1', [clientId])).rows[0] || { id: clientId };
}

function layout({ heading, intro, rows, quote, imageUrl, button, footer }) {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;background:#F5F2EA;color:#1F3D2C;">
    <h2 style="font-size:20px;margin:0 0 8px;color:#1F3D2C;">${heading}</h2>
    <p style="font-size:15px;line-height:1.6;margin:0 0 18px;color:#444;">${intro}</p>
    ${quote ? `<div style="background:#fff;border-left:4px solid #7D2A03;padding:12px 16px;margin:0 0 18px;font-size:15px;line-height:1.6;color:#1F3D2C;white-space:pre-wrap;">${esc(quote)}</div>` : ''}
    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;margin:0 0 18px;font-size:14px;">
      ${rows.filter(r => r[1]).map(([k, v]) => `<tr><td style="padding:8px 12px;color:#6B756B;width:110px;vertical-align:top;">${k}</td><td style="padding:8px 12px;color:#1F3D2C;white-space:pre-wrap;">${v}</td></tr>`).join('')}
    </table>
    ${imageUrl ? `<img src="${esc(imageUrl)}" alt="" style="display:block;max-width:240px;border-radius:8px;margin:0 0 18px;">` : ''}
    <a href="${esc(button.url)}" style="display:inline-block;background:#2D6B4F;color:#F5F2EA;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:600;">${button.label}</a>
    ${footer ? `<p style="font-size:13px;color:#6B756B;margin:18px 0 0;">${footer}</p>` : ''}
  </div>`;
}

async function send(subject, html, important = true) {
  if (!mailer.isConfigured()) { console.log(`[alerts] Email not set up — skipped: ${subject}`); return; }
  await mailer.sendMail({ to: mailer.TEAM(), subject, html, important });
  console.log(`✅ Team alert sent: ${subject}`);
}

async function postChangesRequested(postId) {
  const p = (await pool.query('SELECT * FROM posts WHERE id = $1', [postId])).rows[0];
  if (!p) return;
  const c = await client(p.client_id);
  const who = c.business_name || c.name || 'A client';
  const image = (Array.isArray(p.media) ? p.media : []).find(m => m && m.type !== 'video' && /^https:\/\//.test(m.url || ''));
  await send(
    `Changes requested: ${who} — ${nets(p)} post for ${day(p.scheduled_date)}`,
    layout({
      heading: `${esc(who)} asked for changes to a post`,
      intro: p.source === 'metricool'
        ? 'Edit the draft in Metricool. The revised version goes back to them for approval automatically.'
        : 'Update the post in the admin and it goes back to them for approval.',
      quote: p.change_notes,
      rows: [
        ['Post', esc(nets(p))],
        ['Goes out', esc(`${day(p.scheduled_date)}${p.scheduled_time ? ' at ' + time(p.scheduled_time) : ''}`)],
        ['Caption', esc(String(p.caption || '').slice(0, 400))],
        ['From', esc([c.name, c.email].filter(Boolean).join(' · '))],
      ],
      imageUrl: image && image.url,
      button: { label: 'Open their account', url: `${APP_URL()}/admin?client=${p.client_id}` },
    })
  );
}

async function newsletterChangesRequested(newsletterId) {
  const n = (await pool.query('SELECT * FROM newsletters WHERE id = $1', [newsletterId])).rows[0];
  if (!n) return;
  const c = await client(n.client_id);
  const who = c.business_name || c.name || 'A client';
  await send(
    `Changes requested: ${who} — ${n.title}`,
    layout({
      heading: `${esc(who)} asked for changes to “${esc(n.title)}”`,
      intro: 'Make the changes in Canva, then use <strong>Upload revised version</strong> on their Newsletter tab. It goes back to them for approval.',
      quote: n.change_notes,
      rows: [
        ['Newsletter', esc(n.title)],
        ['Send date', esc(day(n.send_date))],
        ['Subject line', esc(n.subject)],
        ['From', esc([c.name, c.email].filter(Boolean).join(' · '))],
      ],
      button: { label: 'Open their Newsletter tab', url: `${APP_URL()}/admin?client=${n.client_id}` },
    })
  );
}

async function newsletterApproved(newsletterId) {
  const n = (await pool.query('SELECT * FROM newsletters WHERE id = $1', [newsletterId])).rows[0];
  if (!n) return;
  const c = await client(n.client_id);
  const who = c.business_name || c.name || 'A client';
  await send(
    `Approved, ready to send: ${who} — ${n.title}${n.send_date ? ` (${day(n.send_date)})` : ''}`,
    layout({
      heading: `${esc(who)} approved “${esc(n.title)}”`,
      intro: `It's ready to go out${n.send_date ? ` on <strong>${esc(day(n.send_date))}</strong>` : ''}. Send it, then click <strong>Mark as sent</strong> on their Newsletter tab.`,
      rows: [
        ['Newsletter', esc(n.title)],
        ['Send date', esc(day(n.send_date))],
        ['Subject line', esc(n.subject)],
        ['Preview text', esc(n.preview_text)],
      ],
      button: { label: 'Open their Newsletter tab', url: `${APP_URL()}/admin?client=${n.client_id}` },
    })
  );
}

// Fire-and-forget wrappers for the routes
const safe = fn => (...args) => fn(...args).catch(err =>
  console.error('[alerts] Could not send team email:', err.response?.data?.error?.message || err.message));

module.exports = {
  postChangesRequested: safe(postChangesRequested),
  newsletterChangesRequested: safe(newsletterChangesRequested),
  newsletterApproved: safe(newsletterApproved),
};
