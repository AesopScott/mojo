const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Mojo-Api": "cloudflare-pages-worker",
};

const PUBLIC_CONSENT_TEXT =
  "I agree to receive recurring SMS reminders for upcoming Advanced AI Concepts Meetup events. Mojo AI Studio will use my phone number only for event reminders and SMS service messages, not marketing or any other purpose.";

const FORUM_SESSION_COOKIE = "mojo_forum_session";
const FORUM_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const FORUM_LOGIN_CODE_TTL_MINUTES = 15;
const FORUM_ADMIN_EMAILS = new Set(["scott@mojoaistudio.com"]);

const JOIN_SESSIONS = {
  harness: {
    title: "Global - Dev Automation and Harness Engineering I",
    date: "2026-07-12T14:00:00Z",
    duration: 120,
    zoomUrl: "https://us06web.zoom.us/j/83807077130?pwd=nWRWVcUhdntdUeDHqTw2XLnebkVepi.1",
  },
  "anthro-cert": {
    title: "Anthropic Certified Architect Prep",
    date: "2026-07-18T00:00:00Z",
    duration: 120,
    zoomUrl: "https://us06web.zoom.us/j/85138194775?pwd=jtMvJyC6ficqZ4L4H30N8YTgP6PSt8.1",
  },
  "anthro-cert-global": {
    title: "Global - Anthropic Certified Architect Prep",
    date: "2026-07-19T14:00:00Z",
    duration: 120,
    zoomUrl: "https://us06web.zoom.us/j/81322966426?pwd=CuThxc5YARefRgufvgogQA5kK7H1RJ.1",
  },
  govern: {
    title: "AI Governance for AI Developers",
    date: "2026-07-25T00:00:00Z",
    duration: 120,
    zoomUrl: "https://us06web.zoom.us/j/82609616968?pwd=LYxMUuIbHoStB6YnQb6IvPPdaOssmi.1",
  },
  "govern-global": {
    title: "Global - AI Governance for AI Developers",
    date: "2026-07-26T14:00:00Z",
    duration: 120,
    zoomUrl: "https://us06web.zoom.us/j/81053958115?pwd=eY5KL5ZHFVAUIkieefFhPHKLDwXpZm.1",
  },
};

