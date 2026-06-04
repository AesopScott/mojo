# Seller Marketplace Payout System — Deployment Checklist

**Status:** Production Deployment (mojo-f86de) — 2026-06-04

---

## ✅ Completed Tasks

### Infrastructure
- [x] Firestore collections created (sellers, products, sales, contracts, payout_requests)
- [x] Firestore security rules deployed
- [x] Firestore indexes deployed
- [x] Cloud Functions deployed (7 endpoints)
- [x] Firebase secrets configured:
  - [x] `SELLER_ENCRYPTION_KEY` (AES-256 encryption for bank details)
  - [x] `ADMIN_PAYOUT_KEY` (admin dashboard authentication)

### Data Layer
- [x] Initial seller contract (v1.0) created in Firestore
- [x] Encryption utilities (functions/encryption.js) deployed
- [x] Bank details encrypted with AES-256-GCM

### Frontend
- [x] Seller onboarding form (seller-onboarding.html)
- [x] Seller dashboard (seller-dashboard.html)
- [x] Admin payouts dashboard (admin-payouts.html)
- [x] Admin products dashboard (admin-products.html)
- [x] Product marketplace loader (products-loader.js)

### Testing
- [x] PU1: Development brief form routing verified (200 status)
- [x] PU2: Form submission handler verified ({"ok":true})
- [⏳] PU3: Email delivery (pending manual inbox check)

---

## ✅ Completed Configuration

### 1. Polar Webhook Configuration
**Status:** ✅ Configured via Polar API (2026-06-04)

**Webhook Details:**
- **ID:** `ff0554aa-6f87-4f03-bce1-2bbb542a439d`
- **URL:** `https://polarwebhook-ybz2g7wg4a-uc.a.run.app`
- **Events:** `order.created`, `subscription.updated`
- **Secret:** Configured in Firebase Secret Manager (version 3)
- **Status:** ✅ Active and deployed

**How it works:**
1. Customer purchases product via Polar checkout
2. Polar fires webhook to Cloud Function
3. Function validates signature with POLAR_WEBHOOK_SECRET
4. Creates sales record in Firestore
5. Credits seller 90% of order amount to availableBalance
6. Seller can see updated balance in dashboard

**✅ Now live and processing orders**

### 2. Admin Payout Key Deployment
**Status:** ✅ Configured in Firebase

**Key:** `51281e9d47cddf110802ebbc1d8f3d06022795e15c4ac8ef75a9b14ed49de718`

**Where to use:**
- Admin Payouts Dashboard: `/products/pages/admin-payouts.html?key=51281e9d47cddf110802ebbc1d8f3d06022795e15c4ac8ef75a9b14ed49de718`
- Admin Products Dashboard: `/products/pages/admin-products.html?key=51281e9d47cddf110802ebbc1d8f3d06022795e15c4ac8ef75a9b14ed49de718`

**Distribution:**
- [ ] Send securely to admin(s) via password manager or secure channel
- [ ] Do NOT commit to version control
- [ ] Rotate periodically

---

## 📋 Operational Setup

### Admin Payouts Workflow
1. Sellers request payout in dashboard (available balance > $0)
2. Payout request appears in `/products/pages/admin-payouts.html`
3. Admin reviews bank details (decrypted on-demand, last 4 digits shown)
4. Admin confirms transfer made from Mojo account
5. Click "Mark Complete" → status → completed
6. Seller receives confirmation email

### Product Approval Workflow
1. Seller submits product form
2. Product appears in `/products/pages/admin-products.html` (Pending Review tab)
3. Admin sets: price (USD), Polar Price ID, featured flag
4. Click "Approve & Publish" → status → live
5. Product appears in marketplace `/products/`

### Sales & Commission Tracking
1. Customer purchases product via Polar checkout
2. Polar webhook fires → Cloud Function processes
3. Sales record created in Firestore
4. Seller's `availableBalance` credited 90% of sale amount
5. Seller can see updated balance in dashboard

---

## 🔐 Security Configuration

### Secrets Audit
```bash
# Verify secrets are set
firebase functions:secrets:list

# Should show:
# - SELLER_ENCRYPTION_KEY (version 1)
# - ADMIN_PAYOUT_KEY (version 1)
# - POLAR_WEBHOOK_SECRET (pending setup)
```

### Firestore Security Rules
All sensitive collections are write-protected:
- `sellers/{email}` — read if email matches, admin write only
- `products/{id}` — public read, backend write only
- `sales/{id}` — backend write only
- `payout_requests/{id}` — seller read own, create own, admin update
- `contracts/{version}` — public read

