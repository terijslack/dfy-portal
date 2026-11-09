'use strict';

// Free GBP audit form (/landing) — replaces the GoHighLevel "GBP Survey" workflows.

const express = require('express');
const request = require('supertest');

function buildApp({ mockQuery, crm, emails }) {
  jest.resetModules();
  jest.doMock('pg', () => ({ Pool: jest.fn(() => ({ query: mockQuery })) }));
  jest.doMock('../services/email', () => ({ sendContactInquiry: jest.fn(), sendClientMessage: jest.fn() }));
  jest.doMock('../services/crm', () => crm);
  jest.doMock('../services/gbpAuditEmail', () => emails);
  const router = require('../routes/contact');
  const app = express();
  app.use(express.json());
  app.use('/api/contact', router);
  return app;
}

const good = {
  name: 'Pat Lee', business_name: 'Davis Bakery', email: 'pat@davisbakery.com',
  phone: '530-555-0100', gbp_link: 'https://maps.app.goo.gl/abc', notes: 'We moved last year',
};

describe('POST /api/contact/gbp-audit', () => {
  let mockQuery, crm, emails, app;

  beforeEach(() => {
    mockQuery = jest.fn(async (sql) => (/INSERT INTO gbp_audit_requests/.test(sql)
      ? { rows: [{ id: 7, created_at: '2026-11-09T17:00:00Z' }] } : { rows: [] }));
    crm = { addInquiryLead: jest.fn().mockResolvedValue(1), addGbpAuditLead: jest.fn().mockResolvedValue(1) };
    emails = { sendThankYou: jest.fn().mockResolvedValue(), sendTeamAlert: jest.fn().mockResolvedValue() };
    app = buildApp({ mockQuery, crm, emails });
  });

  test('saves the request, adds the lead, and sends both emails', async () => {
    const res = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '1.1.1.1').send(good);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const insert = mockQuery.mock.calls.find(c => /INSERT INTO gbp_audit_requests/.test(c[0]));
    expect(insert[1]).toEqual(['Pat Lee', 'Davis Bakery', 'pat@davisbakery.com', '530-555-0100', 'https://maps.app.goo.gl/abc', 'We moved last year']);
    const expected = expect.objectContaining({ id: 7, business_name: 'Davis Bakery', email: 'pat@davisbakery.com' });
    expect(crm.addGbpAuditLead).toHaveBeenCalledWith(expected);
    expect(emails.sendThankYou).toHaveBeenCalledWith(expected);
    expect(emails.sendTeamAlert).toHaveBeenCalledWith(expected);
  });

  test('still succeeds when the emails or contacts step fail', async () => {
    crm.addGbpAuditLead.mockRejectedValue(new Error('db'));
    emails.sendThankYou.mockRejectedValue(new Error('gmail'));
    emails.sendTeamAlert.mockRejectedValue(new Error('gmail'));
    const res = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '1.1.1.2').send(good);
    expect(res.status).toBe(200);
  });

  test('requires name, business, email and phone; optional fields can be blank', async () => {
    const missing = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '1.1.1.3')
      .send({ ...good, phone: '' });
    expect(missing.status).toBe(400);
    const ok = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '1.1.1.3')
      .send({ ...good, gbp_link: '', notes: '' });
    expect(ok.status).toBe(200);
    expect(emails.sendThankYou).toHaveBeenCalledTimes(1);
  });

  test('rejects a bad email address', async () => {
    const res = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '1.1.1.4')
      .send({ ...good, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(emails.sendThankYou).not.toHaveBeenCalled();
  });

  test('bots that fill the hidden field get a quiet success and nothing is sent', async () => {
    const res = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '1.1.1.5')
      .send({ ...good, company_website: 'spam.example' });
    expect(res.status).toBe(200);
    expect(mockQuery.mock.calls.some(c => /INSERT INTO gbp_audit_requests/.test(c[0]))).toBe(false);
    expect(emails.sendThankYou).not.toHaveBeenCalled();
  });

  test('limits one visitor to 5 requests an hour', async () => {
    for (let i = 0; i < 5; i++) {
      const r = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '9.9.9.9').send(good);
      expect(r.status).toBe(200);
    }
    const sixth = await request(app).post('/api/contact/gbp-audit').set('X-Forwarded-For', '9.9.9.9').send(good);
    expect(sixth.status).toBe(429);
    expect(emails.sendThankYou).toHaveBeenCalledTimes(5);
  });
});

