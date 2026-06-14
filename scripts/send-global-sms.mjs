#!/usr/bin/env node

import fs from "node:fs";
import https from "node:https";
import path from "node:path";

const args = process.argv.slice(2);
const options = {};

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (!arg.startsWith("--")) continue;
  const name = arg.slice(2);
  const next = args[index + 1];
  if (next && !next.startsWith("--")) {
    options[name] = next;
    index += 1;
  } else {
    options[name] = true;
  }
}

const groupUrlname = String(options.group || options.groupUrlname || "").trim();
const message = String(options.message || options.body || "").trim();
const endpoint = String(options.endpoint || "https://mojoaistudio-com.pages.dev/api/meetup-admin").trim();
const shouldSend = Boolean(options.send || options.confirm);

if (!message) {
  console.error("Usage:");
  console.error("  node scripts/send-global-sms.mjs --message \"Your message\"");
  console.error("  node scripts/send-global-sms.mjs --message \"Your message\" --send");
  console.error("  node scripts/send-global-sms.mjs --group advanced-ai-concepts-dallas --message \"Your message\"");
  process.exit(1);
}

const adminKey = findEnvValue("MEETUP_ADMIN_KEY");
if (!adminKey) {
  console.error("MEETUP_ADMIN_KEY was not found in .env or ../.env.");
  process.exit(1);
}

const url = new URL(endpoint);
url.searchParams.set("action", "send-admin-sms");
if (groupUrlname) {
  url.searchParams.set("groupUrlname", groupUrlname);
}
url.searchParams.set("body", message);
url.searchParams.set("admin_key", adminKey);
if (shouldSend) {
  url.searchParams.set("confirm", "send-admin-sms");
}

console.log(shouldSend ? "Sending SMS..." : "Dry run...");
console.log(groupUrlname ? `Group: ${groupUrlname}` : "Scope: all stored public SMS subscribers");
console.log(`Message length: ${message.length}`);

const result = await requestText(url, Number(options.timeout || 15000));
console.log(result.body);

if (result.status < 200 || result.status >= 300) {
  process.exit(1);
}

function requestText(url, timeout) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      family: 4,
      method: "GET",
      timeout,
      headers: {
        "User-Agent": "mojo-sms-admin/1.0",
      },
    }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        resolve({ status: response.statusCode || 0, body });
      });
    });

    request.on("timeout", () => {
      request.destroy(new Error(`Request timed out after ${timeout}ms.`));
    });
    request.on("error", reject);
    request.end();
  });
}

function findEnvValue(name) {
  const candidates = [
    path.resolve(".env"),
    path.resolve("..", ".env"),
    path.resolve("..", "..", ".env"),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;
    const value = readEnvValue(filePath, name);
    if (value) return value;
  }

  return "";
}

function readEnvValue(filePath, name) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key.trim() !== name) continue;
    return rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
  return "";
}
