# Seller Marketplace Payout System — Complete Implementation

**Status:** Complete & Ready for Deployment  
**Date Completed:** 2026-06-04  
**Phase:** All 5 phases + product management complete

---

## Executive Summary

Full end-to-end seller marketplace with:
- Seller onboarding (contract + encrypted bank details)
- Product listing management (submit → admin review → publish)
- Automatic sales tracking via Polar webhook (90/10 commission split)
- Payout requests + admin approval system
- Seller dashboard (view balance, earnings, request payouts)
- Admin dashboards (manage payouts, manage products)

**Key Model:** Sellers list products → Mojo handles Polar sales → System automatically credits seller 90% of sale → Seller requests payout → Admin transfers manually from Mojo account

---

## Architecture Overview

### Data Layer (Firestore)

**Collections:**

| Collection | Purpose | Key Fields | Status |
|---|---|---|---|
| `sellers/{email}` | Seller profiles | status, contractSignedAt, encryptedBankDetails, availableBalance, totalEarnings | ✅ |
| `contracts/{version}` | Versioned contract terms | version, content, active, createdAt | ✅ |
| `products/{productId}` | Product listings | sellerId, name, status, polarPriceId, price, featured | ✅ |
| `sales/{saleId}` | Sales records | productId, sellerId, amount, commission, polarOrderId | ✅ |
| `payout_requests/{requestId}` | Payout requests | sellerId, amount, status, bankDetailsSnapshot | ✅ |
| `purchases/{polarOrderId}` | Polar orders | userId, polarOrderId, amount, status (existing) | ✅ |

**Indexes:**
- sellers: email ASC
- products: (status ASC, featured DESC) + (polarPriceId ASC)
- sales: (sellerId ASC, createdAt DESC)
- payout_requests: (status ASC, requestedAt DESC)

**Security Rules:**
- sellers: read if email matches, write by backend only
- products: public read, backend write only
- sales: internal only (admin SDK)
- payout_requests: seller read own, create own, admin update
- contracts: public read

### Encryption

**File:** `functions/encryption.js`  
**Algorithm:** AES-256-GCM  
**Key:** `SELLER_ENCRYPTION_KEY` (Firebase secret, 32-byte base64)  
**Usage:** Encrypts bank details at rest in Firestore, decrypted only for payouts/snapshots

---

## Backend Cloud Functions

**File:** `functions/index.js`

### Existing (Modified)
- `polarWebhook` — Now calls `trackSaleIfApplicable` to create sales records

### New Endpoints

| Endpoint | Method | Purpose | Called By |
|---|---|---|---|
| `signContract` | POST | Seller signs agreement, moves to pending_bank_info | seller-onboarding.html |
| `submitBankInfo` | POST | Seller submits encrypted bank details, moves to active | seller-onboarding.html |
| `createSellerFromProductSubmission` | POST | Creates seller record + generates token after product submit | product-form.js |
| `createProductFromSubmission` | POST | Creates product listing (pending_review) from form | product-form.js |
| `requestPayout` | POST | Seller requests payout, deducts from availableBalance | seller-dashboard.html |
| `completePayout` | POST | Admin marks payout complete (requires admin key) | admin-payouts.html |

**Internal Helpers:**
- `trackSaleIfApplicable(order)` — Polar webhook handler, creates sales + updates seller balance
- `encryptBankDetails(details, key)` — AES-256-GCM encryption
- `decryptBankDetails(data, key)` — AES-256-GCM decryption

---

## Frontend Components

### Seller Onboarding
**File:** `products/pages/seller-onboarding.html`  
**Handler:** `scripts/seller-onboarding.js`

Flow:
1. Load via email + seller token from URL params
2. Display contract from Firestore
3. After signing → show bank details form
4. Encrypt & submit bank details
5. Status → "active"

### Seller Dashboard
**File:** `products/pages/seller-dashboard.html`  
**Handler:** `scripts/seller-dashboard.js`

Features:
- Login with email + seller token
- View available balance & total earnings
- View bank account status (pending/verified)
- Request payouts (with balance validation)
- View payout history (pending/completed)
- View recent sales & commissions

### Product Listing
**File:** `products/index.html` (existing)  
**New Handler:** `scripts/products-loader.js`

- Loads live products from Firestore
- Filters by category & tags
- Renders alongside hardcoded Mojo products
- Public marketplace display

### Product Form
**File:** `scripts/product-form.js` (modified)

New flow:
1. Submit product via `/api/submit-product` (existing PHP)
2. Call `createProductFromSubmission` Cloud Function
3. Call `createSellerFromProductSubmission` Cloud Function
4. Send onboarding email via `/api/send-seller-onboarding-email`

**New File:** `api/send-seller-onboarding-email.php`  
- Sends seller onboarding link with email & token
- Includes explanation of 90/10 split & verification process

---

## Admin Dashboards

