// services/email.js — sends the portal's one-at-a-time emails (welcome, password
// reset, contact-form alerts) through Google Workspace from noreply@dfymarketinggroup.com.
//
// Settings (Railway → Variables):
//   SMTP_USER        the Workspace mailbox that sends, e.g. noreply@dfymarketinggroup.com
//   SMTP_PASS        an App Password for that mailbox (Google Account → Security → App passwords)
//   SMTP_HOST        optional, default smtp.gmail.com
//   SMTP_PORT        optional, default 465 (SSL). 587 switches to STARTTLS.
//   EMAIL_FROM       optional, default "Done For You Marketing <SMTP_USER>"
//   EMAIL_REPLY_TO   optional, default hello@dfymarketinggroup.com — where replies land
//   EMAIL_TEAM       optional, default hello@dfymarketinggroup.com — where lead alerts go
//
// Bulk sends (newsletters, campaigns) never go through here — those belong on a
// subdomain with a bulk-email platform, so the main domain's reputation stays clean.

const nodemailer = require('nodemailer');

const TEAM_EMAIL = () => process.env.EMAIL_TEAM || 'hello@dfymarketinggroup.com';
const REPLY_TO   = () => process.env.EMAIL_REPLY_TO || 'hello@dfymarketinggroup.com';

function isConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function appUrl() {
  return (process.env.APP_URL || process.env.BASE_URL || 'https://dfymarketinggroup.com').replace(/\/$/, '');
}

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

// Sends one email. Throws if email isn't set up, so callers can decide whether
// that's fatal (welcome email: yes, Stripe retries) or not (contact alert: log it).
async function sendMail({ to, subject, html, replyTo }) {
  if (!isConfigured()) {
    const err = new Error('Email is not set up: SMTP_USER / SMTP_PASS are missing.');
    err.notConfigured = true;
    throw err;
  }
  const from = process.env.EMAIL_FROM || `Done For You Marketing <${process.env.SMTP_USER}>`;
  const info = await getTransporter().sendMail({
    from, to, subject, html,
    replyTo: replyTo || REPLY_TO(),
    text: htmlToText(html),
  });
  console.log(`✅ Email sent: "${subject}" → ${to}`);
  return info;
}

// ─── Templates ───────────────────────────────────────────────────────────────

const STYLE = {
  body:   'font-family:Inter,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#F5F2EA;',
  h2:     'font-size:22px;color:#1F3D2C;margin:0 0 12px;',
  p:      'color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 16px;',
  button: 'display:inline-block;background:#2D6B4F;color:#F5F2EA;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:600;',
  small:  'color:#9AA199;font-size:13px;margin-top:24px;',
};

function layout(inner) {
  return `
    <div style="${STYLE.body}">
      <img src="${appUrl()}/logo.png" alt="Done For You Marketing" style="height:80px;margin-bottom:24px;" />
      ${inner}
    </div>`;
}

// Password reset: the link is good for 1 hour (set in routes/auth.js)
async function sendPasswordReset(toEmail, resetUrl) {
  await sendMail({
    to: toEmail,
    subject: 'Reset your DFY Portal password',
    html: layout(`
      <h2 style="${STYLE.h2}">Reset your password</h2>
      <p style="${STYLE.p}">
        We received a request to reset the password for your DFY Marketing client portal account.
        Click the button below to choose a new password. This link expires in 1 hour.
      </p>
      <a href="${resetUrl}" style="${STYLE.button}">Reset Password</a>
      <p style="${STYLE.small}">
        If you didn't request this, you can safely ignore this email — your password won't change.
      </p>`),
  });
}

// Welcome: sent by the Stripe webhook once a plan is paid for.
// setPasswordUrl is only given to clients who paid through a payment link and
// don't have a password yet; clients who signed up on the site already chose one.
async function sendWelcome({ name, email, planName, setPasswordUrl }) {
  const firstName = escapeHtml((name || '').trim().split(/\s+/)[0] || 'there');
  const plan = escapeHtml(planName || 'your plan');
  const nextStep = setPasswordUrl
    ? `<p style="${STYLE.p}">First, choose a password for your client portal. This link is good for 7 days.</p>
       <a href="${setPasswordUrl}" style="${STYLE.button}">Set my password</a>`
    : `<p style="${STYLE.p}">Your client portal is ready. Sign in and fill out your business profile — that's what we use to plan your content.</p>
       <a href="${appUrl()}/login" style="${STYLE.button}">Open my portal</a>`;

  await sendMail({
    to: email,
    subject: 'Welcome to Done For You Marketing',
    html: layout(`
      <h2 style="${STYLE.h2}">Welcome, ${firstName}</h2>
      <p style="${STYLE.p}">Thanks for choosing Done For You Marketing. Your <strong>${plan}</strong> plan is active.</p>
      ${nextStep}
      <p style="${STYLE.p}" >
        <br>What happens next: once your profile is in, we build your first posts and send them to your portal to approve.
        You'll get an email whenever something's waiting for you.
      </p>
      <p style="${STYLE.small}">
        Questions? Just reply to this email and it comes straight to our team.
      </p>`),
  });
}

// Contact-form inquiry → the team inbox. Reply-to is the visitor, so answering is one click.
async function sendContactInquiry({ name, email, message }) {
  await sendMail({
    to: TEAM_EMAIL(),
    replyTo: email,
    subject: `New website inquiry from ${name}`,
    html: layout(`
      <h2 style="${STYLE.h2}">New website inquiry</h2>
      <p style="${STYLE.p}"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="${STYLE.p}"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#2D6B4F;">${escapeHtml(email)}</a></p>
      <p style="${STYLE.p}"><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      <p style="${STYLE.small}">Sent from the DFY Marketing contact form.</p>`),
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Plain-text fallback for mail apps that don't show HTML
function htmlToText(html) {
  return String(html)
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/gi, '$2: $1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|h\d|div)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n')
    .trim();
}

module.exports = { isConfigured, sendMail, sendPasswordReset, sendWelcome, sendContactInquiry, escapeHtml };
