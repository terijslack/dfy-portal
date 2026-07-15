/**
 * Smoke tests for the price-ID refactor.
 *
 * Verifies that:
 *  1. backend/config/plans.js exports the correct shape and IDs
 *     under both fallback values and env-var overrides.
 *  2. stripe.js checkout routes pass the right price IDs to Stripe.
 *  3. stripe.js webhook handler maps price IDs back to plan names correctly.
 *  4. account.js change-plan route sends the right priceId to Stripe.
 */

'use strict';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Re-require a module so env changes take effect. */
function freshRequire(mod) {
  jest.resetModules();
  return require(mod);
}

// Hardcoded fallback IDs copied from plans.js (used for assertions)
const FALLBACK = {
  ONLINE_PRESENCE: 'price_1TTK4hJaMlIvd3H414Ffw3Hr',
  GROWTH_ENGINE:   'price_1TTK5DJaMlIvd3H4V0LeAYL7',
  DFY_PARTNER:     'price_1TTK5jJaMlIvd3H4NFHH6hPl',
};

// ─── 1. config/plans.js ───────────────────────────────────────────────────────

describe('backend/config/plans.js — fallback price IDs', () => {
  let plans;

  beforeAll(() => {
    delete process.env.STRIPE_PRICE_ONLINE_PRESENCE;
    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
    delete process.env.STRIPE_PRICE_DFY_PARTNER;
    plans = freshRequire('../config/plans');
  });

  test('PLAN_KEY_TO_PRICE contains all three plan keys', () => {
    expect(plans.PLAN_KEY_TO_PRICE).toHaveProperty('online-presence');
    expect(plans.PLAN_KEY_TO_PRICE).toHaveProperty('growth-engine');
    expect(plans.PLAN_KEY_TO_PRICE).toHaveProperty('done-for-you-partner');
  });

  test('PLAN_KEY_TO_PRICE resolves to fallback IDs', () => {
    expect(plans.PLAN_KEY_TO_PRICE['online-presence']).toBe(FALLBACK.ONLINE_PRESENCE);
    expect(plans.PLAN_KEY_TO_PRICE['growth-engine']).toBe(FALLBACK.GROWTH_ENGINE);
    expect(plans.PLAN_KEY_TO_PRICE['done-for-you-partner']).toBe(FALLBACK.DFY_PARTNER);
  });

  test('PRICE_TO_PLAN maps every fallback ID to the correct plan name', () => {
    expect(plans.PRICE_TO_PLAN[FALLBACK.ONLINE_PRESENCE]).toBe('Starter Presence');
    expect(plans.PRICE_TO_PLAN[FALLBACK.GROWTH_ENGINE]).toBe('Growth Engine');
    expect(plans.PRICE_TO_PLAN[FALLBACK.DFY_PARTNER]).toBe('Marketing Partner');
  });

  test('PLANS entries carry priceId that matches PLAN_KEY_TO_PRICE', () => {
    expect(plans.PLANS['Starter Presence'].priceId).toBe(plans.PLAN_KEY_TO_PRICE['online-presence']);
    expect(plans.PLANS['Growth Engine'].priceId).toBe(plans.PLAN_KEY_TO_PRICE['growth-engine']);
    expect(plans.PLANS['Marketing Partner'].priceId).toBe(plans.PLAN_KEY_TO_PRICE['done-for-you-partner']);
  });

  test('VALID_PRICE_IDS contains exactly the three price IDs', () => {
    expect(plans.VALID_PRICE_IDS.has(FALLBACK.ONLINE_PRESENCE)).toBe(true);
    expect(plans.VALID_PRICE_IDS.has(FALLBACK.GROWTH_ENGINE)).toBe(true);
    expect(plans.VALID_PRICE_IDS.has(FALLBACK.DFY_PARTNER)).toBe(true);
    expect(plans.VALID_PRICE_IDS.size).toBe(3);
  });

  test('PLAN_KEY_TO_NAME maps keys to display names', () => {
    expect(plans.PLAN_KEY_TO_NAME['online-presence']).toBe('Starter Presence');
    expect(plans.PLAN_KEY_TO_NAME['growth-engine']).toBe('Growth Engine');
    expect(plans.PLAN_KEY_TO_NAME['done-for-you-partner']).toBe('Marketing Partner');
  });
});

