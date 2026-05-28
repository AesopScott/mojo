# API Endpoints Registry

Every HTTP endpoint and route in this project. For each: what serves it, who calls it, expected request/response shape. Update whenever an endpoint is added, removed, or its interface changes.

---

## GET `/products`

Product marketplace listing page.

**Producers**
- `products/index.html:1` — serves HTML page with product listings (Task 2.2)

**Consumers**
- `products/scripts/listing.js:*` — client-side script that loads product data and renders cards (Task 2.2)
- Browser navigation: user visits `MojoAiStudio.com/products` (proof unit 2)

**Expected behavior:** Page loads with product cards fetched from `products/data/products.json`

**Status:** ✓ (producer and consumer both in plan)

---

## GET `/products/pages/[product-id]`

Individual product detail page.

**Producers**
- `products/pages/[product-id].html:1` — serves detail page template (Task 2.3)
- `products/scripts/detail.js:*` — client-side handler for detail page logic (Task 2.3)

**Consumers**
- `products/scripts/listing.js:*` — links from listing page to detail pages (Task 2.2)
- User clicks "View Details" on product card (proof unit 2)

**Expected behavior:** Detail page loads product data from `products/data/products.json` by ID, displays full description, images, and "Add to Cart" button.

**Status:** ✓ (producer and consumer in plan)

---

## GET `/products/pages/cart.html`

Shopping cart page.

**Producers**
- `products/pages/cart.html:1` — serves cart page (Task 2.4)
- `products/scripts/cart.js:*` — manages cart state and UI (Task 2.4)

**Consumers**
- `products/scripts/listing.js:*` and `products/scripts/detail.js:*` — link to cart page (Task 2.2, 2.3)
- User clicks "View Cart" or cart icon (proof unit 3)

**Expected behavior:** Page loads cart items from localStorage, displays quantity controls, and "Proceed to Checkout" button.

**Status:** ✓ (producer and consumer in plan)

---

## POST `/api/stripe-webhook`

Stripe webhook endpoint for payment events (charge.succeeded, invoice.paid, etc.).

**Producers**
- Stripe Dashboard → sends HTTP POST requests with event data (external service)
- `api/stripe-webhook.js:*` — receives and processes webhook (Task 2.5)

**Consumers**
- `api/stripe-webhook.js:*` — handles webhook, updates order status (Task 2.5)
- Stripe → needs endpoint URL registered in Stripe Dashboard settings (external configuration)

**Expected behavior:** Endpoint receives JSON payload with `type` and `data` fields, validates Stripe signature, processes event (e.g., marks payment as successful), returns 200 OK.

**Shape:** Stripe webhook payload — `{ id, object, api_version, created, data: { object: { ... } }, livemode, pending_webhooks, request, type }`

**Status:** ⚠ orphan consumer — endpoint is defined in code (Task 2.5), but **no task documents registering the endpoint URL in Stripe Dashboard**. This must be done manually or via Stripe API before webhook events can be received. Recommend adding to Task 2.5 or as a separate validation step in Task 5.2.

---

## POST `/api/submit-brief`

Email submission endpoint for /development brief form. Served by PHP on MochaHost; `.htaccess` rewrites `/api/submit-brief` → `/api/submit-brief.php`.

**Producers**
- `api/submit-brief.php:1` — receives POST, validates, sends email via PHP `mail()`, returns JSON
- `.htaccess:8` — Apache rewrite rule strips `.php` extension

**Consumers**
- `scripts/brief-form.js:34` — `fetch('/api/submit-brief', { method: 'POST', headers: { 'Content-Type': 'application/json' } })`
- User submits brief form at `/development/pages/brief.html` (proof unit 5)

**Expected behavior:** Receives JSON body, validates required fields, sends email to `admin@MojoAiStudio.com` via `mail()`, sends auto-reply to submitter, returns `{ "ok": true }` on success or `{ "ok": false, "message": "..." }` with 4xx/5xx status on error.

**Shape:**
```
Request:  POST /api/submit-brief  Content-Type: application/json
Body:     { projectName, contactName, contactEmail, problemDescription,
            currentTools?, timeline?, budget?, anythingElse? }
Response: 200 { "ok": true }
          422 { "ok": false, "message": "Missing required fields: ..." }
          500 { "ok": false, "message": "Email could not be sent..." }
```

**Admin email override:** Set `MOJO_ADMIN_EMAIL` env var in cPanel → PHP → Environment Variables. Defaults to `admin@MojoAiStudio.com`.

**Status:** ✓ implemented — producer (`api/submit-brief.php`) and consumer (`scripts/brief-form.js`) paired. Email service: PHP `mail()` via MochaHost.

