'use strict';

// Tests for contact-form email notification (Task B).
// Two describe blocks:
//   1. email service unit tests (nodemailer transport, templates, HTML escaping)
//   2. POST /api/contact route tests (email sent, failure handling, validation)

const express = require('express');
const request = require('supertest');

// ─── 1. email service — unit tests (nodemailer, no real sending) ─────────────

describe('email service — sends through Google Workspace via nodemailer', () => {
  let mockSendMail, mockCreateTransport;
  let email;

  beforeAll(() => {
    jest.resetModules();
    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'm1' });
    mockCreateTransport = jest.fn(() => ({ sendMail: mockSendMail }));
    jest.mock('nodemailer', () => ({ createTransport: (...a) => mockCreateTransport(...a) }));

    process.env.SMTP_USER = 'noreply@dfymarketinggroup.com';
    process.env.SMTP_PASS = 'app-password';
    process.env.APP_URL   = 'https://portal.test';
    delete process.env.SMTP_HOST; delete process.env.SMTP_PORT; delete process.env.EMAIL_FROM;

    email = require('../services/email');
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    delete process.env.SMTP_USER; delete process.env.SMTP_PASS; delete process.env.APP_URL;
    jest.restoreAllMocks();
  });

  beforeEach(() => mockSendMail.mockClear());

  const lastMail = () => mockSendMail.mock.calls[mockSendMail.mock.calls.length - 1][0];

  test('uses Google SMTP over SSL with the noreply mailbox, and reuses one connection', async () => {
    await email.sendContactInquiry({ name: 'Alice', email: 'alice@test.com', message: 'Hello there' });
    await email.sendContactInquiry({ name: 'Bob', email: 'bob@test.com', message: 'Hi' });
    expect(mockCreateTransport).toHaveBeenCalledTimes(1);
    expect(mockCreateTransport.mock.calls[0][0]).toMatchObject({
      host: 'smtp.gmail.com', port: 465, secure: true,
      auth: { user: 'noreply@dfymarketinggroup.com', pass: 'app-password' },
    });
  });

  test('contact inquiry goes to hello@, from noreply@, with reply-to set to the visitor', async () => {
    await email.sendContactInquiry({ name: 'Alice', email: 'alice@test.com', message: 'Hello there' });
    const m = lastMail();
    expect(m.to).toBe('hello@dfymarketinggroup.com');
    expect(m.from).toBe('Done For You Marketing <noreply@dfymarketinggroup.com>');
    expect(m.replyTo).toBe('alice@test.com');
    expect(m.subject).toBe('New website inquiry from Alice');
    expect(m.text).toContain('Hello there');
  });

  test('HTML-escapes name, email, and message to prevent markup injection', async () => {
    await email.sendContactInquiry({
      name:    '<script>alert(1)</script>',
      email:   'evil@test.com',
      message: '<img src=x onerror=alert(2)>',
    });
    const html = lastMail().html;
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img');
  });

  test('includes visitor email as a mailto link in the body', async () => {
    await email.sendContactInquiry({ name: 'Bob', email: 'bob@test.com', message: 'Hi' });
    expect(lastMail().html).toContain('href="mailto:bob@test.com"');
  });

  test('password reset goes to the client with the reset link and replies routed to hello@', async () => {
    await email.sendPasswordReset('dana@x.com', 'https://portal.test/reset-password.html?token=abc');
    const m = lastMail();
    expect(m.to).toBe('dana@x.com');
    expect(m.replyTo).toBe('hello@dfymarketinggroup.com');
    expect(m.subject).toBe('Reset your DFY Portal password');
    expect(m.html).toContain('href="https://portal.test/reset-password.html?token=abc"');
  });

  test('welcome for a payment-link buyer carries the set-password link', async () => {
    await email.sendWelcome({ name: 'Lu Ro', email: 'lu@ro.com', planName: 'Custom Plan',
      setPasswordUrl: 'https://portal.test/reset-password.html?token=t1&welcome=1' });
    const m = lastMail();
    expect(m.to).toBe('lu@ro.com');
    expect(m.subject).toBe('Welcome to Done For You Marketing');
    expect(m.html).toContain('Welcome, Lu');
    expect(m.html).toContain('href="https://portal.test/reset-password.html?token=t1&welcome=1"');
    expect(m.html).not.toContain('/login');
  });

  test('welcome for a signup-page client links to login instead', async () => {
    await email.sendWelcome({ name: 'Dana Whitaker', email: 'dana@x.com', planName: 'Growth Engine', setPasswordUrl: null });
    const m = lastMail();
    expect(m.html).toContain('href="https://portal.test/login"');
    expect(m.html).toContain('Growth Engine');
    expect(m.html).not.toContain('reset-password');
  });

  test('refuses to send when SMTP settings are missing, and says so', async () => {
    delete process.env.SMTP_PASS;
    expect(email.isConfigured()).toBe(false);
    await expect(email.sendContactInquiry({ name: 'A', email: 'a@x.com', message: 'm' }))
      .rejects.toMatchObject({ notConfigured: true });
    expect(mockSendMail).not.toHaveBeenCalled();
    process.env.SMTP_PASS = 'app-password';
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
    mockSendContactInquiry.mockRejectedValue(new Error('SMTP is down'));

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