### Admin Payouts
**File:** `products/pages/admin-payouts.html`  
**Handler:** `scripts/admin-payouts.js`

- Login with admin key (via sessionStorage)
- View pending payout requests (seller, amount, date)
- Display decrypted bank account info (last 4 digits)
- Mark payouts as complete → updates status
- Shows stats: pending count, pending amount, completed this month

### Admin Products
**File:** `products/pages/admin-products.html`  
**Handler:** `scripts/admin-products.js`

- Login with admin key
- **Pending Review Tab:**
  - Lists products with status=pending_review
  - Admin sets: price (USD), Polar price ID, featured flag
  - Approve button → sets status=live + stores pricing
  - Reject button → deletes product
- **Published Tab:**
  - Lists all live products
  - Shows price, Polar ID, seller
  - Archive button → moves to archived status

---

## Complete User Flows

### 1. Seller Setup
```
1. Seller fills product form (name, description, category, etc)
2. Form submits to /api/submit-product (PHP endpoint)
3. After success:
   a. createProductFromSubmission creates Firestore doc (pending_review)
   b. createSellerFromProductSubmission creates seller record + generates token
   c. Email sent with onboarding link: /seller-onboarding.html?email=X&token=Y
4. Seller clicks email link
5. Views contract from Firestore, signs
6. Fills bank details form (encrypted AES-256)
7. Status changes: pending_contract → pending_bank_info → active
8. Seller receives confirmation email
```

### 2. Product Admin Review
```
1. Admin goes to /admin-products.html
2. Logs in with admin key
3. Sees pending products
4. Reviews product details
5. Sets price (USD) + Polar price ID
6. Toggles featured flag
7. Clicks "Approve & Publish"
8. Product status → live
9. Appears in /products/ marketplace
```

### 3. Product Purchase & Commission
```
1. Customer purchases product via Polar checkout
2. Polar webhook fires → polarWebhook function
3. trackSaleIfApplicable:
   a. Looks up product by polarPriceId
   b. Finds seller from product.sellerId
   c. Creates sales record
   d. Calculates commission: amount × 0.9 (90%)
   e. Updates seller.availableBalance += commission
   f. Updates seller.totalEarnings += commission
4. Seller sees balance increase in dashboard (real-time from Firestore)
```

### 4. Seller Payout Request
```
1. Seller logs into /seller-dashboard.html
2. Views available balance
3. Enters amount to withdraw
4. Clicks "Request Payout"
5. requestPayout endpoint:
   a. Validates: active status, verified bank, sufficient balance
   b. Creates payout_request doc (status=pending)
   c. Deducts amount from availableBalance immediately
6. Seller sees "Payout request submitted" confirmation
7. Payout appears in admin dashboard
```

### 5. Admin Payout Approval
```
1. Admin goes to /admin-payouts.html
2. Logs in with admin key
3. Sees pending payout requests with decrypted bank details (last 4 digits visible)
4. Reviews request, confirms transfer made from Mojo account
5. Clicks "Mark Complete" button
6. completePayout endpoint updates status → completed
7. Seller can see completed payout in dashboard
```

---

## Configuration & Secrets

**Firebase Secrets (set via CLI):**
```bash
firebase functions:secrets:set POLAR_WEBHOOK_SECRET
firebase functions:secrets:set SELLER_ENCRYPTION_KEY
firebase functions:secrets:set ADMIN_PAYOUT_KEY
```

**Environment Variables:**

