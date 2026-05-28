# Environment Variables Registry

Every environment variable used in this project. For each: where it's set, where it's used, what it controls. Update whenever an env var is added, removed, or its purpose changes.

> **Note:** This registry replaced a stale prior version (2026-05-24) that documented Stripe and email-provider vars from an earlier architecture. Those vars no longer exist in the codebase — Stripe was replaced by Polar.sh and PHP `mail()` is used directly.

---

## `MOJO_ADMIN_EMAIL`

Override the admin email address that receives development brief submissions. Defaults to `admin@MojoAiStudio.com` if not set.

**Producers**
- cPanel → Software → PHP → Environment Variables (MochaHost server config)
- Alternatively: `.user.ini` at the document root

**Consumers**
- `api/submit-brief.php:93` — `getenv('MOJO_ADMIN_EMAIL') ?: 'admin@MojoAiStudio.com'` — "To:" address for brief emails

**Default:** `admin@MojoAiStudio.com`

**Status:** ✓ (optional override; default is hardcoded fallback)

---

## `POLAR_WEBHOOK_SECRET`

HMAC-SHA256 secret used to verify incoming Polar.sh webhook signatures.

**Producers**
- Polar.sh dashboard → Webhooks → secret (copy and set via Firebase CLI)
- Set via: `firebase functions:secrets:set POLAR_WEBHOOK_SECRET`

**Consumers**
- `functions/index.js:36` — `defineSecret('POLAR_WEBHOOK_SECRET')` — loaded into Cloud Function runtime
- `functions/index.js:50` — `POLAR_WEBHOOK_SECRET.value()` — used in `verifySignature()` to validate `webhook-signature` header

**Status:** ✓

---

## `MEETUP_CLIENT_ID`

Meetup OAuth application client ID.

**Producers**
- Meetup developer dashboard → OAuth app → Client ID
- Stored in server `.env` file (loaded by `loadFirstEnvFile()`)

**Consumers**
- `api/meetup-admin.php:282` — `envValue('MEETUP_CLIENT_ID')` — used in refresh token requests
- `oauth/meetup/callback/index.php:268` — `envValue('MEETUP_CLIENT_ID')` — used in authorization code exchange

**Status:** ✓

---

## `MEETUP_CLIENT_SECRET`

Meetup OAuth application client secret.

**Producers**
- Meetup developer dashboard → OAuth app → Client Secret
- Stored in server `.env` file

**Consumers**
- `api/meetup-admin.php:283` — `envValue('MEETUP_CLIENT_SECRET')` — used in refresh token requests
- `oauth/meetup/callback/index.php:269` — `envValue('MEETUP_CLIENT_SECRET')` — used in authorization code exchange

**Status:** ✓

---

## `MEETUP_ADMIN_KEY`

Secret key that gates access to the `api/meetup-admin.php` endpoint. Must be provided via `X-Admin-Key` header or `?admin_key=` query param.

**Producers**
- Stored in server `.env` file

**Consumers**
- `api/meetup-admin.php:444` — `envValue('MEETUP_ADMIN_KEY')` — compared via `hash_equals()` to the provided key

**Status:** ✓

---

## `MEETUP_REDIRECT_URI`

The OAuth redirect URI registered with Meetup. Defaults to the production callback URL if not set.

**Producers**
- Stored in server `.env` file (optional — defaults to production URL)

**Consumers**
- `oauth/meetup/callback/index.php:270` — `envValue('MEETUP_REDIRECT_URI', 'https://mojoaistudio.com/oauth/meetup/callback')` — sent in token exchange request

**Default:** `https://mojoaistudio.com/oauth/meetup/callback`

**Status:** ✓ (optional override; production default is hardcoded)

---

## `MEETUP_TOKEN_STORE`

Absolute filesystem path where Meetup OAuth tokens are persisted after exchange. If not set, tokens are derived from the `.env` file's directory.

**Producers**
- Stored in server `.env` file (optional)

**Consumers**
- `api/meetup-admin.php:247` — `envValue('MEETUP_TOKEN_STORE')` — used in `tokenStorePath()`
- `oauth/meetup/callback/index.php:307` — `envValue('MEETUP_TOKEN_STORE', defaultTokenStore($loadedEnv))` — used to persist tokens after OAuth exchange

**Status:** ✓ (optional override)

---

## Summary

| Variable | Set In | Used In | Status |
|----------|--------|---------|--------|
| `MOJO_ADMIN_EMAIL` | cPanel env (optional) | `api/submit-brief.php:93` | ✓ |
| `POLAR_WEBHOOK_SECRET` | Firebase CLI secrets | `functions/index.js:36,50` | ✓ |
| `MEETUP_CLIENT_ID` | server `.env` | `meetup-admin.php:282`, `callback/index.php:268` | ✓ |
| `MEETUP_CLIENT_SECRET` | server `.env` | `meetup-admin.php:283`, `callback/index.php:269` | ✓ |
| `MEETUP_ADMIN_KEY` | server `.env` | `meetup-admin.php:444` | ✓ |
| `MEETUP_REDIRECT_URI` | server `.env` (optional) | `callback/index.php:270` | ✓ |
| `MEETUP_TOKEN_STORE` | server `.env` (optional) | `meetup-admin.php:247`, `callback/index.php:307` | ✓ |

---

## Audit Trail — Proof of Registry Verification

**Last audit:** 2026-05-28T00:00:00Z (by /cross-boundary-audit)

**Boundaries checked:** Environment Variables

**Evidence recorded:**
- 7 env var entries identified
- 7 entries with complete producer/consumer pairs ✓
- 0 entries with gaps ⚠
- New identifiers introduced on this audit: `MOJO_ADMIN_EMAIL`, `POLAR_WEBHOOK_SECRET`, `MEETUP_CLIENT_ID`, `MEETUP_CLIENT_SECRET`, `MEETUP_ADMIN_KEY`, `MEETUP_REDIRECT_URI`, `MEETUP_TOKEN_STORE`
- Prior registry replaced: stale Stripe/email-provider vars removed
- Registries match current code diff: yes

**Gaps identified:** none

**Status:** Audit complete
