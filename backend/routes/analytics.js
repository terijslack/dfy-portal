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

    const [client, rows, first] = await Promise.all([
      pool.query('SELECT metricool_blog_id, stats_synced_at FROM clients WHERE id = $1', [req.user.id]),
      // From a month before the comparison period, so follower counts have a starting point
      pool.query(
        `SELECT network, metric, to_char(day, 'YYYY-MM-DD') AS day, value
           FROM stats_daily WHERE client_id = $1 AND day >= $2 AND day <= $3`,
        [req.user.id, addDays(previous.start, -31), today]
      ),
      pool.query(`SELECT to_char(MIN(day), 'YYYY-MM-DD') AS first_day FROM stats_daily WHERE client_id = $1 AND value <> 0`, [req.user.id]),
    ]);

    const c = client.rows[0] || {};
    const summary = summarize(rows.rows, { period, today });
    res.json({
      ...summary,
      connected: Boolean(c.metricool_blog_id),
      updatedAt: c.stats_synced_at || null,
      firstDay: first.rows[0]?.first_day || null,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Could not load your numbers.' });
  }
});

module.exports = router;
