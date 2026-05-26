# Polar.sh Checkout Copy — GAIN (Govern AI Now)

Paste the content below into each product's **"Customize how this product is presented during checkout"** field in the Polar.sh dashboard.

**Trial model:** GAIN has no time-based trial. The free plan is unlimited time but capped on objects (AI systems, team members, workspaces). Paid plans unlock higher limits. GAIN enforces all limits — Polar does not need a trial period configured.

---

## GAIN — Pro · $100/mo

**Product name:** GAIN — Pro

**Description (paste into Polar checkout description field):**

```
GAIN (Govern AI Now) is the fastest way to build a real AI governance program — risk register, AI Impact Assessments, and compliance checklists mapped to NIST AI RMF, ISO 42001, EU AI Act, and HIPAA.

The Pro plan is built for startups and single-product orgs getting governance right from day one. Track up to 15 AI systems, run your team of 10, and run AI Impact Assessments with sector-specific checklists — no consultant required.

Already on the free plan? Upgrading is instant. Your existing data stays where it is — limits lift immediately. Cancel any time.
```

**Benefits (one per line — these appear as checkmarks at checkout):**

```
Up to 15 AI systems tracked
Up to 10 team members
1 workspace
AI Impact Assessments (AIA)
Sector compliance checklists — NIST AI RMF, ISO 42001, EU AI Act, HIPAA
Email support (48h response)
Cancel any time
```

---

## GAIN — Business · $250/mo

**Product name:** GAIN — Business

**Description:**

```
GAIN (Govern AI Now) is the fastest way to build a real AI governance program — risk register, AI Impact Assessments, and compliance checklists mapped to NIST AI RMF, ISO 42001, EU AI Act, and HIPAA.

The Business plan is built for mid-market teams and regulated industries that need multi-workspace control and faster support. Track up to 35 AI systems across 3 workspaces, bring in a team of 25, and get Google Workspace SSO out of the box.

Already on the free plan? Upgrading is instant. Your existing data stays where it is — limits lift immediately. Cancel any time.
```

**Benefits:**

```
Up to 35 AI systems tracked
Up to 25 team members
3 workspaces
AI Impact Assessments (AIA)
Sector compliance checklists — NIST AI RMF, ISO 42001, EU AI Act, HIPAA
Google Workspace SSO
Priority email support (24h response)
Cancel any time
```

---

## GAIN — Enterprise · $500/mo

**Product name:** GAIN — Enterprise

**Description:**

```
GAIN (Govern AI Now) is the fastest way to build a real AI governance program — risk register, AI Impact Assessments, and compliance checklists mapped to NIST AI RMF, ISO 42001, EU AI Act, and HIPAA.

The Enterprise plan is built for large organizations and multi-business-unit deployments that need unlimited scale, enterprise SSO (SAML, Okta, Azure AD), and a dedicated support channel. Unlimited AI systems, unlimited team members, unlimited workspaces.

Already on the free plan? Upgrading is instant. Your existing data stays where it is — limits lift immediately. Cancel any time.
```

**Benefits:**

```
Unlimited AI systems tracked
Unlimited team members
Unlimited workspaces
AI Impact Assessments (AIA)
Sector compliance checklists — NIST AI RMF, ISO 42001, EU AI Act, HIPAA
Enterprise SSO — SAML, Okta, Azure AD
Email + Discord support (8h response SLA)
Cancel any time
```

---

## Notes for Polar setup

- **Trial period:** Do NOT set a trial period — GAIN's free plan is the trial (unlimited time, object-capped). Polar trial period should be left off.
- **Billing interval:** Monthly (annual option can be added later).
- **Cover image:** Use `assets/gain-product-image.svg` — keep consistent across all three products.
- **Webhook:** `https://polarwebhook-ybz2g7wg4a-uc.a.run.app` — subscribe to `order.created`, `subscription.created`, `subscription.updated`, `subscription.canceled`.
- **Success URL / redirect:** `https://mojoaistudio.com/portal/` — sends the buyer to the customer portal after checkout.
- **Org slug:** `mind-share-media-llc`