const LEARN_SOURCE_GROUP = "advanced-ai-concepts";
const LEARN_SCHEDULE_CACHE_SECONDS = 60 * 60 * 24;
const LEARN_SCHEDULE_CACHE_KEY = "https://mojoaistudio.com/api/learn-schedule";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/social.html") {
      const assetUrl = new URL("/products/pages/admin-social", url);
      assetUrl.search = url.search;
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (url.pathname === "/api/meetup-admin" || url.pathname === "/api/meetup-admin.php") {
      return handleMeetupAdmin(request, env, url);
    }

    if (url.pathname === "/api/sms-reminders" || url.pathname === "/api/sms-reminders.php") {
      return handleSmsReminders(request, env);
    }

    if (url.pathname === "/api/learn-schedule") {
      return handleLearnSchedule(request, env, url);
    }

    if (url.pathname === "/api/zoom-webhook" || url.pathname === "/api/zoom-webhook.php") {
      return handleZoomWebhook(request, env);
    }

    if (url.pathname === "/api/join-session" || url.pathname === "/api/join-session.php") {
      return handleJoinSession(url);
    }

    if (url.pathname === "/api/submit-product" || url.pathname === "/api/submit-product.php") {
      return handleSubmitProduct(request, env, ctx);
    }

    if (url.pathname === "/api/submit-brief" || url.pathname === "/api/submit-brief.php") {
      return handleSubmitBrief(request, env);
    }

    if (url.pathname === "/api/submit-product-admin") {
      return handleSubmitProductAdmin(request, env, url);
    }

    if (url.pathname === "/api/send-seller-onboarding-email" || url.pathname === "/api/send-seller-onboarding-email.php") {
      return handleSellerOnboardingEmail(request, env);
    }

    if (url.pathname.startsWith("/api/forum")) {
      return handleForumApi(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
};

function handleJoinSession(url) {
  const id = (url.searchParams.get("id") || "").trim();
  const session = JOIN_SESSIONS[id];
  if (!session) {
    return new Response("Session not found.\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const start = Date.parse(session.date);
  const now = Date.now();
  const windowOpen = start - 15 * 60 * 1000;
  const windowClose = start + session.duration * 60 * 1000 + 45 * 60 * 1000;

  if (Number.isFinite(start) && now < windowOpen) {
    const minutes = Math.ceil((windowOpen - now) / 60000);
    return joinSessionPage(
      session.title,
      "Session has not started yet",
      `The join link opens 15 minutes before the session. Come back in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      null,
    );
  }

  if (Number.isFinite(start) && now > windowClose) {
    return joinSessionPage(
      session.title,
      "Session has ended",
      "This session is over. Recordings will be posted after the session.",
      null,
    );
  }

  if (url.searchParams.has("go")) {
    return Response.redirect(session.zoomUrl, 302);
  }

  const goUrl = `/api/join-session.php?id=${encodeURIComponent(id)}&go=1`;
  return joinSessionPage(
    session.title,
    "Joining session",
    "The verified Zoom room is open. Click the join button when you are ready.",
    goUrl,
    formatMountainDate(session.date),
  );
}

function joinSessionPage(title, heading, body, goUrl, dateLabel = "") {
  const safeTitle = escapeHtml(title);
  const safeHeading = escapeHtml(heading);
  const safeBody = escapeHtml(body);
  const safeDate = escapeHtml(dateLabel);
  const learningLinks = `
  <nav class="learn-links" aria-label="Learning links">
    <a href="https://mojoaistudio.com/learn">Mojo AI Studio Learning</a>
    <a href="https://aesopacademy.org">Aesop AI Academy</a>
    <a href="https://25experts.com/videos.html">25 AI Experts Video Curation</a>
  </nav>`;
  const button = goUrl
    ? `<a class="button" href="${escapeHtml(goUrl)}" id="join">Join Now</a>`
    : "";

  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - Mojo AI Studio</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #0b1020; color: #f8fafc; }
    main { max-width: 680px; margin: 64px auto; padding: 0 24px; text-align: center; }
    .eyebrow { color: #67e8f9; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    h1 { font-size: 30px; line-height: 1.2; margin: 14px 0 10px; }
    p { color: #cbd5e1; line-height: 1.6; }
    .date { color: #94a3b8; font-size: 14px; margin-bottom: 28px; }
    a.button { display: inline-block; margin-top: 22px; padding: 13px 18px; color: #06121f; background: #67e8f9; border-radius: 8px; font-weight: 700; text-decoration: none; }
    .learn-links { display: grid; gap: 10px; margin: 34px auto 0; max-width: 420px; }
    .learn-links a { color: #67e8f9; text-decoration: none; border: 1px solid rgba(103,232,249,.32); border-radius: 8px; padding: 11px 14px; }
    .learn-links a:hover { background: rgba(103,232,249,.1); }
  </style>
</head>
<body>
<main>
  <div class="eyebrow">${safeHeading}</div>
  <h1>${safeTitle}</h1>
  ${safeDate ? `<div class="date">${safeDate}</div>` : ""}
  <p>${safeBody}</p>
  ${button}
  ${learningLinks}
</main>
</body>
</html>`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function formatMountainDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));
}

async function handleLearnSchedule(request, env, url) {
  const force = url.searchParams.get("refresh") === "1";
  const cache = caches.default;
  const cacheRequest = new Request(LEARN_SCHEDULE_CACHE_KEY);

  if (!force) {
    const cached = await cache.match(cacheRequest);
    if (cached) return cached;
  }

  try {
    const payload = await buildLearnSchedule(env);
    const response = jsonWithHeaders(payload, 200, {
      "Cache-Control": `public, max-age=${LEARN_SCHEDULE_CACHE_SECONDS}`,
    });
    await cache.put(cacheRequest, response.clone());
    return response;
  } catch (error) {
    if (!force) {
      const cached = await cache.match(cacheRequest);
      if (cached) return cached;
    }

    const fallback = learnScheduleFallback(error);
    return jsonWithHeaders(fallback, 200, {
      "Cache-Control": "public, max-age=300",
      "X-Mojo-Schedule-Source": "fallback",
    });
  }
}

async function buildLearnSchedule(env) {
  const token = await meetupAccessToken(env).catch(() => "");
  const groups = await meetupNetworkGroups(token);
  const eventsByGroup = {};

  for (const batch of chunk(groups, 20)) {
    Object.assign(eventsByGroup, await meetupGroupEventsBatch(token, batch));
  }

  const events = [];
  for (const group of groups) {
    for (const event of eventsByGroup[group.urlname] || []) {
      if (Date.parse(event.dateTime) < Date.now() - 60 * 60 * 1000) continue;
      events.push(normalizeLearnEvent(event, group));
    }
  }

  events.sort((a, b) => Date.parse(a.dateTime) - Date.parse(b.dateTime) || a.title.localeCompare(b.title));

  return {
    ok: true,
    source: "meetup",
    refreshedAt: new Date().toISOString(),
    cacheSeconds: LEARN_SCHEDULE_CACHE_SECONDS,
    mountainTimezone: "America/Denver",
    groupCount: groups.length,
    eventCount: events.length,
    groups,
    events,
    featured: featuredLearnEvents(events),
  };
}

async function meetupAccessToken(env) {
  const direct = String(env.MEETUP_ACCESS_TOKEN || "").trim();
  if (direct) return direct;

  const jsonToken = String(env.MEETUP_OAUTH_TOKEN_JSON || "").trim();
  if (jsonToken) {
    const parsed = JSON.parse(jsonToken);
    if (parsed.access_token) return parsed.access_token;
  }

  if (env.MEETUP_MEMBER_ID && env.MEETUP_SIGNING_KEY_ID && env.MEETUP_PRIVATE_KEY && env.MEETUP_CLIENT_ID) {
    return meetupJwtAccessToken(env);
  }

  if (String(env.MEETUP_ENABLE_REFRESH_TOKEN || "") !== "1") return "";

  const refreshToken = String(env.MEETUP_REFRESH_TOKEN || "").trim();
  const clientId = String(env.MEETUP_CLIENT_ID || "").trim();
  const clientSecret = String(env.MEETUP_CLIENT_SECRET || "").trim();
  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error("Meetup credentials are not configured for learn schedule refresh.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const response = await fetch("https://secure.meetup.com/oauth2/access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error("Meetup token refresh failed.");
  }
  return payload.access_token;
}

async function meetupJwtAccessToken(env) {
  const assertion = await meetupSignedJwt(env);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await fetch("https://secure.meetup.com/oauth2/access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error("Meetup JWT token request failed.");
  }
  return payload.access_token;
}

async function meetupSignedJwt(env) {
  const header = {
    kid: String(env.MEETUP_SIGNING_KEY_ID || "").trim(),
    typ: "JWT",
    alg: "RS256",
  };
  const payload = {
    iss: String(env.MEETUP_CLIENT_ID || "").trim(),
    sub: String(env.MEETUP_MEMBER_ID || "").trim(),
    aud: "api.meetup.com",
    exp: Math.floor(Date.now() / 1000) + 120,
  };
  const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const key = await importRsaPrivateKey(String(env.MEETUP_PRIVATE_KEY || ""));
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

async function importRsaPrivateKey(pem) {
  const normalized = pem.replaceAll("\\n", "\n");
  const body = normalized
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const binary = Uint8Array.from(atob(body), (char) => char.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binary,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function base64UrlEncode(value) {
  const bytes = typeof value === "string"
    ? new TextEncoder().encode(value)
    : new Uint8Array(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function meetupGraphQL(token, query, variables = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch("https://api.meetup.com/gql-ext", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors) {
    throw new Error("Meetup GraphQL request failed.");
  }
  return payload.data;
}

async function meetupNetworkGroups(token) {
  const groups = [];
  let after = null;
  do {
    const data = await meetupGraphQL(token, `query($urlname:String!,$after:String){
      groupByUrlname(urlname:$urlname){
        proNetwork{
          groupsSearch(input:{first:100,after:$after,sort:"NAME",filter:{activeGroups:true}}){
            pageInfo{ hasNextPage endCursor }
            edges{ node{ urlname name city state country timezone link } }
          }
        }
      }
    }`, { urlname: LEARN_SOURCE_GROUP, after });
    const search = data.groupByUrlname?.proNetwork?.groupsSearch;
    if (!search) break;
    groups.push(...search.edges.map((edge) => normalizeLearnGroup(edge.node)));
    after = search.pageInfo?.hasNextPage ? search.pageInfo.endCursor : null;
  } while (after);

  return groups
    .filter((group) => group.urlname)
    .sort((a, b) => learnGroupLabel(a).localeCompare(learnGroupLabel(b)));
}

async function meetupGroupEventsBatch(token, groups) {
  const fields = groups.map((group, index) => `g${index}: groupByUrlname(urlname:${JSON.stringify(group.urlname)}){
    events(first:100,status:ACTIVE,sort:ASC){
      edges{ node{ id title dateTime eventUrl howToFindUs } }
    }
  }`).join("\n");
  const data = await meetupGraphQL(token, `query{
    ${fields}
  }`);
  const eventsByGroup = {};
  groups.forEach((group, index) => {
    eventsByGroup[group.urlname] = data[`g${index}`]?.events?.edges?.map((edge) => edge.node) || [];
  });
  return eventsByGroup;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function normalizeLearnGroup(group) {
  const urlname = String(group.urlname || "").trim();
  return {
    urlname,
    name: String(group.name || "Advanced AI Concepts").trim(),
    city: String(group.city || "Meetup").trim(),
    state: String(group.state || "").trim(),
    country: String(group.country || "").trim(),
    timezone: String(group.timezone || "America/Denver").trim(),
    link: String(group.link || (urlname ? `https://www.meetup.com/${urlname}/` : "")).trim(),
  };
}

function normalizeLearnEvent(event, group) {
  const dateTime = String(event.dateTime || "").trim();
  const joinUrl = publicJoinSessionUrl(event.howToFindUs) || joinSessionUrlForEvent(event);
  return {
    id: String(event.id || "").trim(),
    title: String(event.title || "Advanced AI Concepts").trim(),
    dateTime,
    mountainTime: formatMountainDate(dateTime),
    eventUrl: String(event.eventUrl || "").trim(),
    groupUrlname: group.urlname,
    groupName: group.name,
    city: group.city,
    timezone: group.timezone,
    joinUrl,
    hasPhpJoinLink: Boolean(joinUrl),
  };
}

function joinSessionUrlForEvent(event) {
  const title = String(event.title || "").trim();
  const instant = Date.parse(event.dateTime || "");
  if (!title || !Number.isFinite(instant)) return "";

  const match = Object.entries(JOIN_SESSIONS).find(([, session]) => (
    session.title === title && Date.parse(session.date) === instant
  ));
  return match ? `https://mojoaistudio.com/api/join-session.php?id=${encodeURIComponent(match[0])}` : "";
}

function publicJoinSessionUrl(value) {
  const text = String(value || "");
  const matches = text.match(/https?:\/\/[^\s<>"')]+\/api\/join-session(?:\.php)?\?id=[A-Za-z0-9_-]+/g) || [];
  const mojo = matches.find((match) => {
    try {
      const url = new URL(match);
      return url.hostname === "mojoaistudio.com";
    } catch {
      return false;
    }
  });
  return mojo || "";
}

function featuredLearnEvents(events) {
  const seen = new Set();
  const featured = [];
  for (const event of events) {
    const key = `${event.title}|${new Date(event.dateTime).toISOString().slice(0, 16)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    featured.push(event);
    if (featured.length >= 6) break;
  }
  return featured;
}

function learnScheduleFallback(error) {
  const events = Object.entries(JOIN_SESSIONS).map(([id, session]) => ({
    id,
    title: session.title,
    dateTime: session.date,
    mountainTime: formatMountainDate(session.date),
    eventUrl: "",
    groupUrlname: LEARN_SOURCE_GROUP,
    groupName: "Advanced AI Concepts",
    city: "Colorado Springs",
    timezone: "America/Denver",
    joinUrl: `https://mojoaistudio.com/api/join-session.php?id=${encodeURIComponent(id)}`,
    hasPhpJoinLink: true,
  }));

  return {
    ok: true,
    source: "fallback",
    warning: String(error?.message || "Meetup schedule refresh failed."),
    refreshedAt: new Date().toISOString(),
    cacheSeconds: 300,
    mountainTimezone: "America/Denver",
    groupCount: 1,
    eventCount: events.length,
    groups: [{
      urlname: LEARN_SOURCE_GROUP,
      name: "Advanced AI Concepts",
      city: "Colorado Springs",
      state: "CO",
      country: "us",
      timezone: "America/Denver",
      link: "https://www.meetup.com/advanced-ai-concepts/",
    }],
    events,
    featured: events,
  };
}

async function mapLimit(items, limit, iteratee) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await iteratee(item);
    }
  });
  await Promise.all(workers);
}

function learnGroupLabel(group) {
  return `${group.city || ""} ${group.state || ""} ${group.country || ""}`.trim();
}

async function handleMeetupAdmin(request, env, url) {
  if (!isAuthorized(request, env, url)) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  const action = url.searchParams.get("action") || "";

  if (action === "test-sms-store") {
    return json({
      ok: true,
      runtime: "cloudflare-pages-worker",
      twilioConfigured: twilioConfigured(env),
      smsStoreConfigured: Boolean(env.SMS_REMINDERS),
    });
  }

  if (action === "list-sms-subscribers") {
    if (!env.SMS_REMINDERS) {
      return json({ ok: false, error: "SMS reminder storage is not configured." }, 503);
    }

    const subscribers = await listPublicSubscribers(env, null);
    return json({
      ok: true,
      recipientCount: subscribers.length,
      recipients: subscribers.map((subscriber) => ({
        phoneLast4: subscriber.phoneLast4,
        groupUrlname: subscriber.groupUrlname || null,
        groupName: subscriber.groupName || null,
        consentedAt: subscriber.consentedAt || null,
        updatedAt: subscriber.updatedAt || null,
      })),
    });
  }

  if (action === "delete-sms-subscriber") {
    if (!env.SMS_REMINDERS) {
      return json({ ok: false, error: "SMS reminder storage is not configured." }, 503);
    }

    const phone = normalizePhone(url.searchParams.get("phone") || "");
    if (!phone) {
      return json({ ok: false, error: "Provide a valid phone number to delete." }, 422);
    }

    const deleted = await deletePublicSubscribersByPhone(env, phone);
    return json({
      ok: true,
      deletedCount: deleted.length,
      deleted: deleted.map((record) => ({
        phoneLast4: record.phoneLast4,
        groupUrlname: record.groupUrlname || null,
      })),
    });
  }

  if (action === "send-admin-sms" || action === "send-test-sms") {
    const phone = normalizePhone(url.searchParams.get("phone") || "");
    const groupUrlname = String(url.searchParams.get("groupUrlname") || "").trim().toLowerCase();
    const confirm = url.searchParams.get("confirm") || "";
    const dryRun = confirm !== action;
    let body = (url.searchParams.get("body") || "").trim();
    const mode = body === "" ? "test" : (phone ? "one_off_phone" : "one_off_subscribers");

    if (body === "") {
      body = "Mojo AI Studio test SMS. Your Advanced AI Concepts reminders are connected. Reply STOP to opt out.";
    }

    if (phone) {
      if (body.length > 1000) {
        return json({ ok: false, error: "SMS body must be 1000 characters or less." }, 422);
      }

      const result = dryRun
        ? { ok: true, dry_run: true }
        : await sendTwilio(env, phone, body);

      return json({
        ok: Boolean(result.ok),
        dry_run: dryRun,
        mode,
        recipientCount: 1,
        phoneLast4: phoneLast4(phone),
        bodyLength: body.length,
        twilioMessageSid: result.twilio_sid || null,
        error: result.error || null,
      }, result.ok ? 200 : 500);
    }

    if (mode === "test") {
      return json({
        ok: false,
        error: "Provide a phone number for the default test SMS, or provide body for a one-off subscriber message.",
        required: ["phone or body"],
      }, 422);
    }

    if (body.length > 1000) {
      return json({ ok: false, error: "SMS body must be 1000 characters or less." }, 422);
    }

    if (groupUrlname && !/^[a-z0-9-]{3,80}$/.test(groupUrlname)) {
      return json({
        ok: false,
        error: "Provide a valid groupUrlname, or omit it to message all stored subscribers.",
      }, 422);
    }

    if (!env.SMS_REMINDERS) {
      return json({ ok: false, error: "SMS reminder storage is not configured." }, 503);
    }

    const recipients = await listPublicSubscribers(env, groupUrlname || null);
    if (dryRun) {
      return json({
        ok: true,
        dry_run: true,
        mode,
        scope: groupUrlname ? "group" : "all_public_subscribers",
        groupUrlname: groupUrlname || null,
        recipientCount: recipients.length,
        recipientLast4: recipients.map((recipient) => recipient.phoneLast4),
        bodyLength: body.length,
      });
    }

    const sends = [];
    for (const recipient of recipients) {
      const result = await sendTwilio(env, recipient.phone, body);
      sends.push({
        ok: Boolean(result.ok),
        phoneLast4: recipient.phoneLast4,
        twilioMessageSid: result.twilio_sid || null,
        error: result.error || null,
      });
    }

    const failed = sends.filter((send) => !send.ok);

    return json({
      ok: failed.length === 0,
      dry_run: false,
      mode,
      scope: groupUrlname ? "group" : "all_public_subscribers",
      groupUrlname: groupUrlname || null,
      recipientCount: recipients.length,
      sentCount: sends.length - failed.length,
      failedCount: failed.length,
      bodyLength: body.length,
      sends,
    }, failed.length === 0 ? 200 : 207);
  }

  return json({ ok: false, error: "Unknown action." }, 404);
}

async function handleSmsReminders(request, env) {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed." }, 405);
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, message: "Expected JSON body." }, 400);
  }

  const phone = normalizePhone(input.phone || "");
  const consent = Boolean(input.consent);
  const source = String(input.source || "").trim();
  const groupUrlname = String(input.groupUrlname || "advanced-ai-concepts").trim().toLowerCase();
  const groupName = String(input.groupName || "Advanced AI Concepts").trim();

  if (!phone || !consent) {
    return json({
      ok: false,
      message: "Enter a valid phone number and consent to SMS event reminders.",
    }, 422);
  }

  if (source !== "learn_public") {
    return json({ ok: false, message: "This reminder link is not supported on Cloudflare yet." }, 422);
  }

  if (!/^[a-z0-9-]{3,80}$/.test(groupUrlname)) {
    return json({ ok: false, message: "Choose a valid Meetup city." }, 422);
  }

  if (!env.SMS_REMINDERS) {
    return json({
      ok: false,
      message: "SMS reminder storage is not configured yet.",
    }, 503);
  }

  const now = new Date().toISOString();
  const id = await sha256(`${groupUrlname}|${phone}`);
  const existing = (await env.SMS_REMINDERS.get(`public:${id}`, "json")) || {};
  const record = {
    id,
    phone,
    phoneLast4: phoneLast4(phone),
    groupName: groupName || "Advanced AI Concepts",
    groupUrlname,
    source: "learn_public",
    purpose: "recurring_upcoming_event_sms_reminders",
    consentText: PUBLIC_CONSENT_TEXT,
    consentedAt: existing.consentedAt || now,
    updatedAt: now,
    eventReminders: Array.isArray(existing.eventReminders) ? existing.eventReminders : [],
    unsubscribedAt: null,
  };

  await env.SMS_REMINDERS.put(`public:${id}`, JSON.stringify(record));

  return json({
    ok: true,
    message: "SMS reminders saved.",
    phoneLast4: phoneLast4(phone),
  });
}

async function handleZoomWebhook(request, env) {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed." }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "Expected JSON body." }, 400);
  }

  const event = String(payload.event || "");

  if (event === "endpoint.url_validation") {
    const plainToken = String(payload.payload?.plainToken || "");
    const secretToken = String(env.ZOOM_SECRET_TOKEN || "").trim();

    if (!plainToken) {
      return json({ message: "Missing plainToken." }, 400);
    }

    if (!secretToken) {
      return json({ message: "Zoom secret token is not configured." }, 500);
    }

    return json({
      plainToken,
      encryptedToken: await hmacSha256Hex(secretToken, plainToken),
    });
  }

  return json({ ok: true });
}

async function hmacSha256Hex(secret, value) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function isAuthorized(request, env, url) {
  const expected = String(env.MEETUP_ADMIN_KEY || "").trim();
  const provided = request.headers.get("X-Admin-Key") || url.searchParams.get("admin_key") || "";
  return expected !== "" && safeEqual(provided, expected);
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function normalizePhone(phone) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D+/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (raw.startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return "";
}

function phoneLast4(phone) {
  return String(phone || "").replace(/\D+/g, "").slice(-4);
}

function twilioConfigured(env) {
  return Boolean(env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER);
}

async function sendTwilio(env, to, body) {
  if (!twilioConfigured(env)) {
    return { ok: false, error: "Twilio credentials are not configured." };
  }

  const accountSid = env.TWILIO_ACCOUNT_SID;
  const params = new URLSearchParams({
    From: env.TWILIO_FROM_NUMBER,
    To: to,
    Body: body,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${accountSid}:${env.TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  const payload = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    http_status: response.status,
    twilio_sid: payload.sid || null,
    error: payload.message || "",
  };
}

async function listPublicSubscribers(env, groupUrlname) {
  const recipients = [];
  let cursor;

  do {
    const page = await env.SMS_REMINDERS.list({
      prefix: "public:",
      cursor,
    });

    for (const key of page.keys || []) {
      const record = await env.SMS_REMINDERS.get(key.name, "json");
      if (!record || record.unsubscribedAt) {
        continue;
      }

      if (groupUrlname && record.groupUrlname !== groupUrlname) {
        continue;
      }

      const phone = normalizePhone(record.phone || "");
      if (!phone) {
        continue;
      }

      recipients.push({
        phone,
        phoneLast4: record.phoneLast4 || phoneLast4(phone),
        groupUrlname: record.groupUrlname,
        groupName: record.groupName,
        consentedAt: record.consentedAt,
        updatedAt: record.updatedAt,
      });
    }

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return recipients;
}

async function deletePublicSubscribersByPhone(env, phone) {
  const deleted = [];
  let cursor;

  do {
    const page = await env.SMS_REMINDERS.list({
      prefix: "public:",
      cursor,
    });

    for (const key of page.keys || []) {
      const record = await env.SMS_REMINDERS.get(key.name, "json");
      if (!record || normalizePhone(record.phone || "") !== phone) {
        continue;
      }

      await env.SMS_REMINDERS.delete(key.name);
      deleted.push({
        phoneLast4: record.phoneLast4 || phoneLast4(phone),
        groupUrlname: record.groupUrlname,
      });
    }

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return deleted;
}

async function sha256(value) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function handleSellerOnboardingEmail(request, env) {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed." }, 405);
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, message: "Email service not configured." }, 503);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, message: "Expected JSON body." }, 400);
  }

  const required = ["email", "contactName", "productName", "sellerToken"];
  const missing = required.filter((f) => !String(data[f] || "").trim());
  if (missing.length) {
    return json({ ok: false, message: "Missing required fields: " + missing.join(", ") }, 422);
  }

  const { email, contactName, productName, sellerToken } = data;
  const onboardingUrl = `https://mojoaistudio.com/products/pages/seller-onboarding.html?email=${encodeURIComponent(email)}&token=${encodeURIComponent(sellerToken)}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mojo AI Studio <noreply@mojoaistudio.com>",
      to: [email],
      subject: "Complete Your Seller Contract - Mojo AI Studio",
      html: `<p>Hi ${contactName},</p>
<p>Thanks for submitting <strong>${productName}</strong> to the Mojo AI Studio marketplace!</p>
<p>Your product has been approved for seller onboarding. Please review and sign the seller agreement here:</p>
<p><a href="${onboardingUrl}">${onboardingUrl}</a></p>
<p>What happens next:</p>
<ol>
<li>If the listing fee was not waived, choose PayPal or Zelle and submit your $100 payment details</li>
<li>After Mojo verifies the fee payment, review and sign the seller agreement</li>
<li>Choose a payout method such as PayPal, Zelle, Venmo, Cash App, mailed check, or another option</li>
<li>Mojo sends your seller portal link so you can finish product details and launch setup</li>
<li>Mojo creates and syncs the Polar checkout product under the Mojo account</li>
<li>Buyers purchase through the Mojo marketplace checkout</li>
</ol>
<p>Questions? Reply to this email or contact <a href="mailto:admin@MojoAiStudio.com">admin@MojoAiStudio.com</a>.</p>
<p>— Mojo AI Studio Team<br><a href="https://MojoAiStudio.com">MojoAiStudio.com</a></p>`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[sellerOnboarding] Resend error:", err);
    return json({ ok: false, message: "Failed to send email: " + (err.message || err.name || JSON.stringify(err)) }, 500);
  }

  return json({ ok: true });
}

async function handleForumApi(request, env, url) {
  if (!env.FORUM_DB) {
    return json({
      ok: false,
      message: "Forum database is not configured. Bind a Cloudflare D1 database as FORUM_DB.",
    }, 503);
  }

  const path = url.pathname.replace(/\/+$/, "");

  try {
    if (path === "/api/forum/categories" && request.method === "GET") {
      const [categories, stats] = await Promise.all([
        forumCategories(env),
        forumStats(env),
      ]);
      return json({ ok: true, categories, stats });
    }

    if (path === "/api/forum/threads" && request.method === "GET") {
      return json({ ok: true, threads: await forumThreads(env, url, request) });
    }

    if (path === "/api/forum/thread" && request.method === "GET") {
      const thread = await forumThread(env, url.searchParams.get("id"), request);
      if (!thread) return json({ ok: false, message: "Thread not found." }, 404);
      return json({ ok: true, thread });
    }

    if (path === "/api/forum/auth/me" && request.method === "GET") {
      const user = await forumCurrentUser(env, request);
      return json({ ok: true, user: user ? forumUserPayload(user) : null });
    }

    if (path === "/api/forum/auth/request-code" && request.method === "POST") {
      const input = await readJsonBody(request);
      await requestForumLoginCode(env, input);
      return json({ ok: true, message: "Check your email for a Mojo Forum login code." });
    }

    if (path === "/api/forum/auth/verify" && request.method === "POST") {
      const input = await readJsonBody(request);
      const session = await verifyForumLoginCode(env, input);
      return forumSessionResponse(session);
    }

    if (path === "/api/forum/auth/logout" && request.method === "POST") {
      await logoutForumUser(env, request);
      return jsonWithHeaders({ ok: true }, 200, {
        "Set-Cookie": forumSessionCookie("", new Date(0)),
      });
    }

    if (path === "/api/forum/threads" && request.method === "POST") {
      const input = await readJsonBody(request);
      const saved = await createForumThread(env, input, request);
      return json({ ok: true, thread: saved }, 201);
    }

    if (path === "/api/forum/threads" && request.method === "PUT") {
      const input = await readJsonBody(request);
      const saved = await updateForumThread(env, input, request);
      return json({ ok: true, thread: saved });
    }

    if (path === "/api/forum/posts" && request.method === "POST") {
      const input = await readJsonBody(request);
      const saved = await createForumPost(env, input, request);
      return json({ ok: true, post: saved }, 201);
    }

    if (path === "/api/forum/posts" && request.method === "PUT") {
      const input = await readJsonBody(request);
      const saved = await updateForumPost(env, input, request);
      return json({ ok: true, post: saved });
    }

    if (path === "/api/forum/votes" && request.method === "POST") {
      const input = await readJsonBody(request);
      const result = await createForumVote(env, input, request);
      return json({ ok: true, vote: result });
    }

    if (path === "/api/forum/moderate" && request.method === "POST") {
      if (!(isForumAdmin(request, env, url) || await isForumAdminUser(env, request))) {
        return json({ ok: false, message: "Unauthorized." }, 401);
      }
      const input = await readJsonBody(request);
      const result = await moderateForumItem(env, input);
      return json({ ok: true, moderation: result });
    }

    if (request.method === "OPTIONS") {
      return new Response("", { status: 204, headers: JSON_HEADERS });
    }

    return json({ ok: false, message: "Forum endpoint not found." }, 404);
  } catch (err) {
    console.error("[forum] API error:", err);
    return json({ ok: false, message: err.publicMessage || "Forum request failed." }, err.status || 500);
  }
}

async function forumCategories(env) {
  const result = await env.FORUM_DB.prepare(`
    SELECT
      c.id,
      c.slug,
      c.name,
      c.description,
      COUNT(t.id) AS threadCount,
      COALESCE(MAX(t.updated_at), c.created_at) AS lastActivityAt
    FROM forum_categories c
    LEFT JOIN forum_threads t ON t.category_id = c.id AND t.hidden = 0
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
  `).all();

  return (result.results || []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || "",
    threadCount: Number(row.threadCount || 0),
    lastActivityAt: row.lastActivityAt || null,
  }));
}

async function forumStats(env) {
  const row = await env.FORUM_DB.prepare(`
    SELECT COUNT(*) AS memberCount
    FROM forum_users
  `).first();

  return {
    memberCount: Number(row?.memberCount || 0),
  };
}

async function forumThreads(env, url, request) {
  const category = String(url.searchParams.get("category") || "").trim();
  const viewer = await forumViewer(env, request);
  const params = [];
  let where = "t.hidden = 0";

  if (category) {
    where += " AND c.slug = ?";
    params.push(category);
  }

  const result = await env.FORUM_DB.prepare(`
    SELECT
      t.id,
      t.title,
      t.body,
      t.author_name AS authorName,
      t.author_token_hash AS authorHash,
      t.youtube_url AS youtubeUrl,
      t.youtube_video_id AS youtubeVideoId,
      t.youtube_thumbnail_url AS youtubeThumbnailUrl,
      t.image_url AS imageUrl,
      t.poll_question AS pollQuestion,
      t.pinned,
      t.locked,
      t.created_at AS createdAt,
      t.updated_at AS updatedAt,
      c.slug AS categorySlug,
      c.name AS categoryName,
      COUNT(p.id) AS replyCount
    FROM forum_threads t
    JOIN forum_categories c ON c.id = t.category_id
    LEFT JOIN forum_posts p ON p.thread_id = t.id AND p.hidden = 0
    WHERE ${where}
    GROUP BY t.id
    ORDER BY t.pinned DESC, t.updated_at DESC
    LIMIT 80
  `).bind(...params).all();

  return (result.results || []).map((row) => forumThreadSummary(row, viewer));
}

async function forumThread(env, threadId, request) {
  const id = cleanId(threadId);
  if (!id) return null;
  const viewer = request ? await forumViewer(env, request) : null;

  const threadResult = await env.FORUM_DB.prepare(`
    SELECT
      t.id,
      t.title,
      t.body,
      t.author_name AS authorName,
      t.author_token_hash AS authorHash,
      t.youtube_url AS youtubeUrl,
      t.youtube_video_id AS youtubeVideoId,
      t.youtube_thumbnail_url AS youtubeThumbnailUrl,
      t.image_url AS imageUrl,
      t.poll_question AS pollQuestion,
      t.pinned,
      t.locked,
      t.created_at AS createdAt,
      t.updated_at AS updatedAt,
      c.slug AS categorySlug,
      c.name AS categoryName
    FROM forum_threads t
    JOIN forum_categories c ON c.id = t.category_id
    WHERE t.id = ? AND t.hidden = 0
    LIMIT 1
  `).bind(id).first();

  if (!threadResult) return null;

  const postsResult = await env.FORUM_DB.prepare(`
    SELECT
      id,
      body,
      author_name AS authorName,
      author_token_hash AS authorHash,
      youtube_url AS youtubeUrl,
      youtube_video_id AS youtubeVideoId,
      youtube_thumbnail_url AS youtubeThumbnailUrl,
      image_url AS imageUrl,
      created_at AS createdAt
    FROM forum_posts
    WHERE thread_id = ? AND hidden = 0
    ORDER BY created_at ASC
    LIMIT 300
  `).bind(id).all();

  const optionsResult = await env.FORUM_DB.prepare(`
    SELECT
      o.id,
      o.label,
      COUNT(v.option_id) AS voteCount
    FROM forum_poll_options o
    LEFT JOIN forum_poll_votes v ON v.option_id = o.id
    WHERE o.thread_id = ?
    GROUP BY o.id
    ORDER BY o.sort_order ASC
  `).bind(id).all();

  return {
    ...forumThreadSummary({ ...threadResult, replyCount: (postsResult.results || []).length }, viewer),
    posts: (postsResult.results || []).map((row) => forumPostPayload(row, viewer)),
    pollOptions: (optionsResult.results || []).map((row) => ({
      id: row.id,
      label: row.label,
      voteCount: Number(row.voteCount || 0),
    })),
  };
}

async function createForumThread(env, input, request) {
  const user = await requireForumUser(env, request);
  const title = cleanText(input.title, 140);
  const body = cleanText(input.body, 5000);
  const authorName = user.display_name || "Mojo member";
  const categorySlug = cleanText(input.categorySlug, 80);
  const media = normalizeForumMedia(input);
  const isPoll = cleanText(input.type, 20) === "poll";
  if (isPoll && !isForumAdminEmail(user.email)) {
    throw publicError("Only admins can create polls.", 403);
  }
  const pollQuestion = isPoll ? cleanText(input.pollQuestion || input.title, 180) : "";
  const pollOptions = isPoll ? normalizePollOptions(input.pollOptions) : [];

  if (!title || !body || !categorySlug) {
    throw publicError("Title, body, and category are required.", 422);
  }

  if (pollQuestion && pollOptions.length < 2) {
    throw publicError("Polls need at least two options.", 422);
  }

  const category = await env.FORUM_DB.prepare(
    "SELECT id FROM forum_categories WHERE slug = ? LIMIT 1"
  ).bind(categorySlug).first();

  if (!category) {
    throw publicError("Choose a valid forum category.", 422);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const authorHash = await forumActorHash(request, user.id);

  const statements = [
    env.FORUM_DB.prepare(`
      INSERT INTO forum_threads (
        id, category_id, title, body, author_name, author_token_hash,
        youtube_url, youtube_video_id, youtube_thumbnail_url, image_url,
        poll_question, pinned, locked, hidden, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?)
    `).bind(
      id,
      category.id,
      title,
      body,
      authorName,
      authorHash,
      media.youtubeUrl,
      media.youtubeVideoId,
      media.youtubeThumbnailUrl,
      media.imageUrl,
      pollQuestion || null,
      now,
      now,
    ),
  ];

  pollOptions.forEach((label, index) => {
    statements.push(env.FORUM_DB.prepare(`
      INSERT INTO forum_poll_options (id, thread_id, label, sort_order)
      VALUES (?, ?, ?, ?)
    `).bind(crypto.randomUUID(), id, label, index));
  });

  await env.FORUM_DB.batch(statements);
  return forumThread(env, id, request);
}

async function updateForumThread(env, input, request) {
  const user = await requireForumUser(env, request);
  const threadId = cleanId(input.threadId);
  const title = cleanText(input.title, 140);
  const body = cleanText(input.body, 5000);

  if (!threadId || !title || !body) {
    throw publicError("Thread, title, and body are required.", 422);
  }

  const thread = await env.FORUM_DB.prepare(`
    SELECT id, author_token_hash AS authorHash
    FROM forum_threads
    WHERE id = ? AND hidden = 0
    LIMIT 1
  `).bind(threadId).first();

  if (!thread) throw publicError("Thread not found.", 404);

  const viewer = await forumViewerFromUser(request, user);
  if (!viewer.isAdmin && thread.authorHash !== viewer.authorHash) {
    throw publicError("You can only edit your own threads.", 403);
  }

  const media = normalizeForumMedia(input);
  const now = new Date().toISOString();

  await env.FORUM_DB.prepare(`
    UPDATE forum_threads
    SET title = ?,
        body = ?,
        youtube_url = ?,
        youtube_video_id = ?,
        youtube_thumbnail_url = ?,
        image_url = ?,
        updated_at = ?
    WHERE id = ?
  `).bind(
    title,
    body,
    media.youtubeUrl,
    media.youtubeVideoId,
    media.youtubeThumbnailUrl,
    media.imageUrl,
    now,
    threadId,
  ).run();

  return forumThread(env, threadId, request);
}

async function createForumPost(env, input, request) {
  const user = await requireForumUser(env, request);
  const threadId = cleanId(input.threadId);
  const body = cleanText(input.body, 5000);
  const authorName = user.display_name || "Mojo member";
  const media = normalizeForumMedia(input);

  if (!threadId || !body) {
    throw publicError("Thread and reply body are required.", 422);
  }

  const thread = await env.FORUM_DB.prepare(
    "SELECT id, locked FROM forum_threads WHERE id = ? AND hidden = 0 LIMIT 1"
  ).bind(threadId).first();

  if (!thread) throw publicError("Thread not found.", 404);
  if (thread.locked) throw publicError("This thread is locked.", 423);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const authorHash = await forumActorHash(request, user.id);

  await env.FORUM_DB.batch([
    env.FORUM_DB.prepare(`
      INSERT INTO forum_posts (
        id, thread_id, body, author_name, author_token_hash,
        youtube_url, youtube_video_id, youtube_thumbnail_url, image_url,
        hidden, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).bind(
      id,
      threadId,
      body,
      authorName,
      authorHash,
      media.youtubeUrl,
      media.youtubeVideoId,
      media.youtubeThumbnailUrl,
      media.imageUrl,
      now,
    ),
    env.FORUM_DB.prepare(
      "UPDATE forum_threads SET updated_at = ? WHERE id = ?"
    ).bind(now, threadId),
  ]);

  return {
    id,
    threadId,
    body,
    authorName,
    ...media,
    createdAt: now,
  };
}

