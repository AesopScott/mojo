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

## Summary

| Endpoint | Method | Serves | Calls | Status |
|----------|--------|--------|-------|--------|
| `/api/submit-brief` | POST | `api/submit-brief.php` | `brief-form.js:34` | ✓ |
| `polarWebhook` (Cloud Function) | POST | `functions/index.js:40` | Polar.sh (external) | ✓ |

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
