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
  ];

  for (const sql of steps) {
    await pool.query(sql);
  }

  console.log('✅ DB migrations complete');
}

module.exports = { runMigrations };
