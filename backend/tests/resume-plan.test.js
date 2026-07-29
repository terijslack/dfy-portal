// backend/tests/resume-plan.test.js
// Tests for POST /api/account/resume-plan

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

// ── Mock pg Pool ─────────────────────────────────────────────────────────────
let mockQueryImpl;
jest.mock('pg', () => {
  const mPool = { query: jest.fn((...args) => mockQueryImpl(...args)) };
  return { Pool: jest.fn(() => mPool) };
});

// ── Mock stripe ───────────────────────────────────────────────────────────────
const mockStripeUpdate = jest.fn();
jest.mock('stripe', () =>
  jest.fn(() => ({
    subscriptions: { update: mockStripeUpdate },
  }))
);

// ── Build a minimal Express app that mirrors server.js wiring ─────────────────
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/account', require('../routes/account'));
  return app;
}

// ── Helper: mint a valid JWT cookie ──────────────────────────────────────────
function authCookie(userId = 42) {
  const token = jwt.sign({ id: userId }, JWT_SECRET);
  return `token=${token}`;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/account/resume-plan', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    mockStripeUpdate.mockReset();
    app = buildApp();
  });

  // ── Success path (with Stripe) ──────────────────────────────────────────────
  it('resumes a paused subscription via Stripe and sets DB status to active', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';

    const client = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      plan: 'Starter Presence',
      stripe_subscription_id: 'sub_abc123',
      subscription_status: 'paused',
    };

    // First query returns client row; second query is the UPDATE
    let callCount = 0;
    mockQueryImpl = jest.fn(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve({ rows: [client] });
      return Promise.resolve({ rows: [] });
    });

    mockStripeUpdate.mockResolvedValue({});

    const res = await request(app)
      .post('/api/account/resume-plan')
      .set('Cookie', authCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/resumed/i);

    // Stripe should have been called to clear pause_collection
    expect(mockStripeUpdate).toHaveBeenCalledTimes(1);
    expect(mockStripeUpdate).toHaveBeenCalledWith('sub_abc123', {
      pause_collection: '',
    });

    // DB UPDATE should have set status → 'active'
    const updateCall = mockQueryImpl.mock.calls[1];
    expect(updateCall[0]).toMatch(/UPDATE clients SET subscription_status/i);
    expect(updateCall[1]).toContain('active');
  });

  // ── Success path (no Stripe key — dev / no-Stripe mode) ────────────────────
  it('resumes without Stripe when STRIPE_SECRET_KEY is absent', async () => {
    delete process.env.STRIPE_SECRET_KEY;

    const client = {
      name: 'Grace Hopper',
      email: 'grace@example.com',
      plan: 'Starter Presence',
      stripe_subscription_id: null,
      subscription_status: 'paused',
    };

    let callCount = 0;
    mockQueryImpl = jest.fn(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve({ rows: [client] });
      return Promise.resolve({ rows: [] });
    });

    const res = await request(app)
      .post('/api/account/resume-plan')
      .set('Cookie', authCookie());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockStripeUpdate).not.toHaveBeenCalled();
  });

  // ── Already-active guard → 400 ──────────────────────────────────────────────
  it('returns 400 when the subscription is already active', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';

    const client = {
      name: 'Alan Turing',
      email: 'alan@example.com',
      plan: 'Starter Presence',
      stripe_subscription_id: 'sub_xyz',
      subscription_status: 'active',
    };

    mockQueryImpl = jest.fn(() => Promise.resolve({ rows: [client] }));

    const res = await request(app)
      .post('/api/account/resume-plan')
      .set('Cookie', authCookie());

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/not currently paused/i);
    expect(mockStripeUpdate).not.toHaveBeenCalled();
  });

  // ── Not logged in → 401 ────────────────────────────────────────────────────
  it('returns 401 when no auth cookie is present', async () => {
    const res = await request(app).post('/api/account/resume-plan');
    expect(res.status).toBe(401);
  });

  // ── Stripe error propagates → 500 ─────────────────────────────────────────
  it('returns 500 when Stripe throws an error', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';

    const client = {
      name: 'Linus Torvalds',
      email: 'linus@example.com',
      plan: 'Starter Presence',
      stripe_subscription_id: 'sub_err',
      subscription_status: 'paused',
    };

    mockQueryImpl = jest.fn(() => Promise.resolve({ rows: [client] }));
    mockStripeUpdate.mockRejectedValue(new Error('Stripe network failure'));

    const res = await request(app)
      .post('/api/account/resume-plan')
      .set('Cookie', authCookie());

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/stripe network failure/i);
  });

  // ── Account not found → 404 ───────────────────────────────────────────────
  it('returns 404 when the client row does not exist', async () => {
    mockQueryImpl = jest.fn(() => Promise.resolve({ rows: [] }));

    const res = await request(app)
      .post('/api/account/resume-plan')
      .set('Cookie', authCookie());

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/account not found/i);
  });
});
