// services/email.js — password reset + contact form emails.
// Sends through Google Workspace (services/mailer.js, GOOGLE_SERVICE_ACCOUNT_JSON).
// GoHighLevel used to be the backup route; it was removed when GHL was cancelled.

const mailer = require('./mailer');

const APP_URL = () => process.env.APP_URL || 'https://dfymarketinggroup.com';

// Every email here needs Gmail sending. Fail loudly (callers log it) instead of
// pretending the email went out.
function requireMailer() {
  if (!mailer.isConfigured()) {
    throw new Error('Email is not set up: GOOGLE_SERVICE_ACCOUNT_JSON is missing in Railway');
  }
}

// Password reset email
function passwordResetHtml(resetUrl) {
  return `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#F5F2EA;">
          <img src="${APP_URL()}/logo.png" alt="Done For You Marketing" style="height:80px;margin-bottom:24px;" />
          <h2 style="font-size:22px;color:#1F3D2C;margin:0 0 12px;">Reset your password</h2>
          <p style="color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 24px;">
            We received a request to reset the password for your DFY Marketing client portal account.
            Click the button below to choose a new password. This link expires in 1 hour.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#2D6B4F;color:#F5F2EA;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:600;">
            Reset Password
          </a>
          <p style="color:#9AA199;font-size:13px;margin-top:24px;">
            If you didn't request this, you can safely ignore this email — your password won't change.
          </p>
        </div>
      `;
}

async function sendPasswordReset(toEmail, resetUrl) {
  requireMailer();
  await mailer.sendMail({ to: toEmail, subject: 'Reset your DFY Portal password', html: passwordResetHtml(resetUrl) });
  console.log(`✅ Password reset email sent via Gmail to ${toEmail}`);
}

// Send a contact-form inquiry to hello@dfymarketinggroup.com
function contactInquiryHtml({ name, email, message }) {
  return `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#F5F2EA;">
          <img src="${APP_URL()}/logo.png" alt="Done For You Marketing" style="height:80px;margin-bottom:24px;" />
          <h2 style="font-size:22px;color:#1F3D2C;margin:0 0 16px;">New website inquiry</h2>
          <p style="color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 8px;">
            <strong>Name:</strong> ${escapeHtml(name)}
          </p>
          <p style="color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 8px;">
            <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#2D6B4F;">${escapeHtml(email)}</a>
          </p>
          <p style="color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 24px;">
            <strong>Message:</strong><br>${escapeHtml(message)}
          </p>
          <p style="color:#9AA199;font-size:13px;margin-top:24px;">
            Sent from the DFY Marketing contact form.
          </p>
        </div>
      `;
}

async function sendContactInquiry({ name, email, message }) {
  requireMailer();
  // Reply-To is the person who wrote in, so hitting Reply answers them directly
  await mailer.sendMail({
    to: mailer.TEAM(), replyTo: email,
    subject: `New website inquiry from ${name}`,
    html: contactInquiryHtml({ name, email, message }),
  });
  console.log(`✅ Contact inquiry email sent via Gmail for ${email}`);
}

// A message a logged-in client sent from the portal's Contact Us page.
// Goes to the team inbox (hello@). Throws if it can't be sent, so the client is told.
function clientMessageHtml({ name, businessName, email, subject, message }) {
  return `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#F5F2EA;">
          <img src="${APP_URL()}/logo.png" alt="Done For You Marketing" style="height:80px;margin-bottom:24px;" />
          <h2 style="font-size:22px;color:#1F3D2C;margin:0 0 16px;">New message from a client</h2>
          <p style="color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 8px;">
            <strong>Client:</strong> ${escapeHtml(name)}${businessName ? ` (${escapeHtml(businessName)})` : ''}
          </p>
          <p style="color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 8px;">
            <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#2D6B4F;">${escapeHtml(email)}</a>
          </p>
          <p style="color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 8px;">
            <strong>Subject:</strong> ${escapeHtml(subject)}
          </p>
          <p style="color:#6B756B;font-size:15px;line-height:1.6;margin:0 0 24px;">
            <strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}
          </p>
          <p style="color:#9AA199;font-size:13px;margin-top:24px;">
            Sent from the Contact Us page in the client portal. Hit Reply to answer the client directly.
          </p>
        </div>
      `;
}

async function sendClientMessage({ name, businessName, email, subject, message }) {
  requireMailer();
  const who = businessName || name;
  await mailer.sendMail({
    to: mailer.TEAM(), replyTo: email,
    subject: `Portal message from ${who}: ${subject}`,
    html: clientMessageHtml({ name, businessName, email, subject, message }),
  });
  console.log(`✅ Client portal message sent via Gmail for ${email}`);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendPasswordReset, sendContactInquiry, sendClientMessage };
