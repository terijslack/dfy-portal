// config/accounts.js — How an account's plan and status are shown in the admin.

const { PLANS } = require('./plans');

// Plan name → the short tier shown on the Accounts page
const TIERS = {
  'Starter Presence': 'Starter',
  'Growth Engine': 'Growth',
  'Marketing Partner': 'Partner',
};
const planTier = plan => (plan ? (TIERS[plan] || 'Custom') : '');

// Status follows billing. Active = currently being billed (including a payment
// that's late, or a cancellation that hasn't taken effect yet).
const ACTIVE_BILLING = ['active', 'past_due', 'cancelling'];
const BILLING_NOTE = {
  past_due: 'payment late',
  cancelling: 'cancels at period end',
  paused: 'paused',
  cancelled: 'cancelled',
  pending: 'hasn\'t paid yet',
};
function accountStatus(client) {
  const billing = client.status === 'pending' ? 'pending' : (client.subscription_status || 'inactive');
  return {
    status: ACTIVE_BILLING.includes(billing) ? 'Active' : 'Inactive',
    status_note: BILLING_NOTE[billing] || '',
  };
}

const PRIORITIES = ['high', 'medium', 'low'];

module.exports = { planTier, accountStatus, PRIORITIES, PLANS };