describe('backend/config/plans.js — env-var overrides', () => {
  const OVERRIDE = {
    ONLINE_PRESENCE: 'price_TEST_online',
    GROWTH_ENGINE:   'price_TEST_growth',
    DFY_PARTNER:     'price_TEST_dfy',
  };

  let plans;

  beforeAll(() => {
    process.env.STRIPE_PRICE_ONLINE_PRESENCE = OVERRIDE.ONLINE_PRESENCE;
    process.env.STRIPE_PRICE_GROWTH_ENGINE   = OVERRIDE.GROWTH_ENGINE;
    process.env.STRIPE_PRICE_DFY_PARTNER     = OVERRIDE.DFY_PARTNER;
    plans = freshRequire('../config/plans');
  });

  afterAll(() => {
    delete process.env.STRIPE_PRICE_ONLINE_PRESENCE;
    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
    delete process.env.STRIPE_PRICE_DFY_PARTNER;
  });

  test('PLAN_KEY_TO_PRICE uses the env-var overrides', () => {
    expect(plans.PLAN_KEY_TO_PRICE['online-presence']).toBe(OVERRIDE.ONLINE_PRESENCE);
    expect(plans.PLAN_KEY_TO_PRICE['growth-engine']).toBe(OVERRIDE.GROWTH_ENGINE);
    expect(plans.PLAN_KEY_TO_PRICE['done-for-you-partner']).toBe(OVERRIDE.DFY_PARTNER);
  });

  test('PRICE_TO_PLAN maps override IDs to the correct plan names', () => {
    expect(plans.PRICE_TO_PLAN[OVERRIDE.ONLINE_PRESENCE]).toBe('Starter Presence');
    expect(plans.PRICE_TO_PLAN[OVERRIDE.GROWTH_ENGINE]).toBe('Growth Engine');
    expect(plans.PRICE_TO_PLAN[OVERRIDE.DFY_PARTNER]).toBe('Marketing Partner');
  });

  test('VALID_PRICE_IDS contains the override IDs (not the fallbacks)', () => {
    expect(plans.VALID_PRICE_IDS.has(OVERRIDE.ONLINE_PRESENCE)).toBe(true);
    expect(plans.VALID_PRICE_IDS.has(OVERRIDE.GROWTH_ENGINE)).toBe(true);
    expect(plans.VALID_PRICE_IDS.has(OVERRIDE.DFY_PARTNER)).toBe(true);
    // Fallback IDs should NOT be present when overrides are set
    expect(plans.VALID_PRICE_IDS.has(FALLBACK.ONLINE_PRESENCE)).toBe(false);
  });

  test('PLANS[].priceId reflects the overrides', () => {
    expect(plans.PLANS['Starter Presence'].priceId).toBe(OVERRIDE.ONLINE_PRESENCE);
    expect(plans.PLANS['Growth Engine'].priceId).toBe(OVERRIDE.GROWTH_ENGINE);
    expect(plans.PLANS['Marketing Partner'].priceId).toBe(OVERRIDE.DFY_PARTNER);
  });
});

// ─── 2. stripe.js — checkout creation ────────────────────────────────────────
//
// We mount the router on a minimal express app and call it with supertest-style
// mocking. Because we don't have supertest installed, we drive the route handler
// directly by constructing fake req/res objects.

