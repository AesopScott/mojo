# Polar.sh Checkout Copy — GAIN (Govern AI Now)

Paste the content below into each product's **"Customize how this product is presented during checkout"** field in the Polar.sh dashboard.

---

## GAIN — Pro · $100/mo

**Product name:** GAIN — Pro

**Description (paste into Polar checkout description field):**

```
GAIN (Govern AI Now) is the fastest way to build a real AI governance program — risk register, AI Impact Assessments, and compliance checklists mapped to NIST AI RMF, ISO 42001, EU AI Act, and HIPAA.

The Pro plan is built for startups and single-product orgs getting governance right from day one. Track up to 15 AI systems, run your team of 10, and run AI Impact Assessments with sector-specific checklists — no consultant required.

14-day free trial. Cancel any time.
```

**Benefits (one per line — these appear as checkmarks at checkout):**

```
Up to 15 AI systems tracked
Up to 10 team members
1 workspace
AI Impact Assessments (AIA)
Sector compliance checklists — NIST AI RMF, ISO 42001, EU AI Act, HIPAA
Email support (48h response)
14-day free trial, then $100/mo
```

---

## GAIN — Business · $250/mo

**Product name:** GAIN — Business

**Description:**

```
GAIN (Govern AI Now) is the fastest way to build a real AI governance program — risk register, AI Impact Assessments, and compliance checklists mapped to NIST AI RMF, ISO 42001, EU AI Act, and HIPAA.

The Business plan is built for mid-market teams and regulated industries that need multi-workspace control and faster support. Track up to 35 AI systems across 3 workspaces, bring in a team of 25, and get Google Workspace SSO out of the box.

14-day free trial. Cancel any time.
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
14-day free trial, then $250/mo
```

---

## GAIN — Enterprise · $500/mo

**Product name:** GAIN — Enterprise

**Description:**

```
GAIN (Govern AI Now) is the fastest way to build a real AI governance program — risk register, AI Impact Assessments, and compliance checklists mapped to NIST AI RMF, ISO 42001, EU AI Act, and HIPAA.

The Enterprise plan is built for large organizations and multi-business-unit deployments that need unlimited scale, enterprise SSO (SAML, Okta, Azure AD), and a dedicated support channel. Unlimited AI systems, unlimited team members, unlimited workspaces.

14-day free trial. Cancel any time.
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
14-day free trial, then $500/mo
```

---

## Notes for Polar setup

- **Trial period:** Set to **14 days** on all three products.
- **Billing interval:** Monthly (annual option can be added later).
- **Cover image:** Use the GAIN governance graphic or the Mojo AI Studio brand mark — keep it consistent across all three products.
- **Webhook:** `https://polarwebhook-ybz2g7wg4a-uc.a.run.app` — subscribe to `order.created`, `subscription.created`, `subscription.updated`, `subscription.canceled`.
- **Success URL / redirect:** `https://mojoaistudio.com/portal/` — sends the buyer to the customer portal after checkout.
- **Org slug:** Whatever slug you choose here is what goes in the GitHub Actions `POLAR_ORG` variable to activate the portal iframe.
