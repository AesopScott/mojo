# Environment Variables Registry

Every environment variable used in this project. For each: where it's set, where it's used, what it controls. Update whenever an env var is added, removed, or its purpose changes.

---

## `STRIPE_PUBLISHABLE_KEY`

Stripe publishable API key (safe to expose in client-side code).

**Producers**
- Stripe Dashboard → user manually creates Stripe account and copies key (Task 1.4)
- `.env.example:1` — documented template (Task 1.4)
- `.env` — set by developer during setup (Task 1.4)

**Consumers**
- `products/scripts/checkout.js:*` — initializes Stripe.js with publishable key (Task 2.5)
- Stripe.js client library requires this to initialize payment forms (Task 2.5)

**Expected behavior:** Key loaded from environment at runtime. Format: `pk_test_*` (test mode) or `pk_live_*` (live mode).

**Validation:** Must be present and match format before Task 2.5 runs. Recommend Task 5.2 validates both keys are set and correct mode (test vs. live).

**Status:** ⚠ configuration gap — no task explicitly validates that key is set before Task 2.5 checkout code runs. Missing validation in startup.

---

## `STRIPE_SECRET_KEY`

Stripe secret API key (must never be exposed to client; server-side only).

**Producers**
- Stripe Dashboard → user creates and copies secret key (Task 1.4)
- `.env.example:1` — documented template (Task 1.4)
- `.env` — set by developer during setup (Task 1.4)

**Consumers**
- `api/stripe-webhook.js:*` — uses secret key to validate webhook signatures (Task 2.5)
- `api/stripe-webhook.js:*` — queries Stripe API to confirm payment status (Task 2.5)
- Backend middleware — validates Stripe signature on webhook (Task 2.5)

**Expected behavior:** Key loaded from environment and used server-side only. Never logged, never sent to client. Format: `sk_test_*` (test mode) or `sk_live_*` (live mode).

**Validation:** Must be present, must match test/live mode, must be different from publishable key.

**Status:** ⚠ configuration gap — no startup validation. Task 5.2 must verify both keys are present, correct mode, and that secret key is never sent to client.

---

## `EMAIL_SERVICE` (decision pending)

Email service provider choice: `sendgrid`, `mailgun`, or `smtp`.

**Producers**
- Developer decision in Task 1.5 — must choose and document (Task 1.5)
- `.env.example` — documented (Task 1.5)
- `.env` — set during setup (Task 1.5)

**Consumers**
- `api/email-handler.js:*` — uses this to select email provider (Task 1.5)
- Task 1.5 validation — confirms email service can send (Task 1.5)

**Expected behavior:** One of three values: `sendgrid`, `mailgun`, or `smtp`. Controls which email library/API is used.

**Status:** ⚠ ambiguous decision — Task 1.5 says "use SendGrid, Mailgun, or SMTP" but doesn't lock the choice. Must decide before Task 1.5 writes code. Recommend documenting the decision in CLAUDE.md or task description.

---

## `SENDGRID_API_KEY` (if `EMAIL_SERVICE=sendgrid`)

SendGrid API key for sending emails.

**Producers**
- SendGrid account → user creates and copies API key (Task 1.5, conditional)
- `.env.example` — documented if SendGrid chosen (Task 1.5)
- `.env` — set if using SendGrid (Task 1.5)

**Consumers**
- `api/email-handler.js:*` — uses key to authenticate with SendGrid API (Task 1.5, if SendGrid)

**Expected behavior:** Key loaded from environment. Format: `SG.*` (Base64-encoded).

**Status:** ⚠ conditional — only required if `EMAIL_SERVICE=sendgrid`. Must be documented as optional in `.env.example`.

---

## `MAILGUN_API_KEY` (if `EMAIL_SERVICE=mailgun`)

Mailgun API key for sending emails.

**Producers**
- Mailgun account → user creates and copies API key (Task 1.5, conditional)
- `.env.example` — documented if Mailgun chosen (Task 1.5)
- `.env` — set if using Mailgun (Task 1.5)

**Consumers**
- `api/email-handler.js:*` — uses key to authenticate with Mailgun API (Task 1.5, if Mailgun)

**Expected behavior:** Key loaded from environment.

**Status:** ⚠ conditional — only required if `EMAIL_SERVICE=mailgun`. Must be documented as optional in `.env.example`.

---

## `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (if `EMAIL_SERVICE=smtp`)