async function updateForumPost(env, input, request) {
  const user = await requireForumUser(env, request);
  const postId = cleanId(input.postId);
  const body = cleanText(input.body, 5000);

  if (!postId || !body) {
    throw publicError("Post and reply body are required.", 422);
  }

  const post = await env.FORUM_DB.prepare(`
    SELECT id, thread_id AS threadId, author_token_hash AS authorHash
    FROM forum_posts
    WHERE id = ? AND hidden = 0
    LIMIT 1
  `).bind(postId).first();

  if (!post) throw publicError("Reply not found.", 404);

  const viewer = await forumViewerFromUser(request, user);
  if (!viewer.isAdmin && post.authorHash !== viewer.authorHash) {
    throw publicError("You can only edit your own replies.", 403);
  }

  const media = normalizeForumMedia(input);
  const now = new Date().toISOString();

  await env.FORUM_DB.batch([
    env.FORUM_DB.prepare(`
      UPDATE forum_posts
      SET body = ?,
          youtube_url = ?,
          youtube_video_id = ?,
          youtube_thumbnail_url = ?,
          image_url = ?
      WHERE id = ?
    `).bind(
      body,
      media.youtubeUrl,
      media.youtubeVideoId,
      media.youtubeThumbnailUrl,
      media.imageUrl,
      postId,
    ),
    env.FORUM_DB.prepare("UPDATE forum_threads SET updated_at = ? WHERE id = ?").bind(now, post.threadId),
  ]);

  return { id: postId, threadId: post.threadId };
}

