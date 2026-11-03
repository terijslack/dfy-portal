// services/metricool.js — Talks to Metricool's API.
//
// How posts flow:
//   1. DFY writes a post in Metricool and saves it as a DRAFT on the client's
//      brand. Drafts never publish on their own.
//   2. The portal pulls those drafts in (see metricoolSync.js) and shows them
//      on the client's Post Approval page — caption, image/video, date.
//   3. Client clicks Approve → the portal flips the draft to scheduled in
//      Metricool (releasePost below), and Metricool publishes it on its date.
//      Client clicks Request Changes → their notes show in the admin; DFY edits
//      the draft in Metricool and the revised version reappears for approval.
//
// The older path still works too: a post typed into the admin's "Add Post"
// form gets created in Metricool when the client approves it (scheduleToMetricool).
//
// Needs METRICOOL_USER_TOKEN and METRICOOL_USER_ID (Metricool → Settings → API),
// plus a Metricool brand ID set on each client's account in the admin.
// Endpoints match Metricool's own official connector (mcp-metricool).

const axios = require('axios');

const BASE = 'https://app.metricool.com/api';

// Our platform names → Metricool's network names
const NETWORK = {
  instagram: 'instagram', facebook: 'facebook', twitter: 'twitter', linkedin: 'linkedin', tiktok: 'tiktok',
};

// We only store a date for portal-written posts (no time of day), so pick a consistent time
const DEFAULT_TIME = process.env.METRICOOL_DEFAULT_TIME || '10:00:00';
const DEFAULT_TIMEZONE = process.env.METRICOOL_DEFAULT_TIMEZONE || 'America/Los_Angeles';

function isConfigured() {
  return Boolean(process.env.METRICOOL_USER_TOKEN && process.env.METRICOOL_USER_ID);
}

function headers() {
  return { 'Content-Type': 'application/json', 'X-Mc-Auth': process.env.METRICOOL_USER_TOKEN };
}

function authQuery(blogId) {
  return `blogId=${encodeURIComponent(blogId)}&userId=${encodeURIComponent(process.env.METRICOOL_USER_ID)}`;
}

// Portal-written post → create it in Metricool (used on approve).
// Returns Metricool's post id, or null if Metricool isn't set up for this client yet.
async function scheduleToMetricool({ text, platform, scheduledDate, blogId, timezone }) {
  if (!isConfigured() || !blogId) return null;

  const day = new Date(scheduledDate).toISOString().slice(0, 10);
  const res = await axios.post(
    `${BASE}/v2/scheduler/posts?${authQuery(blogId)}`,
    {
      text,
      providers: [{ network: NETWORK[platform] || platform }],
      publicationDate: { dateTime: `${day}T${DEFAULT_TIME}`, timezone: timezone || DEFAULT_TIMEZONE },
      autoPublish: true,
      draft: false,
    },
    { headers: headers(), timeout: 15000 }
  );
  return res.data?.id ?? res.data?.data?.id ?? null;
}

// All not-yet-published posts (drafts and scheduled) on a brand between two
// days ('YYYY-MM-DD'). Returns an array of Metricool post objects.
async function listScheduledPosts({ blogId, start, end, timezone }) {
  const tz = encodeURIComponent(timezone || DEFAULT_TIMEZONE);
  const res = await axios.get(
    `${BASE}/v2/scheduler/posts?${authQuery(blogId)}` +
      `&start=${start}T00%3A00%3A00&end=${end}T23%3A59%3A59&timezone=${tz}&extendedRange=false`,
    { headers: headers(), timeout: 20000 }
  );
  const body = res.data;
  const list = Array.isArray(body) ? body : (body?.data ?? body?.posts ?? []);
  if (!Array.isArray(list)) throw new Error('Unexpected response from Metricool when listing posts');
  return list;
}

// Client approved a Metricool draft → put it on the schedule.
// Metricool wants the full post back on update, so we resend its own copy
// with only draft/autoPublish changed.
async function releasePost({ blogId, raw }) {
  const id = raw.id;
  const body = { ...raw, draft: false, autoPublish: true };
  const res = await axios.put(
    `${BASE}/v2/scheduler/posts/${encodeURIComponent(id)}?${authQuery(blogId)}`,
    body,
    { headers: headers(), timeout: 15000 }
  );
  return res.data;
}

module.exports = { scheduleToMetricool, listScheduledPosts, releasePost, isConfigured, DEFAULT_TIMEZONE };
