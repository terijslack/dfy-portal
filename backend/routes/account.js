// routes/account.js — Account and subscription management
// GET  /api/account/subscription  → returns plan, billing_date for the logged-in client
// POST /api/account/change-plan   → upgrades/downgrades via Stripe API
// POST /api/account/pause-plan    → pauses billing via Stripe pause_collection
// POST /api/account/cancel-plan   → sets cancel_at_period_end: true via Stripe

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { requireLogin } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  'Starter Presence':  {
    price: 800,  posts: 8,  platforms: '1 platform',
    label: 'Starter Presence',
    priceId: process.env.STRIPE_PRICE_ONLINE_PRESENCE || 'price_1TTK4hJaMlIvd3H414Ffw3Hr',
  },
  'Growth Engine':     {
    price: 1500, posts: 16, platforms: '3 platforms',
    label: 'Growth Engine',
    priceId: process.env.STRIPE_PRICE_GROWTH_ENGINE || 'price_1TTK5DJaMlIvd3H4V0LeAYL7',
  },
  'Marketing Partner': {
    price: 2800, posts: 24, platforms: '3–4 platforms',
    label: 'Marketing Partner',
    priceId: process.env.STRIPE_PRICE_DFY_PARTNER || 'price_1TTK5jJaMlIvd3H4NFHH6hPl',
  },
};

// GET /api/account/subscription
router.get('/subscription', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT plan, billing_date, subscription_status, stripe_subscription_id FROM clients WHERE id = $1',
      [req.user.id]
    );

    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Account not found.' });

    const planKey  = row.plan || 'Starter Presence';
    const planInfo = PLANS[planKey] || PLANS['Starter Presence'];

    // Try to get cancel_at from Stripe if subscription is cancelling
    let cancel_at = null;
    if (row.subscription_status === 'cancelling' && row.stripe_subscription_id && process.env.STRIPE_SECRET_KEY) {
      try {
        const sub = await getStripe().subscriptions.retrieve(row.stripe_subscription_id);
        if (sub.cancel_at) cancel_at = new Date(sub.cancel_at * 1000).toISOString();
      } catch (_) {}
    }

    res.json({
      plan: planKey,
      price: planInfo.price,
      posts_per_month: planInfo.posts,
      platforms: planInfo.platforms,
      billing_date: row.billing_date,
      subscription_status: row.subscription_status,
      cancel_at,
      available_plans: Object.entries(PLANS).map(([key, val]) => ({
        key,
        label: val.label,
        price: val.price,
        posts: val.posts,
        platforms: val.platforms,
        current: key === planKey,
      })),
    });
  } catch (err) {
    console.error('Subscription fetch error:', err);
    res.status(500).json({ error: 'Could not load subscription.' });
  }
});

