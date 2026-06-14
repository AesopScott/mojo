# API Endpoints Registry

Every HTTP endpoint served by this project. For each: who serves it, who calls it, URL routing, request/response shape, status. Update whenever an endpoint is added, renamed, or its shape changes.

> **Note:** This registry replaced a stale prior version (2026-05-24) that documented Stripe-webhook and email-handler endpoints from an earlier architecture. Those endpoints do not exist in the codebase — Stripe was replaced by Polar.sh and PHP `mail()` is used directly.

---

## `POST /sellers/request-payout` (Firebase Cloud Function)

Seller submits payout request for available earnings. Requires verified bank account and active seller status. Deducts amount from available balance immediately.

**Request shape:** JSON body
```
{
  email:        string  (required, validated as email)
  sellerToken:  string  (required, must match seller record)
  amount:       number  (required, in cents; must be ≤ availableBalance)
}
```

**Response shape:**
```
200  { "ok": true, "payoutId": "...", "message": "Payout request submitted..." }
400  { "ok": false, "message": "Missing required fields" | "Insufficient balance" | ... }
401  { "ok": false, "message": "Invalid token" }
404  { "ok": false, "message": "Seller record not found" }
500  { "ok": false, "message": "Server error" }
```

**Producers (serves the endpoint)**
- `functions/index.js:472` — `exports.requestPayout` — creates payout_requests doc, updates seller balance

**Consumers (calls the endpoint)**
- Seller dashboard (future) — seller submits payout request

**Firestore writes:**
- Creates document in `payout_requests/{payoutId}` with status="pending"
- Updates seller's `availableBalance` (decremented by amount)

---

## `POST /sellers/complete-payout` (Firebase Cloud Function)

Admin endpoint to mark a payout request as complete after manual transfer.

**Request shape:** JSON body + admin auth header
```
{
  payoutId:      string  (required)
  adminNotes:    string  (optional)
}

Header: X-Admin-Key: [ADMIN_PAYOUT_KEY]
```

**Response shape:**
```
200  { "ok": true, "message": "Payout marked as complete" }
400  { "ok": false, "message": "Payout is not pending" }
401  { "ok": false, "message": "Unauthorized" }
404  { "ok": false, "message": "Payout request not found" }
405  { "ok": false, "message": "Method not allowed" }
500  { "ok": false, "message": "Server error" }
```

**Producers (serves the endpoint)**
- `functions/index.js:575` — `exports.completePayout` — updates payout_requests status to "completed"

**Consumers (calls the endpoint)**
- `scripts/admin-payouts.js:180` — admin dashboard marks payouts complete

**Security:** Requires valid `ADMIN_PAYOUT_KEY` (Firebase secret)

---

## `POST /products/create-from-submission` (Firebase Cloud Function)

Creates a product listing in Firestore when seller submits a product.

**Request shape:** JSON body
```
{
  email:              string  (required)
  contactName:        string  (required)
  productName:        string  (required)
  productDescription: string  (required)
  category:           string  (optional)
  pricingModel:       string  (optional)
  productUrl:         string  (optional)
  targetUser:         string  (optional)
}
```

**Response shape:**
```
200  { "ok": true, "productId": "...", "message": "Product listing created..." }
400  { "ok": false, "message": "Missing required fields" }
500  { "ok": false, "message": "Server error" }
```

**Producers (serves the endpoint)**
- `functions/index.js:683` — `exports.createProductFromSubmission` — creates product doc in Firestore

**Consumers (calls the endpoint)**
- `scripts/product-form.js:47` — after product submission succeeds

**Firestore writes:**
- Creates document in `products/{productId}` with status="pending_review"

---

## `POST /api/send-seller-onboarding-email`

Sends seller onboarding email with contract signing link after product submission.

**Request shape:** JSON body
```
{
  email:           string  (required, validated as email)
  contactName:     string  (required)
  productName:     string  (required)
  sellerToken:     string  (required, from createSellerFromProductSubmission)
}
```

