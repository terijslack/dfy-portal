// services/crm.js — Contacts and pipeline helpers shared by the admin pages
// and the public forms. Everything a person sends us (contact form, signup)
// ends up as a contact here, with a timeline entry, so the admin portal is the
// one place to see it.

const { Pool } = require('pg');
const { PLANS } = require('../config/plans');
const { OPEN_STAGE_KEYS, stageLabel } = require('../config/pipeline');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const clean = v => (typeof v === 'string' ? (v.trim() || null) : (v ?? null));
const planValue = plan => (PLANS[plan] ? PLANS[plan].price : null);

// Add a timeline entry. With a ref, the same entry is never added twice.
async function logActivity(db, contactId, type, body, ref = null) {
  const r = await db.query(
    `INSERT INTO contact_activity (contact_id, type, body, ref)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (ref) WHERE ref IS NOT NULL DO NOTHING
     RETURNING id`,
    [contactId, type, body, ref]
  );
  return r.rows.length > 0; // false = this ref was already logged
}

// Find a contact by email (or client), or create one. Fills in blanks on an
// existing contact but never overwrites something already there.
async function upsertContact(db, { name, email, phone, company, source, client_id }) {
  email = clean(email)?.toLowerCase() || null;
  let row = null;
  if (client_id) {
    row = (await db.query('SELECT * FROM contacts WHERE client_id = $1', [client_id])).rows[0];
  }
  if (!row && email) {
    row = (await db.query('SELECT * FROM contacts WHERE LOWER(email) = $1', [email])).rows[0];
  }
  if (row) {
    await db.query(
      `UPDATE contacts SET
         email     = COALESCE(email, $2),
         phone     = COALESCE(phone, $3),
         company   = COALESCE(company, $4),
         client_id = COALESCE(client_id, $5)
       WHERE id = $1`,
      [row.id, email, clean(phone), clean(company), client_id || null]
    );
    return { id: row.id, created: false };
  }
  const ins = await db.query(
    `INSERT INTO contacts (name, email, phone, company, source, client_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [clean(name) || email || 'Unknown', email, clean(phone), clean(company), clean(source), client_id || null]
  );
  return { id: ins.rows[0].id, created: true };
}

// A message from the website contact form → contact + timeline + new deal
async function addInquiryLead(inquiry) {
  const { id, name, email, message, created_at } = inquiry;
  const contact = await upsertContact(pool, { name, email, source: 'Website contact form' });
  const fresh = await logActivity(pool, contact.id, 'form',
    `Contact form: ${message}`, id ? `inquiry:${id}` : null);
  if (!fresh) return contact.id;
  if (created_at) {
    await pool.query(`UPDATE contact_activity SET created_at = $2 WHERE ref = $1`, [`inquiry:${id}`, created_at]);
  }
  const open = await pool.query(
    'SELECT id FROM opportunities WHERE contact_id = $1 AND stage = ANY($2)',
    [contact.id, OPEN_STAGE_KEYS]
  );
  if (!open.rows.length) {
    await pool.query(
      `INSERT INTO opportunities (contact_id, title, stage, created_at, stage_changed_at)
       VALUES ($1, $2, 'new', COALESCE($3, NOW()), COALESCE($3, NOW()))`,
      [contact.id, `${clean(name) || email} — website inquiry`, created_at || null]
    );
  }
  return contact.id;
}

// Bring the contacts list up to date with the clients table and any contact
// form messages that came in before contacts existed. Safe to run any time.
let syncing = null;
function syncAll() {
  // If a sync is already running, wait for that one instead of starting another
  if (!syncing) syncing = runSync().finally(() => { syncing = null; });
  return syncing;
}

async function runSync() {
  const clients = (await pool.query(
    `SELECT id, name, email, business_name, plan, status, subscription_status, subscription_start_date, created_at
     FROM clients WHERE is_admin = false`
  )).rows;

  for (const c of clients) {
    const contact = await upsertContact(pool, {
      name: c.name, email: c.email, company: c.business_name, source: 'Portal signup', client_id: c.id,
    });
    // The client account is the source of truth for a client's name, email and business
    await pool.query(
      `UPDATE contacts SET name = $2, email = LOWER($3), company = $4, updated_at = NOW()
       WHERE id = $1 AND (name IS DISTINCT FROM $2 OR email IS DISTINCT FROM LOWER($3) OR company IS DISTINCT FROM $4)`,
      [contact.id, c.name, c.email, c.business_name]
    ).catch(err => console.error('CRM: could not copy client details to contact', c.id, err.message));
    await logActivity(pool, contact.id, 'signup', `Created a portal account${c.plan ? ` (${c.plan})` : ''}`, `signup:client:${c.id}`);
    if (contact.created) {
      await pool.query('UPDATE contact_activity SET created_at = $2 WHERE ref = $1', [`signup:client:${c.id}`, c.created_at]);
    }

    const isPaying = c.status === 'active' && c.subscription_status !== 'cancelled';
    const opps = (await pool.query('SELECT id, stage FROM opportunities WHERE contact_id = $1', [contact.id])).rows;

    if (!opps.length) {
      const stage = isPaying ? 'won' : 'checkout';
      await pool.query(
        `INSERT INTO opportunities (contact_id, title, value, stage, plan, created_at, stage_changed_at, closed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $6, $7)`,
        [contact.id, `${c.business_name || c.name}${c.plan ? ` — ${c.plan}` : ''}`, planValue(c.plan),
         stage, c.plan, c.created_at, stage === 'won' ? c.created_at : null]
      );
      if (isPaying && await logActivity(pool, contact.id, 'stage', 'Became a paying client', `won:client:${c.id}`)) {
        await pool.query('UPDATE contact_activity SET created_at = $2 WHERE ref = $1',
          [`won:client:${c.id}`, c.subscription_start_date || c.created_at]);
      }
    } else if (!isPaying && c.status === 'pending') {
      // A lead who has now started checkout: move their open deal forward (once)
      const open = opps.find(o => ['new', 'contacted', 'call_booked', 'proposal'].includes(o.stage));
      if (open && await logActivity(pool, contact.id, 'stage', 'Started checkout on the website', `checkout:client:${c.id}`)) {
        await pool.query(
          `UPDATE opportunities SET stage = 'checkout', stage_changed_at = NOW(), updated_at = NOW(),
             plan = COALESCE(plan, $2), value = COALESCE(value, $3)
           WHERE id = $1`,
          [open.id, c.plan, planValue(c.plan)]
        );
      }
    } else if (isPaying) {
      // First time we see them paying: close their open deal as won (only once,
      // so moving it somewhere else by hand later sticks)
      const open = opps.find(o => OPEN_STAGE_KEYS.includes(o.stage));
      if (open && await logActivity(pool, contact.id, 'stage', 'Became a paying client', `won:client:${c.id}`)) {
        await pool.query(
          `UPDATE opportunities SET stage = 'won', stage_changed_at = NOW(), closed_at = NOW(), updated_at = NOW(),
             plan = COALESCE(plan, $2), value = COALESCE(value, $3)
           WHERE id = $1`,
          [open.id, c.plan, planValue(c.plan)]
        );
      }
    }
  }

  // Older contact-form messages
  try {
    const inquiries = (await pool.query(
      `SELECT ci.* FROM contact_inquiries ci
       WHERE NOT EXISTS (SELECT 1 FROM contact_activity a WHERE a.ref = 'inquiry:' || ci.id)
       ORDER BY ci.created_at ASC`
    )).rows;
    for (const q of inquiries) await addInquiryLead(q);
  } catch (err) {
    if (err.code !== '42P01') throw err; // 42P01 = table doesn't exist yet; nothing to import
  }
}

module.exports = { pool, clean, planValue, logActivity, upsertContact, addInquiryLead, syncAll, stageLabel };
