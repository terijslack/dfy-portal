'use strict';

// Tests for the Stripe webhook "front door":
//  - a payment-link / custom-package buyer with no portal account gets one created
//  - clients who signed up on the site are found and activated (no duplicate account)
//  - the welcome email goes out after the account is saved (set-password link for payment-link buyers)
//  - failures return 500 so Stripe retries; repeat deliveries do no harm
//  - billing date and ended plans are recorded

const mockDbQuery      = jest.fn();
const mockConstructEvent = jest.fn();
const mockRetrieve     = jest.fn();
const mockSendWelcome  = jest.fn();

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ query: mockDbQuery })) }));
jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed-random-password') }));
jest.mock('../services/email', () => ({
  sendWelcome: (...a) => mockSendWelcome(...a),
  isConfigured: () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
}));
jest.mock('stripe', () => () => ({
  webhooks: { constructEvent: (...a) => mockConstructEvent(...a) },
  checkout: { sessions: { retrieve: (...a) => mockRetrieve(...a) } },
}));

process.env.STRIPE_SECRET_KEY     = 'sk_test_x';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_x';

const router = require('../routes/stripe');
const webhook = router.stack.find(l => l.route && l.route.path === '/webhook')
  .route.stack.slice(-1)[0].handle;

const GROWTH = 'price_1TTK5DJaMlIvd3H4V0LeAYL7';

// db: how the mocked database answers. Defaults: no existing client, insert succeeds.
function setDb({ existing = null, insertedRow = { id: 99, name: 'Lu Ro', email: 'lu@ro.com', stripe_price_id: null, password_reset_token: 'tok_new', password_reset_expires: new Date(Date.now() + 86400000) } } = {}) {
  mockDbQuery.mockImplementation(sql => {
    if (/^\s*SELECT id, name, email, stripe_price_id, password_reset_token, password_reset_expires FROM clients/.test(sql)) {
      return Promise.resolve({ rows: existing ? [existing] : [] });
    }
    if (/INSERT INTO clients/.test(sql)) {
      return Promise.resolve({ rows: insertedRow ? [insertedRow] : [] });
    }
    return Promise.resolve({ rows: [] });
  });
}

async function fire(event) {
  mockConstructEvent.mockReturnValue(event);
  const req = { headers: { 'stripe-signature': 'sig' }, body: Buffer.from('{}') };
  const res = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };
  await webhook(req, res);
  return res;
}

const sqlCalls = re => mockDbQuery.mock.calls.filter(c => re.test(c[0]));

// A payment-link purchase: no metadata at all, email only inside customer_details
function paymentLinkEvent(overrides = {}) {
  return {
    id: 'evt_1', type: 'checkout.session.completed',
    data: { object: {
      id: 'cs_1', mode: 'subscription', customer: 'cus_1', subscription: 'sub_1',
      customer_email: null, metadata: {},
      customer_details: { email: 'Lu@Ro.com', name: 'Lu Ro' },
      ...overrides,
    } },
  };
}