**Response shape:**
```
200  { "ok": true }
400  { "ok": false, "message": "Invalid JSON body." }
422  { "ok": false, "message": "Missing required fields: ..." }
422  { "ok": false, "message": "Invalid email address." }
405  { "ok": false, "message": "Method not allowed." }
500  { "ok": false, "message": "Email could not be sent..." }
```

**Producers (serves the endpoint)**
- `api/send-seller-onboarding-email.php:1` — validates fields, builds email, calls `mail()`
- `.htaccess:22` — rewrites `/api/[name]` → `api/[name].php`

**Consumers (calls the endpoint)**
- `scripts/product-form.js:47` — after `createSellerFromProductSubmission` succeeds

**Email content:**
- Contains onboarding URL: `products/pages/seller-onboarding.html?email=...&token=...`
- Explains 90/10 commission split and account verification process

---

## `POST /api/submit-brief`

Receives the development brief form submission, validates fields, sends admin email and submitter auto-reply, returns JSON.

**Request shape:** JSON body
```
{
  projectName:        string  (required)
  contactName:        string  (required)
  contactEmail:       string  (required, validated as email)
  problemDescription: string  (required)
  currentTools:       string  (optional)
  timeline:           string  (optional — "asap" | "1-month" | "3-months" | "flexible")
  budget:             string  (optional — "under-5k" | "5k-15k" | "15k-50k" | "50k-plus" | "unsure")
  anythingElse:       string  (optional)
}
```

**Response shape:**
```
200  { "ok": true }
422  { "ok": false, "message": "Missing required fields: ..." }
422  { "ok": false, "message": "Invalid email address." }
405  { "ok": false, "message": "Method not allowed." }
500  { "ok": false, "message": "Email could not be sent..." }
```

**Producers (serves the endpoint)**
- `api/submit-brief.php:1` — PHP handler; validates, sanitizes, calls `mail()`
- `.htaccess:22` — rewrites `/api/[name]` → `api/[name].php` (strips `.php` extension)

**Consumers (calls the endpoint)**
- `scripts/brief-form.js:34` — `fetch('/api/submit-brief', { method: 'POST', ... })` — submits form as JSON
- `development/pages/brief.html:115` — `action="/api/submit-brief"` — fallback form action (JS intercepts first)

**Adjacent constraint — redirect on success:**
- `scripts/brief-form.js:48` — on `{ ok: true }`, redirects to `/development/pages/confirmation.html`
- `development/pages/confirmation.html` must exist at that path ✓

**Admin email:** defaults to `admin@MojoAiStudio.com`; override with `MOJO_ADMIN_EMAIL` env var (see [[env-vars]])

---

## `POST /polarWebhook` (Firebase Cloud Function)

Receives Polar.sh subscription/order events and writes purchase records to Firestore.

**Producers (sends events)**
- Polar.sh webhook (external) — sends `order.created` and `subscription.*` events

**Consumers (handles events)**
- `functions/index.js:40` — `exports.polarWebhook` — verifies HMAC signature, routes to `upsertPurchase` or `upsertSubscription`
- Deployed URL: `https://polarwebhook-hmkyyu2gma-uc.a.run.app` (from backlog notes — verify in Firebase console)

**Event types handled:**
- `order.created` → `functions/index.js:78`
- `subscription.*` (prefix) → `functions/index.js:84`

**Adjacent constraint:** Polar webhook secret must be set via `firebase functions:secrets:set POLAR_WEBHOOK_SECRET` (see [[env-vars]])

---

## `POST /api/sms-reminders`

Receives SMS reminder opt-ins. The private RSVP flow comes from `/watch/sms/?token=...`, validates the invite token, records consent, and stores the phone number only for that event reminder. The public `/learn/` flow stores a recurring city/group subscription for upcoming Advanced AI Concepts Meetup event reminders.

**Request shape:** JSON body
```
{
  token:   string  (required; invite token created by Meetup polling)
  phone:   string  (required; US or E.164-style phone number)
  consent: boolean (required; must be true)
}
```

