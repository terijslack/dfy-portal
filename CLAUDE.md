# DFY Client Portal — Project Context

## What This Is
A client-facing portal for Done For You Marketing (DFY). Clients log in to review/approve social posts, manage their subscription, and complete onboarding. Teri is the admin.

**Stack:** Node.js/Express · PostgreSQL (Railway) · Stripe (subscriptions) · Metricool (social scheduling) · Google Workspace SMTP (portal emails)  
**Deployed:** Railway, auto-deploys from `main` on GitHub (`terijslack/dfy-portal`)  
**Workflow:** Claude builds on a branch and opens a PR; Teri merges to `main` to go live. The admin portal (Accounts, Contacts, Pipeline) is the single source of truth; outside tools plug into it and can be swapped without changing it.

**GoHighLevel is being retired.** The backend no longer calls GHL. Leftovers: the landing-page survey and free-guide form are still GHL-hosted embeds (to be replaced with native forms), and `services/ghlImport.js` reads GHL CSV exports for the one-time contact/deal import.

---

## File Structure

```
server.js                        — app entry point, registers all routes
backend/
  routes/
    auth.js                      — login, logout, /me
    posts.js                     — post review/approval; approved posts are scheduled in Metricool
    admin.js                     — admin-only actions
    adminCrm.js                  — admin Accounts, Contacts, Pipeline, GHL CSV import
    messages.js                  — messages from DFY shown on the client dashboard
    planEnded.js                 — restart flow for clients whose plan ended
    stripe.js                    — Stripe checkout + webhook handler
    account.js                   — pause/resume/cancel/change-plan (calls Stripe)
    onboarding.js                — new client intake form
    contact.js                   — public contact form
    socials.js                   — social account connections
    brandAssets.js               — logo + content uploads
  services/
    email.js                     — welcome, password reset, contact alerts (nodemailer → Google Workspace)
    crm.js                       — contacts/opportunities helpers, Stripe→pipeline sync
    metricool.js                 — Metricool API (schedule approved posts)
    ghlImport.js                 — one-time import of GHL CSV exports into contacts/opportunities
    supabase-storage.js          — file uploads
  middleware/
    auth.js                      — requireLogin, requireAdmin middleware
  config/
    plans.js                     — plan names, prices, Stripe price IDs
  utils/
    encrypt.js                   — encryption helpers
database/
  schema.sql                     — table definitions (NOTE: may be behind the live Railway DB)
  addClient.js                   — admin utility to add a client manually
frontend/public/                 — all HTML, CSS, JS served to clients
  *.html                         — one file per page (no framework, plain HTML)
  style.css, palette.css         — global styles
  sidebar.js, sidebar.css        — shared sidebar nav component
```

---

## Pages

| URL | File | Who sees it |
|-----|------|-------------|
| `/` | home.html | Public |
| `/signup` | signup.html | New clients |
| `/create-account` | create-account.html | New clients (2-step flow) |
| `/login` | login.html | Everyone |
| `/dashboard` | dashboard.html | Logged-in clients |
| `/posts` | posts.html | Logged-in clients |
| `/calendar` | calendar.html | Logged-in clients |
| `/analytics` | analytics.html | Logged-in clients |
| `/gbp` | gbp.html | Logged-in clients |
| `/socials` | socials.html | Logged-in clients |
| `/account` | account.html | Logged-in clients |
| `/profile` | profile.html | Logged-in clients |
| `/onboarding` | onboarding.html | New clients post-signup |
| `/admin` | admin.html | Admin (Teri) only |
| `/landing` | landing.html | Public marketing |
| `/free-guide` | free-guide.html | Public marketing |
| `/privacy` | privacy.html | Public |

---

## Database Tables (PostgreSQL on Railway)

**`clients`** — one row per client
- Core: `id`, `name`, `email`, `password` (bcrypt), `business_name`, `is_admin`
- Status: `status` ('pending' → 'active'), `subscription_status` ('active', 'paused', 'cancelling', 'cancelled', 'past_due')
- Stripe: `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`
- Plan: `plan` (plan name string), `billing_date`, `subscription_start_date`
- Password reset / first password: `password_reset_token`, `password_reset_expires` (payment-link buyers get a 7-day set-password token at signup)

**`posts`** — social media posts; approving one schedules it in Metricool (brand ID set per account in admin)

**`contacts`**, **`opportunities`**, **`activities`** — the admin CRM (see `backend/config/pipeline.js` for stages). `database/migrate.js` adds columns at boot.

**`client_onboarding`** — intake form answers (industry, website, brand voice, etc.)

**`contact_inquiries`** — public contact form submissions

> **Important:** `database/schema.sql` is not fully up to date with the live Railway database. The actual DB has more columns than schema.sql shows (added via ALTER TABLE, not reflected in file).

---

## Stripe Flow

1. Client fills out signup form → POST `/api/stripe/create-checkout` (or `/create-checkout-session` for 2-step)
2. Stripe checkout page collects card
3. After payment, Stripe POSTs to `/api/stripe/webhook`
4. Webhook activates the client in the DB and sends the welcome email (with a set-password link if they bought through a Stripe Payment Link and have no password yet)
5. Client lands on `/payment-success`

**Subscription management** (account.js): pause, resume, cancel, and change-plan all make real Stripe API calls using `stripe_subscription_id`.

**Webhook events handled:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Email

`backend/services/email.js` sends every one-at-a-time portal email through Google Workspace from `noreply@dfymarketinggroup.com`, with replies going to `hello@`. Needs `SMTP_USER` + `SMTP_PASS` (a Google App Password) in Railway; without them it logs a warning and skips. Bulk email (newsletters, campaigns) must never go through this — it belongs on a subdomain with a bulk platform.

- Welcome email: sent by the Stripe webhook. If it fails, the webhook returns 500 so Stripe retries (the account is already saved by then).
- Password reset: `routes/auth.js`, 1-hour link to `/reset-password.html?token=…`. The same page with `&welcome=1` is the new-client "choose your password" screen.
- Contact form: alert to the team inbox, reply-to set to the visitor.

---

## Environment Variables (set in Railway)

```
DATABASE_URL              — PostgreSQL connection string
STRIPE_SECRET_KEY         — Stripe secret key
STRIPE_WEBHOOK_SECRET     — Stripe webhook signing secret
SMTP_USER                 — sending mailbox (noreply@dfymarketinggroup.com)
SMTP_PASS                 — Google App Password for that mailbox
METRICOOL_USER_TOKEN      — Metricool API token (agency-wide)
METRICOOL_USER_ID         — Metricool user id
APP_URL                   — Public URL (used for Stripe redirect URLs)
JWT_SECRET                — Used to sign login tokens
```

---

## Known Issues / Pending Decisions

- Landing-page survey (`landing.html`) and free-guide form (`free-guide.html`) are still GoHighLevel embeds — replace with native forms that create leads in the pipeline.
- `socials.html` still says engagement data arrives "once GHL is connected" — should come from Metricool.
- `database/schema.sql` lags the live DB; `database/migrate.js` is the reliable record of added columns.
- Security/hygiene cleanup is batched for after the build (JWT secret rotation, seed script, `.gitignore`, `.replit` removal).

---

## Who Teri Is
Owner of Done For You Marketing. Not a developer — explain things in plain English, no jargon. She wants Claude to figure things out and do the work, not hand her steps. Make targeted changes, not broad rewrites; put each change on a branch with a PR she can merge. Going live is her merging to `main` (Railway auto-deploys).
