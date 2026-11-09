// services/guideEmail.js — The email with the free guide ("7 Proven Posts Any
// Trade Can Steal"). Replaces the email step of the GoHighLevel "Guide
// download - 7 posts to steal" workflow; same content, refreshed (no emojis,
// new phone number).
//
// The person can also download the guide right on the page after they sign up,
// so this email is the backup copy. Sent from Frankie through Google Workspace
// (services/mailer.js). Best-effort: an email problem never breaks the form.

const mailer = require('./mailer');

const SITE = 'https://dfymarketinggroup.com';
const GUIDE_PATH = '/downloads/7-proven-posts-for-trades.pdf';
const GUIDE_URL = () => `${process.env.APP_URL || SITE}${GUIDE_PATH}`;
const PHONE = '(530) 753-2013';
const SUBJECT = 'Your free guide: 7 Proven Posts Any Trade Can Steal';

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const firstName = name => String(name || '').trim().split(/\s+/)[0] || 'there';

function guideHtml({ name }) {
  const p = 'font-size:15px;line-height:1.6;margin:0 0 16px;color:#444;';
  const h = 'font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#2D6B4F;margin:26px 0 8px;font-weight:600;';
  const button = (href, label, bg) =>
    `<a href="${href}" style="display:inline-block;background:${bg};color:#F5F2EA;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;">${label}</a>`;
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;background:#F5F2EA;color:#1F3D2C;">
    <p style="font-size:15px;margin:0 0 16px;">Hi ${esc(firstName(name))},</p>
    <p style="${p}">Your free guide is ready. <strong style="color:#1F3D2C;">7 Proven Posts Any Trade Can Steal</strong> gives you seven post formats that get attention, build trust, and bring in calls, each with a caption template and a pro tip.</p>
    <p style="margin:0 0 8px;">${button(GUIDE_URL(), 'Open your free guide', '#2D6B4F')}</p>
    <p style="font-size:13px;line-height:1.5;margin:0 0 8px;color:#6B756B;">It opens right in your browser, on your phone or computer.</p>

    <p style="${h}">Marketing pro tip</p>
    <p style="${p}">Customers notice when a business "sounds" different on Instagram than it does on its website or in an email. Even small differences in tone can make a brand feel less trustworthy. Before creating new content, pick a few words that describe your business's voice and check that every post, page, and email matches.</p>
    <p style="${p}">We keep this consistent across every platform for you.</p>

    <p style="${h}">Free Google Business Profile audit</p>
    <p style="${p}">Is your business showing up when local customers search? Find out what's holding your Google listing back before it costs you another customer.</p>
    <p style="margin:0 0 24px;">${button(`${SITE}/landing`, 'Get your free audit', '#7D2A03')}</p>

    <p style="${p}">Questions? Just reply to this email or call us at <span style="white-space:nowrap;">${PHONE}</span>.</p>
    <p style="font-size:15px;line-height:1.6;margin:0;color:#444;">The Done For You Marketing team</p>
    <p style="font-size:12px;color:#6B756B;margin:24px 0 0;">Done For You Marketing LLC · <a href="${SITE}" style="color:#6B756B;">dfymarketinggroup.com</a> · hello@dfymarketinggroup.com</p>
  </div>`;
}

async function sendGuide(request) {
  if (!mailer.isConfigured()) { console.log('[guide] Email not set up — guide email skipped'); return; }
  await mailer.sendMail({ to: request.email, replyTo: mailer.TEAM(), subject: SUBJECT, html: guideHtml(request) });
  console.log(`✅ Free guide email sent to ${request.email}`);
}

module.exports = { sendGuide, guideHtml, GUIDE_PATH, SUBJECT };
