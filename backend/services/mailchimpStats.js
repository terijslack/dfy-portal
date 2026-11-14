// services/mailchimpStats.js — Newsletter results from each client's own Mailchimp
// account: audience size and, for every send, how many people it went to,
// opened it and clicked.
//
// DFY pastes the client's Mailchimp API key once (Admin → account → Newsletter).
// It's stored encrypted (utils/encrypt.js). A daily job (and "Update results" in
// the admin) saves the numbers in the portal's database:
//   stats_daily     network 'newsletter', metric 'subscribers' — one snapshot a day
//   email_campaigns one row per Mailchimp send, matched to the portal newsletter
// Pages read from those tables, never from Mailchimp directly.
//
// "Opened" uses Mailchimp's rate that leaves out Apple Mail's automatic opens
// (proxy_excluded_open_rate) when it has one, so the number isn't inflated.

const axios = require('axios');
const { pool } = require('./crm');
const { encrypt, decrypt } = require('../utils/encrypt');
const { DEFAULT_TIMEZONE } = require('./metricool');

let tablesReady = null;
function ensureTables() {
  if (!tablesReady) {
    tablesReady = (async () => {
      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS mailchimp_api_key TEXT`);
      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS mailchimp_list_id TEXT`);
      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS mailchimp_list_name TEXT`);
      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS newsletter_synced_at TIMESTAMPTZ`);
      await pool.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS newsletter_error TEXT`);
      await pool.query(`CREATE TABLE IF NOT EXISTS email_campaigns (
        client_id      INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        campaign_id    TEXT NOT NULL,
        newsletter_id  INTEGER REFERENCES newsletters(id) ON DELETE SET NULL,
        title          TEXT,
        subject        TEXT,
        sent_at        TIMESTAMPTZ,
        emails_sent    INTEGER DEFAULT 0,
        unique_opens   INTEGER DEFAULT 0,
        open_rate      NUMERIC DEFAULT 0,
        clicks         INTEGER DEFAULT 0,
        click_rate     NUMERIC DEFAULT 0,
        unsubscribed   INTEGER DEFAULT 0,
        updated_at     TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (client_id, campaign_id)
      )`);
    })().catch(err => { tablesReady = null; throw err; });
  }
  return tablesReady;
}

// Mailchimp keys end in the data center, e.g. "abc123…-us21"
function dataCenter(key) {
  const m = String(key || '').trim().match(/-([a-z]{2,4}\d{1,3})$/i);
  return m ? m[1].toLowerCase() : null;
}

function api(key) {
  const dc = dataCenter(key);
  if (!dc) throw new Error("That doesn't look like a Mailchimp API key. It should end in something like -us21.");
  return axios.create({
    baseURL: `https://${dc}.api.mailchimp.com/3.0`,
    auth: { username: 'dfy', password: String(key).trim() },
    timeout: 20000,
  });
}

function mcError(err) {
  const d = err.response?.data;
  if (err.response?.status === 401) return 'Mailchimp says that API key is not valid (it may have been deleted).';
  return (d && (d.detail || d.title)) || err.message || 'Mailchimp error';
}

async function audiences(key) {
  const res = await api(key).get('/lists', { params: { count: 50, fields: 'lists.id,lists.name,lists.stats.member_count' } });
  return (res.data.lists || []).map(l => ({ id: l.id, name: l.name, subscribers: l.stats?.member_count || 0 }));
}

// Save (or replace) a client's key. Checks it with Mailchimp first and picks
// their audience (the biggest one if there are several).
async function connect(clientId, key) {
  await ensureTables();
  let lists;
  try { lists = await audiences(key); } catch (err) { throw new Error(mcError(err)); }
  if (!lists.length) throw new Error('That Mailchimp account has no audience yet.');
  const list = lists.slice().sort((a, b) => b.subscribers - a.subscribers)[0];
  await pool.query(
    `UPDATE clients SET mailchimp_api_key = $2, mailchimp_list_id = $3, mailchimp_list_name = $4, newsletter_error = NULL WHERE id = $1`,
    [clientId, encrypt(String(key).trim()), list.id, list.name]
  );
  return { audience: list.name, subscribers: list.subscribers, otherAudiences: lists.length - 1 };
}

async function disconnect(clientId) {
  await ensureTables();
  await pool.query(
    `UPDATE clients SET mailchimp_api_key = NULL, mailchimp_list_id = NULL, mailchimp_list_name = NULL, newsletter_error = NULL WHERE id = $1`,
    [clientId]
  );
}

const num = v => (Number.isFinite(Number(v)) ? Number(v) : 0);

// One Mailchimp report → the numbers we keep
function fromReport(r) {
  const o = r.opens || {};
  const c = r.clicks || {};
  const hasProxy = o.proxy_excluded_open_rate != null;
  return {
    campaign_id: r.id,
    title: r.campaign_title || null,
    subject: r.subject_line || null,
    sent_at: r.send_time || null,
    emails_sent: num(r.emails_sent),
    unique_opens: num(hasProxy ? o.proxy_excluded_unique_opens : o.unique_opens),
    open_rate: num(hasProxy ? o.proxy_excluded_open_rate : o.open_rate),
    clicks: num(c.unique_subscriber_clicks),
    click_rate: num(c.click_rate),
    unsubscribed: num(r.unsubscribed),
  };
}

