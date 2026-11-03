// services/metricoolSync.js — Pulls each client's posts from Metricool into the
// portal's posts table, so clients can review them on their Post Approval page.
//
// The rule that decides what clients are asked to approve:
//   Draft in Metricool          → shows in the portal as "Needs approval"
//   Scheduled in Metricool      → shows as "Scheduled" (no approval asked)
//
// Runs every few minutes for every client with a Metricool brand ID, and again
// whenever a client opens their posts (if the last sync is more than 2 min old).
//
// What it keeps in step:
//   - New drafts appear for approval.
//   - DFY edits a draft after the client asked for changes → it comes back as
//     "Needs approval" with a "Revised" note.
//   - Client approved but the hand-off to Metricool failed → retried here.
//   - Post gone from Metricool: if its date has passed it's marked Published;
//     if it was in the future, DFY deleted it, so it's removed here too.

const { pool } = require('./crm');
const { listScheduledPosts, releasePost, isConfigured, DEFAULT_TIMEZONE } = require('./metricool');
const { logForClient } = require('./activity');

const WINDOW_BACK_DAYS = 1;
const WINDOW_AHEAD_DAYS = 90;

// ─── Helpers ────────────────────────────────────────────────────────────────

// 'YYYY-MM-DD' for "today" in a timezone
function todayIn(timezone) {
  return new Date().toLocaleDateString('en-CA', { timeZone: timezone || DEFAULT_TIMEZONE });
}

function addDays(ymd, n) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// A DATE column comes back from pg as a JS Date at local midnight — read it as a calendar day
function ymdOf(value) {
  if (!value) return null;
  if (value instanceof Date) {
    const p = (x) => String(x).padStart(2, '0');
    return `${value.getFullYear()}-${p(value.getMonth() + 1)}-${p(value.getDate())}`;
  }
  return String(value).slice(0, 10);
}

function mediaType(url) {
  return /\.(mp4|mov|m4v|webm)(\?|$)/i.test(url) ? 'video' : 'image';
}

// Metricool's post object → the fields the portal stores
function normalizeRemote(raw) {
  const networks = (raw.providers || []).map(p => (p && (p.network || p.provider)) || '').filter(Boolean);
  const dt = String(raw.publicationDate?.dateTime || '');
  const media = (raw.media || [])
    .map(m => (typeof m === 'string' ? m : (m && (m.url || m.mediaUrl || m.src)) || null))
    .filter(Boolean)
    .map(url => ({ url, type: mediaType(url) }));
  return {
    id: String(raw.id),
    // Stays the same when the post is edited (the id changes every time)
    uuid: raw.uuid != null ? String(raw.uuid) : String(raw.id),
    draft: raw.draft === true,
    caption: raw.text || '',
    networks,
    platform: networks[0] || 'other',
    date: dt.slice(0, 10) || null,
    time: dt.length >= 16 ? dt.slice(11, 16) : null,
    media,
    raw,
  };
}

function contentKey({ caption, networks, date, time, media }) {
  return JSON.stringify([
    caption || '',
    Array.isArray(networks) ? networks.join(',') : (networks || ''),
    date || '', time || '',
    (media || []).map(m => m.url),
  ]);
}

function localKey(row) {
  return contentKey({
    caption: row.caption, networks: row.networks, date: ymdOf(row.scheduled_date),
    time: row.scheduled_time, media: row.media || [],
  });
}

// ─── The rules (pure — no database, easy to test) ───────────────────────────
//
// localRows: this client's posts that are linked to Metricool
// remoteRaw: what Metricool returned for the window
// Returns a list of actions: insert | update | release | publish | remove

