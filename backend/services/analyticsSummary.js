// services/analyticsSummary.js — Turns the daily numbers in stats_daily into
// what the Analytics page and the dashboard show: this period vs the one
// before, per platform and in total. Pure functions (no database), so the
// math is easy to test.

const SOCIAL = ['instagram', 'facebook', 'tiktok', 'linkedin'];
const NAMES = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', linkedin: 'LinkedIn', google: 'Google profile' };

// Which stored metrics make up each number on the page
const REACHED = { instagram: ['reach_posts', 'reach_reels'], facebook: ['reach_posts'], tiktok: ['video_views'], linkedin: ['impressions'] };
const INTERACTIONS = { instagram: ['interactions'], facebook: ['interactions'], tiktok: ['likes', 'comments', 'shares'], linkedin: ['interactions'] };
const POSTS = { instagram: ['posts'], facebook: ['posts'], linkedin: ['posts'] };
const GOOGLE_ACTIONS = ['calls', 'website', 'directions', 'messages'];

function addDays(ymd, n) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const monthStart = ymd => `${ymd.slice(0, 7)}-01`;
function daysInMonth(ymd) {
  const [y, m] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}
function shiftMonth(ymd, n) {
  const [y, m, d] = ymd.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1 + n, 1));
  const ym = first.toISOString().slice(0, 7);
  return `${ym}-${String(Math.min(d, daysInMonth(`${ym}-01`))).padStart(2, '0')}`;
}

// period: 'this_month' | 'last_month' | '90d'
function periodRanges(period, today) {
  if (period === 'last_month') {
    const start = shiftMonth(monthStart(today), -1);
    const end = addDays(monthStart(today), -1);
    const pStart = shiftMonth(start, -1);
    return { period, current: { start, end }, previous: { start: pStart, end: addDays(start, -1) } };
  }
  if (period === '90d') {
    const start = addDays(today, -89);
    return { period, current: { start, end: today }, previous: { start: addDays(start, -90), end: addDays(start, -1) } };
  }
  // This month so far, compared with the same days of last month
  const start = monthStart(today);
  const pStart = shiftMonth(start, -1);
  return { period: 'this_month', current: { start, end: today }, previous: { start: pStart, end: shiftMonth(today, -1) } };
}

// rows: [{ network, metric, day: 'YYYY-MM-DD', value }]
function index(rows) {
  const by = new Map();
  for (const r of rows) {
    const key = `${r.network}|${r.metric}`;
    if (!by.has(key)) by.set(key, []);
    by.get(key).push({ day: String(r.day).slice(0, 10), value: Number(r.value) || 0 });
  }
  for (const list of by.values()) list.sort((a, b) => a.day.localeCompare(b.day));
  return by;
}

function sumIn(by, network, metrics, range) {
  let total = 0;
  let any = false;
  for (const m of metrics) {
    for (const p of by.get(`${network}|${m}`) || []) {
      if (p.day >= range.start && p.day <= range.end) { total += p.value; any = true; }
    }
  }
  return { total, any };
}

// Latest value on or before a day (for running totals like followers)
function lastOnOrBefore(by, network, metric, day) {
  const list = by.get(`${network}|${metric}`) || [];
  let found = null;
  for (const p of list) { if (p.day <= day && p.value > 0) found = p; }
  return found;
}

function pctChange(cur, prev, prevHasData) {
  if (!prevHasData || !prev) return null;
  return Math.round(((cur - prev) / prev) * 100);
}

// Followers at the end of a range, and how many were gained during it
function followersIn(by, network, range) {
  const end = lastOnOrBefore(by, network, 'followers', range.end);
  if (!end) return { total: null, gained: null };
  const before = lastOnOrBefore(by, network, 'followers', addDays(range.start, -1));
  if (before) return { total: end.value, gained: end.value - before.value, fromStart: true };
  // No count from before this period (account newly connected): count from the first day we have
  const list = (by.get(`${network}|followers`) || []).filter(p => p.day >= range.start && p.day <= range.end && p.value > 0);
  return { total: end.value, gained: list.length ? end.value - list[0].value : null, fromStart: false };
}