async function createForumVote(env, input, request) {
  const user = await requireForumUser(env, request);
  const threadId = cleanId(input.threadId);
  const optionId = cleanId(input.optionId);
  if (!threadId || !optionId) throw publicError("Choose a poll option.", 422);

  const option = await env.FORUM_DB.prepare(`
    SELECT o.id
    FROM forum_poll_options o
    JOIN forum_threads t ON t.id = o.thread_id
    WHERE o.id = ? AND o.thread_id = ? AND t.hidden = 0 AND t.locked = 0
    LIMIT 1
  `).bind(optionId, threadId).first();

  if (!option) throw publicError("Poll option not found.", 404);

  const voterHash = await forumActorHash(request, user.id);
  await env.FORUM_DB.prepare(`
    INSERT INTO forum_poll_votes (thread_id, option_id, voter_hash, created_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(thread_id, voter_hash) DO UPDATE SET
      option_id = excluded.option_id,
      created_at = excluded.created_at
  `).bind(threadId, optionId, voterHash, new Date().toISOString()).run();

  return { threadId, optionId };
}

async function moderateForumItem(env, input) {
  const type = cleanText(input.type, 20);
  const id = cleanId(input.id);
  const action = cleanText(input.action, 20);

  if (!id || !["thread", "post"].includes(type)) {
    throw publicError("Choose a thread or post to moderate.", 422);
  }

  if (type === "thread" && (action === "hide" || action === "delete")) {
    await env.FORUM_DB.prepare("UPDATE forum_threads SET hidden = 1 WHERE id = ?").bind(id).run();
  } else if (type === "thread" && action === "pin") {
    await env.FORUM_DB.prepare("UPDATE forum_threads SET pinned = 1 WHERE id = ?").bind(id).run();
  } else if (type === "thread" && action === "unpin") {
    await env.FORUM_DB.prepare("UPDATE forum_threads SET pinned = 0 WHERE id = ?").bind(id).run();
  } else if (type === "thread" && action === "lock") {
    await env.FORUM_DB.prepare("UPDATE forum_threads SET locked = 1 WHERE id = ?").bind(id).run();
  } else if (type === "thread" && action === "unlock") {
    await env.FORUM_DB.prepare("UPDATE forum_threads SET locked = 0 WHERE id = ?").bind(id).run();
  } else if (type === "post" && (action === "hide" || action === "delete")) {
    await env.FORUM_DB.prepare("UPDATE forum_posts SET hidden = 1 WHERE id = ?").bind(id).run();
  } else {
    throw publicError("Unsupported moderation action.", 422);
  }

  return { type, id, action };
}

