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
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

const POLAR_WEBHOOK_SECRET = defineSecret('POLAR_WEBHOOK_SECRET');
const ADMIN_PAYOUT_KEY = defineSecret('ADMIN_PAYOUT_KEY');
const SOCIAL_ADMIN_KEY = defineSecret('SOCIAL_ADMIN_KEY');
const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
const POLAR_ACCESS_TOKEN = defineSecret('POLAR_ACCESS_TOKEN');

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
  { secrets: [POLAR_WEBHOOK_SECRET, RESEND_API_KEY] },
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
    const sellerSnap = await sellerRef.get();
    await sellerRef.update({
      availableBalance: admin.firestore.FieldValue.increment(commission),
      totalEarnings: admin.firestore.FieldValue.increment(commission),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Notify seller of sale via email
    const sellerEmail = sellerSnap.exists ? sellerSnap.data().email : null;
    const sellerName = sellerSnap.exists ? (sellerSnap.data().contactName || 'there') : 'there';
    if (sellerEmail && RESEND_API_KEY.value()) {
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY.value()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Mojo AI Studio <noreply@mojoaistudio.com>',
          to: [sellerEmail],
          subject: `You made a sale — ${product.name}`,
          html: `<p>Hi ${sellerName},</p>
<p>Great news — someone just purchased <strong>${product.name}</strong>!</p>
<p><strong>Sale amount:</strong> $${(amount / 100).toFixed(2)}<br>
<strong>Your earnings (90%):</strong> $${(commission / 100).toFixed(2)}</p>
<p>Your earnings accumulate and you can request a payout at any time by contacting <a href="mailto:admin@MojoAiStudio.com">admin@MojoAiStudio.com</a>.</p>
<p>— Mojo AI Studio</p>`,
        }),
      }).catch((err) => console.error('[trackSaleIfApplicable] sale notification email failed:', err));
    }

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
 * POST /sellers/onboarding-state
 * Returns token-validated seller onboarding state so the public page can resume
 * at the correct step without exposing seller records through Firestore rules.
 *
 * Body: { email, sellerToken }
 */