function hasAnyData(by, network) {
  for (const [key, list] of by) {
    if (key.startsWith(`${network}|`) && list.some(p => p.value !== 0)) return true;
  }
  return false;
}

function lastDayWithData(by, network) {
  let last = null;
  for (const [key, list] of by) {
    if (!key.startsWith(`${network}|`)) continue;
    for (const p of list) if (!last || p.day > last) last = p.day;
  }
  return last;
}

function summarize(rows, { period = 'this_month', today }) {
  const ranges = periodRanges(period, today);
  const { current, previous } = ranges;
  const by = index(rows);

  const platforms = [];
  const totals = { reached: 0, reachedPrev: 0, prevReached: false, interactions: 0, interactionsPrev: 0, prevInteractions: false, posts: 0, newFollowers: 0, followers: 0, newFollowersKnown: false };

  for (const network of SOCIAL) {
    if (!hasAnyData(by, network)) continue;
    const reached = sumIn(by, network, REACHED[network], current);
    const reachedPrev = sumIn(by, network, REACHED[network], previous);
    const inter = sumIn(by, network, INTERACTIONS[network], current);
    const interPrev = sumIn(by, network, INTERACTIONS[network], previous);
    const posts = POSTS[network] ? sumIn(by, network, POSTS[network], current).total : null;
    const fol = followersIn(by, network, current);

    platforms.push({
      network, name: NAMES[network],
      followers: fol.total, followersGained: fol.gained,
      reached: Math.round(reached.total), reachedChange: pctChange(reached.total, reachedPrev.total, reachedPrev.any),
      interactions: Math.round(inter.total), interactionsChange: pctChange(inter.total, interPrev.total, interPrev.any),
      posts: posts == null ? null : Math.round(posts),
    });

    totals.reached += reached.total; totals.reachedPrev += reachedPrev.total; totals.prevReached ||= reachedPrev.any;
    totals.interactions += inter.total; totals.interactionsPrev += interPrev.total; totals.prevInteractions ||= interPrev.any;
    if (posts) totals.posts += posts;
    if (fol.total) totals.followers += fol.total;
    if (fol.gained != null) { totals.newFollowers += fol.gained; totals.newFollowersKnown = true; }
  }

  let google = null;
  if (hasAnyData(by, 'google')) {
    const views = sumIn(by, 'google', ['views'], current);
    const viewsPrev = sumIn(by, 'google', ['views'], previous);
    const actions = sumIn(by, 'google', GOOGLE_ACTIONS, current);
    const actionsPrev = sumIn(by, 'google', GOOGLE_ACTIONS, previous);
    const one = m => Math.round(sumIn(by, 'google', [m], current).total);
    google = {
      views: Math.round(views.total), viewsChange: pctChange(views.total, viewsPrev.total, viewsPrev.any),
      actions: Math.round(actions.total), actionsChange: pctChange(actions.total, actionsPrev.total, actionsPrev.any),
      calls: one('calls'), website: one('website'), directions: one('directions'), messages: one('messages'),
      dataThrough: lastDayWithData(by, 'google'),
    };
  }

  // "Times people saw your business" = social reach + Google profile views
  const seen = totals.reached + (google ? google.views : 0);
  const seenPrevAny = totals.prevReached || Boolean(google && google.viewsChange != null);
  const seenPrev = totals.reachedPrev + (google ? sumIn(by, 'google', ['views'], previous).total : 0);

  return {
    period: ranges.period,
    current, previous,
    hasData: platforms.length > 0 || Boolean(google),
    totals: {
      seen: Math.round(seen), seenChange: pctChange(seen, seenPrev, seenPrevAny),
      reached: Math.round(totals.reached), reachedChange: pctChange(totals.reached, totals.reachedPrev, totals.prevReached),
      interactions: Math.round(totals.interactions), interactionsChange: pctChange(totals.interactions, totals.interactionsPrev, totals.prevInteractions),
      posts: Math.round(totals.posts),
      followers: Math.round(totals.followers),
      newFollowers: totals.newFollowersKnown ? Math.round(totals.newFollowers) : null,
    },
    platforms,
    google,
  };
}

module.exports = { summarize, periodRanges, addDays, SOCIAL };
