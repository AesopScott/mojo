# Stripe Configuration Registry

Every Stripe-related configuration point and integration in this project. For each: what must be configured, where it's set, where it's used, validation requirements.

---

## Stripe Account Setup

Main account creation and initial configuration.

**Required:** Yes (blocking for Task 2.5)

**Configured in:** Stripe Dashboard (external service)

**What gets configured:**
- Account basics (business name, email, country)
- Payment methods (credit card processing)
- API keys (publishable and secret)
- Test vs. live mode keys
- Webhook endpoint URL (after domain is live)

**Used in:** 
- Task 1.4 — creates account and obtains keys
- Task 2.5 — uses keys for payment processing
- Task 5.2 — switches between test and live mode
- Proof unit 4 — tests with test card (4242...)

**Adjacent constraint:** Stripe account needs identity verification (1-2 hours). Task 1.4 must account for this delay.

**Status:** ⚠ blocker dependency — Task 2.5 cannot proceed until account is created and API keys are obtained.

---

## `STRIPE_PUBLISHABLE_KEY`

Publishable API key (can be exposed to client).

**Configured in:** Stripe Dashboard → Developers → API Keys → Copy Publishable Key

**Set in:** `.env` file (Task 1.4)

**Used in:**
- `products/scripts/checkout.js:*` — initializes Stripe.js client library (Task 2.5)
- Stripe.js requires this to create payment forms and elements

**Format:** Begins with `pk_test_` (test mode) or `pk_live_` (live mode)

**Test vs. Live:** 
- Test mode key starts with `pk_test_`
- Live mode key starts with `pk_live_`
- Must match mode of secret key

**Validation:** Must be set and correct format before Task 2.5 runs.

**Status:** ⚠ no validation task — recommend Task 5.2 validate key is set and format matches mode.

---

## `STRIPE_SECRET_KEY`

Secret API key (must NEVER be exposed to client).

**Configured in:** Stripe Dashboard → Developers → API Keys → Copy Secret Key

**Set in:** `.env` file (Task 1.4), injected into backend runtime

**Used in:**
- `api/stripe-webhook.js:*` — validates webhook signatures using secret key (Task 2.5)
- `api/stripe-webhook.js:*` — queries Stripe API to confirm payment status (Task 2.5)
- Backend middleware — enforces that secret key is never logged or sent to client

**Format:** Begins with `sk_test_` (test mode) or `sk_live_` (live mode)

**Test vs. Live:**
- Test mode key starts with `sk_test_`
- Live mode key starts with `sk_live_`
- Must match mode of publishable key

**Security constraint:** MUST NOT be sent to client. Must be stored in `.env` (in `.gitignore`). Must not be logged.

**Validation:** Must be set, correct format, and different from publishable key. Should never appear in client bundle.

**Status:** ⚠ no validation task — recommend Task 5.2 validate secret key is set and NEVER sent to client.

---

## Stripe Webhook Endpoint

URL where Stripe sends payment events (charge.succeeded, invoice.paid, etc.).

**Configured in:** Stripe Dashboard → Developers → Webhooks → Add endpoint

**Endpoint URL:** `https://MojoAiStudio.com/api/stripe-webhook`

**Events to listen for:**
- `charge.succeeded` — payment processed
- `charge.failed` — payment declined
- `charge.refunded` — refund issued
- (others as needed)

**Set in:** Task 2.5 (code-side) and Stripe Dashboard (configuration-side)

**Used in:**
- Task 2.5 — `/api/stripe-webhook` endpoint receives and processes events
- Stripe — sends HTTP POST to endpoint when events occur

**Validation:** 
- Endpoint must be publicly accessible (not localhost)
- Endpoint must be live and accepting POST requests before configuring in Stripe
- Must validate webhook signature in code (`api/stripe-webhook.js`)

**Signature validation:** Stripe sends `Stripe-Signature` header. Code must validate using `STRIPE_SECRET_KEY`.

**Adjacent constraint:** Webhook URL cannot be registered until site is deployed (Task 5.4). Recommend:
1. Deploy site to MochaHost (Task 5.4)
2. Get live URL
3. Register webhook endpoint in Stripe Dashboard
4. Test with real webhook events

**Status:** ⚠ orphan consumer — endpoint defined in code (Task 2.5) but **no task documents registering the URL in Stripe Dashboard**. This must be done manually or as part of Task 5.2/5.4.