Public `/learn/` shape:
```
{
  source:       "learn_public"
  phone:        string  (required; US or E.164-style phone number)
  consent:      boolean (required; must be true)
  groupUrlname: string  (optional; defaults to "advanced-ai-concepts")
  groupName:    string  (optional)
}
```

**Response shape:**
```
200  { "ok": true, "message": "SMS reminder saved.", "phoneLast4": "1234" }
404  { "ok": false, "message": "That reminder invite was not found." }
422  { "ok": false, "message": "Enter a valid phone number..." }
405  { "ok": false, "message": "Method not allowed." }
500  { "ok": false, "message": "Unable to save SMS reminder." }
```

**Producers (serves the endpoint)**
- `api/sms-reminders.php` - public opt-in handler
- `.htaccess` - rewrites `/api/sms-reminders` to `api/sms-reminders.php`

**Consumers (calls the endpoint)**
- `watch/sms/index.html` - SMS reminder opt-in form
- `watch/index.html` - public `/learn/` recurring SMS reminder opt-in form

**Adjacent constraint:** Private token opt-ins are stored with `purpose: "event_sms_reminder_only"`. Public `/learn/` opt-ins are stored under `publicSubscriptions` with `purpose: "recurring_upcoming_event_sms_reminders"`. Both persist explicit consent text from `api/sms-reminder-lib.php`.

---

## `GET /api/meetup-admin?action=poll-sms-invites`

Admin/cron action that polls Meetup GraphQL for upcoming Advanced AI Concepts RSVPs, creates one invite token per new RSVP, and emails the registrant a Mojo SMS opt-in link.

**Request shape:** query params
```
action=poll-sms-invites
network=advanced-ai-concepts  (optional)
first=10                       (optional; 1-25)
recovery=1                     (optional; adds apology/update copy)
confirm=send-sms-invites       (required to send email; otherwise dry-run)
```

**Producers (serves the endpoint)**
- `api/meetup-admin.php` - admin-gated Meetup automation helper

**Consumers**
- cPanel cron or manual admin call using `MEETUP_ADMIN_KEY`

**External APIs**
- Meetup GraphQL `proNetwork.eventsSearch(...).rsvps`
- PHP `mail()` for the opt-in invitation

**Safety guard:** production sends preflight the SMS reminder store before sending email, so a bad `MOJO_SMS_REMINDER_STORE` path fails before notifying registrants.

---

## `GET /api/meetup-admin?action=test-sms-store`

Admin-only storage preflight for SMS reminders. Reads the configured SMS reminder store, appends a small write-check marker, and writes it back. Does not call Meetup, email, or Twilio.

**Request shape:** query params
```
action=test-sms-store
```

**Producers (serves the endpoint)**
- `api/meetup-admin.php` - admin-gated SMS store preflight

**Consumers**
- Manual admin test using `MEETUP_ADMIN_KEY`

---

## `GET /api/meetup-admin?action=send-admin-sms`

Admin-only Twilio sender with two modes. With `phone`, it sends one immediate test/custom SMS to that number. With `body` plus `groupUrlname` and no `phone`, it sends that custom one-off message to opted-in public `/learn/` SMS subscribers for the selected Meetup chapter. Defaults to dry-run unless explicitly confirmed.

**Request shape:** query params
```
action=send-admin-sms
phone=+15555551234              (single-recipient test/send mode)
body=optional custom message  (optional; max 1000 chars)
groupUrlname=advanced-ai-concepts-dallas  (subscriber one-off mode; required when phone is omitted)
confirm=send-admin-sms        (required to call Twilio; otherwise dry-run)
```

**Producers (serves the endpoint)**
- `api/meetup-admin.php` - legacy PHP admin-gated Twilio test and one-off sender
- `cloudflare/pages-worker.js` - Cloudflare Pages admin-gated Twilio test and one-off subscriber sender

**Consumers**
- Manual admin test using `MEETUP_ADMIN_KEY`

**External APIs**
- Twilio Messages REST API

