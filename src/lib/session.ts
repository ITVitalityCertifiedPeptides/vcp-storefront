// Signs and verifies our own session cookie for the researcher-gate login
// system (2026-08-27). Deliberately NOT reusing Swell's own session
// mechanism - swell-js's account.login() session is designed for
// browser-side use, and its cookie format/forwarding behavior in a Next.js
// server context (middleware, server components) isn't something we could
// verify live this session. Minting our own signed cookie, after verifying
// the credentials against Swell server-to-server, sidesteps that: we fully
// control the format and can check it synchronously in middleware on every
// request without an extra network round trip.
//
// Uses Web Crypto (crypto.subtle) rather than Node's `crypto` module or a
// JWT library so this works unmodified whether middleware ends up running
// on the Edge runtime or Node - both support Web Crypto.
//
// Requires SESSION_SECRET in Vercel (any long random string - e.g.
// `openssl rand -base64 32`). Never expose it as NEXT_PUBLIC_*.

import "server-only";

export type SessionGroup = "pending" | "researcher" | "friends-family";

export type SessionPayload = {
  sub: string; // Swell account id
  email: string;
  group: SessionGroup;
  exp: number; // unix seconds
};

const SESSION_COOKIE = "vcp_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24h - short enough that a staff
// approval (group change in Swell) is reflected within a day even if the
// customer doesn't explicitly log out/in. See "Known limitations" in
// claude/Researcher Gate - Build Notes.md for the tradeoff.

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  const enc = new TextEncoder().encode(secret);
  return crypto.subtle.importKey("raw", enc, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signSession(data: { sub: string; email: string; group: SessionGroup }): Promise<string> {
  const payload: SessionPayload = { ...data, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const payloadB64 = base64UrlEncode(payloadBytes);
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigB64 = base64UrlEncode(new Uint8Array(sig));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(sigB64) as BufferSource,
      new TextEncoder().encode(payloadB64)
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_TTL_SECONDS };
