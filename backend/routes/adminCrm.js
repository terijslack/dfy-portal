// routes/adminCrm.js — Contacts and sales pipeline (admin only)
// GET    /api/admin/contacts               → everyone: leads and clients (?q= search, ?type=lead|client)
// POST   /api/admin/contacts               → add a contact by hand (optionally with a new deal)
// GET    /api/admin/contacts/:id           → one contact: details, timeline, deals, client account
// PUT    /api/admin/contacts/:id           → edit a contact
// DELETE /api/admin/contacts/:id           → delete a lead (clients can't be deleted here)
// POST   /api/admin/contacts/:id/notes     → add a note to the timeline
// GET    /api/admin/pipeline               → stages and every deal
// POST   /api/admin/opportunities          → add a deal
// PUT    /api/admin/opportunities/:id      → edit a deal or move it to another stage
// DELETE /api/admin/opportunities/:id      → delete a deal

const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { STAGES, STAGE_KEYS } = require('../config/pipeline');
const { pool, clean, logActivity, syncAll, stageLabel } = require('../services/crm');

const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const toMoney = v => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(String(v).replace(/[$,\s]/g, ''));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : NaN;
};
const idParam = req => parseInt(req.params.id, 10) || null;

// Keep contacts in step with client accounts before showing anything.
// If the sync hits a problem, still show what we have.
async function synced(req, res, next) {
  try { await syncAll(); } catch (err) { console.error('CRM sync error:', err.message); }
  next();
}

// ─── CONTACTS ────────────────────────────────────────────────

router.get('/contacts', requireAdmin, synced, async (req, res) => {
  const q = clean(req.query.q);
  const type = req.query.type;
  const where = [];
  const params = [];
  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    where.push(`(LOWER(c.name) LIKE $${params.length} OR LOWER(COALESCE(c.email,'')) LIKE $${params.length}
                 OR LOWER(COALESCE(c.company,'')) LIKE $${params.length} OR COALESCE(c.phone,'') LIKE $${params.length})`);
  }
  if (type === 'client') where.push('c.client_id IS NOT NULL');
  if (type === 'lead') where.push('c.client_id IS NULL');

  try {
    const result = await pool.query(`
      SELECT c.id, c.name, c.email, c.phone, c.company, c.source, c.client_id, c.created_at,
             cl.plan AS client_plan, cl.status AS client_status, cl.subscription_status AS client_subscription,
             (SELECT o.stage FROM opportunities o WHERE o.contact_id = c.id ORDER BY o.updated_at DESC LIMIT 1) AS stage,
             (SELECT MAX(a.created_at) FROM contact_activity a WHERE a.contact_id = c.id) AS last_activity
      FROM contacts c
      LEFT JOIN clients cl ON cl.id = c.client_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY COALESCE((SELECT MAX(a.created_at) FROM contact_activity a WHERE a.contact_id = c.id), c.created_at) DESC
    `, params);
    res.json({ contacts: result.rows, stages: STAGES });
  } catch (err) {
    console.error('Admin contacts list error:', err);
    res.status(500).json({ error: 'Could not load contacts.' });
  }
});

router.post('/contacts', requireAdmin, async (req, res) => {
  const b = req.body || {};
  const name = clean(b.name);
  const email = clean(b.email)?.toLowerCase() || null;
  if (!name) return res.status(400).json({ error: 'Name is required.' });
  if (email && !isEmail(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  const value = toMoney(b.value);
  if (Number.isNaN(value)) return res.status(400).json({ error: 'Deal value must be a number.' });
  const stage = b.stage || 'new';
  if (!STAGE_KEYS.includes(stage)) return res.status(400).json({ error: 'Unknown stage.' });

  const db = await pool.connect();
  try {
    if (email) {
      const dupe = await db.query('SELECT id FROM contacts WHERE LOWER(email) = $1', [email]);
      if (dupe.rows.length) return res.status(409).json({ error: 'A contact with that email already exists.', id: dupe.rows[0].id });
    }
    await db.query('BEGIN');
    const ins = await db.query(
      `INSERT INTO contacts (name, email, phone, company, source, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, email, clean(b.phone), clean(b.company), clean(b.source) || 'Added by admin', clean(b.notes)]
    );
    const id = ins.rows[0].id;
    await logActivity(db, id, 'system', 'Contact added');
    if (b.create_opportunity) {
      await db.query(
        `INSERT INTO opportunities (contact_id, title, value, stage, closed_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, clean(b.title) || `${clean(b.company) || name} — new deal`, value, stage,
         STAGES.find(s => s.key === stage).closed ? new Date() : null]
      );
    }
    await db.query('COMMIT');
    res.json({ success: true, id });
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {});
    console.error('Admin add contact error:', err);
    res.status(500).json({ error: 'Could not add contact.' });
  } finally {
    db.release();
  }
});

