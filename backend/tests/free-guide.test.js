'use strict';

// Free guide form ("7 Proven Posts Any Trade Can Steal") on /free and
// /free-guide — replaces the GoHighLevel form and "Guide download" workflow.

const express = require('express');
const request = require('supertest');

function buildApp({ mockQuery, crm, guide }) {
  jest.resetModules();
  jest.doMock('pg', () => ({ Pool: jest.fn(() => ({ query: mockQuery })) }));
  jest.doMock('../services/email', () => ({ sendContactInquiry: jest.fn(), sendClientMessage: jest.fn() }));
  jest.doMock('../services/crm', () => crm);
  jest.doMock('../services/gbpAuditEmail', () => ({ sendThankYou: jest.fn().mockResolvedValue(), sendTeamAlert: jest.fn().mockResolvedValue() }));
  jest.doMock('../services/guideEmail', () => guide);
  const router = require('../routes/contact');
  const app = express();
  app.use(express.json());
  app.use('/api/contact', router);
  return app;
}

const GUIDE_PATH = '/downloads/7-proven-posts-for-trades.pdf';

describe('POST /api/contact/guide', () => {
  let mockQuery, crm, guide, app;

  beforeEach(() => {
    mockQuery = jest.fn(async (sql) => (/INSERT INTO guide_requests/.test(sql)
      ? { rows: [{ id: 3, created_at: '2026-11-09T19:00:00Z' }] } : { rows: [] }));
    crm = { addInquiryLead: jest.fn().mockResolvedValue(1), addGbpAuditLead: jest.fn().mockResolvedValue(1), addGuideLead: jest.fn().mockResolvedValue(1) };
    guide = { sendGuide: jest.fn().mockResolvedValue(), GUIDE_PATH };
    app = buildApp({ mockQuery, crm, guide });
  });

  test('saves the request, adds the lead, emails the guide and returns the download link', async () => {
    const res = await request(app).post('/api/contact/guide').set('X-Forwarded-For', '2.2.2.1')
      .send({ name: 'Sam Ortiz', email: 'sam@ortizplumbing.com', page: 'free' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, downloadUrl: GUIDE_PATH });
    const insert = mockQuery.mock.calls.find(c => /INSERT INTO guide_requests/.test(c[0]));
    expect(insert[1]).toEqual(['Sam Ortiz', 'sam@ortizplumbing.com', 'free']);
    const expected = expect.objectContaining({ id: 3, name: 'Sam Ortiz', email: 'sam@ortizplumbing.com' });
    expect(crm.addGuideLead).toHaveBeenCalledWith(expected);
    expect(guide.sendGuide).toHaveBeenCalledWith(expected);
  });

  test('still gives them the guide when the email or contacts step fails', async () => {
    crm.addGuideLead.mockRejectedValue(new Error('db'));
    guide.sendGuide.mockRejectedValue(new Error('gmail'));
    const res = await request(app).post('/api/contact/guide').set('X-Forwarded-For', '2.2.2.2')
      .send({ name: 'Sam', email: 'sam@x.com' });
    expect(res.status).toBe(200);
    expect(res.body.downloadUrl).toBe(GUIDE_PATH);
  });

  test('requires a name and a real-looking email', async () => {
    const noName = await request(app).post('/api/contact/guide').set('X-Forwarded-For', '2.2.2.3').send({ email: 'a@b.com' });
    expect(noName.status).toBe(400);
    const badEmail = await request(app).post('/api/contact/guide').set('X-Forwarded-For', '2.2.2.3').send({ name: 'A', email: 'nope' });
    expect(badEmail.status).toBe(400);
    expect(guide.sendGuide).not.toHaveBeenCalled();
  });

  test('bots that fill the hidden field get the link but nothing is saved or sent', async () => {
    const res = await request(app).post('/api/contact/guide').set('X-Forwarded-For', '2.2.2.4')
      .send({ name: 'Bot', email: 'bot@x.com', company_website: 'spam' });
    expect(res.status).toBe(200);
    expect(mockQuery.mock.calls.some(c => /INSERT INTO guide_requests/.test(c[0]))).toBe(false);
    expect(guide.sendGuide).not.toHaveBeenCalled();
  });

  test('after 5 requests in an hour a visitor still gets the link, but no more emails go out', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/contact/guide').set('X-Forwarded-For', '8.8.8.8').send({ name: 'A', email: 'a@b.com' });
    }
    const sixth = await request(app).post('/api/contact/guide').set('X-Forwarded-For', '8.8.8.8').send({ name: 'A', email: 'a@b.com' });
    expect(sixth.status).toBe(200);
    expect(sixth.body.downloadUrl).toBe(GUIDE_PATH);
    expect(guide.sendGuide).toHaveBeenCalledTimes(5);
  });

  test('the guide and audit forms have separate limits', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/contact/guide').set('X-Forwarded-For', '7.7.7.7').send({ name: 'A', email: 'a@b.com' });
    }
    const audit = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '7.7.7.7')
      .send({ name: 'A', business_name: 'B', email: 'a@b.com', phone: '1' });
    expect(audit.status).toBe(200);
  });
});