// PUT /api/account/profile
router.put('/profile', requireLogin, async (req, res) => {
  let { name, email, business_name } = req.body;
  name          = (name          || '').trim();
  email         = (email         || '').trim().toLowerCase();
  business_name = (business_name || '').trim();

  if (!name)  return res.status(400).json({ error: 'Name cannot be empty.' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const dupe = await pool.query(
      'SELECT id FROM clients WHERE email = $1 AND id != $2',
      [email, req.user.id]
    );
    if (dupe.rows.length > 0) {
      return res.status(409).json({ error: 'That email is already in use.' });
    }

    await pool.query(
      'UPDATE clients SET name = $1, email = $2, business_name = $3 WHERE id = $4',
      [name, email, business_name || null, req.user.id]
    );

    res.json({ success: true, name, email, business_name });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Could not save changes. Try again.' });
  }
});

// POST /api/account/change-plan
router.post('/change-plan', requireLogin, async (req, res) => {
  const { new_plan } = req.body;

  if (!new_plan || !PLANS[new_plan]) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  try {
    const clientResult = await pool.query(
      'SELECT name, email, plan, stripe_subscription_id FROM clients WHERE id = $1',
      [req.user.id]
    );
    const client = clientResult.rows[0];
    if (!client) return res.status(404).json({ error: 'Account not found.' });
    if (client.plan === new_plan) return res.status(400).json({ error: 'You are already on this plan.' });

    const newPlanInfo = PLANS[new_plan];

    // No Stripe key — just update DB directly (dev/test)
    if (!process.env.STRIPE_SECRET_KEY || !client.stripe_subscription_id) {
      await pool.query(
        'UPDATE clients SET plan = $1, stripe_price_id = $2 WHERE id = $3',
        [new_plan, newPlanInfo.priceId, req.user.id]
      );
      return res.json({
        success: true,
        new_plan,
        message: `Your plan has been updated to ${new_plan}.`,
      });
    }

    const stripe = getStripe();

    // Retrieve the subscription to get the current item ID
    const subscription = await stripe.subscriptions.retrieve(client.stripe_subscription_id);
    const itemId = subscription.items.data[0]?.id;
    if (!itemId) return res.status(500).json({ error: 'Could not find subscription item. Contact support.' });

    // Update the subscription with the new price and immediate proration
    await stripe.subscriptions.update(client.stripe_subscription_id, {
      items: [{ id: itemId, price: newPlanInfo.priceId }],
      proration_behavior: 'create_prorations',
      // Clear any pause or cancel that may have been set
      pause_collection: '',
      cancel_at_period_end: false,
    });

    // Update DB immediately
    await pool.query(
      'UPDATE clients SET plan = $1, stripe_price_id = $2, subscription_status = $3 WHERE id = $4',
      [new_plan, newPlanInfo.priceId, 'active', req.user.id]
    );

    console.log(`✅ Plan changed: ${client.name} (${client.email}) ${client.plan} → ${new_plan}`);
    res.json({
      success: true,
      new_plan,
      message: `Your plan has been updated to ${new_plan}.`,
    });
  } catch (err) {
    console.error('Plan change error:', err);
    res.status(500).json({ error: err.message || 'Could not change plan. Try again.' });
  }
});

// POST /api/account/pause-plan
router.post('/pause-plan', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, email, plan, stripe_subscription_id FROM clients WHERE id = $1',
      [req.user.id]
    );
    const client = result.rows[0];
    if (!client) return res.status(404).json({ error: 'Account not found.' });

    if (!process.env.STRIPE_SECRET_KEY || !client.stripe_subscription_id) {
      await pool.query(
        'UPDATE clients SET subscription_status = $1 WHERE id = $2',
        ['paused', req.user.id]
      );
      return res.json({
        success: true,
        message: `Your plan has been paused. Billing is on hold — you can resume anytime.`,
      });
    }

    await getStripe().subscriptions.update(client.stripe_subscription_id, {
      pause_collection: { behavior: 'mark_uncollectible' },
    });

    await pool.query(
      'UPDATE clients SET subscription_status = $1 WHERE id = $2',
      ['paused', req.user.id]
    );

    console.log(`⏸️  Plan paused: ${client.name} (${client.email})`);
    res.json({
      success: true,
      message: `Your plan has been paused. Billing is on hold — you can resume anytime from your account or by contacting us.`,
    });
  } catch (err) {
    console.error('Pause plan error:', err);
    res.status(500).json({ error: err.message || 'Could not pause plan. Try again.' });
  }
});

// POST /api/account/cancel-plan
router.post('/cancel-plan', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, email, plan, stripe_subscription_id FROM clients WHERE id = $1',
      [req.user.id]
    );
    const client = result.rows[0];
    if (!client) return res.status(404).json({ error: 'Account not found.' });

    if (!process.env.STRIPE_SECRET_KEY || !client.stripe_subscription_id) {
      await pool.query(
        'UPDATE clients SET subscription_status = $1 WHERE id = $2',
        ['cancelling', req.user.id]
      );
      return res.json({
        success: true,
        message: `Cancellation scheduled. You'll keep access until the end of your billing period.`,
      });
    }

    const subscription = await getStripe().subscriptions.update(client.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await pool.query(
      'UPDATE clients SET subscription_status = $1 WHERE id = $2',
      ['cancelling', req.user.id]
    );

    const cancelDate = subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'the end of your billing period';

    console.log(`❌ Cancellation scheduled: ${client.name} (${client.email}), ends ${cancelDate}`);
    res.json({
      success: true,
      message: `Cancellation scheduled. You'll keep full access until ${cancelDate}.`,
    });
  } catch (err) {
    console.error('Cancel plan error:', err);
    res.status(500).json({ error: err.message || 'Could not cancel plan. Try again.' });
  }
});

module.exports = router;
