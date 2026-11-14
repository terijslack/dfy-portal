'use strict';
// Newsletter results from Mailchimp: reading keys and reports.

jest.mock('../services/crm', () => ({ pool: { query: jest.fn() } }));
const { dataCenter, fromReport } = require('../services/mailchimpStats');

test('finds the data center at the end of a Mailchimp key', () => {
  expect(dataCenter('not-a-real-key-us21')).toBe('us21');
  expect(dataCenter(' abc-US6 ')).toBe('us6');
  expect(dataCenter('no-data-center-here')).toBeNull();
  expect(dataCenter('')).toBeNull();
});

test('uses the open rate without Apple Mail auto-opens when Mailchimp has it', () => {
  const r = fromReport({
    id: 'c1', campaign_title: 'Lu\'Ro November Newsletter 2026', subject_line: 'Black Friday details, plus November birthstones',
    emails_sent: 336, send_time: '2026-11-05T16:00:00+00:00', unsubscribed: 2,
    opens: { unique_opens: 200, open_rate: 0.6, proxy_excluded_unique_opens: 120, proxy_excluded_open_rate: 0.36 },
    clicks: { unique_subscriber_clicks: 20, click_rate: 0.06 },
  });
  expect(r).toEqual({
    campaign_id: 'c1', title: "Lu'Ro November Newsletter 2026", subject: 'Black Friday details, plus November birthstones',
    sent_at: '2026-11-05T16:00:00+00:00', emails_sent: 336, unique_opens: 120, open_rate: 0.36, clicks: 20, click_rate: 0.06, unsubscribed: 2,
  });
});

test('falls back to the plain open rate, and copes with missing numbers', () => {
  const r = fromReport({ id: 'c2', opens: { unique_opens: 5, open_rate: 0.5 }, clicks: {} });
  expect(r).toMatchObject({ unique_opens: 5, open_rate: 0.5, clicks: 0, click_rate: 0, emails_sent: 0 });
});