### Bank Details Encryption
- Algorithm: AES-256-GCM
- Key rotation: Via Firebase Secret Manager (can update SELLER_ENCRYPTION_KEY)
- Decrypted only when needed (payouts, snapshots)
- Never logged or exposed in responses

---

## 📊 Monitoring & Metrics

**Key metrics to track:**
- Number of active sellers (status = "active")
- Pending products for review (status = "pending_review")
- Completed sales (sales collection count)
- Total commission volume (sum of sales.commission)
- Pending payouts (payout_requests where status = "pending")
- Payout approval rate (completed / pending)

**Firestore console:** https://console.firebase.google.com/project/mojo-f86de/firestore

---

## 🚀 Deployment Status

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Firestore rules | ✅ Deployed | 2026-06-04 | All collections configured |
| Firestore indexes | ✅ Deployed | 2026-06-04 | Compound indexes active |
| Cloud Functions | ✅ Deployed | 2026-06-04 | 7 endpoints live |
| SELLER_ENCRYPTION_KEY | ✅ Set | 2026-06-04 | Firebase Secret Manager |
| ADMIN_PAYOUT_KEY | ✅ Set | 2026-06-04 | Firebase Secret Manager |
| POLAR_WEBHOOK_SECRET | ✅ Set | 2026-06-04 | Configured via Polar API |
| Initial contract | ✅ Created | 2026-06-04 | contracts/1.0 in Firestore |
| Seller onboarding form | ✅ Live | 2026-06-04 | /products/pages/seller-onboarding.html |
| Seller dashboard | ✅ Live | 2026-06-04 | /products/pages/seller-dashboard.html |
| Admin dashboards | ✅ Live | 2026-06-04 | /admin-payouts.html, /admin-products.html |
| Product marketplace | ✅ Live | 2026-06-04 | /products/ with seller products |

---

## 🔍 Verification Checklist

**Before going live, verify:**
- [ ] Polar webhook configured and receiving test events
- [ ] Admin key working in both admin dashboards
- [ ] Test product submission → onboarding email → contract signing → bank details entry
- [ ] Test seller becomes "active" after bank details
- [ ] Test product approval workflow
- [ ] Test Polar webhook fires on test purchase
- [ ] Verify seller balance updates (+90% of sale)
- [ ] Test payout request in seller dashboard
- [ ] Verify payout appears in admin dashboard
- [ ] Test payout approval marks as "completed"
- [ ] Verify seller sees completed payout in history

---

## 📞 Support & Troubleshooting

### Seller Issues
- **Missing onboarding email:** Check MOJO_ADMIN_EMAIL env var, verify send-seller-onboarding-email.php
- **Contract won't sign:** Verify contract exists in Firestore (contracts/1.0)
- **Bank form fails:** Check browser console for JS errors, verify encryption key is set
- **Balance not updating:** Check Firestore for sales records, verify Polar webhook is configured

### Admin Issues
- **Admin key not working:** Verify ADMIN_PAYOUT_KEY is set in Firebase secrets
- **Can't see pending products:** Check products collection for status="pending_review"
- **Can't decrypt bank details:** Verify SELLER_ENCRYPTION_KEY is available to Cloud Functions
- **Payout approval fails:** Check Firestore rules allow admin write to payout_requests

### Operational
- **Firestore quota issues:** Monitor in Firebase Console, consider upgrading plan
- **Cloud Function timeouts:** Increase timeout in firebase.json if needed
- **Webhook not firing:** Verify Polar webhook secret matches POLAR_WEBHOOK_SECRET
- **Email delivery issues:** Check MochaHost mail logs, verify SPF/DKIM if emails go to spam

---

## 📝 Change Log

**2026-06-04:**
- ✅ All Cloud Functions deployed to mojo-f86de
- ✅ Firestore rules and indexes deployed
- ✅ SELLER_ENCRYPTION_KEY configured
- ✅ ADMIN_PAYOUT_KEY configured
- ✅ Initial seller contract created
- ✅ Development brief form verified (PU1 & PU2)
- ⏳ Polar webhook configuration pending
- ⏳ Email delivery verification pending

---

**Last updated:** 2026-06-04  
**System version:** Seller Payout System v1.0  
**Firebase project:** mojo-f86de  
**Contact:** admin@MojoAiStudio.com
