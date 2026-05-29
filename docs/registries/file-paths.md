# File Paths Registry

Every internal file path and data structure location referenced across multiple places in the project. For each: who writes it, who reads it, expected format/location. Update whenever a file location is added, removed, or moved.

---

## `../mojo-sms-reminders.json`

Default JSON store for Meetup RSVP SMS reminder invites and consented reminder subscriptions. The default is one directory above the project root; production can set `MOJO_SMS_REMINDER_STORE` to a different absolute path outside public web paths.

**Producers**
- `api/meetup-admin.php` - `action=poll-sms-invites` creates invite tokens for new Meetup RSVPs
- `api/sms-reminders.php` - saves phone number, consent text, and event reminder subscription after opt-in
- `api/meetup-admin.php` - `action=send-sms-reminders` marks reminders sent

**Consumers**
- `api/sms-reminder-lib.php` - `smsReadStore()` and `smsWriteStore()`
- `api/meetup-admin.php` - reads invites/subscriptions for cron actions
- `api/sms-reminders.php` - validates invite tokens before saving phone numbers

**Expected format:** JSON object with `invites`, `subscriptions`, and `messages` keys. Phone numbers are stored only on opted-in `subscriptions` with `purpose: "event_sms_reminder_only"`.

**Status:** active

---

## `../mojo-meetup-followups.json`

Default JSON store for Meetup topic follow-up state. The default is one directory above the project root; production can set `MOJO_MEETUP_FOLLOWUP_STORE` to a different absolute path outside public web paths.

**Producers**
- `api/meetup-admin.php` - `action=send-topic-followups` records first-seen RSVP state and sent markers

**Consumers**
- `api/meetup-admin.php` - skips already-sent follow-ups and waits until records are eligible

**Expected format:** JSON object with a `topicFollowups` key. Records store hashed email addresses, source IDs, eligibility timestamps, and sent timestamps; raw email addresses are not persisted.

**Status:** active

---

## `products/data/products.json`

Static JSON file containing all marketplace products.

**Producers**
- Task 2.1 — creates and defines product data structure

**Consumers**
- `products/scripts/listing.js:*` — fetches and renders product cards (Task 2.2)
- `products/scripts/detail.js:*` — fetches product by ID for detail page (Task 2.3)
- `products/scripts/cart.js:*` — validates product IDs when adding to cart (Task 2.4)

**Expected format:** JSON array of objects with fields: `id`, `name`, `price`, `description`, `features[]`, `image_url`. Exact schema defined in Task 2.1.

**Location guarantee:** Must be at `products/data/products.json` relative to project root, or all three consumers will fail to load.

**Status:** ⚠ missing contract — Task 2.1 defines structure, but Task 2.2 doesn't document expected shape. Risk of mismatch. Recommend adding `products/data/products.schema.json` (JSON Schema) as mentioned in Task 2.1.

---

## `products/data/products.schema.json` (optional)

JSON Schema describing the shape of `products.json`.

**Producers**
- Task 2.1 — optionally creates schema for validation (Task 2.1)

**Consumers**
- `products/scripts/listing.js:*` — may validate products against schema (Task 2.2, optional)
- Documentation — defines contract between producers and consumers

**Expected format:** JSON Schema Draft 7 with `properties` defining each product field.

**Status:** ✓ (optional but recommended; reduces mismatch risk)

---

## `products/pages/[product-id].html`

Individual product detail page template.

**Producers**
- Task 2.3 — creates detail page template file(s)

**Consumers**
- `products/scripts/detail.js:*` — loads product data and populates template (Task 2.3)
- User browser — displays detail page (Task 2.3, proof unit 2)

**Expected location:** `products/pages/[product-id].html` (template) or dynamically generated at `/products/pages/<id>.html` route.

**Status:** ✓ (producer and consumer in plan)

---

## `products/pages/cart.html`

Shopping cart page.

**Producers**
- Task 2.4 — creates cart page file

