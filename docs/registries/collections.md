# Firestore Collections Registry

Every Firestore collection used in this project. For each: producers, consumers, security rules, indexes, status. Update whenever a collection is added, removed, or its schema changes.

---

## `purchases`

Subscription and order records written by the Polar.sh webhook function. Each document is keyed by the Polar order ID or subscription ID.

**Schema:**
```
{
  userId:              string | null   — Firebase UID matched by email; null if user has no portal account
  customerEmail:       string
  polarOrderId:        string | null
  polarSubscriptionId: string | null   — subscriptions only
  planName:            string          — e.g. "GAIN — Business"
  planTier:            string          — "pro" | "business" | "enterprise"
  amount:              number          — cents, e.g. 25000
  currency:            string          — "usd"
  status:              string          — "active" | "cancelled" | "past_due" | "trialing"
  createdAt:           Timestamp
  updatedAt:           Timestamp       — subscription updates only
  renewalDate:         Timestamp | null
}
```

**Producers**
- `functions/index.js:113` — `db.collection('purchases').doc(order.id).set(doc, { merge: true })` — order.created webhook
- `functions/index.js:143` — `db.collection('purchases').doc(docId).set(doc, { merge: true })` — subscription.* webhook
- Both use Admin SDK, which bypasses Firestore security rules ✓ (intentional)

**Consumers**
- `firestore.rules:12` — `match /purchases/{purchaseId}` — read allowed if `resource.data.userId == request.auth.uid`; write blocked (webhook only)
- `firestore.indexes.json:4` — compound index on `userId ASC + createdAt DESC` for per-user purchase history queries

**Rule:** present ✓
**Index:** present ✓ (userId + createdAt)

**Status:** ✓

---

## `users`

User profile documents. Rules are present but **no code in this project writes to this collection**.

**Schema:** unknown — not defined in code

**Producers**
- None in this codebase

**Consumers**
- `firestore.rules:6` — `match /users/{userId}` — read/write allowed if `request.auth.uid == userId`

**Rule:** present (read/write by owner)
**Index:** none

**Status:** ⚠ orphan consumer — rules exist but nothing writes to this collection. The `portal/index.html` page has no client-side Firestore code. Either the portal is not yet implemented, or writes happen outside this repo. Document the intent to prevent re-flagging.

---

## `sellers`

Seller onboarding records. Created when a product is submitted, updated as seller completes contract signing and bank verification.

**Schema:**
```
{
  email:                 string          — seller's email address
  contactName:           string          — seller's name
  productIds:            array<string>   — product IDs listed by this seller
  status:                string          — "pending_contract" | "pending_bank_info" | "active"
  
  contractSignedAt:      Timestamp | null
  contractVersion:       string | null   — version of contract signed
  contractIpAddress:     string | null   — IP address at time of signature
  
  encryptedBankDetails:  string          — AES-256-GCM encrypted JSON (base64)
  bankDetailsStatus:     string          — "pending" | "verified" | "invalid"
  
  availableBalance:      number          — cents, earned commissions pending payout
  totalEarnings:         number          — cents, lifetime earnings
  
  commissionRate:        number          — 0.9 (90% to seller, 10% to Mojo)
  listingFee:            number          — cents, $100 listing fee per product
  
  createdAt:             Timestamp
  updatedAt:             Timestamp
}
```

**Producers**
- `api/sellers/sign-contract.php` — creates seller record on product submission + updates after contract sign
- `functions/sellers.js` — updates availableBalance when sales are processed

**Consumers**
- `firestore.rules:19` — read allowed if `request.auth.email == resource.data.email`; write blocked (backend only)

**Rule:** present ✓
**Index:** needed on `email ASC` for lookups; on `email ASC + status ASC` for admin queries

**Status:** new collection, Phase 1

---

## `contracts`

Versioned seller contract terms. Each version is a separate document.

**Schema:**
```
{
  version:        string      — e.g. "1.0", "2.0"
  content:        string      — HTML or markdown contract terms
  active:         boolean     — true if this is the current contract version
  createdAt:      Timestamp
}
```

**Producers**
- Admin manual entry (via Firebase Console or backend script)

**Consumers**
- `products/pages/seller-onboarding.html` — displays contract from Firestore before seller signs
- `firestore.rules:23` — read allowed for all (public contract terms)

**Rule:** present ✓ (public read)
**Index:** none needed

**Status:** new collection, Phase 1

---

## `sales`

Sales transaction records. Created when the Polar.sh webhook processes a purchase.

**Schema:**
```
{
  productId:        string      — product being purchased
  sellerId:         string      — seller ID (email)
  amount:           number      — cents, sale amount
  commission:       number      — cents, seller's commission (90% of amount)
  polarOrderId:     string      — Polar order ID for audit trail
  status:           string      — "completed" | "refunded"
  createdAt:        Timestamp
}
```

**Producers**
- `functions/index.js` — Polar webhook handler (Admin SDK) after order confirmation

