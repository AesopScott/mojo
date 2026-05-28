#!/usr/bin/env node
/**
 * Local Meetup JWT helper.
 *
 * Usage:
 *   node scripts/meetup-jwt-test.mjs token
 *   node scripts/meetup-jwt-test.mjs self
 *
 * Requires .env:
 *   MEETUP_CLIENT_ID=
 *   MEETUP_MEMBER_ID=
 *   MEETUP_SIGNING_KEY_ID=
 *   MEETUP_PRIVATE_KEY_PATH=
 *
 * The private key may also be supplied as MEETUP_PRIVATE_KEY with \n escapes.
 */

import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const tokenEndpoint = "https://secure.meetup.com/oauth2/access";
const graphQLEndpoint = "https://api.meetup.com/gql-ext";

function loadEnv(path = ".env") {
  let text = "";

  try {
    text = readFileSync(path, "utf8");
  } catch {
    return;
  }

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function required(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env first.`);
  }

  return value;
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function maskToken(token) {
  if (!token || token.length <= 12) {
    return token ? "*".repeat(token.length) : token;
  }

  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

function privateKey() {
  if (process.env.MEETUP_PRIVATE_KEY) {
    return process.env.MEETUP_PRIVATE_KEY.replaceAll("\\n", "\n");
  }

  const keyPath = required("MEETUP_PRIVATE_KEY_PATH");
  return readFileSync(resolve(keyPath), "utf8");
}

function signedJwt() {
  const header = {
    kid: required("MEETUP_SIGNING_KEY_ID"),
    typ: "JWT",
    alg: "RS256",
  };
  const payload = {
    iss: required("MEETUP_CLIENT_ID"),
    sub: required("MEETUP_MEMBER_ID"),
    aud: "api.meetup.com",
    exp: Math.floor(Date.now() / 1000) + 120,
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();

  const signature = signer
    .sign(privateKey(), "base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

  return `${signingInput}.${signature}`;
}

async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: signedJwt(),
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const text = await response.text();
  let payload;

  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`Meetup token request failed (${response.status}): ${JSON.stringify(payload)}`);
  }

  return payload;
}

async function querySelf(accessToken) {
  const response = await fetch(graphQLEndpoint, {
    method: "POST",
    headers: {
      Authorization: `bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "query { self { id name } }",
    }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors) {
    throw new Error(`Meetup GraphQL query failed (${response.status}): ${JSON.stringify(payload)}`);
  }

  return payload;
}

loadEnv();

const command = process.argv[2] ?? "";

try {
  if (command === "token") {
    const token = await getAccessToken();
    console.log(JSON.stringify({
      token_type: token.token_type,
      expires_in: token.expires_in,
      access_token: maskToken(token.access_token),
      refresh_token: maskToken(token.refresh_token),
    }, null, 2));
  } else if (command === "self") {
    const token = await getAccessToken();
    const result = await querySelf(token.access_token);
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error("Usage:");
    console.error("  node scripts/meetup-jwt-test.mjs token");
    console.error("  node scripts/meetup-jwt-test.mjs self");
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
