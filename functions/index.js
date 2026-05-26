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
