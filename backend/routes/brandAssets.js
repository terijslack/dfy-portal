// routes/brandAssets.js — Logo + marketing content uploads via Supabase Storage

const express  = require('express');
const multer   = require('multer');
const jwt      = require('jsonwebtoken');
const { Pool } = require('pg');
const { uploadLogo, uploadContentFile, deleteFile } = require('../services/supabase-storage');

const router = express.Router();
const pool   = new Pool({ connectionString: process.env.DATABASE_URL });

const ALLOWED_MIME = ['image/png', 'image/svg+xml', 'image/jpeg'];
const MAX_BYTES    = 2 * 1024 * 1024; // 2 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PNG, SVG, and JPG files are allowed.'));
  },
});

// Add columns if they don't exist yet
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS logo_url TEXT`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS content_urls JSONB DEFAULT '[]'`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS brand_import_mode TEXT`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS brand_website_url TEXT`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS brand_colors JSONB DEFAULT '[]'`).catch(() => {});
pool.query(`ALTER TABLE client_onboarding ADD COLUMN IF NOT EXISTS brand_typography JSONB DEFAULT '{}'`).catch(() => {});

function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid session' });
  }
}

// GET /api/brand-assets — get all brand asset data
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT logo_url, content_urls, brand_import_mode, brand_website_url, brand_colors, brand_typography FROM client_onboarding WHERE client_id = $1',
      [req.user.id]
    );
    const row = result.rows[0] || {};
    res.json({
      logo_url:          row.logo_url          || null,
      content_urls:      row.content_urls      || [],
      brand_import_mode: row.brand_import_mode || null,
      brand_website_url: row.brand_website_url || null,
      brand_colors:      row.brand_colors      || [],
      brand_typography:  row.brand_typography  || {},
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load brand assets.' });
  }
});

// POST /api/brand-assets/logo — upload/replace logo
router.post('/logo', requireAuth, upload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  try {
    const url = await uploadLogo(req.user.id, req.file.buffer, req.file.mimetype, req.file.originalname);
    await pool.query(
      `INSERT INTO client_onboarding (client_id, logo_url, content_urls, completed_at, updated_at)
       VALUES ($1, $2, '[]', NOW(), NOW())
       ON CONFLICT (client_id) DO UPDATE SET logo_url = $2, updated_at = NOW()`,
      [req.user.id, url]
    );
    res.json({ url });
  } catch (err) {
    console.error('Logo upload error:', err.message);
    res.status(500).json({ error: err.message || 'Upload failed.' });
  }
});

// POST /api/brand-assets/content — upload one content file
router.post('/content', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  try {
    const { url, path } = await uploadContentFile(req.user.id, req.file.buffer, req.file.mimetype, req.file.originalname);
    const current = await pool.query(
      'SELECT content_urls FROM client_onboarding WHERE client_id = $1', [req.user.id]
    );
    const existing = current.rows[0]?.content_urls || [];
    const updated  = [...existing, { url, path, name: req.file.originalname }];
    await pool.query(
      `INSERT INTO client_onboarding (client_id, content_urls, completed_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       ON CONFLICT (client_id) DO UPDATE SET content_urls = $2, updated_at = NOW()`,
      [req.user.id, JSON.stringify(updated)]
    );
    res.json({ url, path, name: req.file.originalname });
  } catch (err) {
    console.error('Content upload error:', err.message);
    res.status(500).json({ error: err.message || 'Upload failed.' });
  }
});

// DELETE /api/brand-assets/content — remove one content file
router.delete('/content', requireAuth, async (req, res) => {
  const { path: storagePath } = req.body;
  if (!storagePath) return res.status(400).json({ error: 'No path provided.' });
  try {
    await deleteFile(storagePath);
    const current = await pool.query(
      'SELECT content_urls FROM client_onboarding WHERE client_id = $1', [req.user.id]
    );
    const existing = current.rows[0]?.content_urls || [];
    const updated  = existing.filter(f => f.path !== storagePath);
    await pool.query(
      'UPDATE client_onboarding SET content_urls = $1, updated_at = NOW() WHERE client_id = $2',
      [JSON.stringify(updated), req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Content delete error:', err.message);
    res.status(500).json({ error: err.message || 'Delete failed.' });
  }
});

// POST /api/brand-assets/import-url — save "do it for me" mode + website URL
router.post('/import-url', requireAuth, async (req, res) => {
  const { url } = req.body;
  try {
    await pool.query(
      `INSERT INTO client_onboarding (client_id, brand_import_mode, brand_website_url, content_urls, completed_at, updated_at)
       VALUES ($1, 'import', $2, '[]', NOW(), NOW())
       ON CONFLICT (client_id) DO UPDATE SET brand_import_mode = 'import', brand_website_url = $2, updated_at = NOW()`,
      [req.user.id, url || null]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Import URL error:', err.message);
    res.status(500).json({ error: 'Could not save.' });
  }
});

// POST /api/brand-assets/colors — save brand colors array
router.post('/colors', requireAuth, async (req, res) => {
  const { colors } = req.body;
  if (!Array.isArray(colors)) return res.status(400).json({ error: 'colors must be an array.' });
  const valid = colors.filter(c => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(c)).slice(0, 10);
  try {
    await pool.query(
      `INSERT INTO client_onboarding (client_id, brand_import_mode, brand_colors, content_urls, completed_at, updated_at)
       VALUES ($1, 'self', $2, '[]', NOW(), NOW())
       ON CONFLICT (client_id) DO UPDATE SET brand_import_mode = 'self', brand_colors = $2, updated_at = NOW()`,
      [req.user.id, JSON.stringify(valid)]
    );
    res.json({ success: true, colors: valid });
  } catch (err) {
    console.error('Colors save error:', err.message);
    res.status(500).json({ error: 'Could not save.' });
  }
});

// POST /api/brand-assets/typography — save typography data
router.post('/typography', requireAuth, async (req, res) => {
  const { heading_font, body_font, notes } = req.body;
  const typo = { heading_font: heading_font || '', body_font: body_font || '', notes: notes || '' };
  try {
    await pool.query(
      `INSERT INTO client_onboarding (client_id, brand_import_mode, brand_typography, content_urls, completed_at, updated_at)
       VALUES ($1, 'self', $2, '[]', NOW(), NOW())
       ON CONFLICT (client_id) DO UPDATE SET brand_import_mode = 'self', brand_typography = $2, updated_at = NOW()`,
      [req.user.id, JSON.stringify(typo)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Typography save error:', err.message);
    res.status(500).json({ error: 'Could not save.' });
  }
});

// Multer error handler
router.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File exceeds 2MB limit.' });
  res.status(400).json({ error: err.message || 'Upload error.' });
});

module.exports = router;
