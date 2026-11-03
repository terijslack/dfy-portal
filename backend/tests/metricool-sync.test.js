'use strict';

// Rules for pulling posts from Metricool into the portal (planSync is pure — no DB).

jest.mock('../services/crm', () => ({ pool: { query: jest.fn() } }));
jest.mock('../services/activity', () => ({ logForClient: jest.fn().mockResolvedValue() }));

const { planSync, normalizeRemote } = require('../services/metricoolSync');

const today = '2026-11-10';
const windowStart = '2026-11-09';
const windowEnd = '2027-02-08';

function remote(overrides = {}) {
  return {
    id: 101,
    text: 'Fall collection is here',
    draft: true,
    providers: [{ network: 'instagram' }, { network: 'facebook' }],
    publicationDate: { dateTime: '2026-11-15T10:30:00', timezone: 'America/Los_Angeles' },
    media: ['https://static.metricool.com/img/a.jpg'],
    ...overrides,
  };
}

// What a stored row looks like after the remote() post above was imported
function local(overrides = {}) {
  return {
    id: 1, metricool_post_id: '101', source: 'metricool', status: 'pending',
    caption: 'Fall collection is here', networks: 'instagram,facebook',
    scheduled_date: '2026-11-15', scheduled_time: '10:30',
    media: [{ url: 'https://static.metricool.com/img/a.jpg', type: 'image' }],
    ...overrides,
  };
}

const run = (localRows, remoteRaw) => planSync({ localRows, remoteRaw, today, windowStart, windowEnd });

describe('normalizeRemote', () => {
  test('reads networks, date, time and media', () => {
    const r = normalizeRemote(remote({ media: ['https://x.com/a.jpg', { url: 'https://x.com/b.mp4' }] }));
    expect(r).toMatchObject({
      id: '101', draft: true, caption: 'Fall collection is here',
      networks: ['instagram', 'facebook'], platform: 'instagram',
      date: '2026-11-15', time: '10:30',
      media: [{ url: 'https://x.com/a.jpg', type: 'image' }, { url: 'https://x.com/b.mp4', type: 'video' }],
    });
  });
});

describe('planSync', () => {
  test('a new Metricool draft comes in as Needs approval', () => {
    const a = run([], [remote()]);
    expect(a).toEqual([expect.objectContaining({ type: 'insert', status: 'pending' })]);
  });

  test('a new post DFY scheduled directly comes in as Scheduled (no approval asked)', () => {
    const a = run([], [remote({ draft: false })]);
    expect(a[0]).toMatchObject({ type: 'insert', status: 'scheduled' });
  });

  test('nothing changed → just refresh our copy', () => {
    expect(run([local()], [remote()])).toEqual([expect.objectContaining({ type: 'refresh', id: 1 })]);
  });

  test('DFY revises after a change request → back to Needs approval, marked revised', () => {
    const a = run([local({ status: 'changes_requested' })], [remote({ text: 'Fall collection — now 20% off' })]);
    expect(a[0]).toMatchObject({ type: 'update', status: 'pending', revised: true });
  });

  test('change request still open and nothing edited yet → stays as is', () => {
    const a = run([local({ status: 'changes_requested' })], [remote()]);
    expect(a[0].type).toBe('refresh');
  });

  test('a new image counts as a revision', () => {
    const a = run([local({ status: 'changes_requested' })], [remote({ media: ['https://static.metricool.com/img/b.jpg'] })]);
    expect(a[0]).toMatchObject({ type: 'update', status: 'pending', revised: true });
  });

  test('edit to a pending post updates it without a revised flag', () => {
    const a = run([local()], [remote({ text: 'Typo fixed' })]);
    expect(a[0]).toMatchObject({ type: 'update', status: 'pending', revised: false });
  });

  test('approved but still a draft in Metricool → retry scheduling it', () => {
    const a = run([local({ status: 'approved' })], [remote()]);
    expect(a.map(x => x.type)).toEqual(['refresh', 'release']);
  });

  test('approved and already scheduled in Metricool → no retry', () => {
    const a = run([local({ status: 'approved' })], [remote({ draft: false })]);
    expect(a.map(x => x.type)).not.toContain('release');
  });

  test('pending post that DFY scheduled directly in Metricool → Scheduled', () => {
    const a = run([local()], [remote({ draft: false })]);
    expect(a[0]).toMatchObject({ type: 'update', status: 'scheduled' });
  });

  test('approved post gone from Metricool after its date → Published', () => {
    const a = run([local({ status: 'approved', scheduled_date: '2026-11-10' })], []);
    expect(a).toEqual([{ type: 'publish', id: 1 }]);
  });

  test('future draft gone from Metricool → removed (DFY deleted it)', () => {
    expect(run([local()], [])).toEqual([{ type: 'remove', id: 1 }]);
  });

  test('past draft nobody approved is left alone', () => {
    expect(run([local({ scheduled_date: '2026-11-01' })], [])).toEqual([]);
  });

  test('portal-written posts are never touched by the sync', () => {
    const a = run([local({ source: 'portal', status: 'approved' })], [remote({ text: 'different' })]);
    expect(a).toEqual([]);
  });

  test('pg Date objects for scheduled_date are read as calendar days', () => {
    const a = run([local({ scheduled_date: new Date(2026, 10, 15) })], [remote()]);
    expect(a[0].type).toBe('refresh');
  });
});
