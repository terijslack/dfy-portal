// services/welcomeEmail.js — The "Welcome to DFY Marketing" email a client gets
// once Stripe confirms their first payment. Replaces the GoHighLevel
// "New Client Welcome" workflow.
//
// Two versions, same as the old workflow:
//   • Custom plan / account we created for them (Payment Link) — they've never
//     chosen a password, so the email has a "Set your password" button that
//     works for 7 days. Forgot-password still works as a backup.
//   • Everyone else (signed up on a standard plan, already has a password) —
//     just "log into your portal".
//
// Sent from Frankie through Google Workspace (services/mailer.js), so replies
// land in her inbox. Sent only once per client, even if Stripe sends the
// payment notice twice, and logged on the account's Activity tab.

const crypto = require('crypto');
const { Pool } = require('pg');
const mailer = require('./mailer');
const { PLANS } = require('../config/plans');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const APP_URL = () => process.env.APP_URL || 'https://dfymarketinggroup.com';
const SET_PASSWORD_DAYS = 7;
const SUBJECT = "Welcome to DFY Marketing — let's get started!";

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const firstName = name => String(name || '').trim().split(/\s+/)[0] || 'there';

let columnReady = null;
function ensureColumn() {
  if (!columnReady) {
    columnReady = pool.query('ALTER TABLE clients ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ')
      .catch(err => { columnReady = null; throw err; });
  }
  return columnReady;
}

// Standard plans are the ones on the signup page; anything else is a custom deal
const isCustomPlan = planName => !PLANS[planName];

const button = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:#2D6B4F;color:#F5F2EA;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">${label}</a>`;

function welcomeHtml({ name, setPasswordUrl }) {
  const p = 'font-size:15px;line-height:1.6;margin:0 0 16px;color:#444;';
  const loginUrl = `${APP_URL()}/login`;
  const steps = setPasswordUrl
    ? `
    <p style="${p}"><strong style="color:#1F3D2C;">First, set your password:</strong></p>
    <p style="margin:0 0 8px;">${button(esc(setPasswordUrl), 'Set your password')}</p>
    <p style="font-size:13px;line-height:1.5;margin:0 0 20px;color:#6B756B;">This button works for ${SET_PASSWORD_DAYS} days. After that, use
      <a href="${APP_URL()}/forgot-password.html" style="color:#2D6B4F;">Forgot password</a> on the sign-in page.</p>
    <p style="${p}">Then log into your portal any time at <a href="${loginUrl}" style="color:#2D6B4F;">dfymarketinggroup.com/login</a>.</p>`
    : `
    <p style="margin:0 0 20px;">${button(loginUrl, 'Log into your portal')}</p>`;

  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;background:#F5F2EA;color:#1F3D2C;">
    <p style="font-size:15px;margin:0 0 16px;">Hi ${esc(firstName(name))},</p>
    <p style="${p}">Welcome to DFY Marketing — we're so glad you're here!</p>
    <p style="${p}">Your payment is confirmed and your client portal is ready. The next step is to log in and complete your
      <strong style="color:#1F3D2C;">Business Profile</strong> so our team can hit the ground running.</p>
    ${steps}
    <p style="${p}">Your business profile takes about 5 minutes and gives us everything we need to start building your campaigns — don't skip it!</p>
    <p style="${p}">If you have any questions, just reply to this email and we'll get back to you shortly.</p>
    <p style="font-size:15px;line-height:1.6;margin:0;color:#444;">Talk soon,<br>The DFY Marketing Team</p>
  </div>`;
}

// One-time link for someone who has never chosen a password. Uses the same
// token the reset-password page already checks, just with a longer expiry.
async function makeSetPasswordUrl(clientId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SET_PASSWORD_DAYS * 24 * 60 * 60 * 1000);
  await pool.query(
    'UPDATE clients SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
    [token, expires, clientId]
  );
  return `${APP_URL()}/reset-password.html?token=${token}&welcome=1`;
}

// needsPassword: true when the account was just made for them (Payment Link) —
// they never picked a password. A custom plan always gets the set-password version.
// Throws if the email can't be sent, so the Stripe webhook fails and Stripe retries.
async function sendWelcomeEmail({ clientId, planName, needsPassword = false }) {
  if (!mailer.isConfigured()) {
    console.warn('[welcome] Email not set up (GOOGLE_SERVICE_ACCOUNT_JSON) — welcome email NOT sent.');
    return { skipped: 'not-configured' };
  }
  await ensureColumn();

  // Claim it first so two webhook deliveries can't both send
  const claimed = await pool.query(
    `UPDATE clients SET welcome_email_sent_at = NOW()
     WHERE id = $1 AND welcome_email_sent_at IS NULL
     RETURNING id, name, email, plan`,
    [clientId]
  );
  const client = claimed.rows[0];
  if (!client) return { skipped: 'already-sent' };
  if (!client.email) return { skipped: 'no-email' };

  const withPassword = needsPassword || isCustomPlan(planName || client.plan);
  try {
    const setPasswordUrl = withPassword ? await makeSetPasswordUrl(client.id) : null;
    await mailer.sendMail({ to: client.email, subject: SUBJECT, html: welcomeHtml({ name: client.name, setPasswordUrl }) });
  } catch (err) {
    // Let the next try (Stripe retry) send it
    await pool.query('UPDATE clients SET welcome_email_sent_at = NULL WHERE id = $1', [client.id]).catch(() => {});
    throw err;
  }

  console.log(`✅ Welcome email sent to ${client.email}${withPassword ? ' (with set-password link)' : ''}`);
  try {
    const { logForClient } = require('./activity');
    await logForClient(client.id, 'dfy',
      `Welcome email sent${withPassword ? ' (with a link to set their password)' : ''}`, `welcome:client:${client.id}`);
  } catch (err) {
    console.error('[welcome] Could not add to Activity:', err.message);
  }
  return { sent: true, withPassword };
}

module.exports = { sendWelcomeEmail, welcomeHtml, isCustomPlan, SUBJECT };