beforeEach(() => {
  mockDbQuery.mockReset(); mockRetrieve.mockReset(); mockSendWelcome.mockReset();
  mockSendWelcome.mockResolvedValue({});
  delete process.env.SMTP_USER; delete process.env.SMTP_PASS;
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

describe('payment-link / custom-package buyer (no portal account yet)', () => {
  beforeEach(() => {
    process.env.SMTP_USER = 'noreply@x.com'; process.env.SMTP_PASS = 'p';
    mockRetrieve.mockResolvedValue({
      line_items: { data: [{ price: { id: 'price_custom', product: { name: "Lu'Ro Jewelers - Monthly Marketing Package" } } }] },
    });
    setDb();
  });

  test('creates the account (lower-cased email from customer_details, random password, active)', async () => {
    const res = await fire(paymentLinkEvent());
    const insert = sqlCalls(/INSERT INTO clients/)[0];
    expect(insert).toBeDefined();
    expect(insert[1].slice(0, 4)).toEqual(['Lu Ro', 'lu@ro.com', 'hashed-random-password', "Lu'Ro Jewelers - Monthly Marketing Package"]);
    expect(insert[1][4]).toMatch(/^[0-9a-f]{64}$/);          // set-password token
    expect(insert[1][5].getTime()).toBeGreaterThan(Date.now() + 6 * 86400000); // ~7 days
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('activates the new account with the Stripe customer and subscription ids', async () => {
    await fire(paymentLinkEvent());
    const update = sqlCalls(/UPDATE clients\s+SET\s+status/)[0];
    expect(update[1]).toEqual(['cus_1', 'sub_1', "Lu'Ro Jewelers - Monthly Marketing Package", 99]);
  });

  test('sends the welcome email with a set-password link (they have no password yet)', async () => {
    await fire(paymentLinkEvent());
    expect(mockSendWelcome).toHaveBeenCalledTimes(1);
    expect(mockSendWelcome.mock.calls[0][0]).toMatchObject({ email: 'lu@ro.com', planName: "Lu'Ro Jewelers - Monthly Marketing Package" });
    expect(mockSendWelcome.mock.calls[0][0].setPasswordUrl).toMatch(/reset-password\.html\?token=tok_new&welcome=1$/);
  });

  test('falls back to "Custom Plan" if Stripe cannot say what was bought', async () => {
    mockRetrieve.mockRejectedValue(new Error('boom'));
    await fire(paymentLinkEvent());
    expect(sqlCalls(/INSERT INTO clients/)[0][1][3]).toBe('Custom Plan');
  });

  test('a standard price bought through a link gets the standard plan name', async () => {
    mockRetrieve.mockResolvedValue({ line_items: { data: [{ price: { id: GROWTH, product: { name: 'x' } } }] } });
    await fire(paymentLinkEvent());
    expect(sqlCalls(/INSERT INTO clients/)[0][1][3]).toBe('Growth Engine');
  });
});

describe('client who signed up on the site', () => {
  test('is found by userId and activated — no second account is created', async () => {
    setDb({ existing: { id: 5, name: 'Dana', email: 'dana@x.com', stripe_price_id: GROWTH } });
    await fire(paymentLinkEvent({ metadata: { userId: '5', plan: 'Growth Engine', email: 'dana@x.com' }, customer_details: null }));
    expect(sqlCalls(/INSERT INTO clients/)).toHaveLength(0);
    expect(sqlCalls(/UPDATE clients\s+SET\s+status/)[0][1]).toEqual(['cus_1', 'sub_1', 'Growth Engine', 5]);
  });

  test('is found by email when there is no userId', async () => {
    setDb({ existing: { id: 8, name: 'Sam', email: 'lu@ro.com', stripe_price_id: null } });
    mockRetrieve.mockResolvedValue({ line_items: { data: [{ price: { id: 'p', product: { name: 'Sam Package' } } }] } });
    await fire(paymentLinkEvent());
    expect(sqlCalls(/INSERT INTO clients/)).toHaveLength(0);
    expect(sqlCalls(/UPDATE clients\s+SET\s+status/)[0][1][3]).toBe(8);
  });
});

describe('repeat deliveries and failures', () => {
  test('a duplicate delivery (account already created) finds it instead of failing', async () => {
    // INSERT ... ON CONFLICT DO NOTHING returns no row, then the re-select finds the account
    let selects = 0;
    mockDbQuery.mockImplementation(sql => {
      if (/^\s*SELECT id, name, email, stripe_price_id, password_reset_token, password_reset_expires FROM clients/.test(sql)) {
        selects += 1;
        return Promise.resolve({ rows: selects === 1 ? [] : [{ id: 42, name: 'Lu Ro', email: 'lu@ro.com', stripe_price_id: null }] });
      }
      return Promise.resolve({ rows: [] });
    });
    mockRetrieve.mockRejectedValue(new Error('no'));
    const res = await fire(paymentLinkEvent());
    expect(res.json).toHaveBeenCalledWith({ received: true });
    expect(sqlCalls(/UPDATE clients\s+SET\s+status/)[0][1][3]).toBe(42);
  });

  test('database failure returns 500 so Stripe retries', async () => {
    mockDbQuery.mockRejectedValue(new Error('db down'));
    const res = await fire(paymentLinkEvent());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).not.toHaveBeenCalledWith({ received: true });
  });

  test('signup-page clients already have a password, so their welcome has no set-password link', async () => {
    process.env.SMTP_USER = 'noreply@x.com'; process.env.SMTP_PASS = 'p';
    setDb({ existing: { id: 5, name: 'Dana', email: 'dana@x.com', stripe_price_id: null, password_reset_token: null, password_reset_expires: null } });
    await fire(paymentLinkEvent({ metadata: { userId: '5', plan: 'Growth Engine' } }));
    expect(mockSendWelcome).toHaveBeenCalledTimes(1);
    expect(mockSendWelcome.mock.calls[0][0]).toMatchObject({ email: 'dana@x.com', planName: 'Growth Engine', setPasswordUrl: null });
  });

  test('email failure returns 500 so Stripe retries — but the account is already saved', async () => {
    process.env.SMTP_USER = 'noreply@x.com'; process.env.SMTP_PASS = 'p';
    setDb({ existing: { id: 5, name: 'Dana', email: 'dana@x.com', stripe_price_id: null } });
    mockSendWelcome.mockRejectedValue(new Error('SMTP down'));
    const res = await fire(paymentLinkEvent({ metadata: { userId: '5', plan: 'Growth Engine' } }));
    expect(sqlCalls(/UPDATE clients\s+SET\s+status/)).toHaveLength(1);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('email not configured: the account is still created and the webhook succeeds', async () => {
    setDb({ existing: { id: 5, name: 'Dana', email: 'dana@x.com', stripe_price_id: null } });
    const res = await fire(paymentLinkEvent({ metadata: { userId: '5', plan: 'Growth Engine' } }));
    expect(mockSendWelcome).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('a checkout with no email and no userId fails loudly (500) instead of guessing', async () => {
    const res = await fire(paymentLinkEvent({ customer_details: null }));
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('a one-time payment (not a plan) does not create or activate anyone', async () => {
    const res = await fire(paymentLinkEvent({ mode: 'payment' }));
    expect(mockDbQuery).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});

describe('other events', () => {
  test('invoice.payment_succeeded saves the next billing date', async () => {
    setDb();
    await fire({ id: 'e', type: 'invoice.payment_succeeded',
      data: { object: { customer: 'cus_1', customer_email: 'Lu@Ro.com', lines: { data: [{ period: { end: 1790000000 } }] } } } });
    const q = sqlCalls(/billing_date/)[0];
    expect(q[1]).toEqual([1790000000, 'cus_1', 'Lu@Ro.com']);
  });

  test('customer.subscription.deleted marks the plan as ended', async () => {
    setDb();
    await fire({ id: 'e', type: 'customer.subscription.deleted', data: { object: { customer: 'cus_1' } } });
    const q = sqlCalls(/'cancelled'/)[0];
    expect(q[0]).toMatch(/subscription_status = 'cancelled'/);
    expect(q[0]).toMatch(/status = 'cancelled'/);
    expect(q[1]).toEqual(['cus_1']);
  });

  test('events we do not handle still return 200', async () => {
    const res = await fire({ id: 'e', type: 'balance.available', data: { object: {} } });
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});