**Safety guard:** Without `confirm=send-admin-sms`, validates the target/body and returns dry-run metadata without sending SMS. In subscriber mode, dry-run returns recipient count and phone last-4s. The older `action=send-test-sms&confirm=send-test-sms` alias is also accepted for default single-number test-message sends.

---

## `GET /api/meetup-admin?action=send-topic-followups`

Admin/cron action that polls Meetup GraphQL for Advanced AI Concepts RSVPs, records first-seen state, and sends a one-week topic prompt email after an RSVP has been observed for `days_after` days.

**Request shape:** query params
```
action=send-topic-followups
network=advanced-ai-concepts   (optional)
first=25                       (optional; 1-25)
days_after=7                   (optional; 1-90)
confirm=send-topic-followups   (required to send email; otherwise dry-run)
dry_run_write=1&confirm=test-followup-store  (optional store probe; no Meetup call or email)
```

**Producers (serves the endpoint)**
- `api/meetup-admin.php` - admin-gated Meetup automation helper

**Consumers**
- cPanel cron or manual admin call using `MEETUP_ADMIN_KEY`
- `.github/workflows/meetup-topic-followups.yml` - daily scheduled GitHub Actions call using the `MEETUP_ADMIN_KEY` repository secret

**External APIs**
- Meetup GraphQL `proNetwork.eventsSearch(...).rsvps`
- PHP `mail()` for the topic prompt email

**Safety guard:** the follow-up store is write-checked before any Meetup work. Email sends only when `confirm=send-topic-followups`; sent state is idempotent in `MOJO_MEETUP_FOLLOWUP_STORE`.

---

## `GET /api/meetup-admin?action=send-sms-reminders`

Admin/cron action that sends due Twilio SMS reminders for registrants who explicitly opted in. It sends private token-based event reminders and recurring public `/learn/` reminders for upcoming events in each subscriber's selected Meetup chapter.

**Request shape:** query params
```
action=send-sms-reminders
confirm=send-sms-reminders  (required to send SMS; otherwise dry-run)
```

**Producers (serves the endpoint)**
- `api/meetup-admin.php` - admin-gated Twilio reminder sender

**Consumers**
- cPanel cron or manual admin call using `MEETUP_ADMIN_KEY`

**External APIs**
- Twilio Messages REST API

**Schedule**
- Evening-before reminder: 6:00 PM event-local time the day before
- Day-of reminder: 4:00 PM event-local time the day of

**Idempotency**
- Private reminders are tracked by invite/subscription token and reminder slot.
- Public `/learn/` reminders are tracked by public subscription ID, Meetup event ID, and reminder slot.

---

---

## `POST /sellers/sign-contract` (Firebase Cloud Function)

Validates seller token and records contract signature. Updates seller status from `pending_contract` to `pending_bank_info`.

**Request shape:** JSON body
```
{
  email:              string  (required, validated as email)
  contactName:        string  (required)
  sellerToken:        string  (required, must match seller record)
  contractVersion:    string  (required, e.g. "1.0")
}
```

**Response shape:**
```
200  { "ok": true, "message": "Contract signed successfully" }
400  { "ok": false, "message": "Missing required fields" }
401  { "ok": false, "message": "Invalid token" }
404  { "ok": false, "message": "Seller record not found" }
500  { "ok": false, "message": "Server error" }
```

**Producers (serves the endpoint)**
- `functions/index.js:234` — `exports.signContract` — validates token, updates Firestore

**Consumers (calls the endpoint)**
- `products/pages/seller-onboarding.html` — signs contract form

**Security:** Validates seller token and IP address for audit trail

---

## `POST /sellers/submit-bank-info` (Firebase Cloud Function)

Collects seller bank details, encrypts with AES-256-GCM, and stores in Firestore. Updates seller status to `active`.

**Request shape:** JSON body
```
{
  email:              string  (required, validated as email)
  sellerToken:        string  (required, must match seller record)
  accountNumber:      string  (required)
  routingNumber:      string  (required)
  accountHolder:      string  (required)
  bankName:           string  (optional)
}
```