function forumThreadSummary(row, viewer) {
  return {
    id: row.id,
    title: row.title,
    body: row.body || "",
    authorName: row.authorName || "Mojo member",
    categorySlug: row.categorySlug,
    categoryName: row.categoryName,
    youtubeUrl: row.youtubeUrl || null,
    youtubeVideoId: row.youtubeVideoId || null,
    youtubeThumbnailUrl: row.youtubeThumbnailUrl || null,
    imageUrl: row.imageUrl || null,
    pollQuestion: row.pollQuestion || null,
    pinned: Boolean(row.pinned),
    locked: Boolean(row.locked),
    canEdit: Boolean(viewer && (viewer.isAdmin || row.authorHash === viewer.authorHash)),
    replyCount: Number(row.replyCount || 0),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function forumPostPayload(row, viewer) {
  return {
    id: row.id,
    body: row.body || "",
    authorName: row.authorName || "Mojo member",
    youtubeUrl: row.youtubeUrl || null,
    youtubeVideoId: row.youtubeVideoId || null,
    youtubeThumbnailUrl: row.youtubeThumbnailUrl || null,
    imageUrl: row.imageUrl || null,
    canEdit: Boolean(viewer && (viewer.isAdmin || row.authorHash === viewer.authorHash)),
    createdAt: row.createdAt,
  };
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw publicError("Expected JSON body.", 400);
  }
}

function normalizeForumMedia(input) {
  const sourceText = [
    input.body,
    input.youtubeUrl,
    input.imageUrl,
  ].map((value) => String(value || "")).join("\n");
  const urls = extractPublicUrls(sourceText);
  const explicitYoutubeUrl = cleanText(input.youtubeUrl, 2000);
  const explicitImageUrl = cleanText(input.imageUrl, 2000);
  const youtubeUrl = explicitYoutubeUrl || urls.find((url) => extractYouTubeVideoId(url)) || "";
  const youtubeVideoId = youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : "";
  const imageUrl = explicitImageUrl || urls.find(isLikelyImageUrl) || "";

  if (youtubeUrl && !youtubeVideoId) {
    throw publicError("Paste a valid YouTube URL.", 422);
  }

  if (imageUrl && !isPublicHttpUrl(imageUrl)) {
    throw publicError("Image must be a public http or https URL.", 422);
  }

  return {
    youtubeUrl: youtubeVideoId ? youtubeUrl : null,
    youtubeVideoId: youtubeVideoId || null,
    youtubeThumbnailUrl: youtubeVideoId ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` : null,
    imageUrl: imageUrl || null,
  };
}

function extractPublicUrls(value) {
  const matches = String(value || "").match(/https?:\/\/[^\s<>"')\]]+/gi) || [];
  const cleaned = [];
  const seen = new Set();

  matches.forEach((match) => {
    const url = match.replace(/[.,!?;:]+$/g, "");
    if (isPublicHttpUrl(url) && !seen.has(url)) {
      seen.add(url);
      cleaned.push(url);
    }
  });

  return cleaned;
}

function isLikelyImageUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url.pathname + url.search);
  } catch {
    return false;
  }
}

function extractYouTubeVideoId(value) {
  try {
    const url = new URL(String(value || "").trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtu.be") {
      return safeYouTubeId(url.pathname.split("/").filter(Boolean)[0]);
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (url.pathname === "/watch") return safeYouTubeId(url.searchParams.get("v"));
      const parts = url.pathname.split("/").filter(Boolean);
      if (["shorts", "embed", "live"].includes(parts[0])) return safeYouTubeId(parts[1]);
    }

    return "";
  } catch {
    return "";
  }
}

function safeYouTubeId(value) {
  const id = String(value || "").trim();
  return /^[A-Za-z0-9_-]{6,32}$/.test(id) ? id : "";
}

function normalizePollOptions(options) {
  if (!Array.isArray(options)) return [];
  const seen = new Set();
  const cleaned = [];

  options.forEach((option) => {
    const label = cleanText(option, 120);
    const key = label.toLowerCase();
    if (label && !seen.has(key) && cleaned.length < 8) {
      seen.add(key);
      cleaned.push(label);
    }
  });

  return cleaned;
}

async function forumActorHash(request, authorToken) {
  const token = cleanText(authorToken, 200) || request.headers.get("CF-Connecting-IP") || "anonymous";
  return sha256(`forum|${token}`);
}

async function forumViewer(env, request) {
  const user = await forumCurrentUser(env, request);
  if (!user) return null;
  return forumViewerFromUser(request, user);
}

async function forumViewerFromUser(request, user) {
  return {
    user,
    isAdmin: isForumAdminEmail(user.email),
    authorHash: await forumActorHash(request, user.id),
  };
}

async function requestForumLoginCode(env, input) {
  if (!env.RESEND_API_KEY) {
    throw publicError("Forum login email is not configured yet.", 503);
  }

  const email = normalizeEmail(input.email);
  const requestedDisplayName = cleanText(input.displayName, 80);
  const displayName = forumDisplayNameForEmail(email, requestedDisplayName);
  if (!email) throw publicError("Enter a valid email address.", 422);
  if (!displayName) throw publicError("Enter your display name.", 422);

  const now = new Date();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(now.getTime() + FORUM_LOGIN_CODE_TTL_MINUTES * 60 * 1000);
  const codeHash = await forumCodeHash(email, code);

  await env.FORUM_DB.prepare(`
    INSERT INTO forum_login_codes (email, code_hash, display_name, expires_at, attempts, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
    ON CONFLICT(email) DO UPDATE SET
      code_hash = excluded.code_hash,
      display_name = excluded.display_name,
      expires_at = excluded.expires_at,
      attempts = 0,
      created_at = excluded.created_at
  `).bind(email, codeHash, displayName, expires.toISOString(), now.toISOString()).run();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mojo AI Studio <noreply@mojoaistudio.com>",
      to: [email],
      subject: "Your Mojo Forum login code",
      html: `<p>Your Mojo Forum login code is:</p>
<p style="font-size:24px;font-weight:700;letter-spacing:3px">${code}</p>
<p>This code expires in ${FORUM_LOGIN_CODE_TTL_MINUTES} minutes.</p>
<p>— Mojo AI Studio</p>`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[forumAuth] Resend error:", err);
    throw publicError("Could not send the login code. Try again in a minute.", 502);
  }
}

async function verifyForumLoginCode(env, input) {
  const email = normalizeEmail(input.email);
  const code = String(input.code || "").replace(/\D+/g, "").slice(0, 6);
  if (!email || code.length !== 6) throw publicError("Enter the 6-digit login code.", 422);

  const login = await env.FORUM_DB.prepare(`
    SELECT email, code_hash AS codeHash, display_name AS displayName, expires_at AS expiresAt, attempts
    FROM forum_login_codes
    WHERE email = ?
    LIMIT 1
  `).bind(email).first();

  if (!login) throw publicError("Request a fresh login code.", 404);
  if (new Date(login.expiresAt).getTime() < Date.now()) {
    await env.FORUM_DB.prepare("DELETE FROM forum_login_codes WHERE email = ?").bind(email).run();
    throw publicError("That login code expired. Request a fresh one.", 410);
  }
  if (Number(login.attempts || 0) >= 5) {
    await env.FORUM_DB.prepare("DELETE FROM forum_login_codes WHERE email = ?").bind(email).run();
    throw publicError("Too many attempts. Request a fresh login code.", 429);
  }

  const expectedHash = await forumCodeHash(email, code);
  if (!safeEqual(expectedHash, login.codeHash || "")) {
    await env.FORUM_DB.prepare("UPDATE forum_login_codes SET attempts = attempts + 1 WHERE email = ?").bind(email).run();
    throw publicError("That login code did not match.", 401);
  }

  const now = new Date().toISOString();
  const existing = await env.FORUM_DB.prepare("SELECT id FROM forum_users WHERE email = ? LIMIT 1").bind(email).first();
  const userId = existing?.id || crypto.randomUUID();

  if (existing) {
    await env.FORUM_DB.prepare(`
      UPDATE forum_users SET display_name = ?, last_login_at = ? WHERE id = ?
    `).bind(cleanText(login.displayName, 80), now, userId).run();
  } else {
    await env.FORUM_DB.prepare(`
      INSERT INTO forum_users (id, email, display_name, created_at, last_login_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(userId, email, cleanText(login.displayName, 80), now, now).run();
  }

  await env.FORUM_DB.prepare("DELETE FROM forum_login_codes WHERE email = ?").bind(email).run();

  const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
  const tokenHash = await forumSessionHash(token);
  const sessionId = crypto.randomUUID();
  const expires = new Date(Date.now() + FORUM_SESSION_TTL_SECONDS * 1000);

  await env.FORUM_DB.prepare(`
    INSERT INTO forum_sessions (id, user_id, token_hash, expires_at, created_at, last_seen_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(sessionId, userId, tokenHash, expires.toISOString(), now, now).run();

  return {
    token,
    expires,
    user: {
      id: userId,
      email,
      display_name: cleanText(login.displayName, 80),
    },
  };
}

async function forumCurrentUser(env, request) {
  const token = parseCookie(request.headers.get("Cookie") || "")[FORUM_SESSION_COOKIE];
  if (!token) return null;
  const tokenHash = await forumSessionHash(token);
  const row = await env.FORUM_DB.prepare(`
    SELECT u.id, u.email, u.display_name, s.id AS sessionId, s.expires_at AS expiresAt
    FROM forum_sessions s
    JOIN forum_users u ON u.id = s.user_id
    WHERE s.token_hash = ?
    LIMIT 1
  `).bind(tokenHash).first();

  if (!row) return null;
  if (new Date(row.expiresAt).getTime() < Date.now()) {
    await env.FORUM_DB.prepare("DELETE FROM forum_sessions WHERE id = ?").bind(row.sessionId).run();
    return null;
  }

  await env.FORUM_DB.prepare("UPDATE forum_sessions SET last_seen_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), row.sessionId)
    .run();
  return row;
}

async function requireForumUser(env, request) {
  const user = await forumCurrentUser(env, request);
  if (!user) throw publicError("Sign in to post in the forum.", 401);
  return user;
}

async function logoutForumUser(env, request) {
  const token = parseCookie(request.headers.get("Cookie") || "")[FORUM_SESSION_COOKIE];
  if (!token) return;
  const tokenHash = await forumSessionHash(token);
  await env.FORUM_DB.prepare("DELETE FROM forum_sessions WHERE token_hash = ?").bind(tokenHash).run();
}

function forumSessionResponse(session) {
  return jsonWithHeaders({ ok: true, user: forumUserPayload(session.user) }, 200, {
    "Set-Cookie": forumSessionCookie(session.token, session.expires),
  });
}

function forumSessionCookie(value, expires) {
  return `${FORUM_SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires.toUTCString()}; Max-Age=${value ? FORUM_SESSION_TTL_SECONDS : 0}`;
}

function forumUserPayload(user) {
  const email = normalizeEmail(user.email);
  return {
    id: user.id,
    email,
    displayName: forumDisplayNameForEmail(email, user.displayName || user.display_name || "Mojo member"),
    isAdmin: isForumAdminEmail(email),
  };
}

async function isForumAdminUser(env, request) {
  const user = await forumCurrentUser(env, request);
  return Boolean(user && isForumAdminEmail(user.email));
}

function isForumAdminEmail(email) {
  return FORUM_ADMIN_EMAILS.has(normalizeEmail(email));
}

function forumDisplayNameForEmail(email, fallback) {
  return isForumAdminEmail(email) ? "Mojo Scott" : cleanText(fallback, 80);
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

async function forumCodeHash(email, code) {
  return sha256(`forum-login|${email}|${code}`);
}

async function forumSessionHash(token) {
  return sha256(`forum-session|${token}`);
}

function parseCookie(header) {
  const cookies = {};
  String(header || "").split(";").forEach((part) => {
    const index = part.indexOf("=");
    if (index === -1) return;
    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!name) return;
    cookies[name] = decodeURIComponent(value);
  });
  return cookies;
}

function isForumAdmin(request, env, url) {
  const expected = String(env.FORUM_ADMIN_KEY || env.MEETUP_ADMIN_KEY || "").trim();
  const provided = request.headers.get("X-Admin-Key") || url.searchParams.get("admin_key") || "";
  return expected !== "" && safeEqual(provided, expected);
}

function cleanId(value) {
  const text = String(value || "").trim();
  return /^[A-Za-z0-9_-]{8,80}$/.test(text) ? text : "";
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function publicError(message, status) {
  const err = new Error(message);
  err.publicMessage = message;
  err.status = status;
  return err;
}

async function handleSubmitBrief(request, env) {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed." }, 405);
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, message: "Email service not configured." }, 503);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, message: "Expected JSON body." }, 400);
  }

  const required = ["projectName", "contactName", "contactEmail", "problemDescription"];
  const missing = required.filter((f) => !String(data[f] || "").trim());
  if (missing.length) {
    return json({ ok: false, message: "Missing required fields: " + missing.join(", ") }, 422);
  }

  const email = String(data.contactEmail || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, message: "Invalid email address." }, 422);
  }

  const record = {
    projectName: String(data.projectName || "").trim(),
    contactName: String(data.contactName || "").trim(),
    contactEmail: email,
    problemDescription: String(data.problemDescription || "").trim(),
    currentTools: String(data.currentTools || "").trim(),
    quoteStatus: String(data.quoteStatus || data.builderPriority || "").trim(),
    teachingPermission: String(data.teachingPermission || data.interviewCount || "").trim(),
    timeline: String(data.timeline || "").trim(),
    budget: String(data.budget || "").trim(),
    anythingElse: String(data.anythingElse || "").trim(),
  };

  const adminEmail = String(env.MOJO_ADMIN_EMAIL || "admin@mojoaistudio.com").trim();
  const rows = [
    ["Project name", record.projectName],
    ["Contact name", record.contactName],
    ["Contact email", record.contactEmail],
    ["Timeline", record.timeline || "(not specified)"],
    ["Budget", record.budget || "(not specified)"],
    ["Outside quote status", record.quoteStatus || "(not specified)"],
    ["Teaching permission", record.teachingPermission || "(not specified)"],
    ["Current tools", record.currentTools || "(not specified)"],
  ];

  const adminHtml = `<p>New Teaching AI Agency quote intake submitted via MojoAiStudio.com.</p>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("")}</table>
<h3>Product request</h3>
<p>${escapeHtml(record.problemDescription).replace(/\n/g, "<br>")}</p>
${record.anythingElse ? `<h3>Anything else</h3><p>${escapeHtml(record.anythingElse).replace(/\n/g, "<br>")}</p>` : ""}
<p>Reply to: <a href="mailto:${escapeHtml(record.contactEmail)}">${escapeHtml(record.contactEmail)}</a></p>`;

  const submitterHtml = `<p>Hi ${escapeHtml(record.contactName)},</p>
<p>Thanks for submitting a Teaching AI Agency build quote to Mojo AI Studio.</p>
<p>We've received your intake for <strong>${escapeHtml(record.projectName)}</strong> and will review the quote, teaching fit, and resale licensing path within two business days.</p>
<p>If you have anything to add in the meantime, just reply to this email.</p>
<p>- Mojo AI Studio<br><a href="https://MojoAiStudio.com">MojoAiStudio.com</a></p>`;

  const adminRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mojo AI Studio <noreply@mojoaistudio.com>",
      to: [adminEmail],
      reply_to: email,
      subject: `[Mojo Teaching Build] ${record.projectName} - ${record.contactName}`,
      html: adminHtml,
    }),
  });

  if (!adminRes.ok) {
    const err = await adminRes.json().catch(() => ({}));
    console.error("[submitBrief] admin email error:", err);
    return json({ ok: false, message: "Email could not be sent. Please email admin@mojoaistudio.com directly." }, 500);
  }

  const replyRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Mojo AI Studio <noreply@mojoaistudio.com>",
      to: [email],
      reply_to: adminEmail,
      subject: "We received your Teaching AI Agency quote - Mojo AI Studio",
      html: submitterHtml,
    }),
  });

  if (!replyRes.ok) {
    const err = await replyRes.json().catch(() => ({}));
    console.error("[submitBrief] auto-reply email error:", err);
  }

  return json({ ok: true });
}

async function handleSubmitProduct(request, env, ctx) {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Method not allowed." }, 405);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, message: "Expected JSON body." }, 400);
  }

  const required = ["productName", "contactName", "contactEmail", "productDescription"];
  const missing = required.filter((f) => !String(data[f] || "").trim());
  if (missing.length) {
    return json({ ok: false, message: "Missing required fields: " + missing.join(", ") }, 422);
  }

  const email = String(data.contactEmail || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, message: "Invalid email address." }, 422);
  }

  const logoUrl = String(data.logoUrl || "").trim();
  const screenshotUrl = String(data.screenshotUrl || "").trim();
  const productUrl = String(data.productUrl || "").trim();
  if (logoUrl && !isHttpUrl(logoUrl)) {
    return json({ ok: false, message: "Logo must be a valid public image URL." }, 422);
  }
  if (screenshotUrl && !isHttpUrl(screenshotUrl)) {
    return json({ ok: false, message: "Screenshot must be a valid public image URL." }, 422);
  }
  if (productUrl && !isHttpUrl(productUrl)) {
    return json({ ok: false, message: "Product URL must be a valid public URL." }, 422);
  }

  if (!env.PRODUCT_SUBMISSIONS) {
    return json({ ok: false, message: "Submission storage not configured." }, 503);
  }

  const now = new Date().toISOString();
  const id = await sha256(`${now}|${email}|${data.productName}`);
  const record = {
    id,
    submittedAt: now,
    productName: String(data.productName || "").trim(),
    contactName: String(data.contactName || "").trim(),
    contactEmail: email,
    productDescription: String(data.productDescription || "").trim(),
    productUrl,
    logoUrl,
    screenshotUrl,
    category: String(data.category || "").trim(),
    pricingModel: String(data.pricingModel || "").trim(),
    targetUser: String(data.targetUser || "").trim(),
    anythingElse: String(data.anythingElse || "").trim(),
  };

  await env.PRODUCT_SUBMISSIONS.put(`submission:${now}:${id.slice(0, 8)}`, JSON.stringify(record));

  const firestoreBody = JSON.stringify({
    email,
    contactName: record.contactName,
    productName: record.productName,
    productDescription: record.productDescription,
    category: record.category,
    pricingModel: record.pricingModel,
    productUrl: record.productUrl,
    logoUrl: record.logoUrl,
    screenshotUrl: record.screenshotUrl,
    targetUser: record.targetUser,
    anythingElse: record.anythingElse,
  });
  const adminEmail = String(env.MOJO_ADMIN_EMAIL || "scott@mojoaistudio.com").trim();
  const adminProductHtml = `<p>New product submission via MojoAiStudio.com.</p>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
<tr><td><strong>Product</strong></td><td>${escapeHtml(record.productName)}</td></tr>
<tr><td><strong>Contact</strong></td><td>${escapeHtml(record.contactName)} &lt;${escapeHtml(email)}&gt;</td></tr>
<tr><td><strong>Category</strong></td><td>${escapeHtml(record.category || "(not specified)")}</td></tr>
<tr><td><strong>Pricing model</strong></td><td>${escapeHtml(record.pricingModel || "(not specified)")}</td></tr>
<tr><td><strong>Product URL</strong></td><td>${record.productUrl ? `<a href="${escapeAttribute(record.productUrl)}">${escapeHtml(record.productUrl)}</a>` : "(not provided)"}</td></tr>
<tr><td><strong>Logo</strong></td><td>${record.logoUrl ? `<a href="${escapeAttribute(record.logoUrl)}">${escapeHtml(record.logoUrl)}</a>` : "(not provided)"}</td></tr>
<tr><td><strong>Screenshot</strong></td><td>${record.screenshotUrl ? `<a href="${escapeAttribute(record.screenshotUrl)}">${escapeHtml(record.screenshotUrl)}</a>` : "(not provided)"}</td></tr>
<tr><td><strong>Target user</strong></td><td>${escapeHtml(record.targetUser || "(not specified)")}</td></tr>
</table>
<h3>Product Description</h3>
<p>${escapeHtml(record.productDescription).replace(/\n/g, "<br>")}</p>
${record.anythingElse ? `<h3>Anything Else</h3><p>${escapeHtml(record.anythingElse).replace(/\n/g, "<br>")}</p>` : ""}
<p><a href="https://mojoaistudio.com/products/pages/admin-products.html">Open Product Management</a></p>`;

  ctx.waitUntil(Promise.all([
    checkedFetch("submitProduct:createProduct", "https://us-central1-mojo-f86de.cloudfunctions.net/createProductFromSubmission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: firestoreBody,
    }),

    checkedFetch("submitProduct:createSeller", "https://us-central1-mojo-f86de.cloudfunctions.net/createSellerFromProductSubmission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        contactName: record.contactName,
        productName: record.productName,
      }),
    }),

    env.RESEND_API_KEY ? checkedFetch("submitProduct:confirmationEmail", "https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Mojo AI Studio <noreply@mojoaistudio.com>",
        to: [email],
        subject: `We received your submission — ${record.productName}`,
        html: `<p>Hi ${record.contactName},</p>
<p>Thanks for submitting <strong>${record.productName}</strong> to Mojo AI Studio!</p>
<p>We'll review your submission and reach out within a few business days. If approved, you'll receive an email with next steps to complete your seller setup.</p>
<p>Questions? Contact <a href="mailto:admin@MojoAiStudio.com">admin@MojoAiStudio.com</a>.</p>
<p>— Mojo AI Studio</p>`,
      }),
    }) : Promise.resolve(),

    env.RESEND_API_KEY ? checkedFetch("submitProduct:adminNotificationEmail", "https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Mojo AI Studio <noreply@mojoaistudio.com>",
        to: [adminEmail],
        reply_to: email,
        subject: `[Mojo Product] ${record.productName} - ${record.contactName}`,
        html: adminProductHtml,
      }),
    }) : Promise.resolve(),
  ]));

  return json({ ok: true });
}

function isHttpUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isPublicHttpUrl(value) {
  return isHttpUrl(value);
}

async function checkedFetch(label, url, init) {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[${label}] failed`, {
        status: response.status,
        statusText: response.statusText,
        body: text.slice(0, 1000),
      });
    }
    return response;
  } catch (err) {
    console.error(`[${label}] network error`, err);
    return null;
  }
}

async function handleSubmitProductAdmin(request, env, url) {
  if (!isAuthorized(request, env, url)) {
    return json({ ok: false, error: "Unauthorized." }, 401);
  }

  if (!env.PRODUCT_SUBMISSIONS) {
    return json({ ok: false, error: "Submission storage not configured." }, 503);
  }

  const submissions = [];
  let cursor;

  do {
    const page = await env.PRODUCT_SUBMISSIONS.list({ prefix: "submission:", cursor });
    for (const key of page.keys || []) {
      const record = await env.PRODUCT_SUBMISSIONS.get(key.name, "json");
      if (record) submissions.push(record);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  submissions.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return json({ ok: true, count: submissions.length, submissions });
}

function json(payload, status = 200) {
  return jsonWithHeaders(payload, status);
}

function jsonWithHeaders(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...extraHeaders,
    },
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;").replace(/`/g, "&#96;");
}
