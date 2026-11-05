'use strict';

// Tests for the client portal "Send a Message" form (POST /api/contact/client).
// It must actually email hello@ — it used to only show a success message.

const express = require('express');
const request = require('supertest');

describe('POST /api/contact/client — portal Send a Message', () => {
  let app;
  let mockQuery;
  let mockSendClientMessage;
  let mockLoggedIn;

  beforeEach(() => {
    jest.resetModules();
    mockLoggedIn = true;

    mockQuery = jest.fn().mockResolvedValue({
      rows: [{ name: 'Lucy Ro', email: 'lucy@luro.test', business_name: "Lu'Ro Jewelers" }],
    });
    jest.mock('pg', () => ({ Pool: jest.fn(() => ({ query: mockQuery })) }));

    mockSendClientMessage = jest.fn().mockResolvedValue();
    jest.mock('../services/email', () => ({
      sendContactInquiry: jest.fn().mockResolvedValue(),
      sendClientMessage: mockSendClientMessage,
    }));
    jest.mock('../services/crm', () => ({ addInquiryLead: jest.fn().mockResolvedValue() }));
    jest.mock('../middleware/auth', () => ({
      requireLogin: (req, res, next) => {
        if (!mockLoggedIn) return res.status(401).json({ error: 'Please log in to access this.' });
        req.user = { id: 7, name: 'Token Name', email: 'token@test.com', business_name: null };
        next();
      },
      requireAdmin: (req, res, next) => next(),
    }));

    const router = require('../routes/contact');
    app = express();
    app.use(express.json());
    app.use('/api/contact', router);
  });

  test('emails the team with the client details from the database', async () => {
    const res = await request(app)
      .post('/api/contact/client')
      .send({ subject: 'Holiday post', message: 'Can we add a sale post?' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockSendClientMessage).toHaveBeenCalledWith({
      name: 'Lucy Ro',
      businessName: "Lu'Ro Jewelers",
      email: 'lucy@luro.test',
      subject: 'Holiday post',
      message: 'Can we add a sale post?',
    });
  });

  test('tells the client when the email could not be sent', async () => {
    mockSendClientMessage.mockRejectedValue(new Error('Gmail refused'));
    const res = await request(app)
      .post('/api/contact/client')
      .send({ subject: 'Hi', message: 'Hello' });

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/hello@dfymarketinggroup\.com/);
  });

  test('requires both subject and message', async () => {
    const res = await request(app).post('/api/contact/client').send({ subject: 'Hi' });
    expect(res.status).toBe(400);
    expect(mockSendClientMessage).not.toHaveBeenCalled();
  });

  test('requires the client to be logged in', async () => {
    mockLoggedIn = false;
    const res = await request(app).post('/api/contact/client').send({ subject: 'Hi', message: 'Hello' });
    expect(res.status).toBe(401);
    expect(mockSendClientMessage).not.toHaveBeenCalled();
  });
});

describe('sendClientMessage — goes to hello@', () => {
  let mockAxios;
  let sendClientMessage;

  beforeAll(() => {
    jest.resetModules();
    jest.unmock('../services/email');
    mockAxios = { get: jest.fn(), post: jest.fn() };
    jest.mock('axios', () => mockAxios);
    delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    process.env.GHL_API_KEY = 'ghl_test';
    process.env.GHL_LOCATION_ID = 'loc_test';
    ({ sendClientMessage } = require('../services/email'));
  });

  afterAll(() => {
    delete process.env.GHL_API_KEY;
    delete process.env.GHL_LOCATION_ID;
  });

  test('sends to the hello@ inbox with a clear subject and escaped content', async () => {
    mockAxios.get.mockResolvedValue({ data: { contact: { id: 'contact_hello' } } });
    mockAxios.post.mockImplementation((url) => {
      if (/conversations\/messages/.test(url)) return Promise.resolve({ data: {} });
      return Promise.resolve({ data: { conversation: { id: 'conv_1' } } });
    });

    await sendClientMessage({
      name: 'Lucy', businessName: "Lu'Ro", email: 'lucy@luro.test',
      subject: 'Question', message: '<b>hi</b>',
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('hello%40dfymarketinggroup.com'), expect.anything()
    );
    const msg = mockAxios.post.mock.calls.find(c => /conversations\/messages/.test(c[0]));
    expect(msg[1].subject).toBe("Portal message from Lu'Ro: Question");
    expect(msg[1].html).toContain('&lt;b&gt;hi&lt;/b&gt;');
    expect(msg[1].html).not.toContain('<b>hi</b>');
  });
});
