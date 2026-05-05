// services/ghl.js — GoHighLevel CRM integration
// Creates a contact in the configured GHL location when a client activates.
// Credentials required: GHL_API_KEY, GHL_LOCATION_ID (set in Railway env).

const axios = require('axios');

const GHL_BASE = 'https://services.leadconnectorhq.com';

const GHL_HEADERS = () => ({
  Authorization: `Bearer ${process.env.GHL_API_KEY}`,
  'Content-Type': 'application/json',
  Version: '2021-07-28',
});

const PLAN_NAMES = {
  'price_1TTK4hJaMlIvd3H414Ffw3Hr': 'Starter Presence',
  'price_1TTK5DJaMlIvd3H4V0LeAYL7': 'Growth Engine',
  'price_1TTK5jJaMlIvd3H4NFHH6hPl': 'Marketing Partner',
};

// Splits "Jane Smith" → { firstName: "Jane", lastName: "Smith" }
function parseName(fullName = '') {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

// Creates a contact in GHL and optionally adds a note with add-on details.
async function createGHLContact({ name, email, stripePriceId, addons }) {
  const { firstName, lastName } = parseName(name);
  const planName = PLAN_NAMES[stripePriceId] || 'Unknown Plan';

  const contact = await axios.post(
    `${GHL_BASE}/contacts/`,
    {
      locationId: process.env.GHL_LOCATION_ID,
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      tags: ['new-client', planName],
      source: 'DFY Portal',
    },
    { headers: GHL_HEADERS() }
  );

  const contactId = contact.data?.contact?.id;

  // If add-ons were selected, attach them as a note so the team can see them
  if (contactId && addons) {
    await axios.post(
      `${GHL_BASE}/contacts/${contactId}/notes`,
      { body: `Add-ons selected at signup: ${addons}` },
      { headers: GHL_HEADERS() }
    );
  }

  return contact.data;
}

module.exports = { createGHLContact };