**Consumers**
- `products/scripts/cart.js:*` — loads cart HTML and populates with items (Task 2.4)
- User browser — displays cart (Task 2.4, proof unit 3)

**Expected location:** `products/pages/cart.html` relative to project root.

**Status:** ✓ (producer and consumer in plan)

---

## `products/pages/confirmation.html`

Order confirmation page after successful payment.

**Producers**
- Task 2.6 — creates confirmation page file

**Consumers**
- `products/scripts/confirmation.js:*` — loads confirmation page and displays order number (Task 2.6)
- User browser — displays after Stripe checkout succeeds (Task 2.6, proof unit 4)

**Expected location:** `products/pages/confirmation.html` relative to project root.

**Status:** ✓ (producer and consumer in plan)

---

## `components/header.html`

Shared navigation header component included in all three sections.

**Producers**
- Task 1.3 — creates header component file

**Consumers**
- `products/index.html:*` — includes header (Task 2.2)
- `development/index.html:*` — includes header (Task 3.1)
- `watch/index.html:*` — includes header (Task 4.1)

**Expected format:** HTML fragment with three nav links: Products, Development, Learn.

**Expected location:** `components/header.html` relative to project root.

**Status:** ⚠ include mechanism not specified — must decide how to include (HTML fragment, server-side template, JavaScript, build-time concatenation). Task 1.3 should document the include pattern.

---

## `components/footer.html`

Shared footer component included in all three sections.

**Producers**
- Task 1.3 — creates footer component file

**Consumers**
- `products/index.html:*` — includes footer (Task 2.2)
- `development/index.html:*` — includes footer (Task 3.1)
- `watch/index.html:*` — includes footer (Task 4.1)

**Expected format:** HTML fragment with shared branding and links.

**Expected location:** `components/footer.html` relative to project root.

**Status:** ⚠ include mechanism not specified — same issue as header. Task 1.3 should document pattern.

---

## `styles/shared.css`

Shared CSS styles for navigation, footer, and consistent branding.

**Producers**
- Task 1.3 — creates shared CSS file

**Consumers**
- `products/index.html:*` — links to shared CSS (Task 2.2)
- `products/styles/listing.css:*` — may import or extend shared styles (Task 2.2)
- `development/index.html:*` — links to shared CSS (Task 3.1)
- `watch/index.html:*` — links to shared CSS (Task 4.1)

**Expected location:** `styles/shared.css` relative to project root.

**Expected behavior:** Defines CSS for header, footer, navigation links, consistent fonts/colors across sections.

**Status:** ✓ (producer and consumer in plan)

---

## `styles/mockups.css`

Existing mockup CSS (current state).

**Producers**
- `index.html:11` — current index links to this

**Consumers**
- Current `index.html` uses this for styling

**Expected location:** `styles/mockups.css` relative to project root.

**Status:** ⚠ transition concern — current index.html links to `styles/mockups.css`, but new structure will use `styles/shared.css`. Must decide: merge styles or replace during Task 1.3.

---

## `.env.example`

Template file documenting all required environment variables.

**Producers**
- Task 1.4 — creates template with Stripe keys (Task 1.4)
- Task 1.5 — adds email config vars (Task 1.5)

**Consumers**
- Developer — reads to know what vars to set (Task 1.4, 1.5)
- `.env` — copied/referenced during setup

**Expected format:** Key=value pairs, one per line, with commented explanations.

**Location guarantee:** `.env.example` at project root (not in `.gitignore`).

**Status:** ⚠ conditional entries — must document which email vars are conditional on `EMAIL_SERVICE` choice. Task 1.5 should clarify.

---

## `.env` (production secrets)

Actual environment variable values for current deployment.

**Producers**
- Developer/DevOps — sets Stripe keys, email credentials, admin email (Task 1.4, 1.5)
- MochaHost secrets manager — injects into runtime (Task 1.1)

