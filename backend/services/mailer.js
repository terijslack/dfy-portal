// services/mailer.js — Sends email through DFY's own Google Workspace (Gmail API).
//
// Why Gmail: Railway's plan blocks normal email (SMTP), GoHighLevel is going
// away, and Workspace is already paid for. Emails come from a real person's
// address (default Frankie) so clients see a human, and replies land in her inbox.
//
// Setup (one time): a Google Cloud service account with domain-wide delegation
// for the gmail.send scope, allowed in Google Admin. Railway variables:
//   GOOGLE_SERVICE_ACCOUNT_JSON — the service account's JSON key (whole file)
//   MAIL_FROM          — who it's sent as (default frankie@dfymarketinggroup.com)
//   MAIL_FROM_NAME     — display name (default "Frankie at Done For You Marketing")
//   TEAM_ALERT_EMAIL   — where portal alerts go (default hello@dfymarketinggroup.com)
// No extra packages: the Google sign-in is done with Node's built-in crypto.

const crypto = require('crypto');
const axios = require('axios');

const FROM = () => process.env.MAIL_FROM || 'frankie@dfymarketinggroup.com';
const FROM_NAME = () => process.env.MAIL_FROM_NAME || 'Frankie at Done For You Marketing';
const TEAM = () => process.env.TEAM_ALERT_EMAIL || 'hello@dfymarketinggroup.com';

function serviceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const sa = JSON.parse(raw);
    if (!sa.client_email || !sa.private_key) return null;
    sa.private_key = sa.private_key.replace(/\\n/g, '\n'); // pasted keys sometimes keep \n literally
    return sa;
  } catch {
    console.error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON');
    return null;
  }
}

function isConfigured() {
  return Boolean(serviceAccount());
}

const b64url = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

let cached = null; // { token, exp, sub }
async function accessToken() {
  const sub = FROM();
  if (cached && cached.sub === sub && cached.exp > Date.now() + 60_000) return cached.token;
  const sa = serviceAccount();
  if (!sa) throw new Error('Email is not set up (GOOGLE_SERVICE_ACCOUNT_JSON missing)');
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({
    iss: sa.client_email, sub, scope: 'https://www.googleapis.com/auth/gmail.send',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  }));
  const signature = b64url(crypto.createSign('RSA-SHA256').update(`${header}.${claims}`).sign(sa.private_key));
  const res = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: `${header}.${claims}.${signature}`,
  }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 });
  cached = { token: res.data.access_token, exp: Date.now() + (res.data.expires_in || 3600) * 1000, sub };
  return cached.token;
}

// Header values with non-ASCII characters (curly quotes, emoji in names…)
const encodeHeader = v => (/^[\x20-\x7e]*$/.test(v) ? v : `=?UTF-8?B?${Buffer.from(v).toString('base64')}?=`);
const stripCRLF = v => String(v || '').replace(/[\r\n]+/g, ' ').trim();
const htmlToText = html => String(html).replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(p|div|h\d|li|tr)>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, '\n\n').trim();

function buildMessage({ to, subject, html, text, replyTo, important }) {
  const boundary = `dfy_${crypto.randomBytes(12).toString('hex')}`;
  const lines = [
    `From: ${encodeHeader(stripCRLF(FROM_NAME()))} <${FROM()}>`,
    `To: ${stripCRLF(Array.isArray(to) ? to.join(', ') : to)}`,
    `Subject: ${encodeHeader(stripCRLF(subject))}`,
    replyTo ? `Reply-To: ${stripCRLF(replyTo)}` : null,
    important ? 'Importance: High' : null,
    important ? 'X-Priority: 1' : null,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(text || htmlToText(html)).toString('base64'),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(html).toString('base64'),
    `--${boundary}--`,
  ].filter(l => l !== null);
  return lines.join('\r\n');
}

// Send one email. Throws if Google refuses it.
async function sendMail(opts) {
  const token = await accessToken();
  const res = await axios.post(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    { raw: b64url(buildMessage(opts)) },
    { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 }
  );
  return res.data; // { id, threadId }
}

module.exports = { sendMail, isConfigured, buildMessage, TEAM, FROM };
