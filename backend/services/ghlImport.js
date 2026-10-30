// services/ghlImport.js — One-time move of contacts and deals out of GoHighLevel.
//
// The admin Contacts page reads GoHighLevel's export files (CSV) in the browser,
// lets you untick anything you don't want, and sends the rows here. Nothing talks
// to GoHighLevel directly. Running it again with the same files updates what's
// there instead of making duplicates (every record remembers its GoHighLevel id).

const { STAGES } = require('../config/pipeline');
const { pool, clean, logActivity, syncAll, stageLabel } = require('./crm');

const digits = p => (p || '').replace(/\D/g, '').slice(-10);
// "+15302315443" → "(530) 231-5443"; anything that isn't a US number is left as-is
function prettyPhone(p) {
  p = clean(p);
  if (!p) return null;
  const d = p.replace(/\D/g, '');
  const ten = d.length === 11 && d[0] === '1' ? d.slice(1) : d;
  return ten.length === 10 ? `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}` : p;
}
const squash = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function toDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toMoney(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(String(v).replace(/[$,\s]/g, ''));
  return Number.isFinite(n) ? n : null;
}

// GoHighLevel stage name + status → our stage key
function mapStage(stageName, status) {
  const st = squash(status);
  if (st === 'won') return 'won';
  if (st === 'lost' || st === 'abandoned') return 'lost';
  const name = squash(stageName);
  const hit = STAGES.find(s => squash(s.label) === name || s.key === name);
  if (hit && !hit.closed) return hit.key;
  if (name.includes('proposal')) return 'proposal';
  if (name.includes('negotia')) return 'negotiation';
  if (name.includes('qualif')) return 'qualified';
  if (name.includes('contact')) return 'contacted';
  if (name.includes('closed') || name.includes('won')) return 'won';
  return 'new';
}

// Find the contact this GoHighLevel row belongs to
async function findContact(db, { ghl_id, email, phone, company }) {
  let r;
  if (ghl_id) {
    r = await db.query('SELECT * FROM contacts WHERE ghl_id = $1', [ghl_id]);
    if (r.rows[0]) return r.rows[0];
  }
  if (email) {
    r = await db.query('SELECT * FROM contacts WHERE LOWER(email) = LOWER($1)', [email]);
    if (r.rows[0]) return r.rows[0];
  }
  if (digits(phone).length === 10) {
    r = await db.query(`SELECT * FROM contacts WHERE RIGHT(REGEXP_REPLACE(COALESCE(phone,''), '\\D', '', 'g'), 10) = $1`, [digits(phone)]);
    if (r.rows[0]) return r.rows[0];
  }
  // A client whose portal email differs from GoHighLevel: match on business name
  return findClientByBusiness(db, company);
}

async function findClientByBusiness(db, business) {
  if (squash(business).length < 4) return null;
  const r = await db.query(
    `SELECT * FROM contacts WHERE client_id IS NOT NULL
       AND REGEXP_REPLACE(LOWER(COALESCE(company,'')), '[^a-z0-9]', '', 'g') = $1`,
    [squash(business)]
  );
  return r.rows.length === 1 ? r.rows[0] : null;
}

async function saveContact(db, row, summary) {
  const name = clean(row.name) || [clean(row.first_name), clean(row.last_name)].filter(Boolean).join(' ') ||
               clean(row.company) || clean(row.email) || 'Unknown';
  const email = clean(row.email)?.toLowerCase() || null;
  const phone = prettyPhone(row.phone);
  const company = clean(row.company);
  const created = toDate(row.created_at);
  const ghlId = clean(row.ghl_id);

  const existing = await findContact(db, { ghl_id: ghlId, email, phone, company });
  let id;
  if (existing) {
    id = existing.id;
    // Fill in blanks only. A client's name/email/business always come from their portal account.
    await db.query(
      `UPDATE contacts SET
         phone   = COALESCE(phone, $2),
         company = COALESCE(company, $3),
         email   = CASE WHEN client_id IS NULL THEN COALESCE(email, $4) ELSE email END,
         tags    = COALESCE($5, tags),
         source  = COALESCE(source, $6),
         ghl_id  = COALESCE(ghl_id, $7),
         updated_at = NOW()
       WHERE id = $1`,
      [id, phone, company, email, clean(row.tags), clean(row.source) || 'GoHighLevel', ghlId]
    );
    summary.contacts_updated++;
  } else {
    if (email) {
      const taken = await db.query('SELECT 1 FROM contacts WHERE LOWER(email) = $1', [email]);
      if (taken.rows.length) throw new Error(`Email ${email} is already used by another contact.`);
    }
    const ins = await db.query(
      `INSERT INTO contacts (name, email, phone, company, source, tags, ghl_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, NOW())) RETURNING id`,
      [name, email, phone, company, clean(row.source) || 'GoHighLevel', clean(row.tags), ghlId, created]
    );
    id = ins.rows[0].id;
    summary.contacts_added++;
  }

  const ref = ghlId ? `ghl:contact:${ghlId}` : null;
  const note = `Imported from GoHighLevel${clean(row.tags) ? ` · tags: ${clean(row.tags)}` : ''}`;
  if (await logActivity(db, id, 'system', note, ref) && ref && created) {
    await db.query('UPDATE contact_activity SET created_at = $2 WHERE ref = $1', [ref, created]);
  }
  return id;
}

