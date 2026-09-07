// Staff portal sign-in: each staff member has their own username and
// password, all in one Vercel env var so nothing is stored in code:
//
//   STAFF_PORTAL_USERS = jeff:password1, marina:password2, tom:password3
//
// (username, colon, password; commas between people; usernames are
// case-insensitive; a password may not contain a comma). A signed,
// HttpOnly cookie carries the username so every payment they log is
// attributed to them. No Swell account needed for staff.

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const STAFF_COOKIE = "vcp_staff";
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(`staff-portal:${payload}`).digest("base64url");
}

function staffUsers(): Map<string, string> {
  const users = new Map<string, string>();
  for (const entry of (process.env.STAFF_PORTAL_USERS || "").split(",")) {
    const i = entry.indexOf(":");
    if (i <= 0) continue;
    const user = entry.slice(0, i).trim().toLowerCase();
    const pass = entry.slice(i + 1).trim();
    if (user && pass) users.set(user, pass);
  }
  return users;
}

export function staffUsernames(): string[] {
  return [...staffUsers().keys()];
}

// Returns the display name on success, null otherwise.
export function checkStaffLogin(username: string, password: string): string | null {
  const expected = staffUsers().get(username.trim().toLowerCase());
  if (!expected) return null;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const u = username.trim().toLowerCase();
  return u.charAt(0).toUpperCase() + u.slice(1);
}

export function makeStaffToken(name: string): string {
  const payload = Buffer.from(JSON.stringify({ name, exp: Date.now() + TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readStaffToken(token: string | undefined): { name: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { name?: string; exp?: number };
    if (!data.name || !data.exp || data.exp < Date.now()) return null;
    return { name: data.name };
  } catch {
    return null;
  }
}

export async function currentStaff(): Promise<{ name: string } | null> {
  const jar = await cookies();
  return readStaffToken(jar.get(STAFF_COOKIE)?.value);
}