function planSync({ localRows, remoteRaw, today, windowStart, windowEnd }) {
  const actions = [];
  const remote = remoteRaw.map(normalizeRemote).filter(r => r.id && r.id !== 'undefined');
  // Match on uuid; fall back to id for rows saved before we stored uuids
  const byKey = new Map();
  for (const row of localRows) {
    if (row.metricool_post_id) byKey.set(`id:${row.metricool_post_id}`, row);
    if (row.metricool_uuid) byKey.set(`uuid:${row.metricool_uuid}`, row);
  }
  const seen = new Set(); // local row ids we matched

  for (const r of remote) {
    const local = byKey.get(`uuid:${r.uuid}`) || byKey.get(`id:${r.id}`);
    if (local) seen.add(local.id);

    if (!local) {
      actions.push({ type: 'insert', remote: r, status: r.draft ? 'pending' : 'scheduled' });
      continue;
    }

    // Posts written in the portal and pushed to Metricool on approve — the portal owns those
    if (local.source !== 'metricool') continue;
    if (local.status === 'published') continue;

    const changed = localKey(local) !== contentKey(r);
    let status = local.status;
    let revised = false;

    if (local.status === 'changes_requested' && changed) { status = 'pending'; revised = true; }
    else if (local.status === 'pending' && !r.draft) status = 'scheduled';   // DFY scheduled it directly
    else if (local.status === 'scheduled' && r.draft) status = 'pending';    // DFY pulled it back to draft

    if (changed || status !== local.status) {
      actions.push({ type: 'update', id: local.id, remote: r, status, revised, from: local.status });
    } else {
      // Keep our copy of Metricool's post current even when nothing visible changed
      actions.push({ type: 'refresh', id: local.id, remote: r });
    }

    // Client approved but Metricool still has it as a draft (hand-off failed) → try again
    if (local.status === 'approved' && r.draft) actions.push({ type: 'release', id: local.id, remote: r });
  }

  // Linked posts Metricool no longer lists
  for (const local of localRows) {
    if (local.source !== 'metricool' || !local.metricool_post_id) continue;
    if (seen.has(local.id)) continue;
    if (local.status === 'published') continue;
    const day = ymdOf(local.scheduled_date);
    if (!day || day > windowEnd) continue; // outside what we asked for — leave it alone

    const live = local.status === 'approved' || local.status === 'scheduled';
    if (day <= today) {
      if (live) actions.push({ type: 'publish', id: local.id });
      // past-date drafts nobody approved: leave as-is so DFY can see they were missed
    } else if (day >= windowStart) {
      actions.push({ type: 'remove', id: local.id }); // future post deleted in Metricool
    }
  }

  return actions;
}

// ─── Running it against the database ────────────────────────────────────────

const running = new Map(); // clientId → promise, so overlapping syncs don't double up

async function applyActions(clientId, actions, blogId) {
  const counts = { added: 0, updated: 0, revised: 0, released: 0, published: 0, removed: 0, errors: 0 };
  const revisedLabels = [];

  for (const a of actions) {
    const r = a.remote;
    if (a.type === 'insert') {
      const res = await pool.query(
        `INSERT INTO posts (client_id, caption, platform, networks, scheduled_date, scheduled_time, media,
                            status, source, metricool_post_id, metricool_uuid, metricool_raw)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'metricool', $9, $10, $11)
         ON CONFLICT DO NOTHING`,
        [clientId, r.caption, r.platform, r.networks.join(','), r.date, r.time,
         JSON.stringify(r.media), a.status, r.id, r.uuid, JSON.stringify(r.raw)]
      );
      if (res.rowCount && a.status === 'pending') counts.added++;
    } else if (a.type === 'update') {
      await pool.query(
        `UPDATE posts SET caption = $1, platform = $2, networks = $3, scheduled_date = $4, scheduled_time = $5,
                media = $6, metricool_raw = $7, status = $8,
                revised_at = CASE WHEN $9 THEN NOW() ELSE revised_at END,
                metricool_post_id = $10, metricool_uuid = $11,
                -- back in front of the client (revised, or pulled back to draft) → they get a fresh email
                client_notified_at = CASE WHEN $8 = 'pending' AND $13 <> 'pending' THEN NULL ELSE client_notified_at END,
                client_reminded_at = CASE WHEN $8 = 'pending' AND $13 <> 'pending' THEN NULL ELSE client_reminded_at END,
                updated_at = NOW()
         WHERE id = $12`,
        [r.caption, r.platform, r.networks.join(','), r.date, r.time, JSON.stringify(r.media),
         JSON.stringify(r.raw), a.status, a.revised, r.id, r.uuid, a.id, a.from]
      );
      counts.updated++;
      if (a.revised) { counts.revised++; revisedLabels.push(r); }
    } else if (a.type === 'refresh') {
      await pool.query('UPDATE posts SET metricool_raw = $1, metricool_post_id = $2, metricool_uuid = $3 WHERE id = $4',
        [JSON.stringify(r.raw), r.id, r.uuid, a.id]);
    } else if (a.type === 'release') {
      try {
        const saved = await releasePost({ blogId, raw: r.raw });
        await recordReleased(a.id, saved);
        counts.released++;
      } catch (err) {
        const msg = describeError(err);
        await pool.query('UPDATE posts SET metricool_error = $1 WHERE id = $2', [msg, a.id]);
        counts.errors++;
      }
    } else if (a.type === 'publish') {
      await pool.query(`UPDATE posts SET status = 'published', updated_at = NOW() WHERE id = $1`, [a.id]);
      counts.published++;
    } else if (a.type === 'remove') {
      await pool.query('DELETE FROM posts WHERE id = $1', [a.id]);
      counts.removed++;
    }
  }

  // Account timeline
  if (counts.added) {
    logForClient(clientId, 'dfy', `DFY sent ${counts.added} post${counts.added === 1 ? '' : 's'} from Metricool for their approval`)
      .catch(e => console.error('Metricool timeline error:', e.message));
  }
  for (const r of revisedLabels) {
    logForClient(clientId, 'dfy', `DFY revised the ${r.networks.join(' + ') || 'social'} post for ${r.date} based on their notes`)
      .catch(e => console.error('Metricool timeline error:', e.message));
  }
  return counts;
}