describe('stripe.js /create-checkout — price ID forwarded to Stripe', () => {
  const TEST_PRICE_ID = FALLBACK.ONLINE_PRESENCE;
  let createCheckoutHandler;
  let mockSessionCreate;

  beforeAll(() => {
    jest.resetModules();
    delete process.env.STRIPE_PRICE_ONLINE_PRESENCE;
    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
    delete process.env.STRIPE_PRICE_DFY_PARTNER;

    // Mock stripe
    mockSessionCreate = jest.fn().mockResolvedValue({ url: 'https://stripe.com/pay/test' });
    jest.mock('stripe', () => () => ({
      checkout: { sessions: { create: mockSessionCreate } },
    }));

    // Mock pg Pool
    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({
        query: jest.fn().mockImplementation((sql) => {
          if (/SELECT id FROM clients/.test(sql)) return Promise.resolve({ rows: [] });
          if (/INSERT INTO clients/.test(sql)) return Promise.resolve({ rows: [{ id: 42 }] });
          return Promise.resolve({ rows: [] });
        }),
      })),
    }));

    // Mock bcryptjs
    jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed') }));

    // Mock GHL service
    jest.mock('../services/ghl', () => ({ createGHLContact: jest.fn() }));

    // Set Stripe key so the handler takes the real checkout path
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    process.env.APP_URL = 'https://example.com';

    const router = require('../routes/stripe');
    // Extract the /create-checkout handler (second registered route on the router)
    createCheckoutHandler = router.stack.find(l => l.route && l.route.path === '/create-checkout')
      ?.route.stack[0]?.handle;
  });

  afterAll(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.APP_URL;
  });

  function makeReqRes(body) {
    const req = { body };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    return { req, res };
  }

  test('rejects a price ID not in VALID_PRICE_IDS', async () => {
    const { req, res } = makeReqRes({
      name: 'Alice', email: 'alice@test.com', password: 'pass123',
      priceId: 'price_BOGUS',
    });
    await createCheckoutHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringMatching(/invalid plan/i) }));
  });

  test('passes the exact price ID from plans.js to stripe.checkout.sessions.create', async () => {
    const { req, res } = makeReqRes({
      name: 'Alice', email: 'alice@test.com', password: 'pass123',
      priceId: TEST_PRICE_ID,
    });
    await createCheckoutHandler(req, res);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: TEST_PRICE_ID, quantity: 1 }],
      })
    );
    expect(res.json).toHaveBeenCalledWith({ url: 'https://stripe.com/pay/test' });
  });
});

describe('stripe.js /create-checkout-session — plan key → price ID → Stripe', () => {
  let createSessionHandler;
  let mockSessionCreate;
  let mockCustomersCreate;

  beforeAll(() => {
    jest.resetModules();
    delete process.env.STRIPE_PRICE_ONLINE_PRESENCE;
    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
    delete process.env.STRIPE_PRICE_DFY_PARTNER;

    mockSessionCreate   = jest.fn().mockResolvedValue({ url: 'https://stripe.com/pay/session' });
    mockCustomersCreate = jest.fn().mockResolvedValue({ id: 'cus_test' });

    jest.mock('stripe', () => () => ({
      checkout: { sessions: { create: mockSessionCreate } },
      customers: { create: mockCustomersCreate },
    }));

    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({
        query: jest.fn().mockImplementation((sql) => {
          if (/SELECT id.*FROM clients/.test(sql) || /SELECT.*name.*email/.test(sql)) {
            return Promise.resolve({ rows: [{ id: 7, name: 'Bob', email: 'bob@test.com', stripe_customer_id: null }] });
          }
          if (/UPDATE clients SET stripe_customer_id/.test(sql)) return Promise.resolve({ rows: [] });
          return Promise.resolve({ rows: [] });
        }),
      })),
    }));

    jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed') }));
    jest.mock('../services/ghl', () => ({ createGHLContact: jest.fn() }));

    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    process.env.APP_URL = 'https://example.com';

    const router = require('../routes/stripe');
    createSessionHandler = router.stack.find(l => l.route && l.route.path === '/create-checkout-session')
      ?.route.stack[0]?.handle;
  });

  afterAll(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.APP_URL;
  });

  function makeReqRes(body) {
    return {
      req: { body },
      res: { status: jest.fn().mockReturnThis(), json: jest.fn() },
    };
  }

  test('rejects an unknown plan key', async () => {
    const { req, res } = makeReqRes({ userId: 7, plan: 'bad-plan' });
    await createSessionHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringMatching(/invalid plan key/i) }));
  });

  test.each([
    ['online-presence',      FALLBACK.ONLINE_PRESENCE],
    ['growth-engine',        FALLBACK.GROWTH_ENGINE],
    ['done-for-you-partner', FALLBACK.DFY_PARTNER],
  ])('plan key "%s" forwards price ID %s to Stripe', async (planKey, expectedPriceId) => {
    mockSessionCreate.mockClear();
    const { req, res } = makeReqRes({ userId: 7, plan: planKey });
    await createSessionHandler(req, res);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: expectedPriceId, quantity: 1 }],
      })
    );
  });
});

