# GAIN — Polar Webhook Build Spec

How to build the Polar webhook receiver that keeps GAIN's Pro access in sync
with subscription state. This lives in the **GAIN codebase** (governainow.com),
not the Mojo marketplace.

---

## Polar dashboard setup

**Name:** GAIN Webhook  
**URL:** `https://governainow.com/api/polar-webhook`  
**Format:** `application/json`

**Events to subscribe — check only these four:**

| Event | Why |
|---|---|
| `subscription.created` | New subscriber → activate Pro, send welcome |
| `subscription.updated` | Renewal, plan change, or status flip |
| `subscription.revoked` | Immediate cancellation → remove Pro access now |
| `order.paid` | Successful payment confirmation (optional but useful for receipts) |

Everything else (checkout.*, customer.*, member.*, customer_seat.*) is noise
for GAIN's current scope — skip it.

**After saving**, Polar shows you a **webhook secret**. Copy it immediately —
you need it for signature verification. Store it as `POLAR_WEBHOOK_SECRET`
in your environment.

---

## What to store in GAIN's database

Add a `subscriptions` table (or equivalent):

```sql
CREATE TABLE subscriptions (
  id              TEXT PRIMARY KEY,   -- Polar subscription ID
  customer_email  TEXT NOT NULL,
  customer_id     TEXT NOT NULL,      -- Polar customer ID
  status          TEXT NOT NULL,      -- active | cancelled | past_due
  license_key     TEXT,               -- the pro-… key Polar issued
  current_period_end  TIMESTAMP,      -- when current paid period ends
  created_at      TIMESTAMP DEFAULT now(),
  updated_at      TIMESTAMP DEFAULT now()
);
```

Your `users` table just needs a `subscription_id` foreign key or a
`plan` column (`free` | `pro`) you flip on each webhook.

---

## Endpoint implementation

### Node.js / Express

```js
// api/polar-webhook.js
import crypto from 'crypto';
import express from 'express';

const router = express.Router();

// Use raw body for signature verification
router.post(
  '/api/polar-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    // 1 — Verify signature
    const sig = req.headers['webhook-signature'];      // Polar header
    const ts  = req.headers['webhook-timestamp'];
    const secret = process.env.POLAR_WEBHOOK_SECRET;

    const signedPayload = `${ts}.${req.body.toString()}`;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    if (sig !== expected) {
      return res.status(401).json({ error: 'invalid signature' });
    }

    // 2 — Parse event
    const event = JSON.parse(req.body);
    const { type, data } = event;

    // 3 — Handle
    try {
      await handleEvent(type, data);
      res.json({ received: true });
    } catch (err) {
      console.error('Webhook handler error', type, err);
      res.status(500).json({ error: 'handler failed' });
    }
  }
);

async function handleEvent(type, data) {
  switch (type) {
    case 'subscription.created':
      await activatePro(data);
      break;

    case 'subscription.updated':
      await syncSubscription(data);
      break;

    case 'subscription.revoked':
      await deactivatePro(data);
      break;

    case 'order.paid':
      await recordPayment(data);
      break;

    default:
      // Ignore unsubscribed event types that Polar may send anyway
      break;
  }
}

// ── Handlers ──────────────────────────────────────────────────────────────────

async function activatePro(sub) {
  // sub.customer.email, sub.id, sub.customer.id, sub.current_period_end
  await db.upsertSubscription({
    id:                sub.id,
    customerEmail:     sub.customer.email,
    customerId:        sub.customer.id,
    status:            'active',
    currentPeriodEnd:  sub.current_period_end,
  });

  await db.setUserPlan(sub.customer.email, 'pro');
  await sendWelcomeEmail(sub.customer.email);  // optional
}

async function syncSubscription(sub) {
  const status = sub.status === 'active' ? 'active' : 'cancelled';

  await db.upsertSubscription({
    id:               sub.id,
    status,
    currentPeriodEnd: sub.current_period_end,
  });

  // Downgrade immediately if not active; keep Pro until period end if cancelled
  const plan = status === 'active' ? 'pro' : 'free';
  await db.setUserPlan(sub.customer.email, plan);
}

async function deactivatePro(sub) {
  await db.upsertSubscription({ id: sub.id, status: 'cancelled' });
  await db.setUserPlan(sub.customer.email, 'free');
}

async function recordPayment(order) {
  // Log for receipts / audit trail — no access change needed
  await db.insertPaymentRecord({
    orderId:       order.id,
    customerEmail: order.customer.email,
    amount:        order.amount,
    paidAt:        order.created_at,
  });
}

export default router;
```

### PHP (if GAIN runs on PHP)

```php
<?php
// api/polar-webhook.php

$rawBody = file_get_contents('php://input');
$sig     = $_SERVER['HTTP_WEBHOOK_SIGNATURE'] ?? '';
$ts      = $_SERVER['HTTP_WEBHOOK_TIMESTAMP']  ?? '';
$secret  = getenv('POLAR_WEBHOOK_SECRET');

// 1 — Verify
$expected = hash_hmac('sha256', "$ts.$rawBody", $secret);
if (!hash_equals($expected, $sig)) {
    http_response_code(401);
    exit('invalid signature');
}

// 2 — Parse
$event = json_decode($rawBody, true);
$type  = $event['type'];
$data  = $event['data'];

// 3 — Handle
switch ($type) {
    case 'subscription.created':
        activatePro($data); break;
    case 'subscription.updated':
        syncSubscription($data); break;
    case 'subscription.revoked':
        deactivatePro($data); break;
    case 'order.paid':
        recordPayment($data); break;
}

http_response_code(200);
echo json_encode(['received' => true]);
```

---

## License key — validate on login (belt-and-suspenders)

Webhooks keep your DB in sync, but also validate the `pro-…` key directly
when a user logs in or hits a Pro-gated route. This catches edge cases where
a webhook was missed.

```js
// Called on login or before showing Pro features
async function validateLicenseKey(key) {
  const res = await fetch('https://api.polar.sh/v1/users/licenses/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      key,
      organization_id: process.env.POLAR_ORGANIZATION_ID,
    }),
  });

  const { valid, expires_at } = await res.json();
  return valid;   // true → Pro, false → downgrade to Free
}
```

---

## Checklist before going live

- [ ] Endpoint deployed at `https://governainow.com/api/polar-webhook`
- [ ] `POLAR_WEBHOOK_SECRET` set in environment
- [ ] `POLAR_ACCESS_TOKEN` set in environment (for key validation calls)
- [ ] `POLAR_ORGANIZATION_ID` set in environment
- [ ] Four events subscribed in Polar dashboard
- [ ] `subscriptions` table (or equivalent) created in GAIN's DB
- [ ] `setUserPlan()` correctly gates Pro features in GAIN UI
- [ ] Webhook URL tested with Polar's "Send test event" button
- [ ] Signature verification returns 401 on bad sig (test with wrong secret)
