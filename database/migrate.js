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
  ];

  for (const sql of steps) {
    await pool.query(sql);
  }

  console.log('✅ DB migrations complete');
}

module.exports = { runMigrations };
