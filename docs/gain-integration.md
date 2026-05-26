# GAIN ↔ Mojo Integration Context

**Last updated:** 2026-05-26  
**Status:** Polar.sh account live — Price IDs needed next

---

## What's been decided

GAIN (GovernAINow.com) is already listed on the Mojo marketplace (`products/index.html`) with a full plan comparison dialog. The current CTA buttons redirect to `https://governainow.com/index.html?plan=pro` etc. — a manual handoff.

The goal is to replace that with a real Polar.sh checkout so Mojo owns the payment.

---

## Polar.sh account

- **Org slug:** `mind-share-media-llc`
- **Status:** Account approved ✅, Stripe payout configured ✅, Identity verified ✅
- **Embed script:** `<script async src="https://cdn.polar.sh/embed.js"></script>` (already scaffolded in `products/index.html:226-230`, commented out)

---

## What Mojo needs to do

1. **Create GAIN products in Polar.sh dashboard** — one for each paid tier:
   - GAIN Pro — $100/month
   - GAIN Business — $250/month
   - GAIN Enterprise — $500/month

2. **Get the 3 Price IDs** from Polar.sh and plug them into:
   - `products/data/products.json` → `polarPriceId` field on the GAIN product (currently `null`)
   - `products/index.html` → `data-polar-checkout` attributes on the CTA buttons (currently `aria-disabled="true"` with placeholder IDs)

3. **Configure the Polar.sh embed** in `products/index.html:226-230`:
   ```javascript
   window.polar.queue.push(['configure', { organization: 'mind-share-media-llc' }]);
   ```
   Uncomment this line and the `<script>` tag.

4. **Enable the checkout buttons** — remove `aria-disabled="true"` and replace placeholder `data-polar-checkout` values with real Price IDs.

5. **Set up a webhook in the Polar.sh dashboard** pointing to GAIN's receiver endpoint:
   ```
   POST https://us-central1-[gain-firebase-project].cloudfunctions.net/polarWebhook
   ```
   *(GAIN will provide the exact URL once the function is deployed)*

6. **Share the webhook secret** with the GAIN session so it can validate incoming requests.

---

## What GAIN will do on webhook receipt

GAIN is building a `polarWebhook` Firebase Cloud Function that:

1. Validates the Polar.sh webhook signature
2. Handles three event types:
   - `subscription.created` → write `stripePlan` to Firestore company doc + send welcome email (Brevo)
   - `subscription.updated` → update `stripePlan` + send plan-change email
   - `subscription.canceled` → reset `stripePlan` to `'starter'` + send cancellation email
3. Looks up the company by the customer's email address
4. Maps Polar Price ID → GAIN plan slug (`pro` | `business` | `enterprise`)

GAIN's `stripePlan` field already drives all plan-gating in the app — no schema changes needed.

---

## Post-purchase redirect (optional but recommended)

Polar.sh supports a `successUrl` redirect after checkout. Consider redirecting to:
```
https://governainow.com/index.html?plan=pro&source=mojo
```
This takes the new customer straight to GAIN sign-up with their plan pre-selected.

---

## Open questions for the Mojo session

- Do the 3 GAIN products already exist in the Polar.sh dashboard, or do they need to be created?
- Should annual pricing be set up in Polar.sh too (GAIN Pro $1,100/yr, Business $2,700/yr, Enterprise $5,250/yr)?
- What `successUrl` should Polar.sh redirect to after checkout?