async function saveOpportunity(db, row, contactIdsByGhl, summary) {
  const ghlId = clean(row.ghl_id);
  const stage = mapStage(row.stage, row.status);
  const closed = STAGES.find(s => s.key === stage).closed;
  const created = toDate(row.created_at);
  const changed = toDate(row.updated_at) || created;
  const value = toMoney(row.value);
  const title = clean(row.title) || clean(row.contact_name) || 'GoHighLevel deal';

  // Which contact? A deal named after a client's business belongs to that client,
  // even if GoHighLevel filed it under a different person (e.g. the owner).
  let contactId = null;
  const clientMatch = await findClientByBusiness(db, row.company || row.title);
  if (clientMatch) {
    contactId = clientMatch.id;
    const person = row.contact_ghl_id ? contactIdsByGhl.get(row.contact_ghl_id) : null;
    if (person && person !== contactId) {
      // Keep the person, and show which business they're with
      await db.query('UPDATE contacts SET company = COALESCE(company, $2) WHERE id = $1', [person, clientMatch.company]);
      await logActivity(db, person, 'system', `Contact for ${clientMatch.company} (deal “${title}” is on the client's record)`,
        ghlId ? `ghl:opp-person:${ghlId}` : null);
    }
  }
  if (!contactId && row.contact_ghl_id) contactId = contactIdsByGhl.get(row.contact_ghl_id) || null;
  if (!contactId) {
    const found = await findContact(db, {
      ghl_id: clean(row.contact_ghl_id), email: clean(row.email), phone: clean(row.phone), company: clean(row.company),
    });
    contactId = found && found.id;
  }
  if (!contactId) {
    contactId = await saveContact(db, {
      ghl_id: row.contact_ghl_id, name: row.contact_name, email: row.email, phone: row.phone,
      company: row.company, source: row.source, created_at: row.created_at,
    }, summary);
  }

  // Already imported before? Update it with the latest from the file.
  let target = ghlId ? (await db.query('SELECT id FROM opportunities WHERE ghl_id = $1', [ghlId])).rows[0] : null;
  // A paying client already has a deal made from their portal signup: fold this into it
  if (!target) {
    target = (await db.query(
      `SELECT id FROM opportunities WHERE contact_id = $1 AND origin = 'portal' AND ghl_id IS NULL
       ORDER BY created_at LIMIT 1`, [contactId]
    )).rows[0];
  }

  if (target) {
    await db.query(
      `UPDATE opportunities SET title = $2, value = COALESCE($3, value), stage = $4, source = COALESCE($5, source),
         notes = COALESCE($6, notes), lost_reason = COALESCE($7, lost_reason), ghl_id = COALESCE(ghl_id, $8),
         created_at = LEAST(created_at, COALESCE($9, created_at)),
         stage_changed_at = CASE WHEN stage = $4 THEN stage_changed_at ELSE COALESCE($10, NOW()) END,
         closed_at = CASE WHEN $11 THEN LEAST(COALESCE(closed_at, $10, NOW()), COALESCE($10, closed_at, NOW())) ELSE NULL END,
         updated_at = NOW()
       WHERE id = $1`,
      [target.id, title, value, stage, clean(row.source), clean(row.notes), clean(row.lost_reason), ghlId,
       created, changed, closed]
    );
    summary.deals_updated++;
  } else {
    await db.query(
      `INSERT INTO opportunities (contact_id, title, value, stage, source, notes, lost_reason, origin, ghl_id,
                                  created_at, stage_changed_at, closed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'ghl', $8, COALESCE($9, NOW()), COALESCE($10, NOW()), $11)`,
      [contactId, title, value, stage, clean(row.source), clean(row.notes), clean(row.lost_reason), ghlId,
       created, changed, closed ? (changed || new Date()) : null]
    );
    summary.deals_added++;
  }

  const ref = ghlId ? `ghl:opp:${ghlId}` : null;
  await logActivity(db, contactId, 'stage',
    `Imported deal “${title}” from GoHighLevel — ${stageLabel(stage)}${value ? ` · $${value.toLocaleString('en-US')}` : ''}`, ref);
}

async function importFromGhl({ contacts = [], opportunities = [] }) {
  if (!Array.isArray(contacts) || !Array.isArray(opportunities)) throw new Error('Nothing to import.');
  if (contacts.length + opportunities.length > 5000) throw new Error('That is more than 5,000 rows — split it up.');

  // Make sure every portal client already has a contact, so GoHighLevel rows join them
  await syncAll();

  const summary = { contacts_added: 0, contacts_updated: 0, deals_added: 0, deals_updated: 0 };
  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const contactIdsByGhl = new Map();
    for (const c of contacts) {
      const id = await saveContact(db, c, summary);
      if (c.ghl_id) contactIdsByGhl.set(c.ghl_id, id);
    }
    for (const o of opportunities) await saveOpportunity(db, o, contactIdsByGhl, summary);
    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    db.release();
  }
  return summary;
}

module.exports = { importFromGhl, mapStage };
