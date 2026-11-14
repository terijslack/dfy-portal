// routes/newsletters.js — Monthly newsletter approval.
//
// How it works today (Canva):
//   1. DFY designs the newsletter in Canva and exports it (PNG/JPG or PDF).
//   2. In the admin (account → Newsletter tab) DFY uploads it with the subject
//      line and send date. It shows in the client's portal as "Needs approval".
//   3. Client approves → DFY sends it. Or asks for changes → DFY uploads a
//      revised version, which comes back marked "updated based on your notes".
//   4. DFY marks it Sent.
// Files are stored in the database (newsletter_files) and served through this
// route, so only the client and DFY can see them.
//
// Client:  GET  /api/newsletters
//          POST /api/newsletters/:id/approve
//          POST /api/newsletters/:id/request-changes
//          GET  /api/newsletters/files/:fileId
// Admin:   GET    /api/newsletters/admin/client/:clientId
//          POST   /api/newsletters/admin/client/:clientId   (multipart: files + fields)
//          POST   /api/newsletters/admin/:id/revise         (multipart: optional new files + fields)
//          POST   /api/newsletters/admin/:id/sent
//          DELETE /api/newsletters/admin/:id

const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const { requireLogin, requireAdmin } = require('../middleware/auth');
const { logForClient } = require('../services/activity');
const alerts = require('../services/alerts');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => (ALLOWED.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Upload PNG, JPG or PDF files exported from Canva.'))),
});
// Turn multer errors into a friendly 400 instead of a crash page
const withFiles = (req, res, next) => upload.array('files', 10)(req, res, err => {
  if (!err) return next();
  const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Each file must be under 20 MB.' : err.message;
  res.status(400).json({ error: msg });
});

const WAITING = ['pending', 'changes_requested'];
const clean = v => (typeof v === 'string' ? (v.trim() || null) : v ?? null);
const dayLabel = d => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : '');
const log = (clientId, body) => logForClient(clientId, 'dfy', body).catch(e => console.error('Newsletter timeline error:', e.message));

// Newsletters for a client, each with its files (no file data, just links)
async function listFor(clientId) {
  const rows = (await pool.query(
    `SELECT n.*,
            COALESCE(json_agg(json_build_object('id', f.id, 'filename', f.filename, 'mimetype', f.mimetype, 'size', f.size)
                     ORDER BY f.position) FILTER (WHERE f.id IS NOT NULL), '[]') AS files
     FROM newsletters n LEFT JOIN newsletter_files f ON f.newsletter_id = n.id
     WHERE n.client_id = $1
     GROUP BY n.id
     ORDER BY n.send_date DESC NULLS FIRST, n.created_at DESC`, [clientId]
  )).rows;
  // How each sent newsletter did, from Mailchimp (services/mailchimpStats.js)
  const results = {};
  try {
    const r = await pool.query(
      `SELECT newsletter_id, emails_sent, open_rate, click_rate FROM email_campaigns
        WHERE client_id = $1 AND newsletter_id IS NOT NULL`, [clientId]);
    r.rows.forEach(x => {
      results[x.newsletter_id] = {
        sentTo: Number(x.emails_sent) || 0,
        opened: Math.round((Number(x.open_rate) || 0) * 100),
        clicked: Math.round((Number(x.click_rate) || 0) * 1000) / 10,
      };
    });
  } catch { /* table not there yet */ }
  return rows.map(n => ({
    ...n,
    results: results[n.id] || null,
    files: n.files.map(f => ({ ...f, url: `/api/newsletters/files/${f.id}`, type: f.mimetype === 'application/pdf' ? 'pdf' : 'image' })),
  }));
}

async function saveFiles(db, newsletterId, files) {
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    await db.query(
      `INSERT INTO newsletter_files (newsletter_id, filename, mimetype, size, position, data) VALUES ($1, $2, $3, $4, $5, $6)`,
      [newsletterId, f.originalname, f.mimetype, f.size, i, f.buffer]
    );
  }
}

// ─── Client ─────────────────────────────────────────────────────────────────