---

## GET `/development`

Custom development services landing page.

**Producers**
- `development/index.html:1` — serves services overview page (Task 3.1)

**Consumers**
- Navigation header links to `/development` (Task 1.3, proof unit 1)
- User visits `MojoAiStudio.com/development` (proof unit 5)

**Expected behavior:** Page explains custom AI development process, shows timeline/pricing framework, contains link to `/development/pages/brief.html` form.

**Status:** ✓ (producer and consumer in plan)

---

## GET `/development/pages/brief.html`

Project brief intake form page.

**Producers**
- `development/pages/brief.html:1` — serves form HTML (Task 3.2)
- `development/scripts/form-validation.js:*` — client-side form validation (Task 3.2)

**Consumers**
- `development/index.html:*` — links to brief form (Task 3.1)
- `development/scripts/form-submit.js:*` — handles form submission to `/api/email-handler` (Task 3.3)
- User fills and submits form (proof unit 5)

**Expected behavior:** Form collects project details with validation; on submit, POSTs to `/api/email-handler` and redirects to confirmation page.

**Status:** ✓ (producer and consumer in plan)

---

## GET `/watch`

Learning referral landing page.

**Producers**
- `watch/index.html:1` — serves educational overview page (Task 4.1)

**Consumers**
- Navigation header links to `/watch` (Task 1.3, proof unit 1)
- User visits `MojoAiStudio.com/watch` (proof unit 6)

**Expected behavior:** Page explains AI learning path, contains 2+ CTAs that redirect to `watchmebuildai.com` with referral tracking parameters.

**Status:** ✓ (producer and consumer in plan)

---

## GET → REDIRECT to `watchmebuildai.com`

CTAs on /watch section redirect to external learning platform.

**Producers**
- `watch/scripts/referral.js:*` — CTA click handlers redirect to watchmebuildai.com (Task 4.2)
- `watch/index.html:*` — CTA buttons with href or click handler (Task 4.1)

**Consumers**
- User clicks "Start Learning", "Learn More", etc. (proof unit 6)
- watchmebuildai.com — receives referral traffic (external service)

**Expected behavior:** CTA link contains `?ref=mojoai` or similar referral parameter; user redirected to `https://watchmebuildai.com/subscribe?ref=mojoai`.

**Status:** ⚠ ambiguous decision — watchmebuildai.com referral program requirements not documented. Task 4.3 mentions "if watchmebuildai.com has a referral program", but no confirmation. Recommend validating watchmebuildai.com accepts referral parameters before Task 4.2 implementation.

---

## Summary

| Endpoint | Producers | Consumers | Status |
|----------|-----------|-----------|--------|
| GET `/products` | Task 2.2 | Task 2.2, user browser | ✓ |
| GET `/products/pages/[id]` | Task 2.3 | Task 2.2, Task 2.3, user | ✓ |
| GET `/products/pages/cart.html` | Task 2.4 | Task 2.2, Task 2.3, user | ✓ |
| POST `/api/stripe-webhook` | Stripe, Task 2.5 | Task 2.5, Stripe Dashboard | ⚠ orphan consumer — needs Stripe Dashboard registration |
| POST `/api/submit-brief` | `api/submit-brief.php` | `scripts/brief-form.js`, user | ✓ implemented (PHP mail) |
| GET `/development` | Task 3.1 | Task 1.3, user | ✓ |
| GET `/development/pages/brief.html` | Task 3.2 | Task 3.1, Task 3.3, user | ✓ |
| GET `/watch` | Task 4.1 | Task 1.3, user | ✓ |
| GET → REDIRECT `watchmebuildai.com` | Task 4.2 | user, watchmebuildai.com | ⚠ ambiguous — referral program not confirmed |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-24T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** API Endpoints

**Evidence recorded:**
- 8 endpoint entries identified
- 5 entries with complete producer/consumer pairs ✓
- 3 entries with gaps (orphan consumers, ambiguous decisions) ⚠
- New identifiers introduced on this task: `/products`, `/api/stripe-webhook`, `/api/email-handler`, `/development`, `/watch`, redirect to watchmebuildai.com
- Registries match current plan (3-Build_Plan.md): yes

**Gaps identified:**
- `/api/stripe-webhook` — no task documents Stripe Dashboard webhook URL registration
- Email service choice — Task 1.5 ambiguous; env var names not defined
- watchmebuildai.com referral program — not confirmed; Task 4.3 is optional

**Status:** Audit complete (pre-implementation) — registries serve as contracts for build phase.
