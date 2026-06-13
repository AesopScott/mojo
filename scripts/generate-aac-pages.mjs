#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const ENV_PATH = path.join(ROOT, ".env");
const ENDPOINT = process.env.MOJO_MEETUP_ADMIN_ENDPOINT || "https://mojoaistudio.com/api/meetup-admin";
const DEFAULT_SOURCE_IMAGE = "G:/My Drive/Aesop Academy/Obsidian/Advanced_AI_Concepts_Build/advancedaiconcepts2.png";
const OUT_DIR = path.join(ROOT, "watch");
const ASSET_DIR = path.join(ROOT, "assets", "advanced-ai-concepts");
const FALLBACK_HERO_IMAGE = path.join(ASSET_DIR, "hero.jpg");
const FALLBACK_OG_IMAGE = path.join(ASSET_DIR, "og-hub.jpg");
const GLOBAL_ACTIVITY_GROUP = "advanced-ai-concepts-global-london";

const cities = [
  { city: "Colorado Springs/Denver", state: "CO", slug: "colorado-springs", urlname: "advanced-ai-concepts" },
  { city: "Dallas-Fort Worth", state: "TX", slug: "dallas", urlname: "advanced-ai-concepts-dallas" },
  { city: "San Francisco", state: "CA", slug: "san-francisco", urlname: "advanced-ai-concepts-san-francisco" },
  { city: "Chicago", state: "IL", slug: "chicago", urlname: "advanced-ai-concepts-chicago" },
  { city: "Los Angeles", state: "CA", slug: "los-angeles", urlname: "advanced-ai-concepts-los-angeles" },
  { city: "New York", state: "NY", slug: "new-york", urlname: "advanced-ai-concepts-new-york" },
  { city: "Boston", state: "MA", slug: "boston", urlname: "advanced-ai-concepts-boston" },
  { city: "Miami", state: "FL", slug: "miami", urlname: "advanced-ai-concepts-miami" },
  { city: "Atlanta", state: "GA", slug: "atlanta", urlname: "advanced-ai-concepts-atlanta" },
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

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function eventPhotoUrl(chapters) {
  return chapters
    .flatMap((chapter) => chapter.events)
    .map((event) => event.featuredEventPhoto?.standardUrl || event.featuredEventPhoto?.baseUrl || "")
    .find(Boolean);
}

async function fetchImageBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch image ${url}: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function imageSourceFrom(value) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    return fetchImageBuffer(value);
  }
  return path.resolve(ROOT, value);
}

async function resolveHeroImageSource(env, chapters) {
  const candidates = [
    env.AAC_HERO_IMAGE_URL,
    env.AAC_SOURCE_IMAGE,
    DEFAULT_SOURCE_IMAGE,
    eventPhotoUrl(chapters),
    FALLBACK_HERO_IMAGE,
    FALLBACK_OG_IMAGE,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (/^https?:\/\//i.test(candidate)) {
      try {
        return await imageSourceFrom(candidate);
      } catch {
        continue;
      }
    }

    const sourcePath = path.resolve(ROOT, candidate);
    if (await pathExists(sourcePath)) {
      return sourcePath;
    }
  }

  throw new Error("No usable hero image source found.");
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

function activityDateFromSource(dateTime, daysToAdd = 0) {
  const match = String(dateTime).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function timeZoneOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const localAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  return localAsUtc - date.getTime();
}

function mountainTimeToUtc(dateTime, daysToAdd, hour) {
  const match = String(dateTime).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  const localDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + daysToAdd, hour, 0, 0));
  const timeZone = "America/Denver";
  let utcDate = new Date(localDate.getTime() - timeZoneOffsetMs(localDate, timeZone));
  utcDate = new Date(localDate.getTime() - timeZoneOffsetMs(utcDate, timeZone));
  return utcDate;
}

function gmtActivityTimeLabel(dateTime, daysToAdd, hour) {
  const utcDate = mountainTimeToUtc(dateTime, daysToAdd, hour);
  if (!utcDate) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(utcDate).replace(/\s([AP]M)$/, " $1 GMT");
}