**Consumers**
- Runtime — loads via `process.env.*` or `os.getenv()` (all tasks that use env vars)

**Expected location:** `.env` at project root (in `.gitignore`, never committed).

**Status:** ✓ (producer and consumer in plan, security pattern correct)

---

## `.github/workflows/deploy.yml`

GitHub Actions workflow for deploying to MochaHost.

**Producers**
- Task 1.1 — creates deployment workflow file

**Consumers**
- GitHub Actions — executes workflow on push to main (Task 1.1)
- MochaHost — receives deployment trigger (Task 1.1)

**Expected location:** `.github/workflows/deploy.yml` relative to project root.

**Expected behavior:** Triggered on push to main; runs build/test steps; deploys to MochaHost.

**Status:** ✓ (producer and consumer in plan, but workflow content not detailed)

---

## `.github/workflows/meetup-topic-followups.yml`

GitHub Actions scheduled workflow that calls the Mojo PHP admin endpoint to send eligible Advanced AI Concepts topic follow-up emails.

**Producers**
- Meetup topic follow-up automation task - creates workflow

**Consumers**
- GitHub Actions - runs daily and on manual dispatch
- `api/meetup-admin.php` - receives the scheduled request and sends only eligible follow-ups

**Expected behavior:** Runs daily at 15:17 UTC, passes `MEETUP_ADMIN_KEY` as an `X-Admin-Key` header from the GitHub repository secret, and calls `action=send-topic-followups&confirm=send-topic-followups`.

**Status:** active

---

## Summary

| File Path | Producers | Consumers | Status |
|-----------|-----------|-----------|--------|
| `../mojo-meetup-followups.json` | `meetup-admin.php` | `meetup-admin.php` | active |
| `products/data/products.json` | Task 2.1 | Task 2.2, 2.3, 2.4 | ⚠ missing schema contract |
| `products/data/products.schema.json` | Task 2.1 (optional) | docs, Task 2.2 (optional) | ✓ optional |
| `products/pages/[product-id].html` | Task 2.3 | Task 2.3, user | ✓ |
| `products/pages/cart.html` | Task 2.4 | Task 2.4, user | ✓ |
| `products/pages/confirmation.html` | Task 2.6 | Task 2.6, user | ✓ |
| `components/header.html` | Task 1.3 | Task 2.2, 3.1, 4.1 | ⚠ include mechanism unclear |
| `components/footer.html` | Task 1.3 | Task 2.2, 3.1, 4.1 | ⚠ include mechanism unclear |
| `styles/shared.css` | Task 1.3 | Task 2.2, 3.1, 4.1 | ✓ |
| `styles/mockups.css` | current | current index | ⚠ transition plan needed |
| `.env.example` | Task 1.4, 1.5 | developer | ⚠ conditional entries not documented |
| `.env` | Task 1.4, 1.5 | runtime | ✓ |
| `.github/workflows/deploy.yml` | Task 1.1 | GitHub Actions | ✓ |
| `.github/workflows/meetup-topic-followups.yml` | topic follow-up automation | GitHub Actions, `meetup-admin.php` | active |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-24T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** File Paths and Internal Structure

**Evidence recorded:**
- 12 file path entries identified
- 6 entries with complete producer/consumer pairs ✓
- 6 entries with gaps (missing contracts, unclear mechanism, transition concern) ⚠
- New identifiers introduced on this task: `products/data/products.json`, component structure, shared styles, GitHub Actions workflow
- Registries match current plan (3-Build_Plan.md): yes

**Gaps identified:**
- `products.json` — no schema defined; risk of consumer/producer shape mismatch (recommend products.schema.json)
- `components/header.html` and `components/footer.html` — include mechanism not specified (HTML fragments? server-side? build-time?)
- `styles/mockups.css` — transition plan needed (merge with shared.css or replace?)
- `.env.example` — conditional email vars not documented

**Status:** Audit complete (pre-implementation) — registries identify file structure contracts.
