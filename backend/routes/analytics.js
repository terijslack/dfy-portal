// routes/analytics.js — Numbers for the client's Analytics page and dashboard.
// GET /api/analytics?period=this_month|last_month|90d
//
// Reads the daily numbers saved by services/metricoolStats.js (never calls
// Metricool here). Platforms the client doesn't have simply don't appear.

const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const { pool } = require('../services/crm');
const { summarize, periodRanges, addDays } = require('../services/analyticsSummary');
const { DEFAULT_TIMEZONE } = require('../services/metricool');

const PERIODS = ['this_month', 'last_month', '90d'];

function todayIn(tz) {
  return new Date().toLocaleDateString('en-CA', { timeZone: tz || DEFAULT_TIMEZONE });
}

router.get('/', requireLogin, async (req, res) => {
  try {
    const period = PERIODS.includes(req.query.period) ? req.query.period : 'this_month';
    const today = todayIn();
    const { previous } = periodRanges(period, today);

    const [client, rows, first, sends] = await Promise.all([
      pool.query('SELECT metricool_blog_id, stats_synced_at, (mailchimp_api_key IS NOT NULL) AS mailchimp_connected FROM clients WHERE id = $1', [req.user.id]),
      // From a month before the comparison period, so follower counts have a starting point
      pool.query(
        `SELECT network, metric, to_char(day, 'YYYY-MM-DD') AS day, value
           FROM stats_daily WHERE client_id = $1 AND day >= $2 AND day <= $3`,
        [req.user.id, addDays(previous.start, -31), today]
      ),
      pool.query(`SELECT to_char(MIN(day), 'YYYY-MM-DD') AS first_day FROM stats_daily WHERE client_id = $1 AND value <> 0 AND network <> 'newsletter'`, [req.user.id]),
      // Newsletter sends (Mailchimp), newest first
      pool.query(
        `SELECT ec.subject, ec.title, ec.sent_at, ec.emails_sent, ec.open_rate, ec.click_rate, ec.unsubscribed, n.title AS newsletter_title
           FROM email_campaigns ec LEFT JOIN newsletters n ON n.id = ec.newsletter_id
          WHERE ec.client_id = $1 AND ec.sent_at IS NOT NULL ORDER BY ec.sent_at DESC LIMIT 60`,
        [req.user.id]
      ).catch(() => ({ rows: [] })),
    ]);

    const c = client.rows[0] || {};
    const social = rows.rows.filter(r => r.network !== 'newsletter');
    const summary = summarize(social, { period, today });
    const newsletter = newsletterSummary(rows.rows, sends.rows, summary.current, c.mailchimp_connected);
    res.json({
      ...summary,
      hasData: summary.hasData || Boolean(newsletter),
      newsletter,
      connected: Boolean(c.metricool_blog_id),
      updatedAt: c.stats_synced_at || null,
      firstDay: first.rows[0]?.first_day || null,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Could not load your numbers.' });
  }
});

// Subscribers now, change during the period, and the sends in the period
// (or the last three, so a quiet month still shows how the last ones did).
function newsletterSummary(rows, sends, current, connected) {
  const subs = rows.filter(r => r.network === 'newsletter' && r.metric === 'subscribers')
    .map(r => ({ day: String(r.day).slice(0, 10), value: Number(r.value) || 0 }))
    .sort((a, b) => a.day.localeCompare(b.day));
  if (!connected && !subs.length && !sends.length) return null;
  const latest = subs.filter(p => p.day <= current.end).pop() || null;
  const before = subs.filter(p => p.day < current.start).pop() || subs.find(p => p.day >= current.start) || null;
  const toItem = s => ({
    subject: s.subject || s.title || 'Newsletter',
    name: s.newsletter_title || null,
    sentAt: s.sent_at,
    sentTo: Number(s.emails_sent) || 0,
    opened: Math.round((Number(s.open_rate) || 0) * 100),
    clicked: Math.round((Number(s.click_rate) || 0) * 1000) / 10,
    unsubscribed: Number(s.unsubscribed) || 0,
  });
  const day = s => new Date(s.sent_at).toLocaleDateString('en-CA', { timeZone: DEFAULT_TIMEZONE });
  const inPeriod = sends.filter(s => day(s) >= current.start && day(s) <= current.end).map(toItem);
  return {
    subscribers: latest ? latest.value : null,
    subscribersChange: latest && before && before.day !== latest.day ? latest.value - before.value : null,
    sends: inPeriod,
    recent: inPeriod.length ? [] : sends.slice(0, 3).map(toItem),
  };
}

module.exports = router;