describe('addGbpAuditLead — contact + New Lead deal like the old GHL workflows', () => {
  test('creates the contact with business name and phone, logs it, and opens an $800 GBP Audit deal', async () => {
    jest.resetModules();
    const calls = [];
    const query = jest.fn(async (sql, params) => {
      calls.push([sql, params]);
      if (/SELECT \* FROM contacts/.test(sql)) return { rows: [] };
      if (/INSERT INTO contacts/.test(sql)) return { rows: [{ id: 42 }] };
      if (/INSERT INTO contact_activity/.test(sql)) return { rows: [{ id: 1 }] };
      if (/SELECT id FROM opportunities/.test(sql)) return { rows: [] };
      return { rows: [] };
    });
    jest.dontMock('../services/crm');
    jest.doMock('pg', () => ({ Pool: jest.fn(() => ({ query })) }));
    const { addGbpAuditLead } = require('../services/crm');

    await addGbpAuditLead({ id: 7, ...good, created_at: '2026-11-09T17:00:00Z' });

    const contact = calls.find(c => /INSERT INTO contacts/.test(c[0]));
    expect(contact[1]).toEqual(['Pat Lee', 'pat@davisbakery.com', '530-555-0100', 'Davis Bakery', 'Free GBP audit', null]);
    const activity = calls.find(c => /INSERT INTO contact_activity/.test(c[0]));
    expect(activity[1][1]).toBe('form');
    expect(activity[1][2]).toContain('Free GBP audit request for Davis Bakery');
    expect(activity[1][2]).toContain('https://maps.app.goo.gl/abc');
    expect(activity[1][3]).toBe('gbp-audit:7');
    const deal = calls.find(c => /INSERT INTO opportunities/.test(c[0]));
    expect(deal[0]).toContain("'GBP Audit'");
    expect(deal[1]).toEqual([42, 'Davis Bakery', 800, '2026-11-09T17:00:00Z']);
  });

  test('does not open a second deal when the request was already logged', async () => {
    jest.resetModules();
    const query = jest.fn(async (sql) => {
      if (/SELECT \* FROM contacts/.test(sql)) return { rows: [{ id: 42 }] };
      if (/INSERT INTO contact_activity/.test(sql)) return { rows: [] }; // ref already there
      return { rows: [] };
    });
    jest.dontMock('../services/crm');
    jest.doMock('pg', () => ({ Pool: jest.fn(() => ({ query })) }));
    const { addGbpAuditLead } = require('../services/crm');
    await addGbpAuditLead({ id: 7, ...good });
    expect(query.mock.calls.some(c => /INSERT INTO opportunities/.test(c[0]))).toBe(false);
  });
});

describe('GBP audit emails', () => {
  test('escape what the visitor typed and only link real web addresses', () => {
    jest.resetModules();
    const { teamAlertHtml, thankYouHtml } = jest.requireActual('../services/gbpAuditEmail');
    const html = teamAlertHtml({ ...good, business_name: '<b>x</b>', gbp_link: 'javascript:alert(1)' });
    expect(html).not.toContain('<b>x</b>');
    expect(html).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(html).not.toContain('href="javascript:');
    expect(thankYouHtml({ name: 'Pat Lee' })).toContain('Hi Pat,');
    expect(thankYouHtml({ name: 'Pat Lee' })).toContain('(530) 753-2013');
  });
});
