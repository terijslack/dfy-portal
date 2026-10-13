// routes/planEnded.js — Supports the /plan-ended page for clients whose plan has ended.
// GET  /api/plan-ended          → name + previous plan for the logged-in client
// POST /api/plan-ended/restart  → starts a Stripe checkout so they can restart (same plan or a new one)
//
// These routes check the login cookie directly instead of using requireLogin,
// because requireLogin blocks clients whose plan has ended, and this is the one
// place those clients need to reach.

const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { Pool } = require('pg');
const { PLANS } = require('../config/plans');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY);

function appUrl() {
  return process.env.APP_URL || process.env.BASE_URL || 'https://dfymarketinggroup.com';
}

// Reads the login cookie. Does NOT check plan status.
function requireSession(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Please log in.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

// GET /api/plan-ended
router.get('/', requireSession, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, email, plan, status, subscription_status FROM clients WHERE id = $1',
      [req.user.id]
    );
    const row = result.rows[0];
    if (!row) return res.status(401).json({ error: 'Account not found.' });

    res.json({
      ended: row.subscription_status === 'cancelled',
      name:  row.name,
      plan:  row.plan || null,
    });
  } catch (err) {
    console.error('plan-ended lookup error:', err);
    res.status(500).json({ error: 'Could not load your account.' });
  }
});

// POST /api/plan-ended/restart   body: { plan: 'Growth Engine' }
router.post('/restart', requireSession, async (req, res) => {
  const planName = req.body?.plan;
  const plan = PLANS[planName];
  if (!plan) return res.status(400).json({ error: 'Please choose one of our plans.' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Checkout is not available right now. Please contact us.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, subscription_status, stripe_customer_id FROM clients WHERE id = $1',
      [req.user.id]
    );
    const client = result.rows[0];
    if (!client) return res.status(401).json({ error: 'Account not found.' });

    // Only clients whose plan has ended can restart here
    if (client.subscription_status !== 'cancelled') {
      return res.status(400).json({ error: 'Your plan is already active.' });
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      // Reuse their Stripe customer so their payment history stays together
      ...(client.stripe_customer_id
        ? { customer: client.stripe_customer_id }
        : { customer_email: client.email }),
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${appUrl()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl()}/plan-ended`,
      subscription_data: {
        metadata: { userId: String(client.id), plan: planName },
      },
      metadata: {
        email:  client.email,
        userId: String(client.id),
        plan:   planName,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('plan-ended restart error:', err);
    res.status(500).json({ error: 'Could not start checkout. Please try again or contact us.' });
  }
});

module.exports = router;
