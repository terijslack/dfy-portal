// services/gbpAuditEmail.js — Emails for the free Google Business Profile audit
// form on /landing. Replaces two GoHighLevel workflows in the "GBP Audit" folder:
//   • "Auto email after GBP audit survey complete" → thankYou() to the person
//   • the team never got an email from GHL; now hello@ gets teamAlert()
// (The other two GHL workflows — make a deal, copy the business name onto the
// contact — are done by services/crm.js addGbpAuditLead.)
//
// Sent through Google Workspace (services/mailer.js), from Frankie, so replies
// land in a real inbox. Best-effort: an email problem never breaks the form.

const mailer = require('./mailer');

const APP_URL = () => process.env.APP_URL || 'https://dfymarketinggroup.com';
const SITE = 'https://dfymarketinggroup.com';
const PHONE = '(530) 753-2013';
const THANK_YOU_SUBJECT = "You're one step closer to getting your time back";

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const firstName = name => String(name || '').trim().split(/\s+/)[0] || 'there';
const safeUrl = u => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : null);

// ── To the person who asked for the audit ────────────────────────────────────
function thankYouHtml({ name }) {
  const p = 'font-size:15px;line-height:1.6;margin:0 0 16px;color:#444;';
  const h = 'font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#2D6B4F;margin:22px 0 6px;font-weight:600;';
  const more = anchor => `<a href="${SITE}/#${anchor}" style="color:#7D2A03;font-size:14px;font-weight:600;text-decoration:none;">Learn more</a>`;
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;background:#F5F2EA;color:#1F3D2C;">
    <p style="font-size:15px;margin:0 0 16px;">Hi ${esc(firstName(name))},</p>
    <p style="${p}">Thank you for requesting your free Google Business Profile audit! One of our team members will reach out within 1–2 business days to go over your results.</p>
    <p style="${p}">In the meantime, here's a look at three ways Done For You Marketing helps local businesses like yours stop guessing and start growing:</p>

    <p style="${h}">Social media management</p>
    <p style="${p}margin-bottom:6px;">Consistent, on-brand content across Instagram, Facebook, LinkedIn, and more. Written, scheduled, and managed for you. No more scrambling for ideas or feeling guilty about not posting. We show up so you can focus on running your business.</p>
    <p style="margin:0 0 8px;">${more('services')}</p>

    <p style="${h}">Analytics &amp; reporting</p>
    <p style="${p}margin-bottom:6px;">No more guessing what's working. We give you clear, straightforward reporting so you always know how your marketing is performing and what's driving real growth for your business.</p>
    <p style="margin:0 0 8px;">${more('services')}</p>

    <p style="${h}">Strategy &amp; brand voice</p>
    <p style="${p}margin-bottom:6px;">This is where most businesses are missing out. We build a content strategy around your brand, your voice, and your goals, then execute it consistently.</p>
    <p style="margin:0 0 22px;">${more('services')}</p>

    <p style="${p}"><strong style="color:#1F3D2C;">All of this, handled by a local team that knows the Sacramento market.</strong> No hidden fees, no long-term contracts.</p>
    <p style="margin:0 0 22px;"><a href="${SITE}/#pricing" style="display:inline-block;background:#2D6B4F;color:#F5F2EA;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">See our plans</a></p>

    <p style="${p}">Questions before we reach out? Just reply to this email or call us at <span style="white-space:nowrap;">${PHONE}</span>.</p>
    <p style="font-size:15px;line-height:1.6;margin:0;color:#444;">The Done For You Marketing team</p>
    <p style="font-size:12px;color:#6B756B;margin:24px 0 0;">Done For You Marketing LLC · <a href="${SITE}" style="color:#6B756B;">dfymarketinggroup.com</a> · hello@dfymarketinggroup.com</p>
  </div>`;
}

async function sendThankYou(request) {
  if (!mailer.isConfigured()) { console.log('[gbp-audit] Email not set up — thank-you email skipped'); return; }
  await mailer.sendMail({
    to: request.email,
    replyTo: mailer.TEAM(),
    subject: THANK_YOU_SUBJECT,
    html: thankYouHtml(request),
  });
  console.log(`✅ GBP audit thank-you email sent to ${request.email}`);
}

// ── To the DFY team (hello@) ─────────────────────────────────────────────────
function teamAlertHtml({ name, business_name, email, phone, gbp_link, notes }) {
  const link = safeUrl(gbp_link);
  const rows = [
    ['Name', esc(name)],
    ['Business', esc(business_name)],
    ['Email', `<a href="mailto:${esc(email)}" style="color:#2D6B4F;">${esc(email)}</a>`],
    ['Phone', phone ? `<a href="tel:${esc(String(phone).replace(/[^\d+]/g, ''))}" style="color:#2D6B4F;">${esc(phone)}</a>` : ''],
    ['Google profile', link ? `<a href="${esc(link)}" style="color:#2D6B4F;word-break:break-all;">${esc(link)}</a>` : esc(gbp_link)],
    ['Notes', esc(notes)],
  ].filter(r => r[1]);
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;background:#F5F2EA;color:#1F3D2C;">
    <h2 style="font-size:20px;margin:0 0 8px;color:#1F3D2C;">New free GBP audit request</h2>
    <p style="font-size:15px;line-height:1.6;margin:0 0 18px;color:#444;">${esc(business_name)} asked for a free Google Business Profile audit. They've been sent the thank-you email and added to the Pipeline as a New Lead. Reply to this email to write back to them.</p>
    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;margin:0 0 18px;font-size:14px;">
      ${rows.map(([k, v]) => `<tr><td style="padding:8px 12px;color:#6B756B;width:120px;vertical-align:top;">${k}</td><td style="padding:8px 12px;color:#1F3D2C;white-space:pre-wrap;">${v}</td></tr>`).join('')}
    </table>
    <a href="${APP_URL()}/admin/pipeline" style="display:inline-block;background:#2D6B4F;color:#F5F2EA;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:600;">Open the Pipeline</a>
  </div>`;
}

async function sendTeamAlert(request) {
  if (!mailer.isConfigured()) { console.log('[gbp-audit] Email not set up — team alert skipped'); return; }
  await mailer.sendMail({
    to: mailer.TEAM(),
    replyTo: request.email,
    subject: `Free GBP audit request: ${request.business_name}`,
    html: teamAlertHtml(request),
    important: true,
  });
  console.log(`✅ GBP audit team alert sent (${request.business_name})`);
}

module.exports = { sendThankYou, sendTeamAlert, thankYouHtml, teamAlertHtml, THANK_YOU_SUBJECT };