function activityDateLabel(event, pairedEvent) {
  const isGlobal = /^Global\s*-\s*/i.test(event.title || "");
  const sourceEvent = isGlobal && pairedEvent ? pairedEvent : event;
  const daysToAdd = isGlobal ? 2 : 0;
  const hour = isGlobal ? 8 : 18;
  const dayLabel = activityDateFromSource(sourceEvent.dateTime, daysToAdd);
  if (!dayLabel) return eventDateLabel(event.dateTime).replace("local time", "Mountain time");
  const gmtLabel = gmtActivityTimeLabel(sourceEvent.dateTime, daysToAdd, hour);
  return `${dayLabel}, ${isGlobal ? "8:00 AM" : "6:00 PM"} Mountain${gmtLabel ? ` / ${gmtLabel}` : ""}`;
}

function jsonLdScript(data) {
  return `    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>\n`;
}

function pageShell({ title, description, canonical, image, body, active = "", schema = [] }) {
  const imageType = image.endsWith(".png") ? "image/png" : "image/jpeg";
  const schemaMarkup = schema.map(jsonLdScript).join("");
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
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta name="theme-color" content="#0f0f1a" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Mojo AI Studio" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
${schemaMarkup}
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
          <a href="/buy/">Buy</a>
          <a href="/sell">Sell</a>
          <a href="/request/">Request</a>
          <a href="/learn/" class="${active}">Learn</a>
        </div>
        <div class="nav-actions">
          <a class="button dark" href="/learn/#events">Join on Meetup</a>
        </div>
      </nav>
      ${body}
    </header>
  </body>
</html>
`;
}

function eventSchema(chapter, event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.dateTime,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: event.eventUrl,
    location: {
      "@type": "VirtualLocation",
      url: event.eventUrl,
    },
    image: event.featuredEventPhoto?.standardUrl ? [event.featuredEventPhoto.standardUrl] : undefined,
    description: `${event.title} is an Advanced AI Concepts live online session for builders in ${chapter.city}. Each event is limited to 100 people.`,
    maximumAttendeeCapacity: 100,
    organizer: {
      "@type": "Organization",
      name: "Mojo AI Studio",
      url: "https://mojoaistudio.com/",
    },
  };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
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

function activityTopicKey(title) {
  return String(title || "")
    .replace(/^Global\s*-\s*/i, "")
    .trim()
    .toLowerCase();
}

function eventStateClass(event) {
  const date = String(event?.dateTime || "").slice(0, 10);
  const topic = activityTopicKey(event?.title);
  if (topic === "building your own ai command center" && date === "2026-06-05") {
    return " aac-event-complete";
  }
  if (date === "2026-06-07") {
    return " aac-event-today";
  }
  return "";
}

function zoomEventLinksMarkup(events, globalEvents = []) {
  const globalByTopic = new Map();
  for (const event of globalEvents) {
    const key = activityTopicKey(event.title);
    if (key && !globalByTopic.has(key)) {
      globalByTopic.set(key, event);
    }
  }

  const activityEvents = [];
  for (const event of events.slice(0, 4)) {
    activityEvents.push({ event });
    const globalEvent = globalByTopic.get(activityTopicKey(event.title));
    if (globalEvent) {
      activityEvents.push({ event: globalEvent, pairedEvent: event });
    }
  }

  return activityEvents.map(({ event, pairedEvent }) => {
    const zoomUrl = event.howToFindUs || event.eventUrl;
    return `
              <a class="aac-zoom-event${eventStateClass(event)}" href="${escapeHtml(zoomUrl)}" target="_blank" rel="noopener">
                <span><b>${escapeHtml(event.title)}</b> ${escapeHtml(activityDateLabel(event, pairedEvent))}</span>
                <small>${escapeHtml(zoomUrl)}</small>
              </a>`;
  }).join("");
}

function recordingsMarkup() {
  return `
          <div class="aac-recordings">
            <span>Session recordings</span>
            <a href="https://us06web.zoom.us/rec/share/Be-tkkt7nadoAoMrBl5WBIFOdfuHRY8fI7c7Hni1KGhpri8VPLDsLjAc4pexCH4.y3bftOMF4mx-Hs20" target="_blank" rel="noopener">
              <b>Building Your Own AI Command Center</b>
            </a>
            <a href="https://us06web.zoom.us/rec/share/eay0cCULgT5ganhf0ahMxF3-wgPUSB5RHfIFI5S4y3IGJn5jF6aMRjYqSmVNYJGs.GENlUuiS2tTY7mnB" target="_blank" rel="noopener">
              <b>Memory Optimization</b>
            </a>
            <a href="/assets/advanced-ai-concepts/optimizing-ai-memory.zip" download>
              <b>Optimizing AI Memory.zip</b>
            </a>
          </div>`;
}

function hubPage(chapters, globalEvents) {
  const homeEvents = chapters[0]?.events || [];
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
          <div class="aac-group-leaders" data-group-leaders hidden>
            <span>Top member cities</span>
            <div data-group-leader-list></div>
          </div>
          ${recordingsMarkup()}
        </div>
        <div class="aac-hero-media">
          <img src="/assets/advanced-ai-concepts/hero.jpg" alt="People watching an advanced AI visualization in a workshop" />
          <div class="aac-host-card">
            <p>Hosted by Scott for builders who want to understand the systems behind modern AI products.</p>
            <img class="scott-avatar" src="/assets/scott-avatars/thinking-up.png" alt="Thoughtful Advanced AI Concepts host" />
          </div>
          <div class="aac-stats" id="aac-stats" hidden>
            <span><b data-stat-week></b> visitors this week</span>
            <span><b data-stat-day></b> today</span>
          </div>
          <div class="aac-zoom-status" id="aac-zoom-status">
            <div class="aac-zoom-status-head">
              <span>Registration activity</span>
              <b>Upcoming sessions</b>
            </div>
            <div class="aac-zoom-metrics">
              <span><b data-meetup-rsvps>0</b> RSVP count</span>
            </div>
            <div class="aac-zoom-feed">
              ${zoomEventLinksMarkup(homeEvents, globalEvents)}
            </div>
          </div>
        </div>
      </section>
    </header>
    <div class="aac-session-separator" aria-hidden="true">
      <span></span>
      <i></i>
      <span></span>
    </div>
    <main>
      <section class="section aac-build-difference" aria-labelledby="aac-build-difference-title">
        <div>
          <p class="kicker">How we teach</p>
          <h2 id="aac-build-difference-title">We build the technology in front of you.</h2>
        </div>
        <div class="aac-build-copy">
          <p>Most AI learning platforms talk about the technology after the fact. Advanced AI Concepts is different: Scott builds real command centers, memory systems, agentic pipelines, and orchestration flows live while you watch the decisions happen.</p>
          <p>You can ask why a tool was chosen, how the pieces connect, what broke, and how to adapt the pattern for your own product, team, or workflow.</p>
        </div>
        <div class="aac-build-points" aria-label="Advanced AI Concepts teaching approach">
          <span><b>Watch it take shape</b> See the architecture, prompts, automations, and tradeoffs as they are built.</span>
          <span><b>Ask from your use case</b> Bring your own project questions while the system is still on the table.</span>
          <span><b>Leave with a build path</b> Understand the next steps for building your own version, not just the vocabulary.</span>
        </div>
      </section>
      <section class="section aac-section" id="events">
        <div class="aac-section-heading">
          <p class="kicker">Upcoming sessions</p>
          <h2>Same live sessions, shared across every city.</h2>
          <p>Each event is limited to 100 people.</p>
        </div>
        <div class="aac-city-session-picker">
          <label for="aac-session-city">City</label>
          <select id="aac-session-city" data-city-select>
            ${chapters.map((chapter, index) => `
            <option value="${escapeHtml(chapter.slug)}" data-urlname="${escapeHtml(chapter.urlname)}" data-group-url="${escapeHtml(chapter.meetupUrl)}"${index === 0 ? " selected" : ""}>${escapeHtml(chapter.city)}</option>`).join("")}
          </select>
        </div>
        <div class="aac-city-group-card">
          <p>Join the local Meetup group, then RSVP for an upcoming session. Each event is limited to 100 people.</p>
          <a class="button dark" data-city-group-link href="${escapeHtml(chapters[0]?.meetupUrl || "https://www.meetup.com/advanced-ai-concepts/")}" target="_blank" rel="noopener">Join the ${escapeHtml(chapters[0]?.city || "selected city")} group</a>
        </div>
        <div class="aac-event-list" data-city-events>
          ${chapters.map((chapter, index) => chapter.events.map((event) => `
          <a class="aac-row-card aac-session-card${eventStateClass(event)}" data-city="${escapeHtml(chapter.slug)}" href="${escapeHtml(event.eventUrl)}" target="_blank" rel="noopener"${index === 0 ? "" : " hidden"}>
            <span>${escapeHtml(eventDateLabel(event.dateTime))}</span>
            <p>${escapeHtml(event.title)}</p>
            <strong>RSVP</strong>
          </a>`).join("")).join("")}
        </div>
        <script>
          (() => {
            const select = document.querySelector("[data-city-select]");
            const groupLink = document.querySelector("[data-city-group-link]");
            const cards = [...document.querySelectorAll("[data-city-events] [data-city]")];
            const chapterSlugs = ${JSON.stringify(Object.fromEntries(chapters.map((chapter) => [chapter.urlname, chapter.slug])))};
            if (!select || !cards.length) return;
            const syncCity = () => {
              const selected = select.selectedOptions[0];
              if (groupLink && selected) {
                groupLink.href = selected.dataset.groupUrl || groupLink.href;
                groupLink.textContent = "Join the " + selected.textContent + " group";
              }
              cards.forEach((card) => {
                card.hidden = card.dataset.city !== select.value;
              });
            };
            const renderCityOptions = (groups) => {
              if (!Array.isArray(groups) || !groups.length) return;
              const currentUrlname = select.selectedOptions[0]?.dataset.urlname || "";
              select.innerHTML = groups.map((group) => {
                const urlname = String(group.urlname || "");
                const value = chapterSlugs[urlname] || urlname;
                const label = String(group.city || "Meetup").replace("Washington, DC", "Washington,\\u00a0DC");
                const link = String(group.link || (urlname ? "https://www.meetup.com/" + urlname + "/" : ""));
                const option = document.createElement("option");
                option.value = value;
                option.dataset.urlname = urlname;
                option.dataset.groupUrl = link;
                option.textContent = label;
                if (urlname === currentUrlname) option.selected = true;
                return option.outerHTML;
              }).join("");
              syncCity();
            };
            fetch('/api/meetup-group-leaders?limit=100')
              .then((response) => response.ok ? response.json() : null)
              .then((data) => {
                if (data && data.ok) renderCityOptions(data.groups);
              })
              .catch(() => {});
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
        <a href="/learn/">Learn to build AI</a>
        <a href="/development">Custom development</a>
      </div>
    </footer>`;

  return pageShell({
    title: "Advanced AI Concepts | Mojo AI Studio",
    description: "Advanced AI Concepts meetup chapters and upcoming live sessions for builders exploring agents, memory, command centers, and AI systems.",
    canonical: "https://mojoaistudio.com/learn/",
    image: "https://mojoaistudio.com/assets/advanced-ai-concepts/og-hub.jpg",
    active: "active",
    body,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Advanced AI Concepts",
        url: "https://mojoaistudio.com/learn/",
        description: "Advanced AI Concepts meetup chapters and upcoming live sessions for builders exploring agents, memory, command centers, and AI systems.",
        isPartOf: {
          "@type": "WebSite",
          name: "Mojo AI Studio",
          url: "https://mojoaistudio.com/",
        },
      },
      breadcrumbSchema([
        { name: "Mojo AI Studio", url: "https://mojoaistudio.com/" },
        { name: "Advanced AI Concepts", url: "https://mojoaistudio.com/learn/" },
      ]),
    ],
  }).replace("</body>", `    <script>
      fetch('/api/analytics')
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(data) {
          if (!data || !data.ok) return;
          var el = document.getElementById('aac-stats');
          if (!el) return;
          el.querySelector('[data-stat-week]').textContent = data.week.toLocaleString();
          el.querySelector('[data-stat-day]').textContent = data.day.toLocaleString();
          el.hidden = false;
        })
        .catch(function() {});

      (function() {
        var panel = document.getElementById('aac-zoom-status');
        var leaders = document.querySelector('[data-group-leaders]');
        var leaderList = document.querySelector('[data-group-leader-list]');

        var rsvps = panel ? panel.querySelector('[data-meetup-rsvps]') : null;

        function setText(el, value) {
          if (el) el.textContent = value;
        }

        function loadRsvpCount() {
          fetch('/api/meetup-rsvp-count')
            .then(function(r) { return r.ok ? r.json() : null; })
            .then(function(data) {
              if (!data || !data.ok) return;
              setText(rsvps, Number(data.count || 0).toLocaleString());
              panel.hidden = false;
            })
            .catch(function() {});
        }

        function loadGroupLeaders() {
          if (!leaders || !leaderList) return;
          fetch('/api/meetup-group-leaders?limit=20')
            .then(function(r) { return r.ok ? r.json() : null; })
            .then(function(data) {
              if (!data || !data.ok || !Array.isArray(data.groups)) return;
              leaderList.innerHTML = data.groups.map(function(group) {
                var item = document.createElement('span');
                var city = document.createElement('b');
                var count = document.createElement('small');
                city.textContent = String(group.city || 'Meetup').replace('Washington, DC', 'Washington,' + String.fromCharCode(160) + 'DC');
                count.textContent = Number(group.members || 0).toLocaleString() + ' members';
                item.appendChild(city);
                item.appendChild(count);
                return item.outerHTML;
              }).join('');
              leaders.hidden = data.groups.length === 0;
            })
            .catch(function() {});
        }

        loadRsvpCount();
        loadGroupLeaders();
        window.setInterval(loadRsvpCount, 300000);
        window.setInterval(loadGroupLeaders, 3600000);
      })();
    </script>
  </body>`);
}

