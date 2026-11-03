// services/email.js — password reset + contact form emails.
// Sends through Google Workspace (services/mailer.js) once it's set up.
// Until then it falls back to GoHighLevel (GHL_API_KEY, GHL_LOCATION_ID),
// which is being retired — so set up GOOGLE_SERVICE_ACCOUNT_JSON.

const axios = require('axios');
const mailer = require('./mailer');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const APP_URL = () => process.env.APP_URL || 'https://dfymarketinggroup.com';

const GHL_HEADERS = () => ({
  Authorization: `Bearer ${process.env.GHL_API_KEY}`,
  'Content-Type': 'application/json',
  Version: '2021-07-28',
});

// Find existing GHL contact by email, or create a minimal one
async function getOrCreateContact(email) {
  const locationId = process.env.GHL_LOCATION_ID;

  // Try to find existing contact
  try {
    const lookup = await axios.get(
      `${GHL_BASE}/contacts/search/duplicate?email=${encodeURIComponent(email)}&locationId=${locationId}`,
      { headers: GHL_HEADERS() }
    );
    if (lookup.data?.contact?.id) return lookup.data.contact.id;
  } catch (_) {}

  // Create minimal contact if not found
  const created = await axios.post(
    `${GHL_BASE}/contacts/`,
    { locationId, email },
    { headers: GHL_HEADERS() }
  );
  return created.data?.contact?.id;
}

// Get or create a conversation for a contact
async function getOrCreateConversation(contactId) {
  const locationId = process.env.GHL_LOCATION_ID;

      try {
              const res = await axios.post(
                        `${GHL_BASE}/conversations/`,
                { contactId, locationId },
                { headers: GHL_HEADERS() }
                      );
              return res.data?.conversation?.id || res.data?.id;
      } catch (err) {
              const data = err.response?.data;
              if (data?.conversationId) return data.conversationId;
              throw err;
      }
}

// Send password reset email via GHL
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
  const subject = 'Reset your DFY Portal password';
  if (mailer.isConfigured()) {
    await mailer.sendMail({ to: toEmail, subject, html: passwordResetHtml(resetUrl) });
    console.log(`✅ Password reset email sent via Gmail to ${toEmail}`);
    return;
  }

  const contactId      = await getOrCreateContact(toEmail);
  const conversationId = await getOrCreateConversation(contactId);

  await axios.post(
    `${GHL_BASE}/conversations/messages`,
    {
      type:           'Email',
      conversationId,
      contactId,
      subject,
      html: passwordResetHtml(resetUrl),
    },
    { headers: GHL_HEADERS() }
  );

  console.log(`✅ Password reset email sent via GHL to ${toEmail}`);
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
  const subject = `New website inquiry from ${name}`;
  if (mailer.isConfigured()) {
    // Reply-To is the person who wrote in, so hitting Reply answers them directly
    await mailer.sendMail({ to: mailer.TEAM(), replyTo: email, subject, html: contactInquiryHtml({ name, email, message }) });
    console.log(`✅ Contact inquiry email sent via Gmail for ${email}`);
    return;
  }

  const contactId      = await getOrCreateContact('hello@dfymarketinggroup.com');
  const conversationId = await getOrCreateConversation(contactId);

  await axios.post(
    `${GHL_BASE}/conversations/messages`,
    {
      type:           'Email',
      conversationId,
      contactId,
      subject,
      html: contactInquiryHtml({ name, email, message }),
    },
    { headers: GHL_HEADERS() }
  );

  console.log(`✅ Contact inquiry email sent for ${email}`);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendPasswordReset, sendContactInquiry };