SMTP server credentials for sending emails.

**Producers**
- Email provider (Gmail, custom SMTP server, etc.) → user provides credentials (Task 1.5, conditional)
- `.env.example` — documented if SMTP chosen (Task 1.5)
- `.env` — set if using SMTP (Task 1.5)

**Consumers**
- `api/email-handler.js:*` — uses credentials to connect to SMTP server (Task 1.5, if SMTP)
- Nodemailer or similar library → authenticates with SMTP server (Task 1.5, if SMTP)

**Expected behavior:** All four vars set together. Format: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=user@gmail.com`, `SMTP_PASS=password`.

**Status:** ⚠ conditional — only required if `EMAIL_SERVICE=smtp`. Must be documented as optional in `.env.example`.

---

## `ADMIN_EMAIL`

Email address that receives form submissions from /development.

**Producers**
- Developer configuration → hardcoded in Task 1.5 or set as env var (Task 1.5)
- `.env.example:1` — value: `admin@MojoAiStudio.com` (Task 1.5)
- `.env` — set during setup (Task 1.5)

**Consumers**
- `api/email-handler.js:*` — uses to set "To:" recipient (Task 1.5)
- `development/scripts/form-submit.js:*` — may display in confirmation message (Task 3.3)

**Expected behavior:** Valid email address format. Emails from `/development` form submitted to this address.

**Current value:** `admin@MojoAiStudio.com` (from plan)

**Status:** ✓ (producer and consumer in plan, value documented)

---

## `GITHUB_TOKEN` (optional, for deployment)

GitHub personal access token for deployment automation.

**Producers**
- GitHub account → user creates PAT and stores in MochaHost secrets (Task 1.1)
- MochaHost → stores and injects into GitHub Actions environment (Task 1.1)

**Consumers**
- `.github/workflows/deploy.yml:*` — uses token to authenticate GitHub API calls during deploy (Task 1.1)

**Expected behavior:** Token with `repo` scope for private repo access, or public-only scope for public repos.

**Status:** ⚠ optional — only needed if GitHub Actions deployment requires authentication (e.g., private repo). May not be needed for MochaHost integration. Clarify in Task 1.1.

---

## Summary

| Variable | Set In | Used In | Status |
|----------|--------|---------|--------|
| `STRIPE_PUBLISHABLE_KEY` | Task 1.4 → `.env` | Task 2.5 client | ⚠ no startup validation |
| `STRIPE_SECRET_KEY` | Task 1.4 → `.env` | Task 2.5 webhook | ⚠ no startup validation |
| `EMAIL_SERVICE` | Task 1.5 → `.env` | Task 1.5 | ⚠ choice not locked in |
| `SENDGRID_API_KEY` | Task 1.5 → `.env` (if SendGrid) | Task 1.5 | ⚠ conditional, not yet chosen |
| `MAILGUN_API_KEY` | Task 1.5 → `.env` (if Mailgun) | Task 1.5 | ⚠ conditional, not yet chosen |
| `SMTP_HOST`, `SMTP_PORT`, etc. | Task 1.5 → `.env` (if SMTP) | Task 1.5 | ⚠ conditional, not yet chosen |
| `ADMIN_EMAIL` | Task 1.5 → `.env` | Task 1.5, Task 3.3 | ✓ |
| `GITHUB_TOKEN` | Task 1.1 → MochaHost secrets | Task 1.1 deploy | ⚠ optional, scope unclear |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-24T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** Environment Variables

**Evidence recorded:**
- 8 env var entries identified
- 1 entry with complete producer/consumer pair ✓
- 7 entries with gaps (missing validation, conditional, ambiguous choice) ⚠
- New identifiers introduced on this task: `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `EMAIL_SERVICE`, `SENDGRID_API_KEY`, `MAILGUN_API_KEY`, `SMTP_*`, `ADMIN_EMAIL`, `GITHUB_TOKEN`
- Registries match current plan (3-Build_Plan.md): yes

**Gaps identified:**
- `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` — no startup validation task
- `EMAIL_SERVICE` — choice not locked; must be decided before Task 1.5 implementation
- `SENDGRID_API_KEY`, `MAILGUN_API_KEY`, `SMTP_*` — conditional on EMAIL_SERVICE choice
- `GITHUB_TOKEN` — scope and necessity unclear for MochaHost integration

**Status:** Audit complete (pre-implementation) — registries document required configuration.
