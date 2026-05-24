// routes/stripe.js — Handles Stripe checkout and webhooks
// POST /api/stripe/create-checkout         — original flow: user data + priceId together
// POST /api/stripe/create-checkout-session — new flow: userId + plan key (account already created)
// POST /api/stripe/webhook                 — Stripe calls this for subscription events

const express = require('express');
const router = express.Router();
const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { createGHLContact } = require('../services/ghl');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Price ID → plan name mapping ─────────────────────────────
const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_ONLINE_PRESENCE]: 'Starter Presence',
  [process.env.STRIPE_PRICE_GROWTH_ENGINE]:   'Growth Engine',
  [process.env.STRIPE_PRICE_DFY_PARTNER]:     'Marketing Partner',
  // Hardcoded fallbacks (existing price IDs)
  'price_1TTK4hJaMlIvd3H414Ffw3Hr': 'Starter Presence',
  'price_1TTK5DJaMlIvd3H4V0LeAYL7': 'Growth Engine',
  'price_1TTK5jJaMlIvd3H4NFHH6hPl': 'Marketing Partner',
};

// Plan key (from spec) → price ID env var
const PLAN_KEY_TO_PRICE = {
  'online-presence':      process.env.STRIPE_PRICE_ONLINE_PRESENCE || 'price_1TTK4hJaMlIvd3H414Ffw3Hr',
  'growth-engine':        process.env.STRIPE_PRICE_GROWTH_ENGINE   || 'price_1TTK5DJaMlIvd3H4V0LeAYL7',
  'done-for-you-partner': process.env.STRIPE_PRICE_DFY_PARTNER     || 'price_1TTK5jJaMlIvd3H4NFHH6hPl',
};

const PLAN_KEY_TO_NAME = {
  'online-presence':      'Starter Presence',
  'growth-engine':        'Growth Engine',
  'done-for-you-partner': 'Marketing Partner',
};

const VALID_PRICE_IDS = new Set([
  'price_1TTK4hJaMlIvd3H414Ffw3Hr',
  'price_1TTK5DJaMlIvd3H4V0LeAYL7',
  'price_1TTK5jJaMlIvd3H4NFHH6hPl',
  ...(process.env.STRIPE_PRICE_ONLINE_PRESENCE ? [process.env.STRIPE_PRICE_ONLINE_PRESENCE] : []),
  ...(process.env.STRIPE_PRICE_GROWTH_ENGINE   ? [process.env.STRIPE_PRICE_GROWTH_ENGINE]   : []),
  ...(process.env.STRIPE_PRICE_DFY_PARTNER     ? [process.env.STRIPE_PRICE_DFY_PARTNER]     : []),
]);

function appUrl() {
  return process.env.APP_URL
    || process.env.BASE_URL
    || ('https://' + process.env.REPLIT_DEV_DOMAIN);
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

  try {
    // ── checkout.session.completed ──────────────────────────
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email   = session.metadata?.email || session.customer_email;
      const userId  = session.metadata?.userId ? parseInt(session.metadata.userId, 10) : null;

      // Resolve plan name: prefer metadata, fall back to DB stripe_price_id
      let planName = session.metadata?.plan || null;

      // Find the user (by userId if available, otherwise by email)
      let whereClause, whereParam;
      if (userId) {
        whereClause = 'id = $1';
        whereParam  = userId;
      } else {
        whereClause = 'email = $1';
        whereParam  = email;
      }

      // If plan not in metadata, look it up from stripe_price_id in DB
      if (!planName) {
        const lookup = await pool.query(
          `SELECT stripe_price_id FROM clients WHERE ${whereClause}`,
          [whereParam]
        );
        const priceId = lookup.rows[0]?.stripe_price_id;
        planName = PRICE_TO_PLAN[priceId] || 'Starter Presence';
      }

      const result = await pool.query(`
        UPDATE clients
        SET
          status                   = 'active',
          subscription_status      = 'active',
          stripe_customer_id       = $1,
          stripe_subscription_id   = $2,
          subscription_start_date  = NOW(),
          plan                     = $3
        WHERE ${whereClause}
        RETURNING id, name, stripe_price_id
      `, [session.customer, session.subscription, planName, whereParam]);

      const client = result.rows[0];
      console.log(`✅ Subscription activated — plan: ${planName}, customer: ${session.customer}`);

      // Create GHL contact (non-fatal)
      if (client && process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
        createGHLContact({
          name:          client.name,
          email,
          stripePriceId: client.stripe_price_id,
          addons:        session.metadata?.addons || '',
        }).then(() => {
          console.log(`✅ GHL contact created: ${email}`);
        }).catch(err => {
          console.error(`GHL contact creation failed:`, err.response?.data || err.message);
        });
      }
    }

    // ── customer.subscription.deleted ──────────────────────
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      await pool.query(
        `UPDATE clients SET subscription_status = 'cancelled' WHERE stripe_customer_id = $1`,
        [subscription.customer]
      );
      console.log(`❌ Subscription cancelled — customer: ${subscription.customer}`);
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
    console.error('Webhook DB error:', err);
  }

  res.json({ received: true });
});

module.exports = router;
