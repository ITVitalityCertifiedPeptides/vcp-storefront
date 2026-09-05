// Mints or clears this app's GLP-1 session cookie (see lib/session.ts).
// Called by account/page.tsx right after swell-js reports a successful
// login, account creation, or an already-active browser session - never
// trusted blindly: verifyAccountExists() re-checks the claimed
// accountId/email against Swell's Backend API before signing anything,
// so a visitor can't just POST an arbitrary id and get a valid cookie.
//
// 2026-09-05: any real Swell account unlocks GLP-1 access instantly -
// there's no approval queue to check here, unlike Inner Circle's/
// Wholesale's equivalent routes.

import { signSession, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/session";
import { verifyAccountExists } from "@/lib/swell-account-verify";

export async function POST(request: Request) {
  let accountId = "";
  let email = "";
  try {
    const body = (await request.json()) as { accountId?: string; email?: string };
    accountId = (body.accountId || "").trim();
    email = (body.email || "").trim();
  } catch {
    // fall through to validation
  }

  if (!accountId || !email) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const exists = await verifyAccountExists(accountId, email);
  if (!exists) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const token = await signSession({ sub: accountId, email });
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Lax`
  );
  return response;
}

export async function DELETE() {
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
  );
  return response;
}
