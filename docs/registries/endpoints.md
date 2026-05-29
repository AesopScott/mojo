# API Endpoints Registry

Every HTTP endpoint served by this project. For each: who serves it, who calls it, URL routing, request/response shape, status. Update whenever an endpoint is added, renamed, or its shape changes.

> **Note:** This registry replaced a stale prior version (2026-05-24) that documented Stripe-webhook and email-handler endpoints from an earlier architecture. Those endpoints do not exist in the codebase — Stripe was replaced by Polar.sh and PHP `mail()` is used directly.

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

Receives a Meetup registrant's SMS reminder opt-in from `/watch/sms/?token=...`, validates the invite token, records consent, and stores the phone number only for event reminder use.

**Request shape:** JSON body
```
{
  token:   string  (required; invite token created by Meetup polling)
  phone:   string  (required; US or E.164-style phone number)
  consent: boolean (required; must be true)
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

**Adjacent constraint:** The phone number is stored with `purpose: "event_sms_reminder_only"` and the explicit consent text in `api/sms-reminder-lib.php`.

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

## `GET /api/meetup-admin?action=send-sms-reminders`

Admin/cron action that sends due Twilio SMS reminders for registrants who explicitly opted in.

**Request shape:** query params
```
action=send-sms-reminders
lead_hours=24   (optional; 1-168)
confirm=send-sms-reminders  (required to send SMS; otherwise dry-run)
```

**Producers (serves the endpoint)**
- `api/meetup-admin.php` - admin-gated Twilio reminder sender

**Consumers**
- cPanel cron or manual admin call using `MEETUP_ADMIN_KEY`

**External APIs**
- Twilio Messages REST API

---

## Summary

| Endpoint | Method | Serves | Calls | Status |
|----------|--------|--------|-------|--------|
| `/api/submit-brief` | POST | `api/submit-brief.php` | `brief-form.js:34` | ✓ |
| `polarWebhook` (Cloud Function) | POST | `functions/index.js:40` | Polar.sh (external) | ✓ |
| `/api/sms-reminders` | POST | `api/sms-reminders.php` | `watch/sms/index.html` | active |
| `/api/meetup-admin?action=poll-sms-invites` | GET | `api/meetup-admin.php` | cPanel cron/manual admin | active |
| `/api/meetup-admin?action=test-sms-store` | GET | `api/meetup-admin.php` | manual admin | active |
| `/api/meetup-admin?action=send-sms-reminders` | GET | `api/meetup-admin.php` | cPanel cron/manual admin | active |

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