// Metricool answers an update with the post under a new id — keep ours current
async function recordReleased(postId, saved) {
  const post = saved && (saved.data || saved);
  if (post && post.id != null) {
    await pool.query(
      `UPDATE posts SET metricool_post_id = $1, metricool_uuid = COALESCE($2, metricool_uuid), metricool_raw = $3,
              metricool_error = NULL, updated_at = NOW() WHERE id = $4`,
      [String(post.id), post.uuid != null ? String(post.uuid) : null, JSON.stringify(post), postId]
    );
  } else {
    await pool.query('UPDATE posts SET metricool_error = NULL, updated_at = NOW() WHERE id = $1', [postId]);
  }
}

function describeError(err) {
  const d = err.response?.data;
  const detail = d ? (typeof d === 'string' ? d : (d.message || d.error || JSON.stringify(d))) : err.message;
  return String(detail).slice(0, 500);
}

async function runSync(clientId) {
  const c = (await pool.query(
    `SELECT c.id, c.metricool_blog_id, o.timezone
     FROM clients c LEFT JOIN client_onboarding o ON o.client_id = c.id
     WHERE c.id = $1`, [clientId]
  )).rows[0];
  if (!c || !c.metricool_blog_id || !isConfigured()) return { skipped: true };

  const timezone = c.timezone || DEFAULT_TIMEZONE;
  const today = todayIn(timezone);
  const windowStart = addDays(today, -WINDOW_BACK_DAYS);
  const windowEnd = addDays(today, WINDOW_AHEAD_DAYS);

  // If this throws, nothing local changes — we never delete on a failed fetch
  const remoteRaw = await listScheduledPosts({ blogId: c.metricool_blog_id, start: windowStart, end: windowEnd, timezone });

  const localRows = (await pool.query(
    `SELECT id, metricool_post_id, metricool_uuid, source, status, caption, networks, scheduled_date, scheduled_time, media
     FROM posts WHERE client_id = $1 AND metricool_post_id IS NOT NULL`, [clientId]
  )).rows;

  const actions = planSync({ localRows, remoteRaw, today, windowStart, windowEnd });
  const counts = await applyActions(clientId, actions, c.metricool_blog_id);
  await pool.query('UPDATE clients SET metricool_synced_at = NOW() WHERE id = $1', [clientId]);
  return { ...counts, fetched: remoteRaw.length };
}

// Sync one client (shares the run if one is already going)
function syncClient(clientId) {
  const key = String(clientId);
  if (running.has(key)) return running.get(key);
  const p = runSync(clientId).finally(() => running.delete(key));
  running.set(key, p);
  return p;
}

// Called when a client opens their posts: sync if it's been a while, but never
// make them wait more than a few seconds — they'll see what we have.
async function syncIfStale(clientId, { maxAgeMs = 2 * 60 * 1000, waitMs = 6000 } = {}) {
  if (!isConfigured()) return;
  try {
    const row = (await pool.query('SELECT metricool_blog_id, metricool_synced_at FROM clients WHERE id = $1', [clientId])).rows[0];
    if (!row || !row.metricool_blog_id) return;
    if (row.metricool_synced_at && Date.now() - new Date(row.metricool_synced_at).getTime() < maxAgeMs) return;
    const job = syncClient(clientId).catch(err => console.error(`Metricool sync failed for client ${clientId}:`, describeError(err)));
    await Promise.race([job, new Promise(resolve => setTimeout(resolve, waitMs))]);
  } catch (err) {
    console.error('Metricool syncIfStale error:', err.message);
  }
}

async function syncAll() {
  if (!isConfigured()) return;
  const clients = (await pool.query(
    `SELECT id FROM clients WHERE metricool_blog_id IS NOT NULL AND metricool_blog_id <> ''`
  )).rows;
  for (const { id } of clients) {
    try { await syncClient(id); }
    catch (err) { console.error(`Metricool sync failed for client ${id}:`, describeError(err)); }
  }
}

// Background timer — started from server.js
function startMetricoolSync(intervalMs = Number(process.env.METRICOOL_SYNC_MINUTES || 10) * 60 * 1000) {
  if (!isConfigured()) {
    console.log('ℹ️  Metricool sync off (METRICOOL_USER_TOKEN / METRICOOL_USER_ID not set)');
    return null;
  }
  setTimeout(() => syncAll().catch(() => {}), 30 * 1000); // first run shortly after boot
  const t = setInterval(() => syncAll().catch(() => {}), intervalMs);
  t.unref?.();
  console.log(`✅ Metricool sync on (every ${Math.round(intervalMs / 60000)} min)`);
  return t;
}

module.exports = { planSync, normalizeRemote, syncClient, syncIfStale, syncAll, startMetricoolSync, describeError, recordReleased };
