# Admin Operations Guide

Quick reference for daily admin operations on the seller marketplace.

---

## Dashboard Access

### Admin Payouts Dashboard
**URL:** https://mojoaistudio.com/products/pages/admin-payouts.html

**Login:**
- Click "Enter Admin Key"
- Paste admin key: `51281e9d47cddf110802ebbc1d8f3d06022795e15c4ac8ef75a9b14ed49de718`
- Click "Sign In"

**What you see:**
- **Pending Payouts** — sellers requesting withdrawal
- **Bank Details** — decrypted (last 4 digits shown for safety)
- **Stats** — pending count, pending total, completed this month

**Actions:**
1. Review payout request
2. Verify transfer sent from Mojo bank account
3. Click "Mark Complete"
4. Seller receives confirmation email

---

### Admin Products Dashboard
**URL:** https://mojoaistudio.com/products/pages/admin-products.html

**Login:**
- Click "Enter Admin Key"
- Paste admin key: `51281e9d47cddf110802ebbc1d8f3d06022795e15c4ac8ef75a9b14ed49de718`
- Click "Sign In"

**Tabs:**

#### Pending Review
- **Products waiting for approval**
- Fields: name, description, category, pricing model, submitted date
- **To approve:**
  1. Review product details
  2. Enter price (USD/month)
  3. Enter Polar Price ID (from Polar.sh dashboard)
  4. Toggle featured flag if desired
  5. Click "Approve & Publish"
  6. Product status → "live"
  7. Appears in marketplace `/products/`

- **To reject:**
  1. Click "Reject"
  2. Product deleted from Firestore

#### Published
- **Live products in marketplace**
- Shows: name, price, Polar ID, featured status
- **To archive:**
  1. Click "Archive"
  2. Product status → "archived" (hidden from marketplace)

---

## Common Tasks

### Finding Polar Price ID

1. Log in to **Polar.sh dashboard**
2. Go to **Products** section
3. Find the product
4. Copy the **Price ID** (format: `PRICE_XXXXXXXXXXXXX`)
5. Paste into admin products form

### Checking Seller Status

1. Open **Firebase Console** → Firestore
2. Navigate to `sellers` collection
3. Click seller email to view:
   - `status` — pending_contract / pending_bank_info / active
   - `contractSignedAt` — when contract was signed
   - `encryptedBankDetails` — bank info (encrypted, not readable in console)
   - `availableBalance` — ready to payout
   - `totalEarnings` — lifetime earnings

### Checking Sales Records

1. Open **Firebase Console** → Firestore
2. Navigate to `sales` collection
3. Browse recent sales:
   - `productId` — which product was sold
   - `sellerId` — seller email who gets commission
   - `amount` — sale price (cents)
   - `commission` — amount credited to seller (90% of amount)
   - `polarOrderId` — Polar order reference
   - `createdAt` — timestamp

### Monitoring Pending Payouts

1. Open **Firebase Console** → Firestore
2. Navigate to `payout_requests` collection
3. Filter by `status` == "pending"
4. For each:
   - Note the `amount` and `sellerId`
   - `bankDetailsSnapshot` contains seller's bank info (encrypted)
   - Update `status` to "completed" after transfer

---

## Firestore Queries

**Active sellers:**
```
Collection: sellers
Filter: status == "active"
```

**Pending products:**
```
Collection: products
Filter: status == "pending_review"
Order by: createdAt (DESC)
```

**Today's sales:**
```
Collection: sales
Filter: createdAt >= today at 00:00 UTC
Order by: createdAt (DESC)
```

**Pending payouts:**
```
Collection: payout_requests
Filter: status == "pending"
Order by: requestedAt (DESC)
```

---

## Email Templates

### Seller Onboarding Email
- **Sent by:** `api/send-seller-onboarding-email.php`
- **To:** Seller email (from product submission)
- **Contains:** Onboarding link with email + token
- **Action:** Seller clicks → signs contract → enters bank details

### Payout Confirmation Email
- **Sent by:** `completePayout` Cloud Function
- **To:** Seller email
- **Contains:** Payout approved, amount, reference #
- **Action:** Seller can withdraw funds

### Auto-Reply to Brief Form
- **Sent by:** `api/submit-brief.php`
- **To:** Submitter email
- **Contains:** Confirmation + 2 business day response promise
- **Why:** Reassures user we received their inquiry

---

## Troubleshooting

### Seller stuck in "pending_contract"
- Verify seller record exists in Firestore (`sellers/{email}`)
- Check if onboarding email was sent (check spam folder)
- Resend: manually create onboarding link with email + token

### Seller stuck in "pending_bank_info"
- Seller signed contract but didn't enter bank details
- Check browser console for JS errors in seller-onboarding.html
- Verify SELLER_ENCRYPTION_KEY is configured

### Product won't approve
- Check Polar Price ID is correct format
- Verify price is valid number (>0)
- Check browser console for JS errors in admin-products.js

### Payout approval fails
- Verify ADMIN_PAYOUT_KEY is configured in Firebase secrets
- Check seller's availableBalance is sufficient
- Verify payout_requests collection exists in Firestore

### Sales not tracking
- Verify Polar webhook is configured (Settings → Webhooks in Polar.sh)
- Check webhook secret matches POLAR_WEBHOOK_SECRET in Firebase
- Verify product has `polarPriceId` field set during approval
- Check Cloud Functions logs in Firebase Console

---

## Security Reminders

1. **Never share admin key in email or chat** — use password manager
2. **Don't log in from unsecured networks** — use VPN if remote
3. **Bank details are encrypted at rest** — only decrypt in secure locations
4. **Session timeout** — reload page to re-login if inactive
5. **Audit trail** — all actions logged via Firestore timestamps

---

## Key Metrics

Track these weekly:

| Metric | Location | Goal |
|--------|----------|------|
| Active sellers | Firestore: `sellers` (count status="active") | Growing adoption |
| Live products | Firestore: `products` (count status="live") | High approval rate |
| Weekly sales | Firestore: `sales` (filter by week) | Revenue tracking |
| Pending payouts | Firestore: `payout_requests` (count status="pending") | <5 day turnaround |
| Seller retention | Repeat product submissions | >50% resubmit |

---

## Contact & Support

**Seller support:** Contact submitter email directly (from payout_requests)
**Technical issues:** Check Firebase Console logs
**Questions:** See DEPLOYMENT_CHECKLIST.md for troubleshooting

---

**Last updated:** 2026-06-04  
**System:** Seller Marketplace Payout System v1.0
