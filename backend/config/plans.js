// config/plans.js — Single source of truth for plan definitions and Stripe price IDs
//
// Hardcoded fallback price IDs are the live Stripe price IDs.
// To use different IDs, set the corresponding environment variables:
//   STRIPE_PRICE_ONLINE_PRESENCE, STRIPE_PRICE_GROWTH_ENGINE, STRIPE_PRICE_DFY_PARTNER

const PRICE_ID = {
  ONLINE_PRESENCE: process.env.STRIPE_PRICE_ONLINE_PRESENCE || 'price_1TTK4hJaMlIvd3H414Ffw3Hr',
  GROWTH_ENGINE:   process.env.STRIPE_PRICE_GROWTH_ENGINE   || 'price_1TTK5DJaMlIvd3H4V0LeAYL7',
  DFY_PARTNER:     process.env.STRIPE_PRICE_DFY_PARTNER     || 'price_1TTK5jJaMlIvd3H4NFHH6hPl',
};

// Plan name → plan details (used in account.js / subscription UI)
const PLANS = {
  'Starter Presence': {
    price:     800,
    posts:     8,
    platforms: '1 platform',
    label:     'Starter Presence',
    priceId:   PRICE_ID.ONLINE_PRESENCE,
  },
  'Growth Engine': {
    price:     1500,
    posts:     16,
    platforms: '3 platforms',
    label:     'Growth Engine',
    priceId:   PRICE_ID.GROWTH_ENGINE,
  },
  'Marketing Partner': {
    price:     2800,
    posts:     24,
    platforms: '3–4 platforms',
    label:     'Marketing Partner',
    priceId:   PRICE_ID.DFY_PARTNER,
  },
};

// Plan key (URL-safe slug) → price ID (used in stripe.js checkout flows)
const PLAN_KEY_TO_PRICE = {
  'online-presence':      PRICE_ID.ONLINE_PRESENCE,
  'growth-engine':        PRICE_ID.GROWTH_ENGINE,
  'done-for-you-partner': PRICE_ID.DFY_PARTNER,
};

// Plan key → display name
const PLAN_KEY_TO_NAME = {
  'online-presence':      'Starter Presence',
  'growth-engine':        'Growth Engine',
  'done-for-you-partner': 'Marketing Partner',
};

// Price ID → plan name (used in webhook / subscription.updated handlers)
const PRICE_TO_PLAN = {
  [PRICE_ID.ONLINE_PRESENCE]: 'Starter Presence',
  [PRICE_ID.GROWTH_ENGINE]:   'Growth Engine',
  [PRICE_ID.DFY_PARTNER]:     'Marketing Partner',
};

// Set of all valid price IDs for input validation
const VALID_PRICE_IDS = new Set(Object.values(PRICE_ID));

module.exports = {
  PLANS,
  PLAN_KEY_TO_PRICE,
  PLAN_KEY_TO_NAME,
  PRICE_TO_PLAN,
  VALID_PRICE_IDS,
};