// ─── 3a. stripe.js webhook handler — checkout.session.completed ──────────────
//
// We invoke the actual webhook async handler (last layer in the route stack),
// bypassing express.raw() middleware by providing a pre-parsed req.body buffer.
// stripe.webhooks.constructEvent is mocked to return controlled event objects.

function buildWebhookHandler() {
  // Must be called inside a describe/test with mocks already set up.
  const router = require('../routes/stripe');
  const webhookRoute = router.stack.find(l => l.route && l.route.path === '/webhook');
  // Route stack: [express.raw middleware, async handler]
  const layers = webhookRoute?.route.stack ?? [];
  // Return the last layer (the actual async handler)
  return layers[layers.length - 1].handle;
}

describe('stripe.js webhook — checkout.session.completed activates correct plan', () => {
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

    mockDbQuery = jest.fn().mockResolvedValue({ rows: [] });
    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({ query: mockDbQuery })),
    }));

    jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
    jest.mock('../services/ghl', () => ({ createGHLContact: jest.fn() }));

    process.env.STRIPE_SECRET_KEY    = 'sk_test_dummy';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';

    webhookHandler = buildWebhookHandler();
  });

  afterAll(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  function makeWebhookReqRes(event) {
    mockConstructEvent.mockReturnValue(event);
    return {
      req: {
        headers: { 'stripe-signature': 'sig_dummy' },
        body:    Buffer.from('{}'),
      },
      res: { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() },
    };
  }

  test.each([
    [FALLBACK.ONLINE_PRESENCE, 'Starter Presence'],
    [FALLBACK.GROWTH_ENGINE,   'Growth Engine'],
    [FALLBACK.DFY_PARTNER,     'Marketing Partner'],
  ])('checkout.session.completed with plan "%s" updates DB with correct plan name', async (priceId, expectedPlan) => {
    mockDbQuery.mockClear();
    const event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          customer:     'cus_test',
          subscription: 'sub_test',
          customer_email: 'user@test.com',
          metadata: {
            plan:   expectedPlan,
            userId: '10',
            email:  'user@test.com',
          },
        },
      },
    };
    const { req, res } = makeWebhookReqRes(event);
    await webhookHandler(req, res);

    // At least one UPDATE should have been issued with the correct plan
    const updateCalls = mockDbQuery.mock.calls.filter(c => /UPDATE clients/.test(c[0]));
    expect(updateCalls.length).toBeGreaterThan(0);
    const planArg = updateCalls[0][1][2];
    expect(planArg).toBe(expectedPlan);

    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('checkout.session.completed with unknown plan falls back to "Starter Presence"', async () => {
    mockDbQuery.mockClear();
    // Simulate old flow: no plan in metadata, stripe_price_id lookup returns unknown ID
    mockDbQuery.mockImplementation((sql) => {
      if (/SELECT stripe_price_id/.test(sql)) return Promise.resolve({ rows: [{ stripe_price_id: 'price_UNKNOWN' }] });
      return Promise.resolve({ rows: [] });
    });

    const event = {
      type: 'checkout.session.completed',
      data: {
        object: {
          customer:     'cus_unknown',
          subscription: 'sub_unknown',
          customer_email: 'x@test.com',
          metadata: {},
        },
      },
    };
    const { req, res } = makeWebhookReqRes(event);
    await webhookHandler(req, res);

    const updateCalls = mockDbQuery.mock.calls.filter(c => /UPDATE clients/.test(c[0]));
    expect(updateCalls.length).toBeGreaterThan(0);
    const planArg = updateCalls[0][1][2];
    expect(planArg).toBe('Starter Presence');
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});

