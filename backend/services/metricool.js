// services/metricool.js — Pushes an approved post onto your Metricool content
// calendar so clicking Approve in the portal actually puts it on the schedule,
// instead of you also having to add it in Metricool by hand.
//
// One-way only: Metricool doesn't offer an API (or webhooks) for reading posts
// back out, so this never fetches anything from Metricool — it only sends.
// You still write the caption once, here in the portal's "Add Post" form; what
// this adds is that Approve also schedules it on the calendar.
//
// Needs three things before it does anything:
//   1. METRICOOL_USER_TOKEN and METRICOOL_USER_ID — env vars, from Metricool's
//      Settings → API page.
//   2. A metricool_blog_id set on the client's account (their "brand" ID in
//      Metricool) — set per-client in the admin, under Account.
// Until all three are set for a given client, scheduling is skipped quietly —
// approving a post never depends on Metricool being configured.

const axios = require('axios');

// Our platform names → Metricool's network names
const NETWORK = {
  instagram: 'instagram', facebook: 'facebook', twitter: 'twitter', linkedin: 'linkedin', tiktok: 'tiktok',
};

// We only store a date for a post (no time of day), so pick a consistent time
// to schedule it at. Override with env vars if you want a different default.
const DEFAULT_TIME = process.env.METRICOOL_DEFAULT_TIME || '10:00:00';
const DEFAULT_TIMEZONE = process.env.METRICOOL_DEFAULT_TIMEZONE || 'America/Los_Angeles';

// scheduledDate: the post's scheduled_date (Date or 'YYYY-MM-DD' string).
// timezone: the client's own timezone if we know it (falls back to DEFAULT_TIMEZONE).
// Returns Metricool's post id, or null if Metricool isn't set up for this client yet.
async function scheduleToMetricool({ text, platform, scheduledDate, blogId, timezone }) {
  const token = process.env.METRICOOL_USER_TOKEN;
  const userId = process.env.METRICOOL_USER_ID;
  if (!token || !userId || !blogId) return null;

  const day = new Date(scheduledDate).toISOString().slice(0, 10);
  const res = await axios.post(
    `https://app.metricool.com/api/v2/scheduler/posts?blogId=${encodeURIComponent(blogId)}&userId=${encodeURIComponent(userId)}`,
    {
      text,
      providers: [{ network: NETWORK[platform] || platform }],
      publicationDate: { dateTime: `${day}T${DEFAULT_TIME}`, timezone: timezone || DEFAULT_TIMEZONE },
      autoPublish: false, // leaves it pending in Metricool rather than posting instantly
      draft: false,
    },
    { headers: { 'Content-Type': 'application/json', 'X-Mc-Auth': token }, timeout: 15000 }
  );
  return res.data?.id ?? res.data?.data?.id ?? null;
}

module.exports = { scheduleToMetricool };
