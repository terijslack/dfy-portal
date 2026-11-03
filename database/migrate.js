// database/migrate.js — self-healing column additions
// Safe to run every startup: ADD COLUMN IF NOT EXISTS is a no-op when the column exists.

async function runMigrations(pool) {
  const steps = [
    // Core status/plan columns added after initial schema
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS status               VARCHAR(50)  DEFAULT 'active'`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS stripe_price_id      TEXT`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS stripe_customer_id   TEXT`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS subscription_status  TEXT         DEFAULT 'inactive'`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS plan                 TEXT`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS billing_date         DATE`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS admin_notes          TEXT`,

    // ── Contacts & pipeline (admin CRM) ──
    // Everyone the business deals with: leads, clients, past clients.
    `CREATE TABLE IF NOT EXISTS contacts (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT,
      phone       TEXT,
      company     TEXT,
      source      TEXT,
      client_id   INTEGER UNIQUE REFERENCES clients(id) ON DELETE SET NULL,
      notes       TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS contacts_email_unique ON contacts (LOWER(email)) WHERE email IS NOT NULL`,
    // Deals moving through the sales pipeline
    `CREATE TABLE IF NOT EXISTS opportunities (
      id                SERIAL PRIMARY KEY,
      contact_id        INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
      title             TEXT NOT NULL,
      value             NUMERIC(10,2),
      stage             TEXT NOT NULL DEFAULT 'new',
      plan              TEXT,
      notes             TEXT,
      lost_reason       TEXT,
      created_at        TIMESTAMPTZ DEFAULT NOW(),
      updated_at        TIMESTAMPTZ DEFAULT NOW(),
      stage_changed_at  TIMESTAMPTZ DEFAULT NOW(),
      closed_at         TIMESTAMPTZ
    )`,
    `CREATE INDEX IF NOT EXISTS opportunities_contact ON opportunities (contact_id)`,
    // Timeline for each contact: notes, form messages, signups, stage moves.
    // "ref" makes automatic entries safe to run twice (it's unique when set).
    `CREATE TABLE IF NOT EXISTS contact_activity (
      id          SERIAL PRIMARY KEY,
      contact_id  INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
      type        TEXT NOT NULL,
      body        TEXT,
      ref         TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS contact_activity_ref ON contact_activity (ref) WHERE ref IS NOT NULL`,
    // Where a record came from, so imports can run again without duplicating anything
    `ALTER TABLE contacts      ADD COLUMN IF NOT EXISTS tags   TEXT`,
    `ALTER TABLE contacts      ADD COLUMN IF NOT EXISTS ghl_id TEXT`,
    `CREATE UNIQUE INDEX IF NOT EXISTS contacts_ghl_id ON contacts (ghl_id) WHERE ghl_id IS NOT NULL`,
    `ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS source TEXT`,
    `ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS origin TEXT`,   // portal | website | admin | ghl
    `ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS ghl_id TEXT`,
    `CREATE UNIQUE INDEX IF NOT EXISTS opportunities_ghl_id ON opportunities (ghl_id) WHERE ghl_id IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS contact_activity_contact ON contact_activity (contact_id, created_at DESC)`,

    // ── Accounts ──
    // How much attention an account needs right now: high | medium | low
    `ALTER TABLE clients  ADD COLUMN IF NOT EXISTS priority   TEXT`,
    // People who work at a client's business but don't log in (e.g. the owner)
    `ALTER TABLE contacts ADD COLUMN IF NOT EXISTS account_id INTEGER REFERENCES clients(id) ON DELETE SET NULL`,
    `ALTER TABLE contacts ADD COLUMN IF NOT EXISTS job_title  TEXT`,
    `CREATE INDEX IF NOT EXISTS contacts_account ON contacts (account_id)`,
    // Last billing status we saw, so changes from Stripe show up on the account timeline
    `ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_billing_status TEXT`,

    // ── Metricool ──
    // Which Metricool "brand" a client's posts schedule under. Set per-account
    // in the admin once you have Metricool IDs; nothing is sent to Metricool
    // until this is set.
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS metricool_blog_id TEXT`,
    // Metricool's own id for a post, once it's been scheduled there
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS metricool_post_id TEXT`,
    // Posts written in Metricool and pulled into the portal for approval.
    // metricool_raw is Metricool's full copy of the post — sent back unchanged
    // (except draft → false) when the client approves, so nothing gets lost.
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS source            TEXT DEFAULT 'portal'`,  // portal | metricool
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS media             JSONB DEFAULT '[]'::jsonb`, // image/video URLs
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS networks          TEXT`,  // e.g. "instagram,facebook"
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS scheduled_time    TEXT`,  // e.g. "10:00" (local to the brand)
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS metricool_raw     JSONB`,
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS metricool_error   TEXT`,  // last problem sending to Metricool
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS revised_at        TIMESTAMPTZ`, // DFY revised it after a change request
    `CREATE UNIQUE INDEX IF NOT EXISTS posts_metricool_unique ON posts (client_id, metricool_post_id) WHERE metricool_post_id IS NOT NULL`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS metricool_synced_at TIMESTAMPTZ`,
    // Metricool gives a post a NEW id every time it's edited; its uuid stays the same.
    // So posts are matched on uuid, and metricool_post_id is just the latest id.
    `ALTER TABLE posts   ADD COLUMN IF NOT EXISTS metricool_uuid    TEXT`,
    `CREATE UNIQUE INDEX IF NOT EXISTS posts_metricool_uuid_unique ON posts (client_id, metricool_uuid) WHERE metricool_uuid IS NOT NULL`,

    // ── Messages from DFY to a client ──
    // Shown on the client's dashboard under "From your marketing team".
    // ask = true asks them for a yes / no answer; otherwise they just tap "Got it".
    // Their answer (and optional note) is saved here and on the account timeline.
    `CREATE TABLE IF NOT EXISTS client_messages (
      id            SERIAL PRIMARY KEY,
      client_id     INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      body          TEXT NOT NULL,
      ask           BOOLEAN NOT NULL DEFAULT false,
      response      TEXT,          -- yes | no | ok
      reply         TEXT,          -- optional note they typed back
      responded_at  TIMESTAMPTZ,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS client_messages_client ON client_messages (client_id, created_at DESC)`,

    // ── Monthly newsletters for client approval ──
    // DFY uploads the Canva export (PNG/JPG/PDF) with the subject line and send
    // date; the client approves or asks for changes in their portal; DFY sends it.
    // source is 'upload' for now — room for pulling drafts from Mailchimp later.
    `CREATE TABLE IF NOT EXISTS newsletters (
      id            SERIAL PRIMARY KEY,
      client_id     INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      title         TEXT NOT NULL,          -- e.g. "December newsletter"
      subject       TEXT,                   -- email subject line
      preview_text  TEXT,                   -- the line inboxes show after the subject
      send_date     DATE,
      canva_url     TEXT,                   -- optional view link
      status        TEXT NOT NULL DEFAULT 'pending',  -- pending | changes_requested | approved | sent
      change_notes  TEXT,
      version       INTEGER NOT NULL DEFAULT 1,
      revised_at    TIMESTAMPTZ,
      approved_at   TIMESTAMPTZ,
      sent_at       TIMESTAMPTZ,
      source        TEXT NOT NULL DEFAULT 'upload',
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS newsletters_client ON newsletters (client_id, send_date DESC)`,
    // The preview files themselves, kept in the database (no extra storage service)
    `CREATE TABLE IF NOT EXISTS newsletter_files (
      id             SERIAL PRIMARY KEY,
      newsletter_id  INTEGER NOT NULL REFERENCES newsletters(id) ON DELETE CASCADE,
      filename       TEXT NOT NULL,
      mimetype       TEXT NOT NULL,
      size           INTEGER NOT NULL,
      position       INTEGER NOT NULL DEFAULT 0,
      data           BYTEA NOT NULL,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS newsletter_files_newsletter ON newsletter_files (newsletter_id, position)`,
  ];

  for (const sql of steps) {
    await pool.query(sql);
  }

  console.log('✅ DB migrations complete');
}

module.exports = { runMigrations };