function cityPage(chapter) {
  const description = `Join Advanced AI Concepts in ${chapter.city}. Live online sessions for builders exploring agents, memory, command centers, and advanced AI systems.`;
  const body = `
      <section class="aac-city-hero">
        <div>
          <p class="kicker">Advanced AI Concepts</p>
          <h1>${escapeHtml(chapter.city)}</h1>
          <p>${escapeHtml(description)} Events are capped at 100 people and shared through the local Meetup group.</p>
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
          <p>Each event is limited to 100 people.</p>
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
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Advanced AI Concepts ${chapter.city}`,
        url: `https://mojoaistudio.com/watch/${chapter.slug}/`,
        description,
        isPartOf: {
          "@type": "WebSite",
          name: "Mojo AI Studio",
          url: "https://mojoaistudio.com/",
        },
      },
      breadcrumbSchema([
        { name: "Mojo AI Studio", url: "https://mojoaistudio.com/" },
        { name: "Advanced AI Concepts", url: "https://mojoaistudio.com/watch/" },
        { name: chapter.city, url: `https://mojoaistudio.com/watch/${chapter.slug}/` },
      ]),
      ...chapter.events.map((event) => eventSchema(chapter, event)),
    ],
  });
}

function ogSvg({ city, state, events }) {
  const eventLines = events.slice(0, 2).map((event, index) => {
    const y = 428 + index * 52;
    return `<text x="82" y="${y}" fill="#ffffff" font-size="30" font-weight="700">${escapeHtml(eventMonthDay(event.dateTime))} - ${escapeHtml(event.title)}</text>`;
  }).join("");
  const chapterLine = /chapters/i.test(state) ? state : `${state} chapter`;

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
  <text x="76" y="322" fill="#dbeafe" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="800">${escapeHtml(chapterLine)}</text>
  <text x="76" y="384" fill="#b8c7df" font-family="Inter, Arial, sans-serif" font-size="29" font-weight="600">Upcoming live online sessions</text>
  ${eventLines}
  <text x="76" y="570" fill="#e0f2fe" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="800">mojoaistudio.com/watch/${escapeHtml(city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))}</text>
