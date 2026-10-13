// routes/stripe.js — Handles Stripe checkout and webhooks
// POST /api/stripe/create-checkout         — original flow: user data + priceId together
// POST /api/stripe/create-checkout-session — new flow: userId + plan key (account already created)
// POST /api/stripe/create-test-checkout    — admin only: real $1/month charge to verify the pipeline
// POST /api/stripe/webhook                 — Stripe calls this for subscription events

const express = require('express');
const router = express.Router();
const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { upsertGHLContact } = require('../services/ghl');
const { requireAdmin } = require('../middleware/auth');
const { PRICE_TO_PLAN, PLAN_KEY_TO_PRICE, PLAN_KEY_TO_NAME, VALID_PRICE_IDS } = require('../config/plans');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function appUrl() {
  return process.env.APP_URL
    || process.env.BASE_URL
    || 'https://dfymarketinggroup.com';
}

// ─────────────────────────────────────────────────────────────
// POST /api/stripe/create-checkout
// Original signup flow: receives name/email/password/priceId,
// creates the pending user, then creates a Stripe checkout session.
// ─────────────────────────────────────────────────────────────
router.post('/create-checkout', async (req, res) => {
  const { business_name, name, email, password, priceId, addons } = req.body;

  if (!name || !email || !password || !priceId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!VALID_PRICE_IDS.has(priceId)) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM clients WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const planName = PRICE_TO_PLAN[priceId] || 'Starter Presence';

    // No Stripe key configured — create active account and skip payment
    if (!process.env.STRIPE_SECRET_KEY) {
      await pool.query(`
        INSERT INTO clients (name, email, password, business_name, is_admin, status, subscription_status, stripe_price_id, plan)
        VALUES ($1, $2, $3, $4, false, 'active', 'active', $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [name, email.toLowerCase().trim(), hashedPassword, business_name || null, priceId, planName]);
      return res.json({ url: '/login' });
    }

    // Create pending user
    const insertResult = await pool.query(`
      INSERT INTO clients (name, email, password, business_name, is_admin, status, subscription_status, stripe_price_id, plan)
      VALUES ($1, $2, $3, $4, false, 'pending', 'inactive', $5, $6)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `, [name, email.toLowerCase().trim(), hashedPassword, business_name || null, priceId, planName]);

    const userId = insertResult.rows[0]?.id;
    const addonList = Array.isArray(addons) ? addons : [];
    const addonNames = addonList.map(a => a.name).join(', ');

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl()}/signup`,
      subscription_data: {
        metadata: {
          userId:   String(userId || ''),
          plan:     planName,
        }
      },
      metadata: {
        email:    email.toLowerCase().trim(),
        userId:   String(userId || ''),
        plan:     planName,
        addons:   addonNames.slice(0, 500),
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Could not create checkout session.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/stripe/create-checkout-session
// New 2-step flow: account already created, now create checkout.
// Receives: { userId, plan } where plan is the plan key string.
// ─────────────────────────────────────────────────────────────
router.post('/create-checkout-session', async (req, res) => {
  const { userId, plan } = req.body;

  if (!userId || !plan) {
    return res.status(400).json({ error: 'userId and plan are required.' });
  }

  const priceId = PLAN_KEY_TO_PRICE[plan];
  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan key.' });
  }

  try {
    const userResult = await pool.query(
      'SELECT id, name, email, stripe_customer_id FROM clients WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // No Stripe key — skip payment, mark active
    if (!process.env.STRIPE_SECRET_KEY) {
      const planName = PLAN_KEY_TO_NAME[plan] || 'Starter Presence';
      await pool.query(`
        UPDATE clients
        SET status = 'active', subscription_status = 'active', plan = $1, subscription_start_date = NOW()
        WHERE id = $2
      `, [planName, userId]);
      return res.json({ url: '/dashboard' });
    }

    const stripe = getStripe();

    // Create or reuse Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  user.name,
        metadata: { userId: String(userId) }
      });
      customerId = customer.id;
      await pool.query(
        'UPDATE clients SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, userId]
      );
    }

    const planName = PLAN_KEY_TO_NAME[plan] || 'Starter Presence';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl()}/signup`,
      subscription_data: {
        metadata: {
          userId: String(userId),
          plan:   planName,
        }
      },
      metadata: {
        userId: String(userId),
        plan:   planName,
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error('create-checkout-session error:', err);
    res.status(500).json({ error: 'Could not create checkout session.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/stripe/create-test-checkout   (admin only)
// Creates a REAL $1/month subscription checkout so you can run an
// actual card through the whole pipeline — Stripe → webhook →
// database → GHL tag → welcome email — without touching real plans
// or real clients. Cancel/refund the resulting subscription in
// Stripe afterward; it reuses the same test client row every run.
// ─────────────────────────────────────────────────────────────
router.post('/create-test-checkout', requireAdmin, async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ error: 'Stripe is not configured.' });
  }

  const testEmail = 'stripe-test@dfymarketinggroup.com';

  try {
    // Reuse the same test client row every time instead of piling up new ones
    const existing = await pool.query('SELECT id FROM clients WHERE email = $1', [testEmail]);
    let userId = existing.rows[0]?.id;

    if (!userId) {
      const randomPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);
      const insertResult = await pool.query(`
        INSERT INTO clients (name, email, password, is_admin, status, subscription_status, plan)
        VALUES ('Stripe Test', $1, $2, false, 'pending', 'inactive', 'Test Subscription')
        RETURNING id
      `, [testEmail, randomPassword]);
      userId = insertResult.rows[0].id;
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: testEmail,
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: 100, // $1.00 — a real charge, to confirm live-mode cards actually process
          recurring: { interval: 'month' },
          product_data: { name: 'DFY Portal — $1 Test Subscription' },
        },
        quantity: 1,
      }],
      success_url: `${appUrl()}/admin?test=success`,
      cancel_url:  `${appUrl()}/admin?test=cancelled`,
      subscription_data: {
        metadata: { userId: String(userId), plan: 'Test Subscription', isTest: 'true' },
      },
      metadata: {
        email:  testEmail,
        userId: String(userId),
        plan:   'Test Subscription',
        isTest: 'true',
      },
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error('create-test-checkout error:', err);
    res.status(500).json({ error: 'Could not create test checkout session.' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/stripe/webhook
// Stripe calls this after payment/subscription events.
// MUST use express.raw — not express.json.
// ─────────────────────────────────────────────────────────────
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // From here on, any failure returns 500 so Stripe retries the event for up to 3 days.
  // Every step below is safe to run twice (find-or-create, upserts, tags that are added
  // only once), so a retry or a duplicate delivery never creates duplicates.
  try {
    // ── checkout.session.completed ──────────────────────────
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object);
    }

    // ── customer.subscription.updated ──────────────────────
    else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;

      // Determine effective status
      let newStatus = subscription.status; // 'active', 'past_due', etc.
      if (subscription.pause_collection) {
        newStatus = 'paused';
      } else if (subscription.cancel_at_period_end) {
        newStatus = 'cancelling';
      }

      // Sync plan if the price changed (custom prices keep whatever plan name they have)
      const priceId  = subscription.items?.data?.[0]?.price?.id;
      const planName = priceId ? (PRICE_TO_PLAN[priceId] || null) : null;

      if (planName && priceId) {
        await pool.query(
          `UPDATE clients SET subscription_status = $1, plan = $2, stripe_price_id = $3 WHERE stripe_customer_id = $4`,
          [newStatus, planName, priceId, subscription.customer]
        );
      } else {
        await pool.query(
          `UPDATE clients SET subscription_status = $1 WHERE stripe_customer_id = $2`,
          [newStatus, subscription.customer]
        );
      }

      console.log(`🔄 Plan updated — customer: ${subscription.customer}, status: ${newStatus}${planName ? `, plan: ${planName}` : ''}`);
    }

    // ── customer.subscription.deleted ──────────────────────
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      await pool.query(
        `UPDATE clients SET subscription_status = 'cancelled', status = 'cancelled' WHERE stripe_customer_id = $1`,
        [subscription.customer]
      );
      console.log(`❌ Plan ended — customer: ${subscription.customer}`);
    }

    // ── invoice.payment_succeeded ───────────────────────────
    // Keeps the "next billing date" on the account page current.
    else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const periodEnd = invoice.lines?.data?.[0]?.period?.end || invoice.period_end;
      if (periodEnd) {
        // Match by Stripe customer, or by email — on a first payment this event can arrive
        // before the checkout event has linked the Stripe customer to the account.
        await pool.query(
          `UPDATE clients SET billing_date = to_timestamp($1)::date
           WHERE stripe_customer_id = $2 OR ($3::text IS NOT NULL AND email = lower($3::text))`,
          [periodEnd, invoice.customer, invoice.customer_email || null]
        );
      }
    }

    // ── invoice.payment_failed ──────────────────────────────
    else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      await pool.query(
        `UPDATE clients SET subscription_status = 'past_due' WHERE stripe_customer_id = $1`,
        [invoice.customer]
      );
      console.log(`⚠️  Payment failed — customer: ${invoice.customer}`);
    }

  } catch (err) {
    console.error(`Webhook error (${event.type}, ${event.id || 'no id'}):`, err.response?.data || err);
    return res.status(500).json({ error: 'Webhook processing failed — Stripe will retry.' });
  }

  res.json({ received: true });
});

// ─────────────────────────────────────────────────────────────
// A payment finished. Works for EVERY way someone can pay:
//   • the portal signup page (the account already exists, found by userId)
//   • a Stripe Payment Link / custom package (no account yet, so we create one)
//   • the admin $1 test button
// Steps: find or create the portal account → activate it → add the contact + new-client
// tag in GoHighLevel. GHL's own workflow handles the welcome email and everything after.
// ─────────────────────────────────────────────────────────────
async function handleCheckoutCompleted(session) {
  // One-time payments (not a recurring plan) don't create or activate a client
  if (session.mode && session.mode !== 'subscription') {
    console.log(`ℹ️  Skipping non-plan checkout (mode: ${session.mode})`);
    return;
  }

  const email = (session.metadata?.email || session.customer_details?.email || session.customer_email || '')
    .toLowerCase().trim();
  const userId = session.metadata?.userId ? parseInt(session.metadata.userId, 10) : null;

  if (!email && !userId) {
    throw new Error('Checkout has no email or userId — cannot tell who paid.');
  }

  // ── Work out the plan name ──
  let planName = session.metadata?.plan || null;
  let priceId  = null;

  if (!planName) {
    // Payment Links carry no metadata, so ask Stripe what was bought
    try {
      const full = await getStripe().checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price.product'],
      });
      const price = full.line_items?.data?.[0]?.price;
      priceId  = price?.id || null;
      planName = (priceId && PRICE_TO_PLAN[priceId]) || price?.product?.name || null;
    } catch (err) {
      console.warn('Could not look up what was purchased:', err.message);
    }
  }

  // ── Find the client (by id from signup, otherwise by email) ──
  const findBy = async (col, val) => {
    const r = await pool.query(
      `SELECT id, name, email, stripe_price_id FROM clients WHERE ${col} = $1`, [val]
    );
    return r.rows[0] || null;
  };

  let client = null;
  if (userId) client = await findBy('id', userId);
  if (!client && email) client = await findBy('email', email);

  // Signup-page clients saved their price when they signed up; use it if we still have no plan
  if (!planName && client?.stripe_price_id) planName = PRICE_TO_PLAN[client.stripe_price_id] || null;
  if (!planName) planName = 'Custom Plan';

  // ── No account yet (Payment Link / custom package) → create one ──
  if (!client) {
    const randomPassword = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10);
    const displayName = session.customer_details?.name || email.split('@')[0];
    const created = await pool.query(`
      INSERT INTO clients (name, email, password, is_admin, status, subscription_status, plan)
      VALUES ($1, $2, $3, false, 'active', 'active', $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email, stripe_price_id
    `, [displayName, email, randomPassword, planName]);
    // If a retry or duplicate delivery got there first, the insert is skipped — just find it
    client = created.rows[0] || await findBy('email', email);
    console.log(`🆕 Account created for payment-link customer: ${email}`);
  }

  // ── Activate ──
  await pool.query(`
    UPDATE clients
    SET
      status                   = 'active',
      subscription_status      = 'active',
      stripe_customer_id       = $1,
      stripe_subscription_id   = $2,
      subscription_start_date  = NOW(),
      plan                     = $3
    WHERE id = $4
    RETURNING id, name, stripe_price_id
  `, [session.customer, session.subscription, planName, client.id]);

  if (priceId) {
    await pool.query('UPDATE clients SET stripe_price_id = $1 WHERE id = $2', [priceId, client.id]);
  }

  console.log(`✅ Plan activated — plan: ${planName}, customer: ${session.customer}`);

  // ── GoHighLevel: contact + new-client tag ──
  // The account is already saved above, so a GHL problem never costs anyone their login.
  // We still fail the webhook so Stripe retries until the tag lands and the welcome
  // email can fire.
  if (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
    await upsertGHLContact({
      name:          client.name,
      email:         client.email || email,
      planName,
      stripePriceId: priceId || client.stripe_price_id,
      addons:        session.metadata?.addons || '',
    });
    console.log(`✅ GHL contact tagged new-client: ${client.email || email}`);
  } else {
    console.warn('GHL_API_KEY / GHL_LOCATION_ID not set — skipped GHL contact.');
  }
}

module.exports = router;