describe('stripe.js webhook — customer.subscription.updated syncs plan + priceId', () => {
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

    mockDbQuery = jest.fn().mockResolvedValue({ rows: [] });
    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({ query: mockDbQuery })),
    }));

    jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
    jest.mock('../services/ghl', () => ({ createGHLContact: jest.fn() }));

    process.env.STRIPE_SECRET_KEY    = 'sk_test_dummy';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';

    webhookHandler = buildWebhookHandler();
  });

  afterAll(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  test.each([
    [FALLBACK.ONLINE_PRESENCE, 'Starter Presence'],
    [FALLBACK.GROWTH_ENGINE,   'Growth Engine'],
    [FALLBACK.DFY_PARTNER,     'Marketing Partner'],
  ])('subscription.updated with price %s updates plan to "%s" in DB', async (priceId, expectedPlan) => {
    mockDbQuery.mockClear();
    mockConstructEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          customer:              'cus_upd',
          status:                'active',
          pause_collection:      null,
          cancel_at_period_end:  false,
          items: { data: [{ price: { id: priceId } }] },
        },
      },
    });

    const req = { headers: { 'stripe-signature': 'sig_dummy' }, body: Buffer.from('{}') };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };
    await webhookHandler(req, res);

    const updateCalls = mockDbQuery.mock.calls.filter(c => /UPDATE clients/.test(c[0]));
    expect(updateCalls.length).toBeGreaterThan(0);
    // The full-plan update path: params are [status, plan, priceId, customerId]
    const params = updateCalls[0][1];
    expect(params[1]).toBe(expectedPlan);
    expect(params[2]).toBe(priceId);
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('subscription.updated with env-var override price ID maps to correct plan', async () => {
    jest.resetModules();
    process.env.STRIPE_PRICE_GROWTH_ENGINE   = 'price_WEBHOOK_OVERRIDE';
    process.env.STRIPE_SECRET_KEY            = 'sk_test_dummy';
    process.env.STRIPE_WEBHOOK_SECRET         = 'whsec_dummy';

    const mockConstruct = jest.fn().mockReturnValue({
      type: 'customer.subscription.updated',
      data: {
        object: {
          customer:             'cus_override',
          status:               'active',
          pause_collection:     null,
          cancel_at_period_end: false,
          items: { data: [{ price: { id: 'price_WEBHOOK_OVERRIDE' } }] },
        },
      },
    });
    jest.mock('stripe', () => () => ({
      webhooks: { constructEvent: mockConstruct },
    }));

    const mockQuery = jest.fn().mockResolvedValue({ rows: [] });
    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({ query: mockQuery })),
    }));
    jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
    jest.mock('../services/ghl', () => ({ createGHLContact: jest.fn() }));

    const handler = buildWebhookHandler();
    const req = { headers: { 'stripe-signature': 'sig_dummy' }, body: Buffer.from('{}') };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };
    await handler(req, res);

    const updateCalls = mockQuery.mock.calls.filter(c => /UPDATE clients/.test(c[0]));
    expect(updateCalls.length).toBeGreaterThan(0);
    expect(updateCalls[0][1][1]).toBe('Growth Engine');

    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
  });
});

// ─── 3b. stripe.js checkout — env-var override route tests ───────────────────

