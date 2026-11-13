'use strict';

// Analytics numbers: reading Metricool's answers, and the this-period vs
// last-period math behind the Analytics page and dashboard cards.

jest.mock('../services/crm', () => ({ pool: { query: jest.fn() } }));

const { parseTimeline, localIso } = require('../services/metricoolStats');
const { summarize, periodRanges } = require('../services/analyticsSummary');

describe('parseTimeline', () => {
  test('reads Metricool timeline values into one number per day', () => {
    const body = { data: [{ metric: 'followers', values: [
      { dateTime: '2026-11-02T00:00:00-08:00', value: 183 },
      { dateTime: '2026-11-01T00:00:00-07:00', value: '181' },
    ] }] };
    expect(parseTimeline(body)).toEqual([
      { day: '2026-11-01', value: 181 },
      { day: '2026-11-02', value: 183 },
    ]);
  });

  test('handles compact YYYYMMDD dates and skips junk', () => {
    expect(parseTimeline([{ date: '20261105', value: 4 }, { date: 'x', value: 1 }, { foo: 1 }]))
      .toEqual([{ day: '2026-11-05', value: 4 }]);
  });

  test('empty or odd answers give no days', () => {
    expect(parseTimeline(null)).toEqual([]);
    expect(parseTimeline({ data: [] })).toEqual([]);
  });
});

describe('localIso', () => {
  test('uses the Pacific offset for the day (daylight vs standard time)', () => {
    expect(localIso('2026-07-01', '00:00:00', 'America/Los_Angeles')).toBe('2026-07-01T00:00:00-07:00');
    expect(localIso('2026-12-01', '23:59:59', 'America/Los_Angeles')).toBe('2026-12-01T23:59:59-08:00');
  });
});

describe('periodRanges', () => {
  test('this month compares with the same days of last month', () => {
    expect(periodRanges('this_month', '2026-11-13')).toMatchObject({
      current: { start: '2026-11-01', end: '2026-11-13' },
      previous: { start: '2026-10-01', end: '2026-10-13' },
    });
  });
  test('this month on the 31st clamps to the end of a shorter month', () => {
    expect(periodRanges('this_month', '2026-12-31').previous).toEqual({ start: '2026-11-01', end: '2026-11-30' });
  });
  test('last month is the whole month, compared with the month before', () => {
    expect(periodRanges('last_month', '2026-11-13')).toMatchObject({
      current: { start: '2026-10-01', end: '2026-10-31' },
      previous: { start: '2026-09-01', end: '2026-09-30' },
    });
  });
  test('last 3 months', () => {
    expect(periodRanges('90d', '2026-11-13')).toMatchObject({
      current: { start: '2026-08-16', end: '2026-11-13' },
      previous: { start: '2026-05-18', end: '2026-08-15' },
    });
  });
});

describe('summarize', () => {
  const row = (network, metric, day, value) => ({ network, metric, day, value });
  const today = '2026-11-13';

  test('adds up reach, followers gained and Google clicks, with change from last month', () => {
    const rows = [
      row('instagram', 'followers', '2026-10-31', 180),
      row('instagram', 'followers', '2026-11-12', 187),
      row('instagram', 'reach_posts', '2026-10-05', 100),
      row('instagram', 'reach_posts', '2026-11-05', 120),
      row('instagram', 'reach_reels', '2026-11-06', 30),
      row('instagram', 'interactions', '2026-11-05', 12),
      row('instagram', 'posts', '2026-11-05', 2),
      row('google', 'views', '2026-10-03', 50),
      row('google', 'views', '2026-11-03', 100),
      row('google', 'calls', '2026-11-03', 3),
      row('google', 'website', '2026-11-04', 2),
      row('google', 'calls', '2026-10-04', 4),
    ];
    const s = summarize(rows, { period: 'this_month', today });
    expect(s.hasData).toBe(true);
    expect(s.platforms).toHaveLength(1);
    expect(s.platforms[0]).toMatchObject({ network: 'instagram', followers: 187, followersGained: 7, reached: 150, reachedChange: 50, interactions: 12, posts: 2 });
    expect(s.google).toMatchObject({ views: 100, viewsChange: 100, actions: 5, actionsChange: 25, calls: 3, website: 2, dataThrough: '2026-11-04' });
    expect(s.totals).toMatchObject({ seen: 250, seenChange: 67, newFollowers: 7, followers: 187 });
  });

  test('platforms with no numbers at all are left out', () => {
    const s = summarize([row('facebook', 'followers', '2026-11-02', 0)], { period: 'this_month', today });
    expect(s.platforms).toEqual([]);
    expect(s.google).toBeNull();
    expect(s.hasData).toBe(false);
  });

  test('no comparison when there is nothing from the period before (first month)', () => {
    const s = summarize([
      row('facebook', 'followers', '2026-11-02', 410),
      row('facebook', 'followers', '2026-11-12', 415),
      row('facebook', 'reach_posts', '2026-11-03', 40),
    ], { period: 'this_month', today });
    expect(s.platforms[0]).toMatchObject({ followers: 415, followersGained: 5, reached: 40, reachedChange: null });
    expect(s.totals.seenChange).toBeNull();
  });

  test('daily account views win over per-post reach when Metricool has them', () => {
    const s = summarize([
      row('instagram', 'views', '2026-11-02', 300),
      row('instagram', 'reach', '2026-11-02', 90),
      row('instagram', 'reach_posts', '2026-11-02', 10),
      row('facebook', 'reach_posts', '2026-11-02', 15),
      row('facebook', 'reach_reels', '2026-11-03', 40),
    ], { period: 'this_month', today });
    const by = Object.fromEntries(s.platforms.map(p => [p.network, p.reached]));
    expect(by).toEqual({ instagram: 300, facebook: 55 });
  });

  test('falls back to account reach when there are no views', () => {
    const s = summarize([row('instagram', 'reach', '2026-11-02', 90), row('instagram', 'reach_posts', '2026-11-02', 10)], { period: 'this_month', today });
    expect(s.platforms[0].reached).toBe(90);
  });

  test('TikTok counts video views as reach and likes + comments + shares as interactions', () => {
    const s = summarize([
      row('tiktok', 'video_views', '2026-11-02', 900),
      row('tiktok', 'likes', '2026-11-02', 30),
      row('tiktok', 'comments', '2026-11-02', 4),
      row('tiktok', 'shares', '2026-11-02', 1),
    ], { period: 'this_month', today });
    expect(s.platforms[0]).toMatchObject({ network: 'tiktok', reached: 900, interactions: 35, posts: null });
  });
});
