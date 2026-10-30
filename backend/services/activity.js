// services/activity.js — Adds an entry to a client account's timeline.
// Used for everything a client does in their portal and everything we do for them,
// so the account page is a complete history no matter which tools are behind it.

const { pool, upsertContact, logActivity } = require('./crm');

// The contact that represents a client's portal login (created if missing)
async function loginContactId(clientId) {
  const found = await pool.query('SELECT id FROM contacts WHERE client_id = $1', [clientId]);
  if (found.rows[0]) return found.rows[0].id;
  const c = (await pool.query('SELECT name, email, business_name FROM clients WHERE id = $1', [clientId])).rows[0];
  if (!c) return null;
  const made = await upsertContact(pool, {
    name: c.name, email: c.email, company: c.business_name, source: 'Portal signup', client_id: clientId,
  });
  return made.id;
}

// type: 'client' = something the client did · 'dfy' = something we did for them
async function logForClient(clientId, type, body, ref = null) {
  const contactId = await loginContactId(clientId);
  if (!contactId || !body) return;
  await logActivity(pool, contactId, type, body, ref);
}

module.exports = { logForClient, loginContactId };
