// Researcher login (2026-08-27). Verifies credentials against Swell
// server-to-server (never trusts a client-supplied group), then mints our
// own signed session cookie so middleware can gate pages without an extra
// network round trip on every request. See src/lib/session.ts and
// src/lib/swell-accounts.ts for the design rationale.

import { verifyLogin, toSessionGroup } from "@/lib/swell-accounts";
import { signSession, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/session";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim();
  const password = body.password || "";
  if (!email || !password) {
    return Response.json({ ok: false, error: "Enter your email and password." }, { status: 400 });
  }

  const result = await verifyLogin(email, password);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 401 });
  }

  const group = toSessionGroup(result.account.group);

  if (group === "pending") {
    // Correct credentials, but not approved yet - don't set a session
    // cookie. The login page sends them to /pending-approval instead.
    return Response.json({ ok: true, pending: true });
  }

  const token = await signSession({ sub: result.account.id, email: result.account.email, group });

  // Secure is dropped in local dev (plain http://localhost) so the cookie
  // still gets set when testing; Vercel's production/preview deploys are
  // always https, where this is always on.
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const response = Response.json({ ok: true, pending: false, group });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Lax${secure}`
  );
  return response;
}
