// Staff portal sign-in: one shared password (STAFF_PORTAL_PASSWORD) and a
// signed, HttpOnly cookie. No Swell account needed for staff. The cookie
// carries the staff member's display name so every payment they log is
// attributed to them.

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

export function passwordMatches(input: string): boolean {
  const expected = process.env.STAFF_PORTAL_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
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
