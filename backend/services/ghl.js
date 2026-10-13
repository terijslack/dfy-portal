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

// Standard plans get their own tag; anything else (custom deals) is tagged "Custom Plan"
// so GHL doesn't end up with a one-off tag for every custom client.
const STANDARD_PLAN_TAGS = new Set(Object.values(PLAN_NAMES));
function planTag(planName) {
  return STANDARD_PLAN_TAGS.has(planName) ? planName : 'Custom Plan';
}

// Creates the contact in GHL, or updates it if that email is already there (many clients
// start as leads), then ADDS the new-client + plan tags. GHL's own workflow takes it from
// there (welcome email, sub-account setup, etc.).
// Safe to run more than once for the same client: upsert never duplicates a contact, and
// adding a tag that's already present changes nothing.
async function upsertGHLContact({ name, email, planName, stripePriceId, addons }) {
  const { firstName, lastName } = parseName(name);
  const plan = planName || PLAN_NAMES[stripePriceId] || 'Custom Plan';
  const opts = { headers: GHL_HEADERS(), timeout: 10000 };

  const upsert = await axios.post(
    `${GHL_BASE}/contacts/upsert`,
    {
      locationId: process.env.GHL_LOCATION_ID,
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      source: 'DFY Portal',
    },
    opts
  );

  const contactId = upsert.data?.contact?.id;
  if (!contactId) throw new Error('GHL did not return a contact id');

  // Tags are added (not replaced), so any tags the contact already has are kept
  await axios.post(
    `${GHL_BASE}/contacts/${contactId}/tags`,
    { tags: ['new-client', planTag(plan)] },
    opts
  );

  // If add-ons were selected, attach them as a note so the team can see them
  if (addons) {
    await axios.post(
      `${GHL_BASE}/contacts/${contactId}/notes`,
      { body: `Add-ons selected at signup: ${addons}` },
      opts
    );
  }

  return upsert.data;
}


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
        { key: 'social_notes',      field_value: profileData.social_notes     || '' },
        { key: 'additional_notes',  field_value: profileData.additional_notes || '' },
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

module.exports = { upsertGHLContact, createGHLContact: upsertGHLContact, syncContactToGHL, planTag };
