# Brief Form Field Contract Registry

The JSON field names shared between the development brief HTML form, the client-side JS serializer, and the PHP API handler. A mismatch at any layer silently drops the field. Update whenever a field is added, renamed, or its required status changes.

---

## `projectName` — required

Project name or working title.

**Producers**
- `development/pages/brief.html:121` — `<input name="projectName" required>`

**Consumers**
- `scripts/brief-form.js:29` — collected by `field.name` loop
- `api/submit-brief.php:53` — listed in `$required` array
- `api/submit-brief.php:77` — `clean($data['projectName'] ?? '')`
- `api/submit-brief.php:98` — written into admin email body

**Status:** ✓

---

## `contactName` — required

Submitter's full name.

**Producers**
- `development/pages/brief.html:132` — `<input name="contactName" required>`

**Consumers**
- `scripts/brief-form.js:29` — collected by `field.name` loop
- `api/submit-brief.php:53` — listed in `$required` array
- `api/submit-brief.php:78` — `clean($data['contactName'] ?? '')`
- `api/submit-brief.php:99` — written into admin email body
- `api/submit-brief.php:147` — used in auto-reply greeting

**Status:** ✓

---

## `contactEmail` — required

Submitter's email address (validated as valid email format).

**Producers**
- `development/pages/brief.html:143` — `<input name="contactEmail" type="email" required>`

**Consumers**
- `scripts/brief-form.js:29` — collected by `field.name` loop
- `api/submit-brief.php:53` — listed in `$required` array
- `api/submit-brief.php:79` — `filter_var(..., FILTER_VALIDATE_EMAIL)`
- `api/submit-brief.php:100` — written into admin email body
- `api/submit-brief.php:124` — used as `Reply-To` on admin email
- `api/submit-brief.php:159` — used as "To:" on auto-reply

**Status:** ✓

---

## `problemDescription` — required

Description of the workflow problem to solve.

**Producers**
- `development/pages/brief.html:153` — `<textarea name="problemDescription" required>`

**Consumers**
- `scripts/brief-form.js:29` — collected by `field.name` loop
- `api/submit-brief.php:53` — listed in `$required` array
- `api/submit-brief.php:80` — `clean($data['problemDescription'] ?? '')`
- `api/submit-brief.php:105` — written into admin email body

**Status:** ✓

---

## `currentTools` — optional

Current tools the submitter uses (freeform text).

**Producers**
- `development/pages/brief.html:167` — `<input name="currentTools">`

**Consumers**
- `scripts/brief-form.js:29` — collected by `field.name` loop
- `api/submit-brief.php:81` — `clean($data['currentTools'] ?? '')`
- `api/submit-brief.php:107` — written into admin email body (only if non-empty)

**Status:** ✓

---

## `timeline` — optional

When the project is needed. One of: `asap`, `1-month`, `3-months`, `flexible`.

**Producers**
- `development/pages/brief.html:174` — `<select name="timeline">`
- `development/pages/brief.html:176-181` — option values: `""`, `"asap"`, `"1-month"`, `"3-months"`, `"flexible"`

**Consumers**
- `scripts/brief-form.js:29` — collected by `field.name` loop
- `api/submit-brief.php:82` — `clean($data['timeline'] ?? '')`
- `api/submit-brief.php:101` — written into admin email body (fallback: "(not specified)")

**Status:** ✓

---

## `budget` — optional

Approximate budget range. One of: `under-5k`, `5k-15k`, `15k-50k`, `50k-plus`, `unsure`.

**Producers**
- `development/pages/brief.html:184` — `<select name="budget">`
- `development/pages/brief.html:186-191` — option values: `""`, `"under-5k"`, `"5k-15k"`, `"15k-50k"`, `"50k-plus"`, `"unsure"`

**Consumers**
- `scripts/brief-form.js:29` — collected by `field.name` loop
- `api/submit-brief.php:83` — `clean($data['budget'] ?? '')`
- `api/submit-brief.php:102` — written into admin email body (fallback: "(not specified)")

**Status:** ✓

---

## `anythingElse` — optional

Free-form additional context (technical constraints, existing data, etc.).

**Producers**
- `development/pages/brief.html:197` — `<textarea name="anythingElse">`

**Consumers**
- `scripts/brief-form.js:29` — collected by `field.name` loop
- `api/submit-brief.php:84` — `clean($data['anythingElse'] ?? '')`
- `api/submit-brief.php:113` — written into admin email body (only if non-empty)

**Status:** ✓

---

## Summary

| Field | Required | HTML form | JS collector | PHP validates | PHP uses | Status |
|-------|----------|-----------|--------------|---------------|----------|--------|
| `projectName` | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| `contactName` | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| `contactEmail` | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| `problemDescription` | yes | ✓ | ✓ | ✓ | ✓ | ✓ |
| `currentTools` | no | ✓ | ✓ | — | ✓ | ✓ |
| `timeline` | no | ✓ | ✓ | — | ✓ | ✓ |
| `budget` | no | ✓ | ✓ | — | ✓ | ✓ |
| `anythingElse` | no | ✓ | ✓ | — | ✓ | ✓ |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-28T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** Brief Form Fields

**Evidence recorded:**
- 8 fields with complete producer/consumer chains ✓
- 0 entries with gaps ⚠
- New identifiers introduced on this audit: all 8 field names
- Registries match current code diff: yes

**Gaps identified:** none

**Status:** Audit complete
