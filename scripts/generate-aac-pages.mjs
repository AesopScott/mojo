#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ENV_PATH = path.join(ROOT, ".env");
const ENDPOINT = "https://mojoaistudio.com/api/meetup-admin";
const SOURCE_IMAGE = "G:/My Drive/Aesop Academy/Obsidian/Advanced_AI_Concepts_Build/advancedaiconcepts2.png";
const OUT_DIR = path.join(ROOT, "watch");
const ASSET_DIR = path.join(ROOT, "assets", "advanced-ai-concepts");

const cities = [
  { city: "Colorado Springs/Denver", state: "CO", slug: "colorado-springs", urlname: "advanced-ai-concepts" },
  { city: "Dallas", state: "TX", slug: "dallas", urlname: "advanced-ai-concepts-dallas" },
  { city: "San Francisco", state: "CA", slug: "san-francisco", urlname: "advanced-ai-concepts-san-francisco" },
  { city: "Chicago", state: "IL", slug: "chicago", urlname: "advanced-ai-concepts-chicago" },
  { city: "Los Angeles", state: "CA", slug: "los-angeles", urlname: "advanced-ai-concepts-los-angeles" },
  { city: "New York", state: "NY", slug: "new-york", urlname: "advanced-ai-concepts-new-york" },
  { city: "Boston", state: "MA", slug: "boston", urlname: "advanced-ai-concepts-boston" },
  { city: "Miami", state: "FL", slug: "miami", urlname: "advanced-ai-concepts-miami" },
  { city: "Seattle", state: "WA", slug: "seattle", urlname: "advanced-ai-concepts-seattle" },
  { city: "Phoenix", state: "AZ", slug: "phoenix", urlname: "advanced-ai-concepts-phoenix" },
  { city: "Houston", state: "TX", slug: "houston", urlname: "advanced-ai-concepts-houston" },
  { city: "San Antonio", state: "TX", slug: "san-antonio", urlname: "advanced-ai-concepts-san-antonio" },
  { city: "The Triangle", state: "NC", slug: "the-triangle", urlname: "advanced-ai-concepts-the-triangle" },
  { city: "Kansas City", state: "MO", slug: "kansas-city", urlname: "advanced-ai-concepts-kansas-city" },
  { city: "Columbus", state: "OH", slug: "columbus", urlname: "advanced-ai-concepts-columbus" },
  { city: "Philadelphia", state: "PA", slug: "philadelphia", urlname: "advanced-ai-concepts-philadelphia" },
  { city: "Washington, DC", state: "DC", slug: "washington-dc", urlname: "advanced-ai-concepts-washington-dc" },
  { city: "OKC", state: "OK", slug: "okc", urlname: "advanced-ai-concepts-okc" },
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readEnv(text) {
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    env[trimmed.slice(0, index)] = trimmed.slice(index + 1).trim();
  }
  return env;
}

async function callAdmin(adminKey, params) {
  const url = new URL(ENDPOINT);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { headers: { "X-Admin-Key": adminKey } });
  const payload = await response.json();
  if (!response.ok || !payload.ok) {
    throw new Error(`Meetup admin request failed for ${params.urlname || params.action}`);
  }
  return payload;
}