router.get('/', requireLogin, async (req, res) => {
  try {
    res.json({ newsletters: await listFor(req.user.id) });
  } catch (err) {
    console.error('Get newsletters error:', err);
    res.status(500).json({ error: 'Could not load newsletters.' });
  }
});

router.post('/:id(\\d+)/approve', requireLogin, async (req, res) => {
  const seen = req.body && req.body.seen_updated_at;
  try {
    const n = (await pool.query('SELECT * FROM newsletters WHERE id = $1 AND client_id = $2', [req.params.id, req.user.id])).rows[0];
    if (!n) return res.status(404).json({ error: 'Newsletter not found.' });
    if (!WAITING.includes(n.status)) return res.status(400).json({ error: 'This newsletter has already been approved.' });
    if (seen && new Date(seen).getTime() !== new Date(n.updated_at).getTime()) {
      return res.status(409).json({ error: 'We just updated this newsletter. Take a look at the new version, then approve.', refresh: true });
    }
    await pool.query(`UPDATE newsletters SET status = 'approved', approved_at = NOW(), updated_at = NOW() WHERE id = $1`, [n.id]);
    res.json({ success: true });
    alerts.newsletterApproved(n.id); // email hello@ to send it
  } catch (err) {
    console.error('Approve newsletter error:', err);
    res.status(500).json({ error: 'Could not approve the newsletter.' });
  }
});

router.post('/:id(\\d+)/request-changes', requireLogin, async (req, res) => {
  const notes = clean(req.body && req.body.notes);
  if (!notes) return res.status(400).json({ error: 'Please include notes about what you want changed.' });
  try {
    const n = (await pool.query('SELECT * FROM newsletters WHERE id = $1 AND client_id = $2', [req.params.id, req.user.id])).rows[0];
    if (!n) return res.status(404).json({ error: 'Newsletter not found.' });
    if (!WAITING.includes(n.status)) {
      return res.status(400).json({ error: 'This newsletter is already approved. Message us and we can still change it.' });
    }
    await pool.query(
      `UPDATE newsletters SET status = 'changes_requested', change_notes = $1, revised_at = NULL, updated_at = NOW() WHERE id = $2`,
      [notes, n.id]
    );
    res.json({ success: true });
    alerts.newsletterChangesRequested(n.id); // email hello@
  } catch (err) {
    console.error('Newsletter changes error:', err);
    res.status(500).json({ error: 'Could not send your change request.' });
  }
});

// The preview image/PDF — only for the client it belongs to, or DFY
router.get('/files/:fileId(\\d+)', requireLogin, async (req, res) => {
  try {
    const f = (await pool.query(
      `SELECT f.filename, f.mimetype, f.data, n.client_id
       FROM newsletter_files f JOIN newsletters n ON n.id = f.newsletter_id WHERE f.id = $1`, [req.params.fileId]
    )).rows[0];
    if (!f || (!req.user.is_admin && f.client_id !== req.user.id)) return res.status(404).send('Not found');
    res.set('Content-Type', f.mimetype);
    res.set('Content-Disposition', `inline; filename="${f.filename.replace(/[^\w.\- ]/g, '_')}"`);
    res.set('Cache-Control', 'private, max-age=86400'); // a file's id never changes content
    res.set('X-Content-Type-Options', 'nosniff');
    res.send(f.data);
  } catch (err) {
    console.error('Newsletter file error:', err);
    res.status(500).send('Could not load the file.');
  }
});

// ─── Admin ──────────────────────────────────────────────────────────────────

router.get('/admin/client/:clientId(\\d+)', requireAdmin, async (req, res) => {
  try {
    res.json({ newsletters: await listFor(Number(req.params.clientId)) });
  } catch (err) {
    console.error('Admin newsletters error:', err);
    res.status(500).json({ error: 'Could not load newsletters.' });
  }
});

