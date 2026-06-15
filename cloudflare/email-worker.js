/**
 * email-worker.js — Standalone Cloudflare Worker for sending transactional email.
 * Deployed as "mojo-email-worker". Called by the Pages worker via service binding.
 *
 * POST /send-seller-onboarding
 * Body: { email, contactName, productName, sellerToken }
 */

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return json({ ok: false, message: "Method not allowed." }, 405);
    }

    const url = new URL(request.url);

    if (url.pathname === "/send-seller-onboarding") {
      return handleSellerOnboarding(request, env);
    }

    return json({ ok: false, message: "Unknown endpoint." }, 404);
  },
};

async function handleSellerOnboarding(request, env) {
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

  if (!env.EMAIL) {
    return json({ ok: false, message: "Email binding not configured." }, 503);
  }

  const { email, contactName, productName, sellerToken } = data;
  const from = "noreply@mojoaistudio.com";
  const subject = "Complete Your Seller Setup — Mojo AI Studio";
  const onboardingUrl = `https://mojoaistudio.com/products/pages/seller-onboarding.html?email=${encodeURIComponent(email)}&token=${encodeURIComponent(sellerToken)}`;

  const body = [
    `Hi ${contactName},`,
    ``,
    `Thanks for submitting "${productName}" to the Mojo AI Studio marketplace!`,
    ``,
    `To complete your seller setup and start receiving payments, please sign the seller agreement and provide your bank information:`,
    ``,
    onboardingUrl,
    ``,
    `What happens next:`,
    `1. Review and sign the seller agreement`,
    `2. Provide your bank details (encrypted and secure)`,
    `3. We'll send a small test deposit to verify your account`,
    `4. Once verified, you'll start earning 90% commission on product sales`,
    ``,
    `If you have any questions, reply to this email or contact us at admin@MojoAiStudio.com.`,
    ``,
    `— Mojo AI Studio Team`,
    `https://MojoAiStudio.com`,
  ].join("\r\n");

  const mime = [
    `From: Mojo AI Studio <${from}>`,
    `To: ${contactName} <${email}>`,
    `Reply-To: admin@mojoaistudio.com`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  const encoded = new TextEncoder().encode(mime);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoded);
      controller.close();
    },
  });

  try {
    const message = new EmailMessage(from, email, stream);
    await env.EMAIL.send(message);
  } catch (err) {
    console.error("[email-worker] send failed:", err);
    return json({ ok: false, message: "Failed to send email: " + err.message }, 500);
  }

  return json({ ok: true });
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
