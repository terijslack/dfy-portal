'use strict';

// Tests for contact-form email notification (Task B).
// Two describe blocks:
//   1. sendContactInquiry unit tests (Gmail send, HTML escaping)
//   2. POST /api/contact route tests (email sent, failure handling, validation)

const express = require('express');
const request = require('supertest');

// ─── 1. sendContactInquiry — unit tests ──────────────────────────────────────

describe('sendContactInquiry — sends the inquiry to hello@ through Gmail', () => {
  let mailer;
  let sendContactInquiry;

  beforeAll(() => {
    jest.resetModules();
    mailer = {
      isConfigured: jest.fn(() => true),
      sendMail: jest.fn().mockResolvedValue(),
      TEAM: () => 'hello@dfymarketinggroup.com',
    };
    jest.doMock('../services/mailer', () => mailer);
    ({ sendContactInquiry } = require('../services/email'));
  });

  afterAll(() => jest.dontMock('../services/mailer'));
  beforeEach(() => { mailer.sendMail.mockClear(); mailer.isConfigured.mockReturnValue(true); });

  test('sends to hello@ with the right subject, and Reply goes to the visitor', async () => {
    await sendContactInquiry({ name: 'Alice', email: 'alice@test.com', message: 'Hello there' });
    const msg = mailer.sendMail.mock.calls[0][0];
    expect(msg.to).toBe('hello@dfymarketinggroup.com');
    expect(msg.replyTo).toBe('alice@test.com');
    expect(msg.subject).toBe('New website inquiry from Alice');
  });

  test('HTML-escapes name, email, and message to prevent markup injection', async () => {
    await sendContactInquiry({
      name:    '<script>alert(1)</script>',
      email:   'evil@test.com',
      message: '<img src=x onerror=alert(2)>',
    });
    const html = mailer.sendMail.mock.calls[0][0].html;
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img');
  });

  test('includes visitor email as a mailto link in the body', async () => {
    await sendContactInquiry({ name: 'Bob', email: 'bob@test.com', message: 'Hi' });
    expect(mailer.sendMail.mock.calls[0][0].html).toContain('href="mailto:bob@test.com"');
  });

  test('throws (instead of pretending) when Gmail sending is not set up', async () => {
    mailer.isConfigured.mockReturnValue(false);
    await expect(sendContactInquiry({ name: 'Bob', email: 'bob@test.com', message: 'Hi' }))
      .rejects.toThrow(/GOOGLE_SERVICE_ACCOUNT_JSON/);
    expect(mailer.sendMail).not.toHaveBeenCalled();
  });
});

// ─── 2. POST /api/contact — route tests ──────────────────────────────────────

describe('POST /api/contact — form submission with email notification', () => {
  let app;
  let mockQuery;
  let mockSendContactInquiry;

  beforeEach(() => {
    jest.resetModules();

    mockQuery = jest.fn().mockResolvedValue({ rows: [] });
    jest.mock('pg', () => ({ Pool: jest.fn(() => ({ query: mockQuery })) }));

    mockSendContactInquiry = jest.fn().mockResolvedValue();
    jest.mock('../services/email', () => ({ sendContactInquiry: mockSendContactInquiry }));

    const router = require('../routes/contact');
    app = express();
    app.use(express.json());
    app.use('/api/contact', router);
  });

  test('returns {success:true} and fires email on valid submission', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Carol', email: 'carol@test.com', message: 'Interested in your services' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO contact_inquiries'),
      ['Carol', 'carol@test.com', 'Interested in your services']
    );
    // Fire-and-forget: function is called synchronously, promise settles after
    expect(mockSendContactInquiry).toHaveBeenCalledWith({
      name: 'Carol', email: 'carol@test.com', message: 'Interested in your services',
    });
  });

  test('returns {success:true} even when email sending fails', async () => {
    mockSendContactInquiry.mockRejectedValue(new Error('Gmail is down'));

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Dave', email: 'dave@test.com', message: 'Hi' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('returns 400 and sends no email when a field is missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Eve', email: 'eve@test.com' }); // no message

    expect(res.status).toBe(400);
    expect(mockSendContactInquiry).not.toHaveBeenCalled();
    // The module-level CREATE TABLE runs on load; confirm no INSERT was triggered
    const insertCalls = mockQuery.mock.calls.filter(c => /INSERT INTO contact_inquiries/.test(c[0]));
    expect(insertCalls.length).toBe(0);
  });

  test('returns 400 and sends no email when all fields are missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({});

    expect(res.status).toBe(400);
    expect(mockSendContactInquiry).not.toHaveBeenCalled();
    const insertCalls = mockQuery.mock.calls.filter(c => /INSERT INTO contact_inquiries/.test(c[0]));
    expect(insertCalls.length).toBe(0);
  });
});