router.post('/admin/client/:clientId(\\d+)', requireAdmin, withFiles, async (req, res) => {
  const clientId = Number(req.params.clientId);
  const title = clean(req.body.title);
  if (!title) return res.status(400).json({ error: 'Give the newsletter a name, like "December newsletter".' });
  if (!req.files || !req.files.length) return res.status(400).json({ error: 'Upload the newsletter from Canva (PNG, JPG or PDF).' });

  const db = await pool.connect();
  try {
    await db.query('BEGIN');
    const n = (await db.query(
      `INSERT INTO newsletters (client_id, title, subject, preview_text, send_date, canva_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [clientId, title, clean(req.body.subject), clean(req.body.preview_text), clean(req.body.send_date), clean(req.body.canva_url)]
    )).rows[0];
    await saveFiles(db, n.id, req.files);
    await db.query('COMMIT');
    res.json({ success: true, id: n.id });
    log(clientId, `DFY sent "${title}"${req.body.send_date ? ` (sending ${dayLabel(req.body.send_date)})` : ''} for their approval`);
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {});
    console.error('Create newsletter error:', err);
    res.status(err.code === '23503' ? 404 : 500).json({ error: err.code === '23503' ? 'Account not found.' : 'Could not save the newsletter.' });
  } finally {
    db.release();
  }
});

// Upload a revised version (and/or update the subject, date, etc.).
// New files replace the old ones; the client is asked to approve again.
router.post('/admin/:id(\\d+)/revise', requireAdmin, withFiles, async (req, res) => {
  const db = await pool.connect();
  try {
    const n = (await db.query('SELECT * FROM newsletters WHERE id = $1', [req.params.id])).rows[0];
    if (!n) return res.status(404).json({ error: 'Newsletter not found.' });
    const files = req.files || [];
    const fields = ['title', 'subject', 'preview_text', 'send_date', 'canva_url'].filter(f => f in req.body);
    if (!files.length && !fields.length) return res.status(400).json({ error: 'Nothing to update.' });
    if (fields.includes('title') && !clean(req.body.title)) return res.status(400).json({ error: 'The newsletter needs a name.' });

    // Changing what the client sees sends it back to them for approval
    const answeringNotes = n.status === 'changes_requested';
    await db.query('BEGIN');
    if (files.length) {
      await db.query('DELETE FROM newsletter_files WHERE newsletter_id = $1', [n.id]);
      await saveFiles(db, n.id, files);
    }
    const sets = fields.map((f, i) => `${f} = $${i + 2}`);
    await db.query(
      `UPDATE newsletters SET ${[...sets,
        `status = 'pending'`, 'version = version + 1', 'approved_at = NULL', 'sent_at = NULL',
        'client_notified_at = NULL', 'client_reminded_at = NULL',
        answeringNotes ? 'revised_at = NOW()' : 'revised_at = revised_at',
        'updated_at = NOW()'].join(', ')}
       WHERE id = $1`,
      [n.id, ...fields.map(f => clean(req.body[f]))]
    );
    await db.query('COMMIT');
    res.json({ success: true });
    log(n.client_id, `DFY sent a revised version of "${clean(req.body.title) || n.title}" for their approval`);
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {});
    console.error('Revise newsletter error:', err);
    res.status(500).json({ error: 'Could not save the revised version.' });
  } finally {
    db.release();
  }
});

router.post('/admin/:id(\\d+)/sent', requireAdmin, async (req, res) => {
  try {
    const n = (await pool.query(
      `UPDATE newsletters SET status = 'sent', sent_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING client_id, title`,
      [req.params.id]
    )).rows[0];
    if (!n) return res.status(404).json({ error: 'Newsletter not found.' });
    res.json({ success: true });
    log(n.client_id, `DFY sent "${n.title}" to their email list`);
  } catch (err) {
    console.error('Mark newsletter sent error:', err);
    res.status(500).json({ error: 'Could not update the newsletter.' });
  }
});

router.delete('/admin/:id(\\d+)', requireAdmin, async (req, res) => {
  try {
    const n = (await pool.query('DELETE FROM newsletters WHERE id = $1 RETURNING client_id, title', [req.params.id])).rows[0];
    if (!n) return res.status(404).json({ error: 'Newsletter not found.' });
    res.json({ success: true });
    log(n.client_id, `DFY removed "${n.title}"`);
  } catch (err) {
    console.error('Delete newsletter error:', err);
    res.status(500).json({ error: 'Could not delete the newsletter.' });
  }
});

module.exports = router;
