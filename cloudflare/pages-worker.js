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

    if (url.pathname === "/api/submit-product" || url.pathname === "/api/submit-product.php") {
      return handleSubmitProduct(request, env);
    }

    if (url.pathname === "/api/submit-product-admin") {
      return handleSubmitProductAdmin(request, env, url);
    }

    if (url.pathname === "/api/send-seller-onboarding-email" || url.pathname === "/api/send-seller-onboarding-email.php") {
      return handleSellerOnboardingEmail(request, env);
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
      from: "Mojo AI Studio <onboarding@resend.dev>",
      to: [email],
      subject: "Complete Your Seller Setup — Mojo AI Studio",
      html: `<p>Hi ${contactName},</p>
<p>Thanks for submitting <strong>${productName}</strong> to the Mojo AI Studio marketplace!</p>
<p>To complete your seller setup, please sign the seller agreement and provide your bank information:</p>
<p><a href="${onboardingUrl}">${onboardingUrl}</a></p>
<p>What happens next:</p>
<ol>
<li>Review and sign the seller agreement</li>
<li>Provide your bank details (encrypted and secure)</li>
<li>We'll send a small test deposit to verify your account</li>
<li>Once verified, you'll start earning 90% commission on product sales</li>
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

async function handleSubmitProduct(request, env) {
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
    productUrl: String(data.productUrl || "").trim(),
    category: String(data.category || "").trim(),
    pricingModel: String(data.pricingModel || "").trim(),
    targetUser: String(data.targetUser || "").trim(),
    anythingElse: String(data.anythingElse || "").trim(),
  };

  await env.PRODUCT_SUBMISSIONS.put(`submission:${now}:${id.slice(0, 8)}`, JSON.stringify(record));

  return json({ ok: true });
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
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: JSON_HEADERS,
  });
}
