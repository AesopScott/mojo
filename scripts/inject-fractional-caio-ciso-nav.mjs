#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), process.env.MOJO_INJECT_ROOT || "_site");
const SKIP_DIRS = new Set([".git", ".github", ".claude", ".obsidian", ".obsidian-memory", ".wrangler", "node_modules", "tmp"]);
const NAV_LINK = '<a href="/sell/fractional-caio-ciso/">Fractional CAIO/CISO</a>';

async function walk(dir, files = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, files);
    } else if (entry.isFile() && full.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function injectNav(html) {
  if (html.includes(NAV_LINK)) return html;
  return html.replace(
    /(<a href="\/sell">Sell<\/a>\s*)<a href="\/request\/">Request<\/a>/,
    `$1${NAV_LINK}\n        <a href="/request/">Request</a>`,
  );
}

const files = await walk(ROOT);
let changed = 0;

for (const file of files) {
  const original = await fs.readFile(file, "utf8");
  const updated = injectNav(original);
  if (updated !== original) {
    await fs.writeFile(file, updated, "utf8");
    changed += 1;
  }
}

console.log(`Injected nav link into ${changed} file(s).`);
