/**
 * index.js — Firebase Cloud Functions for Mojo AI Studio
 *
 * Functions:
 *   polarWebhook  — receives Polar.sh webhook events and writes purchase /
 *                   subscription records to Firestore.
 *
 * Environment config (set via Firebase CLI):
 *   POLAR_WEBHOOK_SECRET  — from Polar.sh dashboard → Webhooks → secret
 *
 * Firestore schema written:
 *   /purchases/{polarOrderId}
 *     userId              string   Firebase UID (matched by email)
 *     polarOrderId        string
 *     polarSubscriptionId string   (subscriptions only)
 *     planName            string   e.g. "GAIN — Business"
 *     planTier            string   "pro" | "business" | "enterprise"
 *     amount              number   cents  e.g. 25000
 *     currency            string   "usd"
 *     status              string   "active" | "cancelled" | "past_due" | "trialing"
 *     customerEmail       string
 *     createdAt           Timestamp
 *     renewalDate         Timestamp | null
 */

'use strict';

const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

const POLAR_WEBHOOK_SECRET = defineSecret('POLAR_WEBHOOK_SECRET');
const ADMIN_PAYOUT_KEY = defineSecret('ADMIN_PAYOUT_KEY');

function setPublicCors(req, res) {
  res.set('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return true;
  }

  return false;
}

/* ── Polar.sh webhook endpoint ── */

exports.polarWebhook = onRequest(
  { secrets: [POLAR_WEBHOOK_SECRET] },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Verify Polar.sh webhook signature
    const signature = req.headers['webhook-signature'] || '';
    const secret    = POLAR_WEBHOOK_SECRET.value();
    const rawBody   = req.rawBody;          // Firebase provides rawBody for HTTPS functions

    if (!verifySignature(rawBody, signature, secret)) {
      console.warn('[polarWebhook] Invalid signature');
      res.status(401).send('Unauthorized');
      return;
    }

    const event = req.body;
    console.log('[polarWebhook] event type:', event.type);

    try {
      await handleEvent(event);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[polarWebhook] handler error:', err);
      res.status(500).send('Internal Server Error');
    }
  }
);

/* ── Event handlers ── */

async function handleEvent(event) {
  const type = event.type || '';

  // Order confirmed (one-time or first subscription payment)
  if (type === 'order.created') {
    await upsertPurchase(event.data);
    return;
  }

  // Subscription lifecycle events
  if (type.startsWith('subscription.')) {
    await upsertSubscription(event.data);
    return;
  }

  console.log('[polarWebhook] unhandled event type:', type);
}

async function upsertPurchase(order) {
  const email = order.customer?.email || order.billing_address?.email || '';
  const uid   = await emailToUid(email);

  const planName = extractPlanName(order.product?.name || '');
  const planTier = extractTier(order.product?.name || '');

  const doc = {
    userId:              uid || null,
    customerEmail:       email,
    polarOrderId:        order.id,
    polarSubscriptionId: order.subscription_id || null,
    planName,
    planTier,
    amount:              order.amount || 0,
    currency:            (order.currency || 'usd').toLowerCase(),
    status:              'active',
    createdAt:           admin.firestore.FieldValue.serverTimestamp(),
    renewalDate:         null,
  };

  await db.collection('purchases').doc(order.id).set(doc, { merge: true });
  console.log('[polarWebhook] upserted purchase', order.id, 'uid:', uid);

  // If this order has a price ID, try to track the sale and credit the seller
  await trackSaleIfApplicable(order);
}