describe('stripe.js /create-checkout — env-var override price IDs are validated', () => {
  const OVERRIDE_PRICE = 'price_CHECKOUT_OVERRIDE';
  let createCheckoutHandler;
  let mockSessionCreate;

  beforeAll(() => {
    jest.resetModules();
    process.env.STRIPE_PRICE_ONLINE_PRESENCE = OVERRIDE_PRICE;
    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
    delete process.env.STRIPE_PRICE_DFY_PARTNER;

    mockSessionCreate = jest.fn().mockResolvedValue({ url: 'https://stripe.com/pay/override' });
    jest.mock('stripe', () => () => ({
      checkout: { sessions: { create: mockSessionCreate } },
    }));
    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({
        query: jest.fn().mockImplementation((sql) => {
          if (/SELECT id FROM clients/.test(sql)) return Promise.resolve({ rows: [] });
          if (/INSERT INTO clients/.test(sql)) return Promise.resolve({ rows: [{ id: 99 }] });
          return Promise.resolve({ rows: [] });
        }),
      })),
    }));
    jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed') }));
    jest.mock('../services/ghl', () => ({ createGHLContact: jest.fn() }));

    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    process.env.APP_URL = 'https://example.com';

    const router = require('../routes/stripe');
    createCheckoutHandler = router.stack.find(l => l.route && l.route.path === '/create-checkout')
      ?.route.stack[0]?.handle;
  });

  afterAll(() => {
    delete process.env.STRIPE_PRICE_ONLINE_PRESENCE;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.APP_URL;
  });

  test('accepts the override price ID and forwards it to Stripe', async () => {
    const req = { body: { name: 'Eve', email: 'eve@test.com', password: 'pw', priceId: OVERRIDE_PRICE } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await createCheckoutHandler(req, res);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({ line_items: [{ price: OVERRIDE_PRICE, quantity: 1 }] })
    );
  });

  test('rejects the fallback online-presence ID when an override is active', async () => {
    const req = { body: { name: 'Eve', email: 'eve2@test.com', password: 'pw', priceId: FALLBACK.ONLINE_PRESENCE } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await createCheckoutHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('stripe.js /create-checkout-session — env-var override price IDs forwarded', () => {
  const OVERRIDE_GE = 'price_SESSION_OVERRIDE_GE';
  let createSessionHandler;
  let mockSessionCreate;

  beforeAll(() => {
    jest.resetModules();
    process.env.STRIPE_PRICE_GROWTH_ENGINE = OVERRIDE_GE;
    delete process.env.STRIPE_PRICE_ONLINE_PRESENCE;
    delete process.env.STRIPE_PRICE_DFY_PARTNER;

    mockSessionCreate = jest.fn().mockResolvedValue({ url: 'https://stripe.com/pay/session-override' });
    jest.mock('stripe', () => () => ({
      checkout: { sessions: { create: mockSessionCreate } },
      customers: { create: jest.fn().mockResolvedValue({ id: 'cus_ovr' }) },
    }));
    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({
        query: jest.fn().mockResolvedValue({ rows: [{ id: 5, name: 'Frank', email: 'f@test.com', stripe_customer_id: null }] }),
      })),
    }));
    jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed') }));
    jest.mock('../services/ghl', () => ({ createGHLContact: jest.fn() }));

    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    process.env.APP_URL = 'https://example.com';

    const router = require('../routes/stripe');
    createSessionHandler = router.stack.find(l => l.route && l.route.path === '/create-checkout-session')
      ?.route.stack[0]?.handle;
  });

  afterAll(() => {
    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.APP_URL;
  });

  test('growth-engine plan key forwards the override price ID to Stripe', async () => {
    const req = { body: { userId: 5, plan: 'growth-engine' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await createSessionHandler(req, res);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({ line_items: [{ price: OVERRIDE_GE, quantity: 1 }] })
    );
  });
});

// ─── 4. account.js change-plan — PLANS[].priceId sent to Stripe ──────────────
//
// We extract only the async route handler (the last layer in the route stack)
// and call it directly with req.user already set, bypassing requireLogin.