function eventDateLabel(dateTime) {
  const match = String(dateTime).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (match) {
    const [, year, month, day, hourText, minute] = match;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
    const dayLabel = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
    const hour = Number(hourText);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${dayLabel}, ${hour12}:${minute} ${suffix} local time`;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(dateTime));
}

function eventMonthDay(dateTime) {
  const match = String(dateTime).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12)));
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateTime));
}

function pageShell({ title, description, canonical, image, body, active = "" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeHtml(description)}" />
    <title>${escapeHtml(title)}</title>
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#0f0f1a" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Mojo AI Studio" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <link rel="stylesheet" href="/styles/shared.css?v=__CACHE_BUST__" />
  </head>
  <body>
    <header class="site-header aac-header" id="top">
      <nav class="site-nav" aria-label="Primary navigation">
        <a class="brand" href="/" aria-label="Mojo AI Studio home">
          <span class="brand-mark">M</span>
          <span>Mojo AI Studio</span>
        </a>
        <div class="nav-links">
          <a href="/products">Products</a>
          <a href="/development">Development</a>
          <a href="/watch" class="${active}">Learn</a>
        </div>
        <div class="nav-actions">
          <a class="button ghost" href="/watch/#events">Sessions</a>
          <a class="button dark" href="https://www.meetup.com/advanced-ai-concepts/" target="_blank" rel="noopener">Join on Meetup</a>
        </div>
      </nav>
      ${body}
    </header>
  </body>
</html>
`;
}

function eventsMarkup(events) {
  return events.map((event) => `
          <a class="aac-event-card" href="${escapeHtml(event.eventUrl)}" target="_blank" rel="noopener">
            <img src="${escapeHtml(event.featuredEventPhoto?.standardUrl || "/assets/advanced-ai-concepts/og-hub.jpg")}" alt="" />
            <span>${escapeHtml(eventDateLabel(event.dateTime))}</span>
            <h2>${escapeHtml(event.title)}</h2>
            <p>RSVP on Meetup</p>
          </a>`).join("");
}

function hubPage(chapters) {
  const body = `
      <section class="aac-hero">
        <div>
          <p class="kicker">Advanced AI Concepts</p>
          <h1>Practical AI conversations for builders.</h1>
          <p>Join live online sessions about AI command centers, agentic workflows, memory, and the systems behind modern AI products.</p>
          <div class="aac-actions">
            <a class="button dark" href="#events">Find your city</a>
            <a class="button ghost" href="#events">Upcoming events</a>
          </div>
        </div>
        <img src="/assets/advanced-ai-concepts/hero.jpg" alt="People watching an advanced AI visualization in a workshop" />
      </section>
    </header>
    <main>
      <section class="section aac-section" id="events">
        <div class="aac-section-heading">
          <p class="kicker">Upcoming sessions</p>
          <h2>Same live sessions, shared across every city.</h2>
        </div>
        <div class="aac-city-session-picker">
          <label for="aac-session-city">City</label>
          <select id="aac-session-city" data-city-select>
            ${chapters.map((chapter, index) => `
            <option value="${escapeHtml(chapter.slug)}"${index === 0 ? " selected" : ""}>${escapeHtml(chapter.city)}</option>`).join("")}
          </select>
        </div>
        <div class="aac-event-list" data-city-events>
          ${chapters.map((chapter, index) => chapter.events.map((event) => `
          <a class="aac-row-card aac-session-card" data-city="${escapeHtml(chapter.slug)}" href="${escapeHtml(event.eventUrl)}" target="_blank" rel="noopener"${index === 0 ? "" : " hidden"}>
            <span>${escapeHtml(eventDateLabel(event.dateTime))}</span>
            <p>${escapeHtml(event.title)}</p>
            <strong>RSVP</strong>
          </a>`).join("")).join("")}
        </div>
        <script>
          (() => {
            const select = document.querySelector("[data-city-select]");
            const cards = [...document.querySelectorAll("[data-city-events] [data-city]")];
            if (!select || !cards.length) return;
            const syncCity = () => {
              cards.forEach((card) => {
                card.hidden = card.dataset.city !== select.value;
              });
            };
            select.addEventListener("change", syncCity);
            syncCity();
          })();
        </script>
      </section>
    </main>
    <footer class="site-footer">
      <div>
        <a class="brand" href="/"><span class="brand-mark">M</span><span>Mojo AI Studio</span></a>
        <p>Advanced AI Concepts is organized by Mojo AI Studio.</p>
      </div>
      <div>
        <b>Meetups</b>
        <a href="#events">Upcoming events</a>
      </div>
      <div>
        <b>Studio</b>
        <a href="/watch">Learn to build AI</a>
        <a href="/development">Custom development</a>
      </div>
    </footer>`;

  return pageShell({
    title: "Advanced AI Concepts | Mojo AI Studio",
    description: "Advanced AI Concepts meetup chapters and upcoming live sessions for builders exploring agents, memory, command centers, and AI systems.",
    canonical: "https://mojoaistudio.com/watch/",
    image: "https://mojoaistudio.com/assets/advanced-ai-concepts/og-hub.jpg",
    active: "active",
    body,
  });
}

function cityPage(chapter) {
  const description = `Join Advanced AI Concepts in ${chapter.city}. Upcoming live sessions for builders exploring agents, memory, command centers, and advanced AI systems.`;
  const body = `
      <section class="aac-city-hero">
        <div>
          <p class="kicker">Advanced AI Concepts</p>
          <h1>${escapeHtml(chapter.city)}</h1>
          <p>${escapeHtml(description)}</p>
          <div class="aac-actions">
            <a class="button dark" href="${escapeHtml(chapter.meetupUrl)}" target="_blank" rel="noopener">Join the ${escapeHtml(chapter.city)} group</a>
          <a class="button ghost" href="#events">See events</a>
          </div>
        </div>
        <img src="/assets/advanced-ai-concepts/og-${chapter.slug}.jpg" alt="" />
      </section>
    </header>
    <main>
      <section class="section aac-section" id="events">
        <div class="aac-section-heading">
          <p class="kicker">Upcoming events</p>
          <h2>RSVP through Meetup.</h2>
        </div>
        <div class="aac-events-grid">
          ${eventsMarkup(chapter.events)}
        </div>
      </section>
      <section class="section aac-section">
        <a class="aac-back-link" href="/watch/">View all Advanced AI Concepts cities</a>
      </section>
    </main>
    <footer class="site-footer">
      <div>
        <a class="brand" href="/"><span class="brand-mark">M</span><span>Mojo AI Studio</span></a>
        <p>Advanced AI Concepts is organized by Mojo AI Studio.</p>
      </div>
      <div>
        <b>${escapeHtml(chapter.city)}</b>
        <a href="${escapeHtml(chapter.meetupUrl)}" target="_blank" rel="noopener">Meetup group</a>
        <a href="#events">Upcoming events</a>
      </div>
      <div>
        <b>Meetups</b>
        <a href="/watch/">All cities</a>
        <a href="/watch">Learn to build AI</a>
      </div>
    </footer>`;

  return pageShell({
    title: `Advanced AI Concepts ${chapter.city} | Mojo AI Studio`,
    description,
    canonical: `https://mojoaistudio.com/watch/${chapter.slug}/`,
    image: `https://mojoaistudio.com/assets/advanced-ai-concepts/og-${chapter.slug}.jpg`,
    active: "active",
    body,
  });
}

function ogSvg({ city, state, events }) {
  const eventLines = events.slice(0, 2).map((event, index) => {
    const y = 428 + index * 52;
    return `<text x="82" y="${y}" fill="#ffffff" font-size="30" font-weight="700">${escapeHtml(eventMonthDay(event.dateTime))} - ${escapeHtml(event.title)}</text>`;
  }).join("");

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#050914" stop-opacity="0.84"/>
      <stop offset="0.55" stop-color="#06111f" stop-opacity="0.46"/>
      <stop offset="1" stop-color="#080a12" stop-opacity="0.76"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" x2="1">
      <stop offset="0" stop-color="#2dd4bf"/>
      <stop offset="0.34" stop-color="#38bdf8"/>
      <stop offset="0.68" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#veil)"/>
  <rect x="72" y="76" width="186" height="12" rx="6" fill="url(#rule)"/>
  <text x="72" y="148" fill="#d8fbff" font-family="Inter, Arial, sans-serif" font-size="35" font-weight="800" letter-spacing="2">ADVANCED AI CONCEPTS</text>
  <text x="72" y="262" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="92" font-weight="900">${escapeHtml(city)}</text>
  <text x="76" y="322" fill="#dbeafe" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="800">${escapeHtml(state)} chapter</text>
  <text x="76" y="384" fill="#b8c7df" font-family="Inter, Arial, sans-serif" font-size="29" font-weight="600">Upcoming live online sessions</text>
  ${eventLines}
  <text x="76" y="570" fill="#e0f2fe" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="800">mojoaistudio.com/watch/${escapeHtml(city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))}</text>
</svg>`;
}

async function generateOgImage(chapter, filename) {
  const overlay = Buffer.from(ogSvg(chapter));
  await sharp(SOURCE_IMAGE)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ASSET_DIR, filename));
}

async function main() {
  const env = readEnv(await fs.readFile(ENV_PATH, "utf8"));
  if (!env.MEETUP_ADMIN_KEY) throw new Error("MEETUP_ADMIN_KEY is missing.");

  await fs.mkdir(ASSET_DIR, { recursive: true });
  await fs.mkdir(OUT_DIR, { recursive: true });
  await sharp(SOURCE_IMAGE)
    .resize(1600, 880, { fit: "cover", position: "center" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(ASSET_DIR, "hero.jpg"));

  const chapters = [];
  for (const city of cities) {
    const payload = await callAdmin(env.MEETUP_ADMIN_KEY, { action: "events", urlname: city.urlname });
    const group = payload.result.response.data.groupByUrlname;
    const events = group.events.edges
      .map((edge) => edge.node)
      .filter((event) => event.status === "ACTIVE")
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    chapters.push({
      ...city,
      events,
      meetupUrl: group.link || `https://www.meetup.com/${city.urlname}/`,
    });
  }

  await generateOgImage({
    city: "Advanced AI Concepts",
    state: "8 city chapters",
    events: chapters[0].events,
  }, "og-hub.jpg");

  for (const chapter of chapters) {
    await generateOgImage(chapter, `og-${chapter.slug}.jpg`);
    const cityDir = path.join(OUT_DIR, chapter.slug);
    await fs.mkdir(cityDir, { recursive: true });
    await fs.writeFile(path.join(cityDir, "index.html"), cityPage(chapter));
  }

  await fs.writeFile(path.join(OUT_DIR, "index.html"), hubPage(chapters));
  console.log(JSON.stringify({
    ok: true,
    city_count: chapters.length,
    event_count: chapters.reduce((sum, chapter) => sum + chapter.events.length, 0),
  }));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