</svg>`;
}

async function generateOgImage(sourceImage, chapter, filename) {
  const overlay = Buffer.from(ogSvg(chapter));
  await sharp(sourceImage)
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

  const globalPayload = await callAdmin(env.MEETUP_ADMIN_KEY, { action: "events", urlname: GLOBAL_ACTIVITY_GROUP });
  const globalGroup = globalPayload.result.response.data.groupByUrlname;
  const globalEvents = globalGroup.events.edges
    .map((edge) => edge.node)
    .filter((event) => event.status === "ACTIVE" && /^Global\s*-\s*/i.test(event.title))
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const heroSource = await resolveHeroImageSource(env, chapters);
  await sharp(heroSource)
    .resize(1600, 880, { fit: "cover", position: "center" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(ASSET_DIR, "hero.jpg"));

  await generateOgImage(heroSource, {
    city: "Advanced AI Concepts",
    state: "Over 20 city chapters",
    events: chapters[0].events,
  }, "og-hub.jpg");

  for (const chapter of chapters) {
    await generateOgImage(heroSource, chapter, `og-${chapter.slug}.jpg`);
    const cityDir = path.join(OUT_DIR, chapter.slug);
    await fs.mkdir(cityDir, { recursive: true });
    await fs.writeFile(path.join(cityDir, "index.html"), cityPage(chapter));
  }

  await fs.writeFile(path.join(OUT_DIR, "index.html"), hubPage(chapters, globalEvents));
  console.log(JSON.stringify({
    ok: true,
    city_count: chapters.length,
    event_count: chapters.reduce((sum, chapter) => sum + chapter.events.length, 0),
    global_activity_count: globalEvents.length,
  }));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
