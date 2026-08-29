// Server-side helpers for the researcher-gate registration/login system
// (2026-08-27), talking to Swell's Backend API with SWELL_SECRET_KEY (same
// auth pattern already used in /api/subscribe).
//
// STATUS (2026-08-29): Both functions confirmed working end to end.
// createPendingAccount() creates accounts that land in Swell as group
// "pending". verifyLogin() was broken until this revision - it was
// calling POST /accounts/login with a JSON body, but Swell's actual
// Backend API login action is GET /accounts/:login with email/password
// as query params (confirmed against developers.swell.is/backend-api/
// accounts). The old call silently got a 200 with an empty body from
// Swell for every login attempt, which read as "wrong password" even
// when it wasn't. Fixed below. See claude/Researcher Gate - Build Notes.md.

import "server-only";
import type { SessionGroup } from "./session";

function swellAuthHeader() {
  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID;
  const secretKey = process.env.SWELL_SECRET_KEY;
  if (!storeId || !secretKey) {
    throw new Error("SWELL_SECRET_KEY / NEXT_PUBLIC_SWELL_STORE_ID not configured");
  }
  return "Basic " + Buffer.from(`${storeId}:${secretKey}`).toString("base64");
}

export type SwellAccount = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  group?: string;
};

export async function createPendingAccount(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<{ ok: true; account: SwellAccount } | { ok: false; error: string }> {
  const res = await fetch("https://api.swell.store/accounts", {
    method: "POST",
    headers: { Authorization: swellAuthHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
      group: "pending",
    }),
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // fall through - body stays null
  }

  // Swell returns HTTP 200 with an `errors` object on validation failure
  // (e.g. email already registered) - see the lesson recorded in
  // claude/Catalog and Pricing Decisions.md. Always check for it.
  const errors = (body as { errors?: Record<string, { message?: string }> } | null)?.errors;
  if (!res.ok || errors) {
    const message = errors ? Object.values(errors)[0]?.message : undefined;
    return { ok: false, error: message || "Could not create account. That email may already be registered." };
  }

  return { ok: true, account: body as SwellAccount };
}

export async function verifyLogin(
  email: string,
  password: string
): Promise<{ ok: true; account: SwellAccount } | { ok: false; error: string }> {
  // Swell's Backend API login action is a GET with email/password as
  // query params, not a POST with a JSON body - see
  // https://developers.swell.is/backend-api/accounts. On a match it
  // returns the account object; on no match it returns JSON `null`.
  const params = new URLSearchParams({ email, password });
  const res = await fetch(`https://api.swell.store/accounts/:login?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: swellAuthHeader() },
  });

  if (!res.ok) {
    return { ok: false, error: "Incorrect email or password." };
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    return { ok: false, error: "Incorrect email or password." };
  }

  const account = body as SwellAccount | null;
  console.log("[verifyLogin]", { email, matched: Boolean(account?.id) });

  if (!account?.id || !account?.email) {
    return { ok: false, error: "Incorrect email or password." };
  }

  return { ok: true, account };
}

// Maps Swell's free-text `group` field to our closed set of session
// groups. Anything unrecognized (including no group at all) is treated as
// "pending" - fail closed, never default a stranger into paid-pricing
// access because of a typo'd group name in Swell.
export function toSessionGroup(swellGroup: string | undefined): SessionGroup {
  if (swellGroup === "researcher" || swellGroup === "friends-family") return swellGroup;
  return "pending";
}
