const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Mojo-Api": "cloudflare-pages-worker",
};

const PUBLIC_CONSENT_TEXT =
  "I agree to receive recurring SMS reminders for upcoming Advanced AI Concepts Meetup events. Mojo AI Studio will use my phone number only for event reminders and SMS service messages, not marketing or any other purpose.";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/meetup-admin" || url.pathname === "/api/meetup-admin.php") {
      return handleMeetupAdmin(request, env, url);
    }

    if (url.pathname === "/api/sms-reminders" || url.pathname === "/api/sms-reminders.php") {
      return handleSmsReminders(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

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

  if (action === "send-admin-sms" || action === "send-test-sms") {
    const phone = normalizePhone(url.searchParams.get("phone") || "");
    const confirm = url.searchParams.get("confirm") || "";
    const dryRun = confirm !== action;
    let body = (url.searchParams.get("body") || "").trim();
    const mode = body === "" ? "test" : "one_off";

    if (body === "") {
      body = "Mojo AI Studio test SMS. Your Advanced AI Concepts reminders are connected. Reply STOP to opt out.";
    }

    if (!phone) {
      return json({
        ok: false,
        error: "Provide a valid phone number.",
        required: ["phone"],
      }, 422);
    }

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
      phoneLast4: phoneLast4(phone),
      bodyLength: body.length,
      twilioMessageSid: result.twilio_sid || null,
      error: result.error || null,
    }, result.ok ? 200 : 500);
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

async function sha256(value) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: JSON_HEADERS,
  });
}