**Response shape:**
```
200  { "ok": true, "message": "Bank details saved securely" }
400  { "ok": false, "message": "Missing required fields" | "Seller has not signed contract yet" }
401  { "ok": false, "message": "Invalid token" }
404  { "ok": false, "message": "Seller record not found" }
500  { "ok": false, "message": "Server error" }
```

**Producers (serves the endpoint)**
- `functions/index.js:303` — `exports.submitBankInfo` — encrypts with `functions/encryption.js`, stores in Firestore

**Consumers (calls the endpoint)**
- `products/pages/seller-onboarding.html` — bank details form

**Security:** Bank details encrypted with AES-256-GCM using `SELLER_ENCRYPTION_KEY`; token validated; requires contract signed first

---

## `POST /sellers/create-from-product-submission` (Firebase Cloud Function)

Creates or updates seller record when product is submitted. Generates seller token and responds with token (caller must email it to seller).

**Request shape:** JSON body
```
{
  email:        string  (required, validated as email)
  contactName:  string  (required)
  productName:  string  (required)
}
```

**Response shape:**
```
200  { "ok": true, "sellerToken": "...", "message": "Seller record created..." }
400  { "ok": false, "message": "Missing required fields" }
500  { "ok": false, "message": "Server error" }
```

**Producers (serves the endpoint)**
- `functions/index.js:371` — `exports.createSellerFromProductSubmission` — creates/updates seller record

**Consumers (calls the endpoint)**
- `scripts/product-form.js:47` — called after `/api/submit-product` succeeds

**Adjacent constraint:**
- Generates random 32-byte seller token
- Response includes token but does NOT send email; form handler must email the seller with onboarding link
- If seller already exists, regenerates token and adds product to list

---

## Summary

| Endpoint | Method | Serves | Calls | Status |
|----------|--------|--------|-------|--------|
| `/api/submit-brief` | POST | `api/submit-brief.php` | `brief-form.js:34` | ✓ |
| `/api/send-seller-onboarding-email` | POST | `api/send-seller-onboarding-email.php` | `product-form.js:47` | new |
| `polarWebhook` (Cloud Function) | POST | `functions/index.js:40` | Polar.sh (external) | ✓ |
| `/api/sms-reminders` | POST | `api/sms-reminders.php` | `watch/sms/index.html` | active |
| `/api/meetup-admin?action=poll-sms-invites` | GET | `api/meetup-admin.php` | cPanel cron/manual admin | active |
| `/api/meetup-admin?action=test-sms-store` | GET | `api/meetup-admin.php` | manual admin | active |
| `/api/meetup-admin?action=send-admin-sms` | GET | `api/meetup-admin.php` | manual admin | active |
| `/api/meetup-admin?action=send-topic-followups` | GET | `api/meetup-admin.php` | GitHub Actions cron/cPanel cron/manual admin | active |
| `/api/meetup-admin?action=send-sms-reminders` | GET | `api/meetup-admin.php` | cPanel cron/manual admin | active |
| `/sellers/sign-contract` (Cloud Function) | POST | `functions/index.js:234` | `seller-onboarding.html` | new |
| `/sellers/submit-bank-info` (Cloud Function) | POST | `functions/index.js:303` | `seller-onboarding.html` | new |
| `/sellers/create-from-product-submission` (Cloud Function) | POST | `functions/index.js:371` | `product-form.js:47` | new |
| `/sellers/request-payout` (Cloud Function) | POST | `functions/index.js:472` | seller dashboard (future) | new |
| `/sellers/complete-payout` (Cloud Function) | POST | `functions/index.js:575` | `admin-payouts.js:180` | new |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-28T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** API Endpoints

**Evidence recorded:**
- 2 endpoint entries with complete producer/consumer pairs ✓
- 0 entries with gaps ⚠
- Prior registry replaced: stale Stripe/email-handler/watch-redirect entries removed
- New identifiers introduced on this audit: `/api/submit-brief`, `polarWebhook`
- Registries match current code diff: yes

**Gaps identified:** none

**Status:** Audit complete