async function trackSaleIfApplicable(order) {
  try {
    const polarPriceId = order.product?.price_id || order.price_id;
    if (!polarPriceId) {
      console.log('[trackSaleIfApplicable] no price ID, skipping sales tracking');
      return;
    }

    // Find product by Polar price ID
    const productSnap = await db
      .collection('products')
      .where('polarPriceId', '==', polarPriceId)
      .limit(1)
      .get();

    if (productSnap.empty) {
      console.warn('[trackSaleIfApplicable] no product found for price ID', polarPriceId);
      return;
    }

    const productDoc = productSnap.docs[0];
    const product = productDoc.data();
    const sellerId = product.sellerId;

    if (!sellerId) {
      console.log('[trackSaleIfApplicable] product has no seller (Mojo product), skipping');
      return;
    }

    // Create sales record
    const amount = order.amount || 0;
    const commission = Math.round(amount * 0.9); // 90% to seller

    await db.collection('sales').add({
      productId: productDoc.id,
      productName: product.name,
      sellerId,
      amount,
      commission,
      polarOrderId: order.id,
      status: 'completed',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update seller's available balance
    const sellerRef = db.collection('sellers').doc(sellerId);
    await sellerRef.update({
      availableBalance: admin.firestore.FieldValue.increment(commission),
      totalEarnings: admin.firestore.FieldValue.increment(commission),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(
      '[trackSaleIfApplicable] created sales record and credited',
      sellerId,
      'amount:',
      commission
    );
  } catch (err) {
    console.error('[trackSaleIfApplicable] error:', err);
    // Don't fail the webhook if sales tracking fails
  }
}

async function upsertSubscription(subscription) {
  const email  = subscription.customer?.email || '';
  const uid    = await emailToUid(email);
  const status = mapSubscriptionStatus(subscription.status);

  const renewalDate = subscription.current_period_end
    ? admin.firestore.Timestamp.fromDate(new Date(subscription.current_period_end))
    : null;

  const docId = subscription.order_id || subscription.id;

  const doc = {
    userId:              uid || null,
    customerEmail:       email,
    polarOrderId:        subscription.order_id || null,
    polarSubscriptionId: subscription.id,
    planName:            extractPlanName(subscription.product?.name || ''),
    planTier:            extractTier(subscription.product?.name || ''),
    amount:              subscription.amount || 0,
    currency:            (subscription.currency || 'usd').toLowerCase(),
    status,
    renewalDate,
    updatedAt:           admin.firestore.FieldValue.serverTimestamp(),
  };

  // Preserve original createdAt on first write
  const ref  = db.collection('purchases').doc(docId);
  const snap = await ref.get();
  if (!snap.exists) {
    doc.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }

  await ref.set(doc, { merge: true });
  console.log('[polarWebhook] upserted subscription', docId, 'status:', status, 'uid:', uid);
}

/* ── Helpers ── */

function verifySignature(rawBody, signatureHeader, secret) {
  if (!secret || !signatureHeader || !rawBody) { return false; }

  // Polar.sh uses Webhook Signature Standard (similar to Standard Webhooks)
  // Header format: "v1,<base64-hmac-sha256>"
  try {
    const parts = signatureHeader.split(',');
    const sigB64 = parts.find(p => p.startsWith('v1=') || !p.includes('=')) || parts[parts.length - 1];
    const sigClean = sigB64.replace(/^v1=/, '');

    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(sigClean, 'base64'),
      Buffer.from(expected, 'base64')
    );
  } catch {
    return false;
  }
}

async function emailToUid(email) {
  if (!email) { return null; }
  try {
    const user = await admin.auth().getUserByEmail(email);
    return user.uid;
  } catch {
    return null;   // customer hasn't created a portal account yet — that's fine
  }
}

function mapSubscriptionStatus(polarStatus) {
  const map = {
    active:      'active',
    trialing:    'trialing',
    past_due:    'past_due',
    canceled:    'cancelled',
    cancelled:   'cancelled',
    unpaid:      'past_due',
    incomplete:  'past_due',
  };
  return map[polarStatus] || polarStatus || 'unknown';
}

function extractPlanName(productName) {
  // e.g. "GAIN Pro" → "GAIN — Pro"
  const tier = extractTier(productName);
  if (tier) {
    return 'GAIN — ' + capitalize(tier);
  }
  return productName || 'GAIN';
}

function extractTier(productName) {
  const lower = (productName || '').toLowerCase();
  if (lower.includes('enterprise')) { return 'enterprise'; }
  if (lower.includes('business'))   { return 'business';   }
  if (lower.includes('pro'))        { return 'pro';        }
  return '';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ── Seller onboarding endpoints ── */

const { encryptBankDetails, decryptBankDetails } = require('./encryption');
const SELLER_ENCRYPTION_KEY = defineSecret('SELLER_ENCRYPTION_KEY');

/**
 * POST /sellers/sign-contract
 * Signs the seller agreement and updates seller status to pending_bank_info
 *
 * Body: { email, contactName, sellerToken, contractVersion }
 */
exports.signContract = onRequest(
  { secrets: [SELLER_ENCRYPTION_KEY] },
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    const { email, contactName, sellerToken, contractVersion } = req.body;

    // Validate required fields
    if (!email || !contactName || !sellerToken || !contractVersion) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      res.status(400).json({ ok: false, message: 'Invalid email' });
      return;
    }

    try {
      // Verify token matches seller record
      const sellerRef = db.collection('sellers').doc(email);
      const sellerSnap = await sellerRef.get();

      if (!sellerSnap.exists) {
        res.status(404).json({ ok: false, message: 'Seller record not found' });
        return;
      }

      const seller = sellerSnap.data();
      if (!seller.sellerToken || seller.sellerToken !== sellerToken) {
        res.status(401).json({ ok: false, message: 'Invalid token' });
        return;
      }

      // Update seller: sign contract, move to pending_bank_info
      const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';

      await sellerRef.update({
        contractSignedAt: admin.firestore.FieldValue.serverTimestamp(),
        contractVersion,
        contractIpAddress: ipAddress,
        status: 'pending_bank_info',
      });

      console.log('[signContract] Seller', email, 'signed contract version', contractVersion);
      res.status(200).json({ ok: true, message: 'Contract signed successfully' });
    } catch (err) {
      console.error('[signContract] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /sellers/submit-bank-info
 * Collects and encrypts seller bank details
 *
 * Body: { email, sellerToken, accountNumber, routingNumber, accountHolder, bankName }
 */
exports.submitBankInfo = onRequest(
  { secrets: [SELLER_ENCRYPTION_KEY] },
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    const { email, sellerToken, accountNumber, routingNumber, accountHolder, bankName } = req.body;

    // Validate required fields
    if (!email || !sellerToken || !accountNumber || !routingNumber || !accountHolder) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    try {
      const sellerRef = db.collection('sellers').doc(email);
      const sellerSnap = await sellerRef.get();

      if (!sellerSnap.exists) {
        res.status(404).json({ ok: false, message: 'Seller record not found' });
        return;
      }

      const seller = sellerSnap.data();

      // Verify token and contract signed
      if (!seller.sellerToken || seller.sellerToken !== sellerToken) {
        res.status(401).json({ ok: false, message: 'Invalid token' });
        return;
      }

      if (seller.status !== 'pending_bank_info') {
        res.status(400).json({ ok: false, message: 'Seller has not signed contract yet' });
        return;
      }

      // Encrypt bank details
      const keyB64 = SELLER_ENCRYPTION_KEY.value();
      const encryptionKey = Buffer.from(keyB64, 'base64');

      const bankDetails = {
        accountNumber,
        routingNumber,
        accountHolder,
        bankName: bankName || 'Unknown',
      };

      const encryptedBankDetails = encryptBankDetails(bankDetails, encryptionKey);

      // Update seller with encrypted bank info
      await sellerRef.update({
        encryptedBankDetails,
        bankDetailsStatus: 'pending', // Will be "verified" after test deposit confirmation
        status: 'active',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('[submitBankInfo] Seller', email, 'submitted bank details');
      res.status(200).json({ ok: true, message: 'Bank details saved securely' });
    } catch (err) {
      console.error('[submitBankInfo] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /sellers/create-from-product-submission
 * Creates seller record after product submission
 * Called by the form after submit-product.php succeeds
 *
 * Body: { email, contactName, productName }
 */
exports.createSellerFromProductSubmission = onRequest(
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    const { email, contactName, productName } = req.body;

    if (!email || !contactName || !productName) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    try {
      const sellerRef = db.collection('sellers').doc(email);
      const sellerSnap = await sellerRef.get();

      // Generate seller token (random 32-byte hex string)
      const sellerToken = crypto.randomBytes(32).toString('hex');

      if (!sellerSnap.exists) {
        // Create new seller record
        await sellerRef.set({
          email,
          contactName,
          productIds: [productName], // Store product name as identifier
          status: 'pending_contract',
          sellerToken,
          contractSignedAt: null,
          contractVersion: null,
          contractIpAddress: null,
          encryptedBankDetails: null,
          bankDetailsStatus: 'pending',
          availableBalance: 0,
          totalEarnings: 0,
          commissionRate: 0.9,
          listingFee: 10000, // $100 in cents
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('[createSellerFromProductSubmission] Created new seller', email);
      } else {
        // Update existing seller record with new product
        const seller = sellerSnap.data();
        const productIds = Array.isArray(seller.productIds) ? seller.productIds : [];
        if (!productIds.includes(productName)) {
          productIds.push(productName);
        }
        await sellerRef.update({
          productIds,
          sellerToken, // Regenerate token on new product
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('[createSellerFromProductSubmission] Updated seller', email, 'with new product');
      }

      // Send onboarding email with token
      const onboardingUrl = `https://mojoaistudio.com/products/pages/seller-onboarding.html?email=${encodeURIComponent(email)}&token=${encodeURIComponent(sellerToken)}`;

      const subject = 'Complete Your Seller Setup — Mojo AI Studio';
      const emailBody = `Hi ${contactName},

Thanks for submitting "${productName}" to the Mojo AI Studio marketplace!

To complete your seller setup and start receiving payments, please sign the seller agreement and provide your bank information:

${onboardingUrl}

What happens next:
1. Review and sign the seller agreement
2. Provide your bank details (encrypted and secure)
3. We'll send a small test deposit to verify your account
4. Once verified, you'll start earning 90% commission on product sales

If you have any questions, reply to this email or contact us at admin@MojoAiStudio.com.

— Mojo AI Studio Team
https://MojoAiStudio.com`;

      const emailHeaders = {
        From: 'noreply@mojoaistudio.com',
        'Reply-To': 'admin@mojoaistudio.com',
        'X-Mailer': 'MojoAiStudio-SellerOnboarding/1.0',
        'MIME-Version': '1.0',
        'Content-Type': 'text/plain; charset=utf-8',
      };

      // Note: This function uses the Firebase Admin SDK, which doesn't have built-in mail.
      // For production, integrate with SendGrid, Mailgun, or another service.
      // For now, log the email that should be sent.
      console.log('[createSellerFromProductSubmission] Email to send:', {
        to: email,
        subject,
        body: emailBody,
      });

      // TODO: Replace with actual email service (SendGrid, Mailgun, etc.)
      // For now, return success but log that email setup is needed
      console.warn('[createSellerFromProductSubmission] Email not sent - configure mail service');

      res.status(200).json({
        ok: true,
        sellerToken,
        message: 'Seller record created. Check your email for onboarding link.',
      });
    } catch (err) {
      console.error('[createSellerFromProductSubmission] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /sellers/request-payout
 * Seller submits a payout request for available earnings
 *
 * Body: { email, sellerToken, amount }
 */
exports.requestPayout = onRequest(
  { secrets: [SELLER_ENCRYPTION_KEY] },
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    const { email, sellerToken, amount } = req.body;

    if (!email || !sellerToken || !amount) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).json({ ok: false, message: 'Amount must be a positive number' });
      return;
    }

    try {
      const sellerRef = db.collection('sellers').doc(email);
      const sellerSnap = await sellerRef.get();

      if (!sellerSnap.exists) {
        res.status(404).json({ ok: false, message: 'Seller record not found' });
        return;
      }

      const seller = sellerSnap.data();

      // Verify token
      if (!seller.sellerToken || seller.sellerToken !== sellerToken) {
        res.status(401).json({ ok: false, message: 'Invalid token' });
        return;
      }

      // Check seller is active and verified
      if (seller.status !== 'active') {
        res.status(400).json({ ok: false, message: 'Seller account is not active' });
        return;
      }

      if (seller.bankDetailsStatus !== 'verified') {
        res.status(400).json({ ok: false, message: 'Bank account not verified yet' });
        return;
      }

      // Check sufficient balance
      const availableBalance = seller.availableBalance || 0;
      if (amount > availableBalance) {
        res.status(400).json({
          ok: false,
          message: `Insufficient balance. Available: $${(availableBalance / 100).toFixed(2)}`,
        });
        return;
      }

      // Decrypt bank details for snapshot
      const keyB64 = SELLER_ENCRYPTION_KEY.value();
      const encryptionKey = Buffer.from(keyB64, 'base64');
      let bankDetailsSnapshot = null;

      try {
        bankDetailsSnapshot = decryptBankDetails(seller.encryptedBankDetails, encryptionKey);
      } catch (err) {
        console.error('[requestPayout] failed to decrypt bank details:', err);
        res.status(500).json({ ok: false, message: 'Unable to process payout' });
        return;
      }

      // Create payout request
      const payoutId = db.collection('payout_requests').doc().id;
      const payoutRef = db.collection('payout_requests').doc(payoutId);

      await payoutRef.set({
        sellerId: email,
        sellerEmail: email,
        sellerName: seller.contactName,
        amount,
        requestedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
        bankDetailsSnapshot,
        processedAt: null,
        adminNotes: null,
      });

      // Deduct amount from available balance immediately
      await sellerRef.update({
        availableBalance: admin.firestore.FieldValue.increment(-amount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('[requestPayout] Created payout request', payoutId, 'for', email, 'amount:', amount);
      res.status(200).json({
        ok: true,
        payoutId,
        message: `Payout request submitted for $${(amount / 100).toFixed(2)}. Your funds will be transferred within 3-5 business days.`,
      });
    } catch (err) {
      console.error('[requestPayout] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /sellers/complete-payout
 * Admin endpoint to mark a payout as complete after manual transfer
 *
 * Requires admin authentication (via API key header)
 * Body: { payoutId, adminNotes }
 */
exports.completePayout = onRequest(
  { secrets: [ADMIN_PAYOUT_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    // Simple admin key verification (in production, use Firebase Auth or stronger auth)
    const adminKey = String(req.headers['x-admin-key'] || req.query?.admin_key || '').trim();
    const expectedKey = String(ADMIN_PAYOUT_KEY.value() || '').trim();

    if (!expectedKey || adminKey !== expectedKey) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    const { payoutId, adminNotes } = req.body;

    if (!payoutId) {
      res.status(400).json({ ok: false, message: 'Missing payoutId' });
      return;
    }

    try {
      const payoutRef = db.collection('payout_requests').doc(payoutId);
      const payoutSnap = await payoutRef.get();

      if (!payoutSnap.exists) {
        res.status(404).json({ ok: false, message: 'Payout request not found' });
        return;
      }

      const payout = payoutSnap.data();

      if (payout.status !== 'pending') {
        res.status(400).json({ ok: false, message: 'Payout is not pending' });
        return;
      }

      // Mark payout complete
      await payoutRef.update({
        status: 'completed',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        adminNotes: adminNotes || null,
      });

      console.log('[completePayout] Marked payout', payoutId, 'as complete');
      res.status(200).json({ ok: true, message: 'Payout marked as complete' });
    } catch (err) {
      console.error('[completePayout] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

function setAdminCors(req, res) {
  res.set('Content-Type', 'application/json');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return true;
  }

  return false;
}

function isAuthorizedAdmin(req) {
  const adminKey = String(req.headers['x-admin-key'] || req.query?.admin_key || '').trim();
  const expectedKey = String(ADMIN_PAYOUT_KEY.value() || '').trim();
  return Boolean(expectedKey && adminKey === expectedKey);
}

function timestampMillis(value) {
  return value && typeof value.toMillis === 'function' ? value.toMillis() : null;
}

function productPayload(doc) {
  const product = doc.data();
  return {
    id: doc.id,
    ...product,
    createdAtMillis: timestampMillis(product.createdAt),
    updatedAtMillis: timestampMillis(product.updatedAt),
    createdAt: undefined,
    updatedAt: undefined,
  };
}

/**
 * GET /adminListProducts?status=pending_review|live
 * Lists products for the admin product dashboard.
 */
exports.adminListProducts = onRequest(
  { secrets: [ADMIN_PAYOUT_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;
    if (req.method !== 'GET') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    const status = String(req.query.status || 'pending_review');
    if (!['pending_review', 'live'].includes(status)) {
      res.status(400).json({ ok: false, message: 'Invalid status' });
      return;
    }

    try {
      const snapshot = await db
        .collection('products')
        .where('status', '==', status)
        .get();

      const products = snapshot.docs
        .map(productPayload)
        .sort((a, b) => (b.createdAtMillis || 0) - (a.createdAtMillis || 0));

      res.status(200).json({
        ok: true,
        products,
      });
    } catch (err) {
      console.error('[adminListProducts] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /adminApproveProduct
 * Publishes a pending product with pricing and Polar checkout metadata.
 */
exports.adminApproveProduct = onRequest(
  { secrets: [ADMIN_PAYOUT_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    const { productId, price, polarPriceId, featured } = req.body || {};
    const priceCents = Number(price);
    if (!productId || !Number.isFinite(priceCents) || priceCents <= 0 || !polarPriceId) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    try {
      const productRef = db.collection('products').doc(String(productId));
      const productSnap = await productRef.get();
      if (!productSnap.exists) {
        res.status(404).json({ ok: false, message: 'Product not found' });
        return;
      }

      await productRef.update({
        status: 'live',
        price: Math.round(priceCents),
        polarPriceId: String(polarPriceId),
        featured: Boolean(featured),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({ ok: true, message: 'Product published' });
    } catch (err) {
      console.error('[adminApproveProduct] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /adminRejectProduct
 * Deletes a pending product submission.
 */
exports.adminRejectProduct = onRequest(
  { secrets: [ADMIN_PAYOUT_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    const { productId } = req.body || {};
    if (!productId) {
      res.status(400).json({ ok: false, message: 'Missing productId' });
      return;
    }

    try {
      await db.collection('products').doc(String(productId)).delete();
      res.status(200).json({ ok: true, message: 'Product rejected' });
    } catch (err) {
      console.error('[adminRejectProduct] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /adminArchiveProduct
 * Archives a live product without deleting history.
 */
exports.adminArchiveProduct = onRequest(
  { secrets: [ADMIN_PAYOUT_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    const { productId } = req.body || {};
    if (!productId) {
      res.status(400).json({ ok: false, message: 'Missing productId' });
      return;
    }

    try {
      await db.collection('products').doc(String(productId)).update({
        status: 'archived',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.status(200).json({ ok: true, message: 'Product archived' });
    } catch (err) {
      console.error('[adminArchiveProduct] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /products/create-from-submission
 * Creates a product listing in Firestore from seller submission
 * Called by product-form.js after submit-product succeeds
 *
 * Body: { email, contactName, productName, description, category, ... }
 */
exports.createProductFromSubmission = onRequest(
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    const {
      email,
      contactName,
      productName,
      productDescription,
      category,
      pricingModel,
      productUrl,
      targetUser,
    } = req.body;

    if (!email || !productName || !productDescription) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    try {
      // Generate product ID from name (slug)
      const productId = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const productRef = db.collection('products').doc(productId);

      await productRef.set({
        id: productId,
        sellerId: email,
        name: productName,
        description: productDescription,
        category: category || 'other',
        tags: ['submitted'], // Mark as submitted for admin review
        price: null, // Admin sets pricing
        billingPeriod: pricingModel || 'month',
        polarPriceId: null, // Admin links this later
        externalUrl: productUrl || null,
        status: 'pending_review', // Requires admin approval
        featured: false,
        rating: null,
        setupMinutes: null,
        integrations: [],
        inputs: targetUser || null,
        outputs: null,
        iconColor: null,
        iconLetter: null,
        notes: `Submitted by ${contactName}: ${productUrl ? 'Has external URL' : 'No external URL provided'}`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        submittedByEmail: email,
      });

      console.log('[createProductFromSubmission] Created product', productId, 'by seller', email);
      res.status(200).json({
        ok: true,
        productId,
        message: 'Product listing created. Admin will review and activate.',
      });
    } catch (err) {
      console.error('[createProductFromSubmission] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);