describe('account.js /change-plan — correct priceId sent to Stripe', () => {
  let changePlanHandler;
  let mockSubscriptionsUpdate;
  let mockSubscriptionsRetrieve;
  let mockDbQuery;

  beforeAll(() => {
    jest.resetModules();
    delete process.env.STRIPE_PRICE_ONLINE_PRESENCE;
    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
    delete process.env.STRIPE_PRICE_DFY_PARTNER;

    mockSubscriptionsUpdate   = jest.fn().mockResolvedValue({});
    mockSubscriptionsRetrieve = jest.fn().mockResolvedValue({
      items: { data: [{ id: 'si_test' }] },
    });

    jest.mock('stripe', () => () => ({
      subscriptions: {
        retrieve: mockSubscriptionsRetrieve,
        update:   mockSubscriptionsUpdate,
      },
    }));

    mockDbQuery = jest.fn().mockImplementation((sql) => {
      if (/SELECT.*FROM clients/.test(sql)) {
        return Promise.resolve({
          rows: [{
            name: 'Carol',
            email: 'carol@test.com',
            plan: 'Starter Presence',
            stripe_subscription_id: 'sub_test123',
          }],
        });
      }
      return Promise.resolve({ rows: [] });
    });

    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({ query: mockDbQuery })),
    }));

    jest.mock('../middleware/auth', () => ({
      requireLogin: (_req, _res, next) => next(),
    }));

    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';

    const router = require('../routes/account');
    // Grab the last layer (the actual async handler, after requireLogin)
    const routeLayers = router.stack.find(l => l.route && l.route.path === '/change-plan')
      ?.route.stack ?? [];
    const lastLayer = routeLayers[routeLayers.length - 1];
    changePlanHandler = lastLayer.handle;
  });

  afterAll(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });

  function makeReqRes(body) {
    return {
      req:  { user: { id: 1 }, body },
      res:  { status: jest.fn().mockReturnThis(), json: jest.fn() },
      next: jest.fn(),
    };
  }

  test('rejects an invalid plan name', async () => {
    const { req, res, next } = makeReqRes({ new_plan: 'Bogus Plan' });
    await changePlanHandler(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });

  test.each([
    ['Growth Engine',      FALLBACK.GROWTH_ENGINE],
    ['Marketing Partner',  FALLBACK.DFY_PARTNER],
  ])('changing to "%s" sends priceId %s to stripe.subscriptions.update', async (newPlan, expectedPriceId) => {
    mockSubscriptionsUpdate.mockClear();
    const { req, res, next } = makeReqRes({ new_plan: newPlan });
    await changePlanHandler(req, res, next);
    expect(mockSubscriptionsUpdate).toHaveBeenCalledWith(
      'sub_test123',
      expect.objectContaining({
        items: [{ id: 'si_test', price: expectedPriceId }],
      })
    );
  });

  test('change-plan with env-var override sends overridden priceId', async () => {
    jest.resetModules();
    process.env.STRIPE_PRICE_GROWTH_ENGINE = 'price_OVERRIDE_growth';

    const mockUpdate = jest.fn().mockResolvedValue({});
    jest.mock('stripe', () => () => ({
      subscriptions: {
        retrieve: jest.fn().mockResolvedValue({ items: { data: [{ id: 'si_test2' }] } }),
        update:   mockUpdate,
      },
    }));
    jest.mock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({
        query: jest.fn().mockImplementation((sql) => {
          if (/SELECT.*FROM clients/.test(sql)) {
            return Promise.resolve({
              rows: [{ name: 'Dave', email: 'd@test.com', plan: 'Starter Presence', stripe_subscription_id: 'sub_override' }],
            });
          }
          return Promise.resolve({ rows: [] });
        }),
      })),
    }));
    jest.mock('../middleware/auth', () => ({
      requireLogin: (_req, _res, next) => next(),
    }));

    const router = require('../routes/account');
    const routeLayers = router.stack.find(l => l.route && l.route.path === '/change-plan')
      ?.route.stack ?? [];
    const handler = routeLayers[routeLayers.length - 1].handle;

    const req  = { user: { id: 2 }, body: { new_plan: 'Growth Engine' } };
    const res  = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await handler(req, res, next);

    expect(mockUpdate).toHaveBeenCalledWith(
      'sub_override',
      expect.objectContaining({
        items: [{ id: 'si_test2', price: 'price_OVERRIDE_growth' }],
      })
    );

    delete process.env.STRIPE_PRICE_GROWTH_ENGINE;
  });
});
