#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ENV_PATH = path.join(ROOT, ".env");
const OUT_PATH = path.join(ROOT, "assets", "advanced-ai-concepts", "eventbrite-classes.json");
const EVENTBRITE_API_BASE = "https://www.eventbriteapi.com/v3";

function readEnv(text) {
  const env = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function requireEnv(env, name) {
  const value = String(env[name] || "").trim();
  if (!value) throw new Error(`Missing ${name} in .env.`);
  return value;
}

async function eventbrite(env, route) {
  const response = await fetch(`${EVENTBRITE_API_BASE}${route}`, {
    headers: {
      Authorization: `Bearer ${requireEnv(env, "EVENTBRITE_PRIVATE_TOKEN")}`,
      "Content-Type": "application/json",
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error_description || payload.error || JSON.stringify(payload);
    throw new Error(`Eventbrite GET ${route} failed (${response.status}): ${message}`);
  }
  return payload;
}

function normalizeEvent(event) {
  return {
    id: String(event.id || ""),
    title: String(event.name?.text || event.name?.html || "Advanced AI Concepts class"),
    description: String(event.summary || ""),
    url: String(event.url || ""),
    status: String(event.status || ""),
    online: Boolean(event.online_event),
    capacity: Number(event.capacity || 0),
    start: {
      utc: String(event.start?.utc || ""),
      local: String(event.start?.local || ""),
      timezone: String(event.start?.timezone || "America/Denver"),
    },
    end: {
      utc: String(event.end?.utc || ""),
      local: String(event.end?.local || ""),
      timezone: String(event.end?.timezone || "America/Denver"),
    },
    availability: {
      hasAvailableTickets: Boolean(event.ticket_availability?.has_available_tickets),
      isSoldOut: Boolean(event.ticket_availability?.is_sold_out),
      price: String(event.ticket_availability?.minimum_ticket_price?.display || "Free"),
    },
  };
}

async function main() {
  const env = readEnv(await fs.readFile(ENV_PATH, "utf8"));
  const orgId = requireEnv(env, "EVENTBRITE_ORGANIZATION_ID");
  let continuation = "";
  const allEvents = [];
  do {
    const params = new URLSearchParams({
      status: "live,started",
      order_by: "start_asc",
      expand: "ticket_availability,venue,organizer",
      page_size: "100",
    });
    if (continuation) params.set("continuation", continuation);
    const payload = await eventbrite(env, `/organizations/${orgId}/events/?${params.toString()}`);
    allEvents.push(...(payload.events || []));
    continuation = payload.pagination?.has_more_items && payload.pagination?.continuation
      ? String(payload.pagination.continuation)
      : "";
  } while (continuation);

  const now = Date.now();
  const events = allEvents
    .map(normalizeEvent)
    .filter((event) => {
      const end = Date.parse(event.end.utc || event.end.local);
      const start = Date.parse(event.start.utc || event.start.local);
      return Number.isFinite(end) ? end >= now : Number.isFinite(start) && start >= now;
    })
    .sort((a, b) => Date.parse(a.start.utc || a.start.local) - Date.parse(b.start.utc || b.start.local));

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, `${JSON.stringify({
    ok: true,
    source: "eventbrite",
    refreshedAt: new Date().toISOString(),
    eventCount: events.length,
    events,
  }, null, 2)}\n`);

  console.log(JSON.stringify({ ok: true, eventCount: events.length, out: OUT_PATH }));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
