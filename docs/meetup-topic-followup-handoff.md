# Meetup One-Week Topic Follow-Up Handoff

## Goal

Build a Mojo PHP automation that sends a one-week follow-up email to Advanced AI Concepts Meetup members/registrants asking what topics they want covered.

Do not use Mailchimp.

Use the Mojo site/PHP stack directly.

## Message

Subject suggestion:

```text
Anything you want us to dig into?
```

Body:

```text
Hey, glad you found Advanced AI Concepts.

Quick question: is there any particular AI topic, build problem, architecture question, model/hardware/harness issue, or advanced concept you would like us to talk about in an upcoming session?

Just reply to this message. It will go to admin@mojoaistudio.com.

The best sessions come from real questions and live problems, so if there is something you are trying to understand, optimize, wire together, or push further, send it over.
```

Reply address:

```text
admin@mojoaistudio.com
```

## Current State

- Meetup already sends the long-form Advanced AI Concepts group positioning/welcome message.
- This follow-up should not repeat that message.
- The follow-up should be sent about one week after a person joins/registers.
- Native Meetup scheduled follow-up automation was not found in public Meetup/Meetup Pro docs.
- The browser session was not logged into Meetup Pro, so hidden dashboard-only scheduling controls were not verified.
- The chosen path is Mojo PHP automation.

## Relevant Repo Context

Project:

```text
C:\Users\scott\Code\Mojo
```

Useful existing files:

```text
api/meetup-admin.php
api/sms-reminder-lib.php
api/sms-reminders.php
docs/registries/endpoints.md
docs/registries/env-vars.md
```

Existing patterns to reuse:

- `api/meetup-admin.php` is admin-gated with `MEETUP_ADMIN_KEY`.
- `api/meetup-admin.php` already loads Meetup OAuth tokens and calls Meetup GraphQL.
- `poll-sms-invites` already polls Meetup RSVPs, sends email through PHP `mail()`, and records idempotent state.
- `api/sms-reminder-lib.php` already has JSON store helpers and safe write patterns.
- Existing email defaults use `MOJO_ADMIN_EMAIL`, defaulting to `admin@MojoAiStudio.com`; for this feature use/normalize to `admin@mojoaistudio.com`.

## Important Blocker

Production Mojo currently returns:

```text
Stored Meetup token was not found.
```

That means any live Meetup GraphQL automation will fail until the server-side Meetup OAuth token is restored or regenerated.

Do not assume live sending works until `/api/meetup-admin?action=self` succeeds with the admin key.

## Suggested Implementation

Add a cron/admin action to `api/meetup-admin.php`, something like:

```text
GET /api/meetup-admin?action=send-topic-followups
```

Suggested query params:

```text
action=send-topic-followups
network=advanced-ai-concepts   optional
first=25                       optional
days_after=7                   optional
confirm=send-topic-followups   required to send; otherwise dry-run
```

Dry-run store-write test link to support during implementation:

```text
https://mojoaistudio.com/api/meetup-admin?action=send-topic-followups&dry_run_write=1&confirm=test-followup-store&admin_key=YOUR_ADMIN_KEY
```

Expected behavior for this test mode:

- Do not send email.
- Do not call Meetup if a direct store probe can validate the write path.
- Create or update one harmless test/probe record in the follow-up JSON store.
- Return the resolved store path, a `probe_key`, and whether the write succeeded.
- Make repeated calls idempotent by overwriting the same probe key.

Suggested probe record:

```json
{
  "topicFollowups": {
    "__dry_run_probe__": {
      "purpose": "advanced_ai_concepts_topic_followup_store_probe",
      "dryRun": true,
      "updatedAt": "2026-05-29T00:00:00Z"
    }
  }
}
```

Behavior:

1. Load Meetup members or registrants through GraphQL.
2. Identify people eligible for follow-up:
   - joined/registered at least `days_after` days ago
   - have an email address available
   - have not already received this follow-up
3. Send the topic prompt email with:
   - From: `Mojo AI Studio <admin@mojoaistudio.com>`
   - Reply-To: `admin@mojoaistudio.com`
   - Content-Type: `text/plain; charset=UTF-8`
4. Record sent state in a JSON store so reruns are idempotent.
5. Default to dry-run unless `confirm=send-topic-followups`.

Store suggestion:

```text
MOJO_MEETUP_FOLLOWUP_STORE
```

Default path can mirror the SMS reminder store style, outside public web paths:

```text
../mojo-meetup-followups.json
```

Suggested store shape:

```json
{
  "topicFollowups": {
    "sha256-member-or-rsvp-key": {
      "memberEmailHash": "...",
      "memberName": "...",
      "groupName": "...",
      "groupUrlname": "...",
      "source": "member|rsvp",
      "sourceId": "...",
      "eligibleAt": "2026-05-29T00:00:00Z",
      "sentAt": "2026-05-29T00:00:00Z",
      "purpose": "advanced_ai_concepts_one_week_topic_prompt"
    }
  }
}
```

Avoid storing raw email addresses unless strictly necessary. The SMS reminder flow already stores hashes for Meetup emails; follow that pattern.

## GraphQL Discovery Needed

Before implementing final live query, inspect Meetup GraphQL schema/API for the best source:

- member join date and email, if available
- RSVP created date and member email, if join date is not available

The existing `poll-sms-invites` RSVP query confirms Meetup GraphQL can return:

```graphql
rsvps {
  edges {
    node {
      id
      member {
        name
        email
      }
    }
  }
}
```

It is not yet confirmed whether that RSVP node exposes `createdAt` or whether group member search exposes `joinedAt`.

## Verification Plan

1. Run local syntax check if PHP CLI is available:

```powershell
php -l api/meetup-admin.php
```

If PHP is not installed locally, note that explicitly.

2. Dry-run live endpoint after deploy:

```text
https://mojoaistudio.com/api/meetup-admin?action=send-topic-followups&admin_key=... 
```

Expected before token restore:

```text
Stored Meetup token was not found.
```

Expected after token restore:

```json
{
  "ok": true,
  "dry_run": true,
  "eligible_count": 0,
  "sent_count": 0,
  "skipped_count": 0,
  "error_count": 0
}
```

3. Send only after reviewing dry-run output:

```text
confirm=send-topic-followups
```

## Obsidian Source Note

Canonical content is also tracked here:

```text
G:\My Drive\Aesop Academy\Obsidian\Advanced_AI_Concepts_Build\10-Welcome-Message.md
```

Build plan/logs were updated to reflect:

- no duplicate welcome message
- one-week topic prompt
- reply address `admin@mojoaistudio.com`
- Meetup native scheduler not found
- PHP/Mojo automation is the chosen path

## Caution

The local Mojo working tree may contain unrelated user changes. Check status first and only stage files touched for this task.

At the time this handoff was created, known dirty files included:

```text
.mcp.json
watch/index.html
```

Do not revert unrelated changes.
