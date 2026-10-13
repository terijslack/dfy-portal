// Tests for the /plan-ended restart flow (backend/routes/planEnded.js)

const mockDbQuery = jest.fn();
const mockSessionCreate = jest.fn();

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ query: mockDbQuery })) }));
jest.mock('stripe', () => jest.fn(() => ({ checkout: { sessions: { create: mockSessionCreate } } })));

process.env.JWT_SECRET = 'test-secret';
process.env.STRIPE_SECRET_KEY = 'sk_test_x';
process.env.APP_URL = 'https://example.test';

const jwt = require('jsonwebtoken');
const router = require('../routes/planEnded');

// Find a route handler (last in its stack) from the express router
function handler(method, path) {
  const layer = router.stack.find(l => l.route && l.route.path === path && l.route.methods[method]);
  const stack = layer.route.stack;
  return { session: stack[0].handle, run: stack[stack.length - 1].handle };
}

function call(method, path, { cookie, body } = {}) {
  const h = handler(method, path);
  const req = { cookies: cookie ? { token: cookie } : {}, body: body || {} };
  const res = {
    statusCode: 200, payload: null,
    status(c) { this.statusCode = c; return this; },
    json(o) { this.payload = o; return this; },
  };
  return new Promise(resolve => {
    h.session(req, res, async () => { await h.run(req, res); resolve(res); });
    if (res.payload) resolve(res); // session middleware already responded (401)
  });
}

const token = jwt.sign({ id: 7, email: 'c@test.com' }, 'test-secret');

beforeEach(() => { mockDbQuery.mockReset(); mockSessionCreate.mockReset(); });

describe('GET /api/plan-ended', () => {
  test('401 when not logged in', async () => {
    const res = await call('get', '/');
    expect(res.statusCode).toBe(401);
  });

  test('reports ended = true for a cancelled client', async () => {
    mockDbQuery.mockResolvedValue({ rows: [{ name: 'Dana', plan: 'Growth Engine', subscription_status: 'cancelled' }] });
    const res = await call('get', '/', { cookie: token });
    expect(res.payload).toEqual({ ended: true, name: 'Dana', plan: 'Growth Engine' });
  });

  test('reports ended = false for an active client', async () => {
    mockDbQuery.mockResolvedValue({ rows: [{ name: 'Dana', plan: 'Growth Engine', subscription_status: 'active' }] });
    const res = await call('get', '/', { cookie: token });
    expect(res.payload.ended).toBe(false);
  });
});

describe('POST /api/plan-ended/restart', () => {
  test('rejects an unknown plan name', async () => {
    const res = await call('post', '/restart', { cookie: token, body: { plan: 'Free Stuff' } });
    expect(res.statusCode).toBe(400);
    expect(mockSessionCreate).not.toHaveBeenCalled();
  });

  test('refuses when the plan is still active', async () => {
    mockDbQuery.mockResolvedValue({ rows: [{ id: 7, email: 'c@test.com', subscription_status: 'active' }] });
    const res = await call('post', '/restart', { cookie: token, body: { plan: 'Growth Engine' } });
    expect(res.statusCode).toBe(400);
    expect(mockSessionCreate).not.toHaveBeenCalled();
  });

  test('creates checkout for the chosen plan and reuses the Stripe customer', async () => {
    mockDbQuery.mockResolvedValue({ rows: [{ id: 7, email: 'c@test.com', subscription_status: 'cancelled', stripe_customer_id: 'cus_123' }] });
    mockSessionCreate.mockResolvedValue({ url: 'https://checkout.stripe.test/abc' });
    const res = await call('post', '/restart', { cookie: token, body: { plan: 'Marketing Partner' } });
    expect(res.payload).toEqual({ url: 'https://checkout.stripe.test/abc' });
    const args = mockSessionCreate.mock.calls[0][0];
    expect(args.customer).toBe('cus_123');
    expect(args.metadata).toMatchObject({ userId: '7', plan: 'Marketing Partner' });
    expect(args.cancel_url).toBe('https://example.test/plan-ended');
  });

  test('falls back to the email when there is no Stripe customer yet', async () => {
    mockDbQuery.mockResolvedValue({ rows: [{ id: 7, email: 'c@test.com', subscription_status: 'cancelled', stripe_customer_id: null }] });
    mockSessionCreate.mockResolvedValue({ url: 'https://checkout.stripe.test/xyz' });
    await call('post', '/restart', { cookie: token, body: { plan: 'Starter Presence' } });
    const args = mockSessionCreate.mock.calls[0][0];
    expect(args.customer).toBeUndefined();
    expect(args.customer_email).toBe('c@test.com');
  });
});