describe('addGuideLead — contact + New Lead deal like the old GHL workflow', () => {
  test('creates the contact, logs the download, and opens a New Lead deal with no value', async () => {
    jest.resetModules();
    jest.dontMock('../services/crm');
    const calls = [];
    const query = jest.fn(async (sql, params) => {
      calls.push([sql, params]);
      if (/SELECT \* FROM contacts/.test(sql)) return { rows: [] };
      if (/INSERT INTO contacts/.test(sql)) return { rows: [{ id: 9 }] };
      if (/INSERT INTO contact_activity/.test(sql)) return { rows: [{ id: 1 }] };
      return { rows: [] };
    });
    jest.doMock('pg', () => ({ Pool: jest.fn(() => ({ query })) }));
    const { addGuideLead } = require('../services/crm');

    await addGuideLead({ id: 3, name: 'Sam Ortiz', email: 'Sam@OrtizPlumbing.com', created_at: '2026-11-09T19:00:00Z' });

    const contact = calls.find(c => /INSERT INTO contacts/.test(c[0]));
    expect(contact[1]).toEqual(['Sam Ortiz', 'sam@ortizplumbing.com', null, null, 'Free guide', null]);
    const activity = calls.find(c => /INSERT INTO contact_activity/.test(c[0]));
    expect(activity[1][2]).toContain('7 Proven Posts');
    expect(activity[1][3]).toBe('guide:3');
    const deal = calls.find(c => /INSERT INTO opportunities/.test(c[0]));
    expect(deal[0]).toContain("'Free guide'");
    expect(deal[0]).not.toContain('value');
    expect(deal[1]).toEqual([9, 'Sam Ortiz — free guide', '2026-11-09T19:00:00Z']);
  });

  test('does not open a second deal for someone who already has an open one', async () => {
    jest.resetModules();
    jest.dontMock('../services/crm');
    const query = jest.fn(async (sql) => {
      if (/SELECT \* FROM contacts/.test(sql)) return { rows: [{ id: 9 }] };
      if (/INSERT INTO contact_activity/.test(sql)) return { rows: [{ id: 2 }] };
      if (/SELECT id FROM opportunities/.test(sql)) return { rows: [{ id: 50 }] };
      return { rows: [] };
    });
    jest.doMock('pg', () => ({ Pool: jest.fn(() => ({ query })) }));
    const { addGuideLead } = require('../services/crm');
    await addGuideLead({ id: 4, name: 'Sam', email: 'sam@x.com' });
    expect(query.mock.calls.some(c => /INSERT INTO opportunities/.test(c[0]))).toBe(false);
  });
});

describe('guide email', () => {
  test('links to the guide, has no emojis, and escapes the name', () => {
    jest.resetModules();
    const { guideHtml } = jest.requireActual('../services/guideEmail');
    const html = guideHtml({ name: '<b>Sam</b> Ortiz' });
    expect(html).toContain('/downloads/7-proven-posts-for-trades.pdf');
    expect(html).toContain('&lt;b&gt;Sam&lt;/b&gt;');
    expect(html).toContain('(530) 753-2013');
    expect(/\p{Extended_Pictographic}/u.test(html)).toBe(false);
  });
});
