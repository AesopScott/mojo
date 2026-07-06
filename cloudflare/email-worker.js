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
  const subject = "Complete Your Seller Contract - Mojo AI Studio";
  const onboardingUrl = `https://mojoaistudio.com/products/pages/seller-onboarding.html?email=${encodeURIComponent(email)}&token=${encodeURIComponent(sellerToken)}`;

  const body = [
    `Hi ${contactName},`,
    ``,
    `Thanks for submitting "${productName}" to the Mojo AI Studio marketplace!`,
    ``,
    `Your product has been approved for seller onboarding. Please review and sign the seller agreement here:`,
    ``,
    onboardingUrl,
    ``,
    `What happens next:`,
    `1. If the listing fee was not waived, choose PayPal or Zelle and submit your $100 payment details`,
    `2. After Mojo verifies the fee payment, review and sign the seller agreement`,
    `3. Choose a payout method such as PayPal, Zelle, Venmo, Cash App, mailed check, or another option`,
    `4. Mojo sends your seller portal link so you can finish product details and launch setup`,
    `5. Mojo creates and syncs the Polar checkout product under the Mojo account`,
    `6. Buyers purchase through the Mojo marketplace checkout`,
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
