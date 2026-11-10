# DFY Client Portal — Project Context

## What This Is
A client-facing portal for Done For You Marketing (DFY). Clients log in to review/approve social posts, manage their subscription, and complete onboarding. Teri is the admin.

**Stack:** Node.js/Express · PostgreSQL (Railway) · Stripe (subscriptions) · Gmail API (email) · Metricool (social posts)  
**Deployed:** Railway  
**Built in:** Replit, pushed to GitHub

---

## File Structure

```
server.js                        — app entry point, registers all routes
backend/
  routes/
    auth.js                      — login, logout, /me
    posts.js                     — post review/approval (posts pulled from Metricool drafts; approve schedules them)
    admin.js                     — admin-only actions
    stripe.js                    — Stripe checkout + webhook handler
    account.js                   — pause/resume/cancel/change-plan (calls Stripe)
    onboarding.js                — new client intake form
    contact.js                   — public contact form
    socials.js                   — social account connections
    brandAssets.js               — logo + content uploads
  services/
    mailer.js                    — sends email through Gmail (Google Workspace service account)
    email.js                     — password reset + contact form emails (uses mailer.js)
    crm.js                       — admin Contacts + Pipeline (leads from forms, clients)
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
| `/newsletter` | newsletter.html | Logged-in clients |
| `/analytics` | analytics.html | Logged-in clients |
| `/gbp` | gbp.html | Logged-in clients |
| `/socials` | socials.html | Logged-in clients |
| `/account` | account.html | Logged-in clients |
| `/profile` | profile.html | Logged-in clients |
| `/onboarding` | onboarding.html | New clients post-signup |
| `/admin/dashboard` | admin-dashboard.html | Admin — landing page after login: what needs DFY across all clients (`GET /api/admin/dashboard`) |
| `/admin` | admin.html | Admin (Teri) only — Accounts; `?client=ID&tab=posts|newsletter|activity` opens an account on a tab |
| `/landing` | landing.html | Public marketing |
| `/free` | free.html | Public marketing — free guide + free GBP audit in one page (Instagram comment DMs link here) |
| `/free-guide` | free-guide.html | Public marketing |
| `/privacy` | privacy.html | Public |

---

## Database Tables (PostgreSQL on Railway)

**`clients`** — one row per client
- Core: `id`, `name`, `email`, `password` (bcrypt), `business_name`, `is_admin`
- Status: `status` ('pending' → 'active'), `subscription_status` ('active', 'paused', 'cancelling', 'cancelled', 'past_due')
- Stripe: `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`
- Plan: `plan` (plan name string), `billing_date`, `subscription_start_date`

**`posts`** — social media posts. `source = 'metricool'` rows are synced from Metricool drafts by `backend/services/metricoolSync.js` (every 10 min + when a client opens /posts). Edit those in Metricool, not in the portal.

**`newsletters`** / **`newsletter_files`** — monthly newsletters for client approval (`backend/routes/newsletters.js`). DFY uploads the Canva export (PNG/JPG/PDF, stored in `newsletter_files` in the DB) with subject line and send date in admin → account → Newsletter; the client approves or requests changes at `/newsletter`; DFY uploads a revised version or marks it sent. Every client sees the Newsletter link (added to the sidebar by `frontend/public/newsletter-nav.js`).

**`client_onboarding`** — intake form answers (industry, website, brand voice, etc.)

**`contact_inquiries`** — public contact form submissions

> **Important:** `database/schema.sql` is not fully up to date with the live Railway database. The actual DB has more columns than schema.sql shows (added via ALTER TABLE, not reflected in file).

---

## Stripe Flow

1. Client fills out signup form → POST `/api/stripe/create-checkout` (or `/create-checkout-session` for 2-step)
2. Stripe checkout page collects card
3. After payment, Stripe POSTs to `/api/stripe/webhook`
4. Webhook activates the client in the DB, moves their Pipeline deal to Won, and sends the welcome email
5. Client lands on `/payment-success`

**Subscription management** (account.js): pause, resume, cancel, and change-plan all make real Stripe API calls using `stripe_subscription_id`.

**Webhook events handled:** `checkout.session.completed`, `invoice.payment_succeeded` (keeps `billing_date` current), `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## GoHighLevel (retired)

DFY no longer uses GoHighLevel (cancelled Nov 2026). The portal has no GHL connection: email goes through Gmail, leads and deals live in the admin Contacts and Pipeline, and social posts run through Metricool. The only GHL leftovers are on purpose: the admin "Import from GoHighLevel" button (reads exported CSV files, no connection) and the `ghl_id` columns on `contacts` and `opportunities` that remember where imported records came from.

---

## Environment Variables (set in Railway)

```
DATABASE_URL              — PostgreSQL connection string
STRIPE_SECRET_KEY         — Stripe secret key
STRIPE_WEBHOOK_SECRET     — Stripe webhook signing secret
GOOGLE_SERVICE_ACCOUNT_JSON — Gmail sending (all portal email)
METRICOOL_USER_TOKEN / METRICOOL_USER_ID — Metricool posts
APP_URL                   — Public URL (used for Stripe redirect URLs)
JWT_SECRET                — Used to sign login tokens
```

---

## Known Issues / Pending Decisions

- **Posts run through Metricool (decided Oct 30, 2026).** DFY saves a post as a *draft* on the client's Metricool brand → it appears in the portal as "Needs approval" → Approve flips it to scheduled in Metricool; Request Changes stores notes, and when DFY edits the draft in Metricool it comes back as "Needs approval" marked revised. Needs METRICOOL_USER_TOKEN / METRICOOL_USER_ID in Railway and a Metricool brand ID per client (admin → Account).

---

## Who Teri Is
Owner of Done For You Marketing. Not a developer — explain things in plain English. Always ask before making changes. She builds in Replit and pushes to GitHub, deploying on Railway.
