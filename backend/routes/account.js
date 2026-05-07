// routes/account.js — Account and subscription management
// GET  /api/account/subscription  → returns plan, billing_date for the logged-in client
// POST /api/account/change-plan   → submits a plan change request (notifies admin)

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { requireLogin } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const PLANS = {
  'Starter Presence':  { price: 800,  posts: 8,  platforms: '1 platform',    label: 'Starter Presence'  },
  'Growth Engine':     { price: 1500, posts: 16, platforms: '3 platforms',   label: 'Growth Engine'     },
  'Marketing Partner': { price: 2800, posts: 24, platforms: '3–4 platforms', label: 'Marketing Partner' },
};

// GET /api/account/subscription
router.get('/subscription', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT plan, billing_date FROM clients WHERE id = $1',
      [req.user.id]
    );

    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: 'Account not found.' });

    const planKey = row.plan || 'Starter Presence';
    const planInfo = PLANS[planKey] || PLANS['Starter Presence'];

    res.json({
      plan: planKey,
      price: planInfo.price,
      posts_per_month: planInfo.posts,
      platforms: planInfo.platforms,
      billing_date: row.billing_date,
      available_plans: Object.entries(PLANS).map(([key, val]) => ({
        key,
        label: val.label,
        price: val.price,
        posts: val.posts,
        platforms: val.platforms,
        current: key === planKey
      }))
    });
  } catch (err) {
    console.error('Subscription fetch error:', err);
    res.status(500).json({ error: 'Could not load subscription.' });
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
      'SELECT name, email, plan FROM clients WHERE id = $1',
      [req.user.id]
    );

    const client = clientResult.rows[0];
    if (!client) return res.status(404).json({ error: 'Account not found.' });

    if (client.plan === new_plan) {
      return res.status(400).json({ error: 'You are already on this plan.' });
    }

    console.log(`📋 PLAN CHANGE REQUEST from ${client.name} (${client.email}): ${client.plan} → ${new_plan}`);

    res.json({
      success: true,
      message: `Your request to switch to the ${new_plan} plan has been received. We'll be in touch within 1 business day to confirm the change.`
    });
  } catch (err) {
    console.error('Plan change error:', err);
    res.status(500).json({ error: 'Could not submit request. Try again.' });
  }
});

module.exports = router;
