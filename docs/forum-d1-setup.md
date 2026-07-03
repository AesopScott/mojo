# Mojo Forum D1 Setup

The Mojo forum uses Cloudflare Pages/Workers plus a D1 database binding named `FORUM_DB`.

## Database

Production database:

```text
name: mojo-forum
id: 3588eba2-cc34-4e11-99a7-6496401a9530
binding: FORUM_DB
```

The schema is in:

```text
cloudflare/forum-schema.sql
```

The schema creates categories, threads, replies, poll options, votes, users, login codes, sessions, and starter categories.

## Login

Forum reads are public. Posting threads, replying, and voting require email-code login.

The Worker uses:

```text
RESEND_API_KEY
```

for login-code email delivery and stores the session in an HTTP-only cookie named `mojo_forum_session`.

## Optional Admin Key

Set `FORUM_ADMIN_KEY` to enable the moderation endpoint:

```text
POST /api/forum/moderate
```

Supported actions:

```text
{ "type": "thread", "id": "...", "action": "hide" }
{ "type": "thread", "id": "...", "action": "lock" }
{ "type": "thread", "id": "...", "action": "unlock" }
{ "type": "post", "id": "...", "action": "hide" }
```

## Media Policy

The forum does not host YouTube videos and does not embed a player. It stores a YouTube URL/video ID, renders the YouTube thumbnail, and opens the original YouTube page when clicked.

Images are URL-based in the first release. D1 stores the image URL only.