router.get('/contacts/:id', requireAdmin, async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid contact id.' });
  try {
    const contact = (await pool.query('SELECT * FROM contacts WHERE id = $1', [id])).rows[0];
    if (!contact) return res.status(404).json({ error: 'Contact not found.' });
    const [activity, opportunities, client] = await Promise.all([
      pool.query('SELECT id, type, body, created_at FROM contact_activity WHERE contact_id = $1 ORDER BY created_at DESC, id DESC LIMIT 200', [id]),
      pool.query('SELECT * FROM opportunities WHERE contact_id = $1 ORDER BY created_at DESC', [id]),
      contact.client_id
        ? pool.query('SELECT id, plan, status, subscription_status, billing_date FROM clients WHERE id = $1', [contact.client_id])
        : Promise.resolve({ rows: [] }),
    ]);
    res.json({
      contact,
      activity: activity.rows,
      opportunities: opportunities.rows,
      client: client.rows[0] || null,
      stages: STAGES,
    });
  } catch (err) {
    console.error('Admin get contact error:', err);
    res.status(500).json({ error: 'Could not load contact.' });
  }
});

router.put('/contacts/:id', requireAdmin, async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid contact id.' });
  const b = req.body || {};
  const FIELDS = ['name', 'email', 'phone', 'company', 'source', 'notes'];
  const sent = FIELDS.filter(f => f in b);
  if (!sent.length) return res.json({ success: true });
  if ('name' in b && !clean(b.name)) return res.status(400).json({ error: 'Name cannot be empty.' });
  if ('email' in b) {
    b.email = clean(b.email)?.toLowerCase() || null;
    if (b.email && !isEmail(b.email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  try {
    const current = (await pool.query('SELECT client_id FROM contacts WHERE id = $1', [id])).rows[0];
    if (!current) return res.status(404).json({ error: 'Contact not found.' });
    if (current.client_id && ['name', 'email', 'company'].some(f => f in b)) {
      return res.status(400).json({ error: 'This is a client — change their name, email or business on the Clients page.' });
    }
    if (b.email) {
      const dupe = await pool.query('SELECT id FROM contacts WHERE LOWER(email) = $1 AND id <> $2', [b.email, id]);
      if (dupe.rows.length) return res.status(409).json({ error: 'Another contact already uses that email.' });
    }
    const sets = sent.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const r = await pool.query(
      `UPDATE contacts SET ${sets}, updated_at = NOW() WHERE id = $1 RETURNING id`,
      [id, ...sent.map(f => clean(b[f]))]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Contact not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('Admin update contact error:', err);
    res.status(500).json({ error: 'Could not save contact.' });
  }
});

router.delete('/contacts/:id', requireAdmin, async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid contact id.' });
  try {
    const c = (await pool.query('SELECT client_id FROM contacts WHERE id = $1', [id])).rows[0];
    if (!c) return res.status(404).json({ error: 'Contact not found.' });
    if (c.client_id) return res.status(400).json({ error: 'This contact has a portal account, so it can\'t be deleted here.' });
    await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete contact error:', err);
    res.status(500).json({ error: 'Could not delete contact.' });
  }
});

router.post('/contacts/:id/notes', requireAdmin, async (req, res) => {
  const id = idParam(req);
  const body = clean((req.body || {}).body);
  if (!id) return res.status(400).json({ error: 'Invalid contact id.' });
  if (!body) return res.status(400).json({ error: 'Write a note first.' });
  try {
    const exists = await pool.query('SELECT 1 FROM contacts WHERE id = $1', [id]);
    if (!exists.rows.length) return res.status(404).json({ error: 'Contact not found.' });
    await logActivity(pool, id, 'note', body);
    await pool.query('UPDATE contacts SET updated_at = NOW() WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin add note error:', err);
    res.status(500).json({ error: 'Could not save note.' });
  }
});

// ─── PIPELINE ────────────────────────────────────────────────

router.get('/pipeline', requireAdmin, synced, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, c.name AS contact_name, c.company AS contact_company, c.email AS contact_email,
             c.phone AS contact_phone, c.client_id
      FROM opportunities o
      JOIN contacts c ON c.id = o.contact_id
      ORDER BY o.stage_changed_at DESC
    `);
    res.json({ stages: STAGES, opportunities: result.rows });
  } catch (err) {
    console.error('Admin pipeline error:', err);
    res.status(500).json({ error: 'Could not load pipeline.' });
  }
});

router.post('/opportunities', requireAdmin, async (req, res) => {
  const b = req.body || {};
  const contactId = parseInt(b.contact_id, 10);
  const stage = b.stage || 'new';
  const value = toMoney(b.value);
  if (!contactId) return res.status(400).json({ error: 'Pick a contact for this deal.' });
  if (!STAGE_KEYS.includes(stage)) return res.status(400).json({ error: 'Unknown stage.' });
  if (Number.isNaN(value)) return res.status(400).json({ error: 'Deal value must be a number.' });
  try {
    const c = (await pool.query('SELECT name, company FROM contacts WHERE id = $1', [contactId])).rows[0];
    if (!c) return res.status(404).json({ error: 'Contact not found.' });
    const closed = STAGES.find(s => s.key === stage).closed;
    const r = await pool.query(
      `INSERT INTO opportunities (contact_id, title, value, stage, plan, notes, closed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [contactId, clean(b.title) || `${c.company || c.name} — new deal`, value, stage, clean(b.plan), clean(b.notes), closed ? new Date() : null]
    );
    await logActivity(pool, contactId, 'stage', `New deal added in “${stageLabel(stage)}”`);
    res.json({ success: true, id: r.rows[0].id });
  } catch (err) {
    console.error('Admin add opportunity error:', err);
    res.status(500).json({ error: 'Could not add deal.' });
  }
});

