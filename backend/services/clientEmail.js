// services/clientEmail.js — One-off emails DFY writes to a client from the admin
// (Admin → Accounts → the client → Activity → "Email them"). Sent through
// Google Workspace as Frankie (services/mailer.js), so replies land in her inbox.
//
// The message is plain text: blank lines start a new paragraph, links become
// clickable, and a line on its own like  [Open the steps](https://…)  becomes a button.

const mailer = require('./mailer');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SAFE_URL = /^https?:\/\/[^\s<>"]+$/i;

function linkify(escaped) {
  return escaped.replace(/https?:\/\/[^\s<>"]+[^\s<>".,;:!?)]/gi, url => `<a href="${url}" style="color:#2D6B4F;">${url}</a>`);
}

function renderClientEmail(body) {
  const p = 'font-size:15px;line-height:1.6;margin:0 0 16px;color:#444;';
  const paragraphs = String(body || '').replace(/\r\n/g, '\n').trim().split(/\n\s*\n/);
  const html = paragraphs.map(par => {
    const button = par.trim().match(/^\[([^\]]{1,60})\]\((\S+)\)$/);
    if (button && SAFE_URL.test(button[2])) {
      return `<p style="margin:0 0 20px;"><a href="${esc(button[2])}" style="display:inline-block;background:#2D6B4F;color:#F5F2EA;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">${esc(button[1])}</a></p>`;
    }
    return `<p style="${p}">${linkify(esc(par.trim())).replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;background:#F5F2EA;color:#1F3D2C;">
    ${html}
  </div>`;
}

// Plain-text version: buttons become "Text: link"
function plainText(body) {
  return String(body || '').replace(/\r\n/g, '\n').trim()
    .replace(/^\[([^\]]{1,60})\]\((\S+)\)$/gm, (m, label, url) => `${label}: ${url}`);
}

async function sendClientEmail({ to, subject, body }) {
  if (!mailer.isConfigured()) throw new Error('Email is not set up: GOOGLE_SERVICE_ACCOUNT_JSON is missing in Railway');
  return mailer.sendMail({ to, subject, html: renderClientEmail(body), text: plainText(body) });
}

module.exports = { renderClientEmail, plainText, sendClientEmail };
