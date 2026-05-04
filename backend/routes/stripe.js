// routes/stripe.js — Handles Stripe checkout and webhooks
// POST /api/stripe/create-checkout — creates a Stripe checkout session
// POST /api/stripe/webhook — Stripe calls this after payment succeeds

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const VALID_PRICE_IDS = new Set([
  'price_1TTK4hJaMlIvd3H414Ffw3Hr', // Starter Presence
  'price_1TTK5DJaMlIvd3H4V0LeAYL7', // Growth Engine
  'price_1TTK5jJaMlIvd3H4NFHH6hPl', // Marketing Partner
]);

// POST /api/stripe/create-checkout
// Creates a Stripe hosted checkout page for the selected plan
router.post('/create-checkout', async (req, res) => {
  const { name, email, password, priceId, addons } = req.body;

  if (!name || !email || !password || !priceId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!VALID_PRICE_IDS.has(priceId)) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  try {
    // Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM clients WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store pending signup in DB (status = 'pending' until payment succeeds)
    await pool.query(`
      INSERT INTO clients (name, email, password, is_admin, status, stripe_price_id)
      VALUES ($1, $2, $3, false, 'pending', $4)
      ON CONFLICT (email) DO NOTHING
    `, [name, email.toLowerCase().trim(), hashedPassword, priceId]);

    // Build add-ons metadata (Stripe values max 500 chars)
    const addonList = Array.isArray(addons) ? addons : [];
    const addonNames = addonList.map(a => a.name).join(', ');

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL}/signup-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/signup`,
      metadata: {
        email: email.toLowerCase().trim(),
        addons: addonNames.slice(0, 500)
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Could not create checkout session.' });
  }
});

// POST /api/stripe/webhook — Stripe calls this when payment succeeds
// This activates the client account
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.metadata?.email || session.customer_email;

    try {
      // Activate the client account
      await pool.query(`
        UPDATE clients 
        SET status = 'active', stripe_customer_id = $1
        WHERE email = $2
      `, [session.customer, email]);

      console.log(`✅ Client activated: ${email}`);
    } catch (err) {
      console.error('Webhook DB error:', err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