router.put('/opportunities/:id', requireAdmin, async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid deal id.' });
  const b = req.body || {};
  if ('stage' in b && !STAGE_KEYS.includes(b.stage)) return res.status(400).json({ error: 'Unknown stage.' });
  if ('title' in b && !clean(b.title)) return res.status(400).json({ error: 'Deal name cannot be empty.' });
  if ('value' in b) {
    b.value = toMoney(b.value);
    if (Number.isNaN(b.value)) return res.status(400).json({ error: 'Deal value must be a number.' });
  }
  const FIELDS = ['title', 'value', 'stage', 'plan', 'notes', 'lost_reason'];
  const sent = FIELDS.filter(f => f in b);
  if (!sent.length) return res.json({ success: true });

  try {
    const before = (await pool.query('SELECT * FROM opportunities WHERE id = $1', [id])).rows[0];
    if (!before) return res.status(404).json({ error: 'Deal not found.' });

    const sets = sent.map((f, i) => `${f} = $${i + 2}`);
    const stageChanged = 'stage' in b && b.stage !== before.stage;
    if (stageChanged) {
      sets.push('stage_changed_at = NOW()');
      sets.push(STAGES.find(s => s.key === b.stage).closed ? 'closed_at = NOW()' : 'closed_at = NULL');
    }
    await pool.query(
      `UPDATE opportunities SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $1`,
      [id, ...sent.map(f => (f === 'value' ? b.value : clean(b[f])))]
    );
    if (stageChanged) {
      const reason = b.stage === 'lost' && clean(b.lost_reason) ? ` — ${clean(b.lost_reason)}` : '';
      await logActivity(pool, before.contact_id, 'stage',
        `Moved “${clean(b.title) || before.title}” from ${stageLabel(before.stage)} to ${stageLabel(b.stage)}${reason}`);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Admin update opportunity error:', err);
    res.status(500).json({ error: 'Could not save deal.' });
  }
});

router.delete('/opportunities/:id', requireAdmin, async (req, res) => {
  const id = idParam(req);
  if (!id) return res.status(400).json({ error: 'Invalid deal id.' });
  try {
    const r = await pool.query('DELETE FROM opportunities WHERE id = $1 RETURNING contact_id, title', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Deal not found.' });
    await logActivity(pool, r.rows[0].contact_id, 'system', `Deleted deal “${r.rows[0].title}”`);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete opportunity error:', err);
    res.status(500).json({ error: 'Could not delete deal.' });
  }
});

module.exports = router;
