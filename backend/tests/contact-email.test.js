'use strict';

// Tests for contact-form email notification (Task B).
// Two describe blocks:
//   1. sendContactInquiry unit tests (GHL API calls, HTML escaping)
//   2. POST /api/contact route tests (email sent, failure handling, validation)

const express = require('express');
const request = require('supertest');

// ─── 1. sendContactInquiry — unit tests ──────────────────────────────────────

describe('sendContactInquiry — sends correct GHL email', () => {
  let mockAxios;
  let sendContactInquiry;

  beforeAll(() => {
    jest.resetModules();

    mockAxios = { get: jest.fn(), post: jest.fn() };
    jest.mock('axios', () => mockAxios);

    process.env.GHL_API_KEY     = 'ghl_test';
    process.env.GHL_LOCATION_ID = 'loc_test';

    ({ sendContactInquiry } = require('../services/email'));
  });

  afterAll(() => {
    delete process.env.GHL_API_KEY;
    delete process.env.GHL_LOCATION_ID;
  });

  function setupGhlMocks() {
    mockAxios.get.mockResolvedValue({ data: { contact: { id: 'contact_hello' } } });
    mockAxios.post.mockImplementation((url) => {
      if (/conversations\/messages/.test(url)) return Promise.resolve({ data: {} });
      return Promise.resolve({ data: { conversation: { id: 'conv_123' } } });
    });
  }

  test('looks up hello@ contact and sends an email with the correct subject', async () => {
    setupGhlMocks();
    mockAxios.get.mockClear();
    mockAxios.post.mockClear();

    await sendContactInquiry({ name: 'Alice', email: 'alice@test.com', message: 'Hello there' });

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('hello%40dfymarketinggroup.com'),
      expect.anything()
    );

    const msgCall = mockAxios.post.mock.calls.find(c => /conversations\/messages/.test(c[0]));
    expect(msgCall).toBeDefined();
    expect(msgCall[1].subject).toBe('New website inquiry from Alice');
    expect(msgCall[1].type).toBe('Email');
  });

  test('HTML-escapes name, email, and message to prevent markup injection', async () => {
    setupGhlMocks();
    mockAxios.post.mockClear();

    await sendContactInquiry({
      name:    '<script>alert(1)</script>',
      email:   'evil@test.com',
      message: '<img src=x onerror=alert(2)>',
    });

    const msgCall = mockAxios.post.mock.calls.find(c => /conversations\/messages/.test(c[0]));
    const html = msgCall[1].html;

    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img');
  });

  test('includes visitor email as a mailto link in the body', async () => {
    setupGhlMocks();
    mockAxios.post.mockClear();

    await sendContactInquiry({ name: 'Bob', email: 'bob@test.com', message: 'Hi' });

    const msgCall = mockAxios.post.mock.calls.find(c => /conversations\/messages/.test(c[0]));
    expect(msgCall[1].html).toContain('href="mailto:bob@test.com"');
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
    mockSendContactInquiry.mockRejectedValue(new Error('GHL is down'));

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
