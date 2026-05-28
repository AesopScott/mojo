# Polar Product IDs Registry

Every Polar.sh product ID used in this project. For each: where the ID is defined, where it flows to, and what it controls. Update whenever a Polar product is created, archived, or its ID changes.

Product IDs flow: `scripts/mockups.js` (defines `polarPriceId`) → `products/scripts/listing.js` (reads and sets `data-polar-checkout` on Subscribe CTA) → Polar `embed.js` (intercepts click and opens checkout overlay).

---

## GAIN — Standard Plans

### `636b0777-d111-414e-968c-455bd5161d3d` — GAIN Pro

**Plan:** GAIN Pro · $100/mo · 1 workspace · up to 10 members · up to 15 AI systems

**Producers**
- `scripts/mockups.js:19` — `polarPriceId: '636b0777-d111-414e-968c-455bd5161d3d'` on `gainPlans[id='pro']`

**Consumers**
- `products/scripts/listing.js:141` — `cta.setAttribute('data-polar-checkout', plan.polarPriceId)` when Pro tab is selected
- Polar `embed.js` (CDN) — intercepts clicks on `[data-polar-checkout]` and opens checkout overlay

**Status:** ✓

---

### `54ceb640-dba6-4fb3-94ef-9ca4a93d6fb5` — GAIN Business

**Plan:** GAIN Business · $250/mo · 3 workspaces · up to 25 members · up to 35 AI systems (featured/default)

**Producers**
- `scripts/mockups.js:41` — `polarPriceId: '54ceb640-dba6-4fb3-94ef-9ca4a93d6fb5'` on `gainPlans[id='business']`

**Consumers**
- `products/scripts/listing.js:141` — sets `data-polar-checkout` when Business tab is selected (default on dialog open)

**Status:** ✓

---

### `f95729d1-af9a-4025-8929-b9ba83a174f1` — GAIN Enterprise

**Plan:** GAIN Enterprise · $500/mo · unlimited workspaces · unlimited members

**Producers**
- `scripts/mockups.js:59` — `polarPriceId: 'f95729d1-af9a-4025-8929-b9ba83a174f1'` on `gainPlans[id='enterprise']`

**Consumers**
- `products/scripts/listing.js:141` — sets `data-polar-checkout` when Enterprise tab is selected

**Status:** ✓

---

## GAIN — MSSP Plans

### `e0063c13-5909-4059-b33c-dc94c1576496` — GAIN Pro MSSP

**Plan:** GAIN Pro MSSP · $100/mo · up to 10 client workspaces

**Producers**
- `scripts/mockups.js:85` — `polarPriceId: 'e0063c13-5909-4059-b33c-dc94c1576496'` on `gainMsspPlans[id='pro-mssp']`

**Consumers**
- `products/scripts/listing.js:214` — `cta.setAttribute('data-polar-checkout', plan.polarPriceId)` when Pro MSSP tab is selected

**Status:** ✓

---

### `a3db7a0e-d1ef-451b-a93f-7ce817af5b79` — GAIN Business MSSP

**Plan:** GAIN Business MSSP · $250/mo · up to 25 client workspaces (featured/default)

**Producers**
- `scripts/mockups.js:108` — `polarPriceId: 'a3db7a0e-d1ef-451b-a93f-7ce817af5b79'` on `gainMsspPlans[id='business-mssp']`

**Consumers**
- `products/scripts/listing.js:214` — sets `data-polar-checkout` when Business MSSP tab is selected (default on dialog open)

**Status:** ✓

---

### `c61fc9b0-e99a-4ae9-9365-63b18e3b103e` — GAIN Enterprise MSSP

**Plan:** GAIN Enterprise MSSP · $500/mo · up to 100 client workspaces

**Producers**
- `scripts/mockups.js:129` — `polarPriceId: 'c61fc9b0-e99a-4ae9-9365-63b18e3b103e'` on `gainMsspPlans[id='enterprise-mssp']`

**Consumers**
- `products/scripts/listing.js:214` — sets `data-polar-checkout` when Enterprise MSSP tab is selected

**Status:** ✓

---

## Polar Organization Slug

**`mind-share-media-llc`** — configures the Polar embed

- `products/index.html:289` — `window.polar.queue.push(['configure', { organization: 'mind-share-media-llc' }])` — must match the actual Polar org slug

This is not a product ID but is a required companion to the product IDs above. If the org slug changes, the embed will stop working even if product IDs are valid.

---

## Summary

| Product ID | Plan | Price | Defined In | Status |
|------------|------|-------|-----------|--------|
| `636b0777...` | GAIN Pro | $100/mo | `mockups.js:19` | ✓ |
| `54ceb640...` | GAIN Business | $250/mo | `mockups.js:41` | ✓ |
| `f95729d1...` | GAIN Enterprise | $500/mo | `mockups.js:59` | ✓ |
| `e0063c13...` | GAIN Pro MSSP | $100/mo | `mockups.js:85` | ✓ |
| `a3db7a0e...` | GAIN Business MSSP | $250/mo | `mockups.js:108` | ✓ |
| `c61fc9b0...` | GAIN Enterprise MSSP | $500/mo | `mockups.js:129` | ✓ |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-28T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** Polar Product IDs

**Evidence recorded:**
- 6 product ID entries with complete producer/consumer pairs ✓
- 0 entries with gaps ⚠
- New identifiers introduced on this audit: all 6 product IDs + org slug
- Registries match current code diff: yes

**Gaps identified:** none

**Status:** Audit complete
