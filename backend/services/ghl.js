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

// ─── Profile sync ────────────────────────────────────────────────────────────
// Upserts a GHL contact with full profile data after a client saves their profile.
// Silently skips if GHL_API_KEY or GHL_LOCATION_ID are not configured.

async function syncContactToGHL(client, profileData, socialAccounts) {
  const apiKey     = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return;

  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Version: '2021-07-28',
    };

    const handles = {};
    (socialAccounts || []).forEach(a => { handles[a.platform] = a.username; });

    const { firstName, lastName } = parseName(client.name || '');

    const payload = {
      locationId,
      firstName,
      lastName,
      email: client.email  || '',
      phone: profileData.phone || '',
      customField: [
        { key: 'business_name',     field_value: client.business_name        || '' },
        { key: 'industry',          field_value: profileData.industry         || '' },
        { key: 'website',           field_value: profileData.website          || '' },
        { key: 'business_location', field_value: profileData.location         || '' },
        { key: 'brand_voice',       field_value: profileData.brand_voice      || '' },
        { key: 'target_audience',   field_value: profileData.target_audience  || '' },
        { key: 'content_themes',    field_value: profileData.content_themes   || '' },
        { key: 'primary_goal',      field_value: profileData.primary_goal     || '' },
        { key: 'instagram_handle',  field_value: handles.instagram  || '' },
        { key: 'facebook_handle',   field_value: handles.facebook   || '' },
        { key: 'linkedin_handle',   field_value: handles.linkedin   || '' },
        { key: 'google_business',   field_value: handles.google     || '' },
      ],
    };

    // Try to find existing contact by email first
    const lookup = await axios.get(
      `${GHL_BASE}/contacts/search/duplicate?email=${encodeURIComponent(client.email)}&locationId=${locationId}`,
      { headers }
    );
    const existingId = lookup.data?.contact?.id;

    if (existingId) {
      await axios.put(`${GHL_BASE}/contacts/${existingId}`, payload, { headers });
    } else {
      await axios.post(`${GHL_BASE}/contacts/`, payload, { headers });
    }
  } catch (err) {
    console.error('[GHL syncContactToGHL error]', err.response?.data || err.message);
    // Never throw — GHL errors must not block profile saves
  }
}

module.exports = { createGHLContact, syncContactToGHL };
