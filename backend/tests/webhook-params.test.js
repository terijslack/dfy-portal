'use strict';

// Confirms that the checkout.session.completed UPDATE query always receives
// exactly 4 parameters — matching the 4 placeholders ($1–$4) in the SQL.
// This guards against the regression where the query had 3 placeholders but
// was called with 4 values, crashing with "bind message supplies 4 parameters
// but prepared statement requires 3".

function buildWebhookHandler() {
  const router = require('../routes/stripe');
  const webhookRoute = router.stack.find(l => l.route && l.route.path === '/webhook');
  const layers = webhookRoute?.route.stack ?? [];
  return layers[layers.length - 1].handle;
}

describe('stripe webhook — checkout.session.completed UPDATE parameter count', () => {
  let webhookHandler;
  let mockDbQuery;
  let mockConstructEvent;

  beforeAll(() => {
    jest.resetModules();
    delete process.env.STRIPE_PRICE_ONLINE_PRESENCE;
    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
    delete process.env.STRIPE_PRICE_DFY_PARTNER;

    mockConstructEvent = jest.fn();
    jest.mock('stripe', () => () => ({
      webhooks: { constructEvent: mockConstructEvent },
    }));

    mockDbQuery = jest.fn().mockImplementation((sql) => {
      if (/SELECT id.*name.*FROM clients WHERE/.test(sql))
        return Promise.resolve({ rows: [{ id: 5, name: 'Test User' }] });
      return Promise.resolve({ rows: [] });
    });
    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({ query: mockDbQuery })),
    }));

    jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
    jest.mock('../services/ghl', () => ({ upsertGHLContact: jest.fn() }));

    process.env.STRIPE_SECRET_KEY     = 'sk_test_dummy';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';

    webhookHandler = buildWebhookHandler();
  });

  afterAll(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  function fireEvent(metadata) {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          customer:       'cus_test',
          subscription:   'sub_test',
          customer_email: 'user@test.com',
          metadata,
        },
      },
    });
    const req = { headers: { 'stripe-signature': 'sig_dummy' }, body: Buffer.from('{}') };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };
    return webhookHandler(req, res).then(() => {
      const updateCall = mockDbQuery.mock.calls.find(c => /UPDATE clients/.test(c[0]));
      return updateCall;
    });
  }

  test('UPDATE query receives exactly 4 parameters when userId is in metadata', async () => {
    mockDbQuery.mockClear();
    const updateCall = await fireEvent({ plan: 'Growth Engine', userId: '5', email: 'user@test.com' });
    expect(updateCall).toBeDefined();
    expect(updateCall[1]).toHaveLength(4);
  });

  test('UPDATE query receives exactly 4 parameters when only email is in metadata (no userId)', async () => {
    mockDbQuery.mockClear();
    const updateCall = await fireEvent({ plan: 'Starter Presence', email: 'user@test.com' });
    expect(updateCall).toBeDefined();
    expect(updateCall[1]).toHaveLength(4);
  });
});