---

## Test Mode vs. Live Mode

Mode switching for development and production.

**Test Mode (development):**
- Use `pk_test_*` and `sk_test_*` keys
- Test credit card: `4242 4242 4242 4242`
- Transactions are not real; no money changes hands
- Used in Task 5.1, 5.2 (proof unit 4)

**Live Mode (production):**
- Use `pk_live_*` and `sk_live_*` keys
- Real credit cards; real transactions
- Used in production deployment (after Task 5.2 verification)

**Switching:** 
- Update `.env` with live keys before deploying to production
- Must be done in same commit as environment change (Task 5.2)
- Both keys must be in same mode (test-test or live-live)

**Validation:** Task 5.2 must test in test mode first, then switch and validate live mode before going live.

**Status:** ✓ (process documented in outline)

---

## Stripe Checkout Session

Client-side integration for payment forms.

**Configured in:** `products/scripts/checkout.js` (Task 2.5)

**How it works:**
1. User clicks "Proceed to Checkout" in cart
2. Client-side code (`checkout.js`) initializes Stripe.js with publishable key
3. Stripe.js creates payment form (card input fields)
4. User enters card details
5. Client-side code sends payment details to server
6. Server creates Stripe PaymentIntent or Charge
7. Server returns client secret to client
8. Client confirms payment with Stripe
9. Stripe processes payment
10. Webhook notifies server of success/failure

**Integration points:**
- Client initialization: `Stripe('pk_test_...')` in checkout.js
- Server-side Charge/Intent creation: not yet detailed in plan
- Webhook listening: `api/stripe-webhook.js`

**Status:** ⚠ incomplete detail — plan doesn't specify whether to use PaymentIntent or Charge API, or full server-side flow. Task 2.5 should document exact integration pattern.

---

## Error Handling

Payment processing error handling and user communication.

**Error types:**
- Card declined (insufficient funds, etc.)
- Network failure (Stripe unavailable)
- Invalid payment method
- Webhook timeout/failure

**Handled in:**
- `products/scripts/checkout.js:*` — catches client-side errors, displays to user (Task 2.5)
- `api/stripe-webhook.js:*` — catches server-side errors, retries webhook (Task 2.5)

**User-facing behavior:**
- Declined card → show error message, allow retry
- Network error → retry or show "try again later"
- Success → redirect to confirmation page with order number

**Logging:**
- Server errors must be logged (not exposed to client)
- Client errors shown to user in friendly terms

**Status:** ⚠ not detailed in plan — Task 2.5 should document error handling strategy for each error type.

---

## Summary

| Configuration | Required | Set In | Used In | Status |
|---------------|----------|--------|---------|--------|
| Stripe Account | yes | Stripe Dashboard | Task 1.4, 2.5, 5.2 | ⚠ 1-2 hr delay for verification |
| Publishable Key | yes | Stripe → `.env` | Task 2.5 client | ⚠ no validation task |
| Secret Key | yes | Stripe → `.env` | Task 2.5 webhook | ⚠ no validation, security risk |
| Webhook Endpoint | yes | Task 2.5 code + Stripe Dashboard | Task 2.5 | ⚠ no task documents Dashboard registration |
| Test vs. Live Mode | yes | `.env` keys | Task 5.2 deployment | ✓ (process outlined) |
| Checkout Session | yes | `products/scripts/checkout.js` | Task 2.5 | ⚠ integration pattern not detailed |
| Error Handling | yes | Task 2.5 | user, server logs | ⚠ not detailed in plan |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-24T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** Stripe Configuration

**Evidence recorded:**
- 7 configuration entries identified
- 2 entries documented in plan ✓
- 5 entries with gaps (missing validation, registration, implementation detail) ⚠
- New identifiers introduced on this task: Stripe account, API keys, webhook endpoint, test/live mode switching
- Registries match current plan (3-Build_Plan.md): yes (but plan is incomplete on Stripe details)

**Gaps identified:**
- No validation task for API keys before use
- Webhook endpoint registration not assigned to any task
- Secret key security validation not documented
- Checkout session integration pattern incomplete in plan
- Error handling strategy not detailed

**Status:** Audit complete (pre-implementation) — registries identify Stripe integration gaps that should be addressed before Task 2.5 begins.