exports.getSellerOnboardingState = onRequest(
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    const email = String(req.body?.email || '').trim();
    const sellerToken = String(req.body?.sellerToken || '').trim();

    if (!email || !sellerToken) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      res.status(400).json({ ok: false, message: 'Invalid email' });
      return;
    }

    try {
      const sellerSnap = await db.collection('sellers').doc(email).get();

      if (!sellerSnap.exists) {
        res.status(404).json({ ok: false, message: 'Seller record not found' });
        return;
      }

      const seller = sellerSnap.data();
      if (!seller.sellerToken || seller.sellerToken !== sellerToken) {
        res.status(401).json({ ok: false, message: 'Invalid token' });
        return;
      }

      const contractSigned = Boolean(seller.contractSignedAt);
      const payoutPreferenceProvided = Boolean(seller.payoutPreferenceStatus === 'provided' || seller.payoutPreference);
      const nextStep = payoutPreferenceProvided ? 'success' : contractSigned ? 'payout' : 'contract';

      res.status(200).json({
        ok: true,
        status: seller.status || null,
        contractSigned,
        payoutPreferenceProvided,
        nextStep,
      });
    } catch (err) {
      console.error('[getSellerOnboardingState] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /sellers/sign-contract
 * Signs the seller agreement and updates seller status to pending_payout_preference
 *
 * Body: { email, contactName, sellerToken, contractVersion }
 */
exports.signContract = onRequest(
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    const { email, sellerToken, contractVersion } = req.body;

    // Validate required fields
    if (!email || !sellerToken || !contractVersion) {
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

      // Update seller: sign contract, move to payout preference collection.
      const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';

      await sellerRef.update({
        contractSignedAt: admin.firestore.FieldValue.serverTimestamp(),
        contractVersion,
        contractIpAddress: ipAddress,
        status: 'pending_payout_preference',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('[signContract] Seller', email, 'signed contract version', contractVersion);
      res.status(200).json({
        ok: true,
        message: 'Contract signed successfully',
      });
    } catch (err) {
      console.error('[signContract] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /sellers/submit-bank-info
 * Deprecated: Mojo no longer collects or stores seller bank account details.
 */
exports.submitBankInfo = onRequest(
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    res.status(410).json({
      ok: false,
      message: 'Bank account collection is disabled. Seller payouts are handled outside Mojo bank-detail storage.',
    });
  }
);

/**
 * POST /sellers/submit-payout-preference
 * Stores the seller's non-bank payout preference for manual Mojo payout coordination.
 *
 * Body: { email, sellerToken, payoutMethod, payoutContact, payoutNotes }
 */
exports.submitPayoutPreference = onRequest(
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }

    const email = String(req.body?.email || '').trim();
    const sellerToken = String(req.body?.sellerToken || '').trim();
    const payoutMethod = String(req.body?.payoutMethod || '').trim().toLowerCase();
    const payoutContact = String(req.body?.payoutContact || '').trim();
    const payoutNotes = String(req.body?.payoutNotes || '').trim().slice(0, 1000);
    const allowedMethods = new Set(['paypal', 'zelle', 'venmo', 'cash_app', 'check', 'other']);

    if (!email || !sellerToken || !payoutMethod || !payoutContact) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      res.status(400).json({ ok: false, message: 'Invalid email' });
      return;
    }

    if (!allowedMethods.has(payoutMethod)) {
      res.status(400).json({ ok: false, message: 'Invalid payout method' });
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
      if (!seller.sellerToken || seller.sellerToken !== sellerToken) {
        res.status(401).json({ ok: false, message: 'Invalid token' });
        return;
      }

      if (!seller.contractSignedAt) {
        res.status(400).json({ ok: false, message: 'Seller agreement must be signed first' });
        return;
      }

      await sellerRef.update({
        payoutPreference: {
          method: payoutMethod,
          contact: payoutContact.slice(0, 240),
          notes: payoutNotes,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        payoutPreferenceStatus: 'provided',
        status: 'ready_for_launch',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('[submitPayoutPreference] Seller', email, 'submitted payout preference:', payoutMethod);
      res.status(200).json({ ok: true, message: 'Payout preference saved' });
    } catch (err) {
      console.error('[submitPayoutPreference] error:', err);
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

To complete your seller setup, please sign the seller agreement:

${onboardingUrl}

What happens next:
1. Review and sign the seller agreement
2. Choose a payout method such as PayPal, Zelle, Venmo, Cash App, mailed check, or another option
3. Mojo reviews your submitted product assets and connects the approved product to the marketplace checkout
4. Buyers purchase through the Mojo marketplace checkout

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
 * Deprecated: seller payout requests are coordinated manually using payout preferences.
 */
exports.requestPayout = onRequest(
  async (req, res) => {
    if (setPublicCors(req, res)) return;

    res.status(410).json({
      ok: false,
      message: 'Self-service payout requests are disabled. Mojo coordinates seller payouts manually using the saved payout preference.',
    });
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

function isAuthorizedSocialAdmin(req) {
  const adminKey = String(req.headers['x-admin-key'] || req.query?.admin_key || '').trim();
  const expectedKey = String(SOCIAL_ADMIN_KEY.value() || '').trim();
  return Boolean(expectedKey && adminKey === expectedKey);
}

function isPublicHttpUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
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

async function productPayloadWithSellerOnboarding(doc) {
  const payload = productPayload(doc);
  const sellerEmail = payload.submittedByEmail || payload.sellerId;
  if (!sellerEmail) return payload;

  try {
    const sellerSnap = await db.collection('sellers').doc(String(sellerEmail)).get();
    if (!sellerSnap.exists) return payload;

    const seller = sellerSnap.data();
    return {
      ...payload,
      sellerToken: seller.sellerToken || null,
      sellerContactName: seller.contactName || null,
      sellerEmail: seller.email || sellerEmail,
      sellerStatus: seller.status || null,
      sellerPayoutMethod: seller.payoutPreference?.method || null,
      sellerPayoutContact: seller.payoutPreference?.contact || null,
      sellerPayoutNotes: seller.payoutPreference?.notes || null,
      sellerPayoutPreferenceStatus: seller.payoutPreferenceStatus || null,
    };
  } catch (err) {
    console.error('[productPayloadWithSellerOnboarding] seller lookup error:', err);
    return payload;
  }
}

function nullableString(value, maxLength = 2000) {
  const text = String(value || '').trim();
  if (!text) return null;
  return text.slice(0, maxLength);
}

function normalizeSocialStatus(value) {
  const status = String(value || 'draft').trim().toLowerCase();
  return ['draft', 'scheduled', 'staged', 'posted', 'canceled'].includes(status) ? status : 'draft';
}

function normalizeSocialPlatform(value) {
  const platform = String(value || 'x').trim().toLowerCase();
  return ['x', 'linkedin', 'facebook', 'instagram', 'tiktok', 'youtube', 'threads', 'other'].includes(platform)
    ? platform
    : 'other';
}

function parsePositiveCents(value) {
  if (value === null || value === undefined || value === '') return null;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) return null;
  return Math.round(numberValue);
}

function normalizeBillingPeriod(value) {
  const period = String(value || '').trim().toLowerCase();
  if (['one_time', 'one-time', 'once'].includes(period)) return 'one_time';
  if (['year', 'yearly', 'annual', 'annually'].includes(period)) return 'year';
  return 'month';
}

function firstPolarPriceId(polarProduct) {
  const prices = Array.isArray(polarProduct?.prices) ? polarProduct.prices : [];
  return prices[0]?.id || null;
}

async function createPolarProductForMojo(productId, product, priceCents, billingPeriod) {
  const token = POLAR_ACCESS_TOKEN.value();
  if (!token) {
    throw new Error('POLAR_ACCESS_TOKEN is not configured');
  }

  const normalizedBillingPeriod = normalizeBillingPeriod(billingPeriod || product.billingPeriod || product.pricingModel);
  const body = {
    name: String(product.name || 'Mojo product').slice(0, 64),
    description: String(product.description || '').slice(0, 2000) || null,
    visibility: 'private',
    prices: [
      {
        price_currency: 'usd',
        price_amount: priceCents,
      },
    ],
    metadata: {
      mojo_product_id: productId,
      mojo_seller_email: String(product.submittedByEmail || product.sellerId || '').slice(0, 500),
      mojo_source: 'seller_submission',
    },
  };

  if (normalizedBillingPeriod !== 'one_time') {
    body.recurring_interval = normalizedBillingPeriod;
  }

  const response = await fetch('https://api.polar.sh/v1/products', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseBody = await response.json().catch(async () => ({ raw: await response.text().catch(() => '') }));
  if (!response.ok) {
    console.error('[createPolarProductForMojo] Polar create failed:', response.status, responseBody);
    throw new Error(responseBody?.detail?.[0]?.msg || responseBody?.message || 'Polar product creation failed');
  }

  return {
    polarProduct: responseBody,
    polarProductId: responseBody.id || null,
    polarPriceId: firstPolarPriceId(responseBody),
    billingPeriod: normalizedBillingPeriod,
  };
}

function socialPostPayload(doc) {
  const post = doc.data();
  return {
    id: doc.id,
    ...post,
    createdAtMillis: timestampMillis(post.createdAt),
    updatedAtMillis: timestampMillis(post.updatedAt),
    createdAt: undefined,
    updatedAt: undefined,
  };
}

function socialPostInput(body = {}) {
  const title = nullableString(body.title, 180);
  const text = nullableString(body.body, 12000);
  if (!title || !text) {
    return { error: 'Title and post text are required' };
  }

  return {
    id: nullableString(body.id, 160),
    title,
    body: text,
    platform: normalizeSocialPlatform(body.platform),
    status: normalizeSocialStatus(body.status),
    siteFunction: nullableString(body.siteFunction, 80) || 'general',
    clientName: nullableString(body.clientName, 180),
    campaign: nullableString(body.campaign, 180),
    scheduledAtIso: nullableString(body.scheduledAtIso, 40),
    assetUrl: nullableString(body.assetUrl, 2000),
    postUrl: nullableString(body.postUrl, 2000),
    notes: nullableString(body.notes, 4000),
  };
}

function socialPostDocId(input) {
  if (input.id) return input.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 160);

  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'social-post';

  return `${slug}-${Date.now().toString(36)}`;
}

/**
 * GET /adminListSocialPosts
 * Lists social posts for the marketing admin workspace.
 */
exports.adminListSocialPosts = onRequest(
  { secrets: [SOCIAL_ADMIN_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;
    if (req.method !== 'GET') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }
    if (!isAuthorizedSocialAdmin(req)) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    try {
      const snapshot = await db.collection('social_posts').get();
      const posts = snapshot.docs
        .map(socialPostPayload)
        .sort((a, b) => (b.updatedAtMillis || b.createdAtMillis || 0) - (a.updatedAtMillis || a.createdAtMillis || 0));

      res.status(200).json({ ok: true, posts });
    } catch (err) {
      console.error('[adminListSocialPosts] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /adminSaveSocialPost
 * Creates or updates a social post record.
 */
exports.adminSaveSocialPost = onRequest(
  { secrets: [SOCIAL_ADMIN_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }
    if (!isAuthorizedSocialAdmin(req)) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    const input = socialPostInput(req.body || {});
    if (input.error) {
      res.status(400).json({ ok: false, message: input.error });
      return;
    }

    try {
      const postId = socialPostDocId(input);
      const postRef = db.collection('social_posts').doc(postId);
      const postSnap = await postRef.get();
      const now = admin.firestore.FieldValue.serverTimestamp();
      const doc = {
        title: input.title,
        body: input.body,
        platform: input.platform,
        status: input.status,
        siteFunction: input.siteFunction,
        clientName: input.clientName,
        campaign: input.campaign,
        scheduledAtIso: input.scheduledAtIso,
        assetUrl: input.assetUrl,
        postUrl: input.postUrl,
        notes: input.notes,
        updatedAt: now,
      };

      if (!postSnap.exists) {
        doc.createdAt = now;
      }
      if (input.status === 'posted' && !postSnap.data()?.postedAtIso) {
        doc.postedAtIso = new Date().toISOString();
      }

      await postRef.set(doc, { merge: true });
      const saved = await postRef.get();
      res.status(200).json({ ok: true, post: socialPostPayload(saved) });
    } catch (err) {
      console.error('[adminSaveSocialPost] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /adminUpdateSocialPostStatus
 * Updates post lifecycle state from the calendar or posting workspace.
 */
exports.adminUpdateSocialPostStatus = onRequest(
  { secrets: [SOCIAL_ADMIN_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }
    if (!isAuthorizedSocialAdmin(req)) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    const postId = nullableString(req.body?.postId, 160);
    const status = normalizeSocialStatus(req.body?.status);
    if (!postId) {
      res.status(400).json({ ok: false, message: 'Missing postId' });
      return;
    }

    try {
      const postRef = db.collection('social_posts').doc(postId);
      const postSnap = await postRef.get();
      if (!postSnap.exists) {
        res.status(404).json({ ok: false, message: 'Post not found' });
        return;
      }

      const update = {
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      if (status === 'posted') {
        update.postedAtIso = new Date().toISOString();
        update.postUrl = nullableString(req.body?.postUrl, 2000) || postSnap.data().postUrl || null;
      }
      if (status === 'canceled') {
        update.canceledAtIso = new Date().toISOString();
      }
      if (status === 'staged') {
        update.stagedAtIso = new Date().toISOString();
      }

      await postRef.update(update);
      const saved = await postRef.get();
      res.status(200).json({ ok: true, post: socialPostPayload(saved) });
    } catch (err) {
      console.error('[adminUpdateSocialPostStatus] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

/**
 * POST /adminDeleteSocialPost
 * Deletes a social post record.
 */
exports.adminDeleteSocialPost = onRequest(
  { secrets: [SOCIAL_ADMIN_KEY] },
  async (req, res) => {
    if (setAdminCors(req, res)) return;
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
      return;
    }
    if (!isAuthorizedSocialAdmin(req)) {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
      return;
    }

    const postId = nullableString(req.body?.postId, 160);
    if (!postId) {
      res.status(400).json({ ok: false, message: 'Missing postId' });
      return;
    }

    try {
      await db.collection('social_posts').doc(postId).delete();
      res.status(200).json({ ok: true, message: 'Post deleted' });
    } catch (err) {
      console.error('[adminDeleteSocialPost] error:', err);
      res.status(500).json({ ok: false, message: 'Server error' });
    }
  }
);

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

      const products = await Promise.all(snapshot.docs.map(productPayloadWithSellerOnboarding));
      products.sort((a, b) => (b.createdAtMillis || 0) - (a.createdAtMillis || 0));

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
  { secrets: [ADMIN_PAYOUT_KEY, POLAR_ACCESS_TOKEN] },
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

    const { productId, polarPriceId, featured, priceCents, billingPeriod } = req.body || {};
    if (!productId) {
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

      const product = productSnap.data();
      const parsedPriceCents = parsePositiveCents(priceCents);
      const manualPolarPriceId = String(polarPriceId || '').trim();
      let polarCreateResult = null;
      let resolvedPolarPriceId = manualPolarPriceId;

      if (!resolvedPolarPriceId) {
        if (!parsedPriceCents) {
          res.status(400).json({ ok: false, message: 'Price is required to create the checkout product in Polar' });
          return;
        }

        polarCreateResult = await createPolarProductForMojo(String(productId), product, parsedPriceCents, billingPeriod);
        resolvedPolarPriceId = polarCreateResult.polarPriceId;
        if (!resolvedPolarPriceId) {
          res.status(502).json({ ok: false, message: 'Polar product was created but no price ID was returned' });
          return;
        }
      }

      await productRef.update({
        status: 'live',
        price: parsedPriceCents || product.price || null,
        billingPeriod: normalizeBillingPeriod(billingPeriod || product.billingPeriod || product.pricingModel),
        polarPriceId: resolvedPolarPriceId,
        polarProductId: polarCreateResult?.polarProductId || product.polarProductId || null,
        polarSyncStatus: polarCreateResult ? 'created' : 'manual_price_id',
        polarSyncedAt: polarCreateResult ? admin.firestore.FieldValue.serverTimestamp() : product.polarSyncedAt || null,
        featured: Boolean(featured),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Look up seller record to return token for onboarding email
      let sellerToken = null;
      let contactName = null;
      if (product.submittedByEmail) {
        const sellerSnap = await db.collection('sellers')
          .where('email', '==', product.submittedByEmail)
          .limit(1)
          .get();
        if (!sellerSnap.empty) {
          const seller = sellerSnap.docs[0].data();
          sellerToken = seller.sellerToken || null;
          contactName = seller.contactName || null;
        }
      }

      res.status(200).json({
        ok: true,
        message: 'Product published',
        email: product.submittedByEmail || null,
        contactName,
        productName: product.name || null,
        sellerToken,
        polarProductId: polarCreateResult?.polarProductId || product.polarProductId || null,
        polarPriceId: resolvedPolarPriceId,
      });
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
      logoUrl,
      screenshotUrl,
      targetUser,
      anythingElse,
    } = req.body;

    if (!email || !productName || !productDescription || !logoUrl || !screenshotUrl) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }

    if (!isPublicHttpUrl(logoUrl) || !isPublicHttpUrl(screenshotUrl)) {
      res.status(400).json({ ok: false, message: 'Logo and screenshot must be valid public image URLs' });
      return;
    }

    if (productUrl && !isPublicHttpUrl(productUrl)) {
      res.status(400).json({ ok: false, message: 'Product URL must be a valid public URL' });
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
        pricingModel: pricingModel || null,
        polarPriceId: null, // Admin links this later
        externalUrl: productUrl || null,
        productUrl: productUrl || null,
        imageUrl: screenshotUrl || logoUrl || null,
        logoUrl: logoUrl || null,
        screenshotUrl: screenshotUrl || null,
        imageUrls: [logoUrl, screenshotUrl].filter(Boolean),
        status: 'pending_review', // Requires admin approval
        featured: false,
        rating: null,
        setupMinutes: null,
        integrations: [],
        inputs: targetUser || null,
        targetUser: targetUser || null,
        outputs: null,
        iconColor: null,
        iconLetter: null,
        notes: `Submitted by ${contactName}: ${productUrl ? 'Has external URL' : 'No external URL provided'}`,
        submitterName: contactName || null,
        anythingElse: anythingElse || null,
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

/**
 * Monthly sales report — runs 1st of each month at 8am ET
 * Emails each seller their prior month's sales + emails admin a full summary
 */
exports.monthlySalesReport = onSchedule(
  { schedule: '0 13 1 * *', timeZone: 'America/New_York', secrets: [RESEND_API_KEY] },
  async () => {
    const now = new Date();
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthLabel = firstOfLastMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const salesSnap = await db.collection('sales')
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(firstOfLastMonth))
      .where('createdAt', '<', admin.firestore.Timestamp.fromDate(firstOfThisMonth))
      .get();

    // Group by seller
    const bySeller = {};
    let totalRevenue = 0;
    let totalCommissions = 0;

    for (const doc of salesSnap.docs) {
      const sale = doc.data();
      const sid = sale.sellerId;
      if (!bySeller[sid]) bySeller[sid] = { sales: [], totalAmount: 0, totalCommission: 0 };
      bySeller[sid].sales.push(sale);
      bySeller[sid].totalAmount += sale.amount || 0;
      bySeller[sid].totalCommission += sale.commission || 0;
      totalRevenue += sale.amount || 0;
      totalCommissions += sale.commission || 0;
    }

    const resendKey = RESEND_API_KEY.value();
    const sendEmail = async (to, subject, html) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'Mojo AI Studio <noreply@mojoaistudio.com>', to: [to], subject, html }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[monthlySalesReport] email failed to', to, err);
      }
    };

    // Email each seller
    for (const [sellerId, data] of Object.entries(bySeller)) {
      const sellerSnap = await db.collection('sellers').doc(sellerId).get();
      if (!sellerSnap.exists) continue;
      const seller = sellerSnap.data();
      const email = seller.email;
      const name = seller.contactName || 'Seller';

      const rows = data.sales.map(s =>
        `<tr><td>${s.productName}</td><td>$${(s.amount / 100).toFixed(2)}</td><td>$${(s.commission / 100).toFixed(2)}</td></tr>`
      ).join('');

      await sendEmail(email, `Your Mojo Sales Report — ${monthLabel}`, `
        <p>Hi ${name},</p>
        <p>Here's your sales summary for <strong>${monthLabel}</strong>:</p>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <thead><tr><th>Product</th><th>Sale Price</th><th>Your 90%</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr><td><strong>Total</strong></td><td><strong>$${(data.totalAmount / 100).toFixed(2)}</strong></td><td><strong>$${(data.totalCommission / 100).toFixed(2)}</strong></td></tr></tfoot>
        </table>
        <p>Payouts are processed manually. Contact <a href="mailto:admin@MojoAiStudio.com">admin@MojoAiStudio.com</a> to request your payout.</p>
        <p>— Mojo AI Studio</p>
      `);
    }

    // Email admin full summary
    const sellerCount = Object.keys(bySeller).length;
    const allRows = salesSnap.docs.map(doc => {
      const s = doc.data();
      return `<tr><td>${s.productName}</td><td>${s.sellerId}</td><td>$${(s.amount / 100).toFixed(2)}</td><td>$${(s.commission / 100).toFixed(2)}</td></tr>`;
    }).join('');

    await sendEmail('admin@MojoAiStudio.com', `Mojo Monthly Sales Report — ${monthLabel}`, `
      <p><strong>${monthLabel} Summary</strong></p>
      <p>Total sales: ${salesSnap.size} | Sellers with sales: ${sellerCount} | Gross revenue: $${(totalRevenue / 100).toFixed(2)} | Total commissions owed: $${(totalCommissions / 100).toFixed(2)} | Mojo cut: $${((totalRevenue - totalCommissions) / 100).toFixed(2)}</p>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <thead><tr><th>Product</th><th>Seller</th><th>Sale</th><th>Commission</th></tr></thead>
        <tbody>${allRows}</tbody>
      </table>
    `);

    console.log('[monthlySalesReport] sent reports for', monthLabel, '— sales:', salesSnap.size, 'sellers:', sellerCount);
  }
);