// Link each Mailchimp send to the portal newsletter it was: same subject line
// first, otherwise sent within 3 days of the newsletter's send date.
async function matchNewsletters(clientId) {
  await pool.query(
    `UPDATE email_campaigns ec SET newsletter_id = n.id
       FROM newsletters n
      WHERE ec.client_id = $1 AND ec.newsletter_id IS NULL AND n.client_id = $1
        AND n.subject IS NOT NULL AND lower(trim(n.subject)) = lower(trim(ec.subject))
        AND NOT EXISTS (SELECT 1 FROM email_campaigns x WHERE x.newsletter_id = n.id)`,
    [clientId]
  );
  await pool.query(
    `UPDATE email_campaigns ec SET newsletter_id = n.id
       FROM newsletters n
      WHERE ec.client_id = $1 AND ec.newsletter_id IS NULL AND n.client_id = $1
        AND n.status IN ('approved', 'sent') AND n.send_date IS NOT NULL AND ec.sent_at IS NOT NULL
        AND abs((ec.sent_at AT TIME ZONE $2)::date - n.send_date) <= 3
        AND NOT EXISTS (SELECT 1 FROM email_campaigns x WHERE x.newsletter_id = n.id)`,
    [clientId, DEFAULT_TIMEZONE]
  );
}

async function runSync(clientId) {
  await ensureTables();
  const row = (await pool.query('SELECT mailchimp_api_key, mailchimp_list_id FROM clients WHERE id = $1', [clientId])).rows[0];
  const key = row && decrypt(row.mailchimp_api_key);
  if (!key) return { skipped: true, reason: 'not_connected' };

  try {
    const mc = api(key);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: DEFAULT_TIMEZONE });

    const list = (await mc.get(`/lists/${row.mailchimp_list_id}`, { params: { fields: 'id,name,stats.member_count' } })).data;
    const subscribers = num(list.stats?.member_count);
    await pool.query(
      `INSERT INTO stats_daily (client_id, network, metric, day, value, updated_at)
       VALUES ($1, 'newsletter', 'subscribers', $2, $3, NOW())
       ON CONFLICT (client_id, network, metric, day) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [clientId, today, subscribers]
    );

    const reports = (await mc.get('/reports', {
      params: {
        count: 100,
        fields: 'reports.id,reports.campaign_title,reports.subject_line,reports.list_id,reports.emails_sent,reports.send_time,reports.unsubscribed,reports.opens,reports.clicks',
      },
    })).data.reports || [];

    const sends = reports.filter(r => !row.mailchimp_list_id || r.list_id === row.mailchimp_list_id).map(fromReport);
    for (const s of sends) {
      await pool.query(
        `INSERT INTO email_campaigns (client_id, campaign_id, title, subject, sent_at, emails_sent, unique_opens, open_rate, clicks, click_rate, unsubscribed, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         ON CONFLICT (client_id, campaign_id) DO UPDATE SET
           title = EXCLUDED.title, subject = EXCLUDED.subject, sent_at = EXCLUDED.sent_at,
           emails_sent = EXCLUDED.emails_sent, unique_opens = EXCLUDED.unique_opens, open_rate = EXCLUDED.open_rate,
           clicks = EXCLUDED.clicks, click_rate = EXCLUDED.click_rate, unsubscribed = EXCLUDED.unsubscribed, updated_at = NOW()`,
        [clientId, s.campaign_id, s.title, s.subject, s.sent_at, s.emails_sent, s.unique_opens, s.open_rate, s.clicks, s.click_rate, s.unsubscribed]
      );
    }
    await matchNewsletters(clientId);
    await pool.query(`UPDATE clients SET newsletter_synced_at = NOW(), newsletter_error = NULL, mailchimp_list_name = $2 WHERE id = $1`, [clientId, list.name || null]);
    return { audience: list.name, subscribers, sends: sends.length };
  } catch (err) {
    const error = mcError(err);
    await pool.query(`UPDATE clients SET newsletter_synced_at = NOW(), newsletter_error = $2 WHERE id = $1`, [clientId, error]);
    return { error };
  }
}

const running = new Map();
function syncNewsletter(clientId) {
  const k = String(clientId);
  if (running.has(k)) return running.get(k);
  const p = runSync(clientId).finally(() => running.delete(k));
  running.set(k, p);
  return p;
}

// Every connected client whose results are more than ~20 hours old
async function syncAllNewsletters() {
  await ensureTables();
  const rows = (await pool.query(
    `SELECT id FROM clients WHERE mailchimp_api_key IS NOT NULL
        AND (newsletter_synced_at IS NULL OR newsletter_synced_at < NOW() - INTERVAL '20 hours')`
  )).rows;
  for (const { id } of rows) {
    const r = await syncNewsletter(id).catch(err => ({ error: err.message }));
    if (r.error) console.error(`Newsletter results sync for client ${id}: ${r.error}`);
  }
}

module.exports = { dataCenter, fromReport, connect, disconnect, syncNewsletter, syncAllNewsletters, ensureTables };
