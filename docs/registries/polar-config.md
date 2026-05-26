# Polar.sh Configuration Registry

Every Polar.sh integration point for the Mojo AI Studio products marketplace.
Polar.sh handles all subscription checkout for `/products`. Custom development services
use the PHP email endpoint instead (see `endpoints.md`).

---

## Polar.sh Account Setup

**Required:** Yes — must be done before any Subscribe buttons go live.

**Steps:**
1. Create an account at https://polar.sh
2. Create an organization — use slug `mojo-ai-studio` (or update `POLAR_ORG_SLUG` in `products/index.html`)
3. Create one product per app in the catalog (9 products + 3 bundles = 12 total)
4. For each product, create a monthly recurring price
5. Copy the **Price ID** (not the Product ID) for each — these are what `data-polar-checkout` attributes need
6. Replace every `POLAR_*_PRICE_ID` placeholder in `products/index.html` and `products/data/products.json`

**Status:** ⚠ not yet created — all checkout buttons show placeholder IDs.

---

## Organization Slug

The Polar.sh organization identifier used in the SDK configuration.

**Set in:** `products/index.html` — inline `<script>` block near `</body>`:
```js
window.polar.queue.push(['configure', { organization: 'POLAR_ORG_SLUG' }]);
```

**Replace:** `POLAR_ORG_SLUG` → your actual organization slug from Polar.sh → Settings → General.

**Status:** ⚠ placeholder — update after account creation.

---

## Polar.js SDK

Client-side JavaScript that intercepts `[data-polar-checkout]` attribute clicks and opens a Polar.sh checkout overlay.

**Loaded in:** `products/index.html` (async, near `</body>`):
```html
<script async src="https://cdn.polar.sh/embed.js"></script>
```

**How it works:** Any element with `data-polar-checkout="PRICE_ID"` — link or button — opens the Polar checkout modal when clicked. No additional JavaScript needed.

**Status:** ✓ script tag present — will activate once real Price IDs replace placeholders.

---

## Price IDs (one per product)

Each Subscribe button needs the **Price ID** of the corresponding Polar.sh product price.
Price IDs are found in Polar.sh Dashboard → Products → [Product] → Prices → copy the ID.

**GAIN (live — wired to Polar overlay):**

| Plan | Price ID | Price |
|---|---|---|
| GAIN Pro | `636b0777-d111-414e-968c-455bd5161d3d` | $100/mo |
| GAIN Business | `54ceb640-dba6-4fb3-94ef-9ca4a93d6fb5` | $250/mo |
| GAIN Enterprise | `f95729d1-af9a-4025-8929-b9ba83a174f1` | $500/mo |

**Future products (placeholders — replace when Polar products are created):**

| Placeholder | Product | Price |
|---|---|---|
| `POLAR_LEADLENS_SUITE_PRICE_ID` | LeadLens Revenue Suite | $149/mo |
| `POLAR_LEADLENS_PRICE_ID` | LeadLens | $29/mo |
| `POLAR_FLOWDESK_PRICE_ID` | FlowDesk | $79/mo |
| `POLAR_CLAUSEPILOT_PRICE_ID` | ClausePilot | $89/mo |
| `POLAR_CLIPSMITH_PRICE_ID` | ClipSmith | $39/mo |
| `POLAR_BRIEFFORGE_PRICE_ID` | BriefForge | $49/mo |
| `POLAR_DATACONCIERGE_PRICE_ID` | Data Concierge | $59/mo |
| `POLAR_MEETINGMEMORY_PRICE_ID` | Meeting Memory | $35/mo |
| `POLAR_PROMPTVAULT_PRICE_ID` | Prompt Vault | $25/mo |
| `POLAR_BUNDLE_REVENUE_PRICE_ID` | Revenue Stack bundle | $199/mo |
| `POLAR_BUNDLE_OPERATOR_PRICE_ID` | Operator Stack bundle | $179/mo |
| `POLAR_BUNDLE_CREATOR_PRICE_ID` | Creator Stack bundle | $129/mo |

**Where to update:**
- `products/index.html` — `data-polar-checkout` attributes on every Subscribe link
- `products/data/products.json` — `polarPriceId` field per product (reference/documentation)

**Status:** ⚠ all 12 are placeholders — replace after creating products in Polar Dashboard.

---

## Product Benefits (license keys)

Polar can automatically issue license keys to subscribers as an "Automated Benefit."
GAIN Pro is the first product configured this way.

### GAIN — Pro License

| Setting | Value |
|---|---|
| Benefit type | License Keys |
| Description | Pro License |
| Key prefix | `pro` → keys are issued as `pro-XXXXXXXX-…` |
| Expires | ✓ 1 Month — auto-renewed each billing cycle |
| Limit Activations | ✗ off |
| Limit Usage | ✗ off |

**How it works:** When a customer completes checkout, Polar issues a `pro-…` key and emails it to them. The key expires after 1 month but is automatically renewed as long as the subscription is active. If the subscription lapses, the key expires and GAIN should downgrade the account to Free.

**GAIN must validate keys server-side** via the Polar License Keys API:
```
POST https://api.polar.sh/v1/users/licenses/validate
Authorization: Bearer <POLAR_ACCESS_TOKEN>
{ "key": "pro-…", "organization_id": "…" }
```
Returns `{ "valid": true/false, "expires_at": "…" }`. Gate Pro features on `valid: true`.

**Status:** ✓ configured in Polar Dashboard for GAIN Pro product.

---

## Polar.sh Webhook (optional)

Polar.sh can send webhook events (subscription created, cancelled, etc.) to a server endpoint.

**If needed:** Create `api/polar-webhook.php` to handle events (e.g., send a welcome email on new subscription).
**Endpoint to register:** `https://MojoAiStudio.com/api/polar-webhook`
**Events to consider:** `subscription.created`, `subscription.cancelled`, `order.created`

**Status:** ⏳ not implemented — low priority for initial launch. Add when post-purchase automation is needed.

---

## Development Services — Not Polar

Custom development services (the `/development` brief form) do NOT use Polar.sh.
They use the PHP email endpoint (`api/submit-brief.php`). Polar.sh cannot represent
open-ended service engagements — only fixed-price digital products and subscriptions.

**Services flow:** `/development` → brief form → `POST /api/submit-brief` → PHP `mail()` → `admin@MojoAiStudio.com`

---

## Summary

| Configuration | Required | Where | Status |
|---|---|---|---|
| Polar.sh account + org | yes | polar.sh dashboard | ⚠ not created |
| Org slug in HTML | yes | `products/index.html` | ⚠ placeholder |
| Polar.js SDK script | yes | `products/index.html` | ✓ present |
| 12 product Price IDs | yes | HTML + products.json | ⚠ all placeholders |
| GAIN Pro license key benefit | yes | polar.sh dashboard | ✓ configured |
| Polar API key (gain-production) | yes | `POLAR_ACCESS_TOKEN` env var in GAIN | ✓ created |
| GAIN checkout link (`gain-checkout`) | yes | "Upgrade to Pro" button on governainow.com | ✓ created |
| License key validation in GAIN | yes | governainow.com codebase | ⏳ not built |
| Polar webhook (GAIN) | yes | `https://governainow.com/api/polar-webhook` | ✓ registered in Polar / ⏳ endpoint not built |

---

## Audit Trail

**Last update:** 2026-05-26 — added GAIN Pro license key benefit config; added license key validation spec.

**2026-05-25** — replaced Stripe configuration with Polar.sh after switching payment platforms.

**Previous registry:** `stripe-config.md` — archived; Stripe is no longer used on this project.
