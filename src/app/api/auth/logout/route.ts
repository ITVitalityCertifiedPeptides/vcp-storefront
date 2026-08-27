// Clears our researcher-gate session cookie. Does NOT touch the separate
// swell-js account session (cart/orders) - the /login page logs into both
// on sign-in, so the account page's own "Sign out" (swell.account.logout())
// handles that side; this route just needs calling alongside it to fully
// sign out of both. See src/lib/session.ts for why there are two sessions.

import { SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
  );
  return response;
}
