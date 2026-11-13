// services/metricoolStats.js — Pulls each client's daily numbers (followers,
// people reached, likes/comments/shares, Google profile views and clicks) from
// Metricool and keeps them in the stats_daily table.
//
// Pages never call Metricool directly: the Analytics page and the dashboard
// read from stats_daily, so they stay fast, still work if Metricool is down,
// and keep history for "up X% from last month".
//
// Runs once a day for every client with a Metricool brand ID (and on demand
// from admin → account → Posts → "Update numbers"). Each run re-pulls the last
// two weeks, because Google's numbers arrive about 5–6 days late. The first
// run for a client pulls ~7 months so the 3-month comparison works right away
// (as far back as Metricool has data).
//
// Endpoint and metric names match Metricool's own connector (mcp-metricool):
//   GET /v2/analytics/timelines?blogId&userId&from&to&timezone&network&subject&metric
//   (LinkedIn sends the subject as metricType instead)

const axios = require('axios');
const { pool } = require('./crm');
const { isConfigured, DEFAULT_TIMEZONE } = require('./metricool');

const BASE = 'https://app.metricool.com/api';
const FIRST_RUN_DAYS = 200;
const REFRESH_DAYS = 14;

// What we store. agg = how a period is summed up on the pages:
//   'last' — a running total (followers): take the latest value
//   'sum'  — a daily count: add up the days
const METRICS = [
  { network: 'instagram', key: 'followers',    subject: 'account',  metric: 'followers',          agg: 'last' },
  { network: 'instagram', key: 'posts',        subject: 'account',  metric: 'postsCount',         agg: 'sum'  },
  { network: 'instagram', key: 'interactions', subject: 'account',  metric: 'postsInteractions',  agg: 'sum'  },
  { network: 'instagram', key: 'views',        subject: 'account',  metric: 'views',              agg: 'sum'  },
  { network: 'instagram', key: 'reach',        subject: 'account',  metric: 'reach',              agg: 'sum'  },
  { network: 'instagram', key: 'reach_posts',  subject: 'posts',    metric: 'reach',              agg: 'sum'  },
  { network: 'instagram', key: 'reach_reels',  subject: 'reels',    metric: 'reach',              agg: 'sum'  },

  { network: 'facebook',  key: 'followers',    subject: 'account',  metric: 'pageFollows',        agg: 'last' },
  { network: 'facebook',  key: 'posts',        subject: 'account',  metric: 'postsCount',         agg: 'sum'  },
  { network: 'facebook',  key: 'interactions', subject: 'account',  metric: 'postsInteractions',  agg: 'sum'  },
  { network: 'facebook',  key: 'media_views',  subject: 'account',  metric: 'pageMediaView',      agg: 'sum'  },
  { network: 'facebook',  key: 'reach_posts',  subject: 'posts',    metric: 'impressionsunique',  agg: 'sum'  },
  { network: 'facebook',  key: 'page_views',   subject: 'account',  metric: 'pageViews',          agg: 'sum'  },

  { network: 'tiktok',    key: 'followers',    subject: 'account',  metric: 'followers_count',    agg: 'last' },
  { network: 'tiktok',    key: 'video_views',  subject: 'account',  metric: 'video_views',        agg: 'sum'  },
  { network: 'tiktok',    key: 'likes',        subject: 'account',  metric: 'likes',              agg: 'sum'  },
  { network: 'tiktok',    key: 'comments',     subject: 'account',  metric: 'comments',           agg: 'sum'  },
  { network: 'tiktok',    key: 'shares',       subject: 'account',  metric: 'shares',             agg: 'sum'  },

  { network: 'linkedin',  key: 'followers',    subject: 'account',  metric: 'followers',          agg: 'last' },
  { network: 'linkedin',  key: 'posts',        subject: 'posts',    metric: 'posts',              agg: 'sum'  },
  { network: 'linkedin',  key: 'impressions',  subject: 'posts',    metric: 'impressions',        agg: 'sum'  },
  { network: 'linkedin',  key: 'interactions', subject: 'posts',    metric: 'interactions',       agg: 'sum'  },

  // Google Business Profile (Metricool calls it "gmb")
  { network: 'google',    key: 'views',        subject: 'business', metric: 'business_impressions_total',  agg: 'sum', mcNetwork: 'gmb' },
  { network: 'google',    key: 'calls',        subject: 'business', metric: 'call_clicks',                 agg: 'sum', mcNetwork: 'gmb' },
  { network: 'google',    key: 'website',      subject: 'business', metric: 'website_clicks',              agg: 'sum', mcNetwork: 'gmb' },
  { network: 'google',    key: 'directions',   subject: 'business', metric: 'business_direction_requests', agg: 'sum', mcNetwork: 'gmb' },
  { network: 'google',    key: 'messages',     subject: 'business', metric: 'business_conversations',      agg: 'sum', mcNetwork: 'gmb' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function todayIn(timezone) {
  return new Date().toLocaleDateString('en-CA', { timeZone: timezone || DEFAULT_TIMEZONE });
}

function addDays(ymd, n) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// '2026-11-01' at 00:00:00 in a timezone → '2026-11-01T00:00:00-07:00'
function localIso(ymd, hms, timezone) {
  const probe = new Date(`${ymd}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'longOffset' }).formatToParts(probe);
  const tz = (parts.find(p => p.type === 'timeZoneName')?.value || 'GMT').replace('GMT', '');
  return `${ymd}T${hms}${tz || '+00:00'}`;
}

// Metricool answers with nested lists of { dateTime, value }. Pull out one
// value per day, whatever the exact wrapping is.
function parseTimeline(body) {
  const out = new Map();
  const visit = (node) => {
    if (Array.isArray(node)) { node.forEach(visit); return; }
    if (!node || typeof node !== 'object') return;
    const when = node.dateTime ?? node.date ?? node.day;
    if (when != null && ('value' in node)) {
      const raw = String(when);
      const day = /^\d{8}$/.test(raw) ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}` : raw.slice(0, 10);
      const v = Number(node.value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(v)) out.set(day, (out.get(day) || 0) + v);
      return;
    }
    Object.values(node).forEach(visit);
  };
  visit(body);
  return [...out.entries()].map(([day, value]) => ({ day, value })).sort((a, b) => a.day.localeCompare(b.day));
}

async function fetchTimeline({ blogId, def, from, to, timezone }) {
  const network = def.mcNetwork || def.network;
  const subjectParam = network === 'linkedin' && def.subject !== 'stories' ? 'metricType' : 'subject';
  const url = `${BASE}/v2/analytics/timelines` +
    `?blogId=${encodeURIComponent(blogId)}&userId=${encodeURIComponent(process.env.METRICOOL_USER_ID)}` +
    `&from=${encodeURIComponent(localIso(from, '00:00:00', timezone))}` +
    `&to=${encodeURIComponent(localIso(to, '23:59:59', timezone))}` +
    `&timezone=${encodeURIComponent(timezone)}` +
    `&metric=${encodeURIComponent(def.metric)}&${subjectParam}=${encodeURIComponent(def.subject)}&network=${encodeURIComponent(network)}`;
  const res = await axios.get(url, { headers: { 'X-Mc-Auth': process.env.METRICOOL_USER_TOKEN }, timeout: 30000 });
  return parseTimeline(res.data);
}

function shortError(err) {
  const d = err.response?.data;
  const msg = (d && (d.message || d.error || d.detail)) || err.message || 'error';
  return `${err.response?.status ? err.response.status + ' ' : ''}${String(typeof msg === 'string' ? msg : JSON.stringify(msg)).slice(0, 160)}`;
}

// ─── Sync one client ────────────────────────────────────────────────────────

async function runStatsSync(clientId, { days } = {}) {
  if (!isConfigured()) return { skipped: true, reason: 'not_configured' };
  const row = (await pool.query('SELECT id, metricool_blog_id FROM clients WHERE id = $1', [clientId])).rows[0];
  if (!row || !row.metricool_blog_id) return { skipped: true, reason: 'no_brand' };

  const timezone = DEFAULT_TIMEZONE;
  const hasHistory = (await pool.query('SELECT 1 FROM stats_daily WHERE client_id = $1 LIMIT 1', [clientId])).rows.length > 0;
  const to = todayIn(timezone);
  const from = addDays(to, -((days || (hasHistory ? REFRESH_DAYS : FIRST_RUN_DAYS)) - 1));

  const report = [];
  let saved = 0;
  let failures = 0;
  for (const def of METRICS) {
    try {
      const points = await fetchTimeline({ blogId: row.metricool_blog_id, def, from, to, timezone });
      for (const p of points) {
        await pool.query(
          `INSERT INTO stats_daily (client_id, network, metric, day, value, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (client_id, network, metric, day) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [clientId, def.network, def.key, p.day, p.value]
        );
      }
      saved += points.length;
      report.push({ network: def.network, metric: def.key, days: points.length, total: Math.round(points.reduce((s, p) => s + p.value, 0)) });
    } catch (err) {
      failures += 1;
      report.push({ network: def.network, metric: def.key, error: shortError(err) });
    }
  }

  // Every call failing means something is wrong (bad brand ID, API key); a few
  // failing just means that network isn't connected for this brand.
  const error = failures === METRICS.length ? (report[0] && report[0].error) || 'Metricool returned no numbers' : null;
  await pool.query('UPDATE clients SET stats_synced_at = NOW(), stats_error = $2 WHERE id = $1', [clientId, error]);
  return { from, to, saved, failures, error, report };
}

const running = new Map();
function syncStats(clientId, opts) {
  const key = String(clientId);
  if (running.has(key)) return running.get(key);
  const p = runStatsSync(clientId, opts).finally(() => running.delete(key));
  running.set(key, p);
  return p;
}

// Every client whose numbers are more than ~20 hours old
async function syncAllStats() {
  if (!isConfigured()) return;
  const clients = (await pool.query(
    `SELECT id FROM clients
      WHERE metricool_blog_id IS NOT NULL AND metricool_blog_id <> ''
        AND (stats_synced_at IS NULL OR stats_synced_at < NOW() - INTERVAL '20 hours')`
  )).rows;
  for (const { id } of clients) {
    try {
      const r = await syncStats(id);
      if (r.error) console.error(`Stats sync for client ${id}: ${r.error}`);
    } catch (err) {
      console.error(`Stats sync failed for client ${id}:`, err.message);
    }
  }
}

// Checks hourly; each client is only pulled once a day
function startStatsSync() {
  if (!isConfigured()) return null;
  setTimeout(() => syncAllStats().catch(() => {}), 2 * 60 * 1000);
  const t = setInterval(() => syncAllStats().catch(() => {}), 60 * 60 * 1000);
  t.unref?.();
  console.log('✅ Analytics numbers sync on (daily per client)');
  return t;
}

module.exports = { METRICS, parseTimeline, localIso, syncStats, syncAllStats, startStatsSync };
