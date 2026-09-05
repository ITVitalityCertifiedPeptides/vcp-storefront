// Signs and verifies retail's GLP-1 login-gate cookie.
//
// 2026-09-05 (Josh: "we do want to sell the GLP class of peptides but we
// do not want them visible until you login... after someone has created
// an account"): unlike Inner Circle's and Wholesale's own session.ts
// (see ff-app/src/lib/session.ts), this app has no group or approval
// concept at all - creating a Swell account is instant, full access to
// every GLP-1 product. This file only answers one question: does the
// visitor have a valid, signed cookie proving a real Swell account was
// checked server-side (see swell-account-verify.ts + the /api/session
// route that mints this).
//
// Same reasons as ff-app's session.ts for NOT reusing swell-js's own
// session (its cookie format/forwarding behavior in a Next.js server
// context has never been verified live for this app) and for using Web
// Crypto (crypto.subtle) instead of Node's `crypto` module or a JWT
// library (works unmodified on the Edge runtime or Node).
//
// Requires SESSION_SECRET in Vercel (any long random string, e.g.
// `openssl rand -base64 32`) - a NEW, retail-only secret. Never reuse
// Inner Circle's or Wholesale's SESSION_SECRET, and never expose this as
// NEXT_PUBLIC_*.
//
// NOTE: deliberately NOT using `import "server-only"`, matching ff-app's
// session.ts - this file is imported both by the /api/session route
// handler and, conditionally, by the GLP-1 product page (a Server
// Component) via current-session.ts.

export type SessionPayload = {
  sub: string; // Swell account id
  email: string;
  exp: number; // unix seconds
};

const SESSION_COOKIE = "vcp_glp1_session";
// 30 days, not Inner Circle's 24h: there's no approval status here that
// can change out from under a signed-in visitor, so there's no reason to
// force a re-login more than roughly once a month. Refreshed on every
// sign-in (see account/page.tsx).
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

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

export async function signSession(data: { sub: string; email: string }): Promise<string> {
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
