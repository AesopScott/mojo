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

## Summary

| Collection | Producers | Consumers | Rule | Index | Status |
|------------|-----------|-----------|------|-------|--------|
| `purchases` | `functions/index.js` (Admin SDK) | `firestore.rules`, `firestore.indexes.json` | ✓ | ✓ | ✓ |
| `users` | none in repo | `firestore.rules` | ✓ | — | ⚠ orphan consumer |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-28T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** Firestore Collections

**Evidence recorded:**
- 1 entry with complete producer/consumer pair ✓
- 1 entry with gaps ⚠
- New identifiers introduced on this audit: `purchases`, `users`
- Registries match current code diff: yes

**Gaps identified:**
- `users` collection — protected by rules, no writer in this repo; portal not yet implemented

**Status:** Audit complete