| Variable | Value | Used By |
|---|---|---|
| `SELLER_ENCRYPTION_KEY` | 32-byte base64 (generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`) | functions/encryption.js |
| `ADMIN_PAYOUT_KEY` | Random string for admin auth | admin-payouts.js, admin-products.js |
| `POLAR_WEBHOOK_SECRET` | From Polar.sh dashboard | functions/index.js (existing) |
| `MOJO_ADMIN_EMAIL` | admin@mojoaistudio.com | api/send-seller-onboarding-email.php (existing) |

**Firestore Contract (Required):**

Create document in Firestore:
- Collection: `contracts`
- Document ID: `1.0`
- Fields:
  ```
  version: "1.0"
  active: true
  content: "[HTML content of seller agreement]"
  createdAt: [timestamp]
  ```

---

## Deployment Steps

1. **Set Firebase Secrets:**
   ```bash
   firebase functions:secrets:set SELLER_ENCRYPTION_KEY
   firebase functions:secrets:set ADMIN_PAYOUT_KEY
   ```

2. **Deploy Firestore Configuration:**
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```

3. **Deploy Cloud Functions:**
   ```bash
   firebase deploy --only functions
   ```

4. **Verify Polar Webhook:**
   - Polar.sh dashboard → Webhooks
   - Set endpoint to Cloud Function URL for `polarWebhook`
   - Test webhook delivery

5. **Create Initial Contract:**
   - Firebase Console → Firestore
   - Create `contracts/1.0` document with seller agreement HTML

6. **Test End-to-End:**
   - Submit product
   - Receive onboarding email
   - Sign contract + enter bank details
   - Verify seller status changes to active
   - Simulate Polar purchase (webhook)
   - Verify sales record created + balance updated
   - Request payout
   - Approve payout in admin dashboard

---

## Files Created

**Backend:**
- `functions/index.js` (modified) — added 6 new Cloud Functions
- `functions/encryption.js` — AES-256-GCM utilities

**Frontend - Seller:**
- `products/pages/seller-onboarding.html` — contract + bank form
- `scripts/seller-onboarding.js` — form handler
- `products/pages/seller-dashboard.html` — balance + earnings view
- `scripts/seller-dashboard.js` — dashboard handler

**Frontend - Product Management:**
- `scripts/product-form.js` (modified) — calls create functions
- `scripts/products-loader.js` — loads Firestore products to marketplace
- `products/pages/admin-products.html` — product review/approve
- `scripts/admin-products.js` — admin handler

**Frontend - Admin:**
- `products/pages/admin-payouts.html` — payout management
- `scripts/admin-payouts.js` — payout handler

**Backend - Email:**
- `api/send-seller-onboarding-email.php` — sends onboarding email

**Configuration:**
- `firestore.rules` (modified) — updated rules for all collections
- `firestore.indexes.json` (modified) — added indexes for products, sales, etc.

**Documentation:**
- `docs/registries/collections.md` (updated) — all Firestore collections
- `docs/registries/endpoints.md` (updated) — all API endpoints
- `docs/registries/env-vars.md` (updated) — secrets + env vars

---

## Key Design Decisions

1. **90/10 Commission Split**
   - Sellers get 90%, Mojo takes 10%
   - Automatic calculation on each sale
   - No manual intervention needed

2. **Bank Details Encryption**
   - AES-256-GCM at rest in Firestore
   - Only decrypted when needed (payouts, snapshots)
   - Key rotated via Firebase secrets

3. **Email-Based Seller Identity**
   - No login system required for MVP
   - Seller email = unique ID in Firestore
   - Token-based onboarding link for verification

4. **Product Status Workflow**
   - pending_review → admin review required
   - live → published in marketplace
   - archived → removed from public view

5. **Payout Model**
   - Mojo holds funds, processes payouts manually
   - Seller requests → admin approves → manual transfer
   - No third-party payout service fees

6. **Sales Tracking**
   - Polar webhook → product lookup by polarPriceId
   - Seller matched from product.sellerId
   - Sales record created atomically with balance update

---

## Testing Checklist

- [ ] Seller submits product → receives onboarding email
- [ ] Seller signs contract → bank form appears
- [ ] Bank details encrypted correctly in Firestore
- [ ] Seller status changes: pending_contract → pending_bank_info → active
- [ ] Admin reviews pending products
- [ ] Admin approves product → status=live
- [ ] Product appears in /products/ marketplace
- [ ] Polar webhook fires on purchase
- [ ] Sales record created correctly
- [ ] Seller balance updated (+90%)
- [ ] Seller requests payout
- [ ] Payout appears in admin dashboard
- [ ] Admin marks complete
- [ ] Payout status changes to completed
- [ ] Seller sees payout in history

---

## Known Limitations & Future Work

1. **Test Deposits:** Not implemented (user requested skip)
   - Currently: bankDetailsStatus marked "pending" → "verified" manually
   - Future: Send small test deposit, seller verifies amount

2. **Seller Login System:** Not implemented
   - Currently: Email-based identification + token
   - Future: Add Firebase Auth for seller accounts

3. **Product Listing Fee:**
   - Collected at submission (manual payment process assumed)
   - Not integrated with Polar yet

4. **Tax/Compliance:**
   - No 1099 generation or tax reporting
   - Manual tracking required for US sellers

5. **International Payments:**
   - Bank details collected but no multi-currency payout system
   - Manual transfer required

6. **Seller Ratings:**
   - Schema supports ratings but no rating system implemented
   - Could be added to seller dashboard

---

## Success Metrics

Once deployed, track:
- Number of products submitted (sellers joining)
- Number of live products (approval rate)
- Total sales revenue (via Firestore sales collection)
- Average commission per sale
- Payout request volume & average amount
- Seller retention (repeat listings)

---

## Support & Maintenance

**Admin Actions Required:**
- Review pending products (~daily)
- Approve products + set Polar IDs (~2-3 per week estimate)
- Approve payouts + transfer funds (~weekly)
- Monitor Firestore indexes + rules

**Seller Support:**
- Email: When account activated, ready for payouts
- Dashboard: Self-serve balance checks, history
- Onboarding: Clear email instructions + link

---

## Related Documentation

- Firestore Collections Registry: `docs/registries/collections.md`
- API Endpoints Registry: `docs/registries/endpoints.md`
- Environment Variables: `docs/registries/env-vars.md`