**Consumers**
- `functions/sellers.js` — monthly payout calculation queries sales by sellerId + date range
- `firestore.rules:26` — read blocked (internal only); write blocked (webhook only)

**Rule:** present ✓
**Index:** needed on `sellerId ASC + createdAt DESC` for payout calculation

**Status:** new collection, Phase 1

---

## `products`

Seller-submitted product listings. Created when seller submits a product; admin links to Polar price ID for sales tracking.

**Schema:**
```
{
  id:               string          — unique product identifier (slug)
  sellerId:         string | null   — seller email (null for Mojo's own products)
  name:             string          — product name
  description:      string          — product description
  category:         string          — e.g. "governance", "sales", "operations"
  tags:             array<string>   — e.g. ["ready", "api", "team"]
  price:            number          — USD price (100 = $1.00)
  billingPeriod:    string          — "month", "year", "one-time"
  
  polarPriceId:     string | null   — Polar price ID for sales tracking (admin sets after creation)
  externalUrl:      string | null   — direct product link if not sold via Polar
  
  status:           string          — "draft" | "pending_review" | "live" | "archived"
  featured:         boolean         — true if featured on marketplace
  featuredLabel:    string | null   — custom featured label
  
  rating:           number | null   — seller rating (0-5)
  setupMinutes:     number | null   — estimated setup time
  integrations:     array<string>   — supported integrations
  inputs:           string | null   — what the product accepts
  outputs:          string | null   — what the product produces
  
  iconColor:        string | null   — color for icon background
  iconLetter:       string | null   — single letter icon
  notes:            string | null   — internal notes
  
  createdAt:        Timestamp
  updatedAt:        Timestamp
  submittedByEmail: string | null   — original submitter email (if different from seller)
}
```

**Producers**
- Seller form (via Cloud Function) - seller creates product listing
- Admin dashboard (manual) - admin sets polarPriceId and status

**Consumers**
- Product listing page - queries active products by category/tags
- Polar webhook - looks up product by polarPriceId to find seller on purchase
- Admin dashboard - manage/review products

**Rule:** present ✓ (read by all, write by backend only)
**Index:** needed on `status ASC + featured DESC` for listing; on `polarPriceId ASC` for webhook lookup

**Status:** new collection, Phase 5

---

## `payout_requests`

Seller payout requests. Created when seller requests withdrawal of earnings.

**Schema:**
```
{
  sellerId:              string          — seller email
  sellerEmail:           string          — duplicate for rule matching
  amount:                number          — cents requested
  requestedAt:           Timestamp
  status:                string          — "pending" | "completed" | "failed"
  
  bankDetailsSnapshot:   object          — decrypted bank details at time of request
    accountNumber:       string
    routingNumber:       string
    accountHolder:       string
    bankName:            string
  
  processedAt:           Timestamp | null
  adminNotes:            string | null
}
```

**Producers**
- `api/sellers/request-payout.php` — seller submits payout request (signed by token)

**Consumers**
- Admin dashboard (manual approval + bank transfer)
- `firestore.rules:29` — read if seller owns request; write to create only

**Rule:** present ✓
**Index:** needed on `status ASC + requestedAt DESC` for admin dashboard

**Status:** new collection, Phase 1

---

## Summary

| Collection | Producers | Consumers | Rule | Index | Status |
|------------|-----------|-----------|------|-------|--------|
| `purchases` | `functions/index.js` (Admin SDK) | `firestore.rules`, `firestore.indexes.json` | ✓ | ✓ | ✓ |
| `users` | none in repo | `firestore.rules` | ✓ | — | ⚠ orphan consumer |
| `sellers` | `api/sellers/*` + `functions/sellers.js` | `firestore.rules`, seller onboarding | ✓ | ⚠ needs index | new |
| `contracts` | admin | `seller-onboarding.html`, `firestore.rules` | ✓ | — | new |
| `products` | seller form + admin | product listing page, Polar webhook | ✓ | ✓ | new |
| `sales` | `functions/index.js` (Polar webhook) | `functions/sellers.js` (payout calc) | ✓ | ✓ | new |
| `payout_requests` | `api/sellers/request-payout.php` | admin dashboard | ✓ | ⚠ needs index | new |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-06-04T00:00:00Z (by Phase 5 implementation)

**Boundaries checked:** Firestore Collections

**Evidence recorded:**
- 6 entries with complete producer/consumer pairs ✓ (purchases, sellers, contracts, products, sales, payout_requests)
- 1 entry with gaps ⚠ (users)
- New identifiers introduced on Phase 5: `products`, `sales`, `payout_requests` (sellers/contracts from earlier phases)
- Registries match current code: yes

**Gaps identified:**
- `users` collection — protected by rules, no writer in this repo; portal not yet implemented
- `sellers` collection — needed index on email ASC for lookups
- `payout_requests` collection — needed index on status ASC + requestedAt DESC

**Status:** Phase 5 implementation in progress
