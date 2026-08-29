// Server-component helper: reads and verifies the researcher-gate session
// cookie (see session.ts) from the incoming request. Used by server
// components that need to know "is this visitor an approved researcher"
// WITHOUT doing a full redirect - e.g. SiteHeader and the homepage, which
// render different (non-catalog) content for logged-out visitors rather
// than bouncing them to /login the way middleware.ts does for the actual
// catalog/checkout routes.

import "server-only";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE, type SessionPayload } from "./session";

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function isApprovedResearcher(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session && (session.group === "researcher" || session.group === "friends-family");
}

// Friends & Family (2026-08-29): distinct from isApprovedResearcher() above
// - both groups can buy, but only friends-family accounts should see the
// discounted price (friendsFamilyPrice on Product) and the "Friends &
// Family" savings callout on BuyBox/the cart. A plain "researcher" account
// is approved to buy but is NOT friends-family and should see the normal
// retail price.
export async function isFriendsFamily(): Promise<boolean> {
  const session = await getCurrentSession();
  return session?.group === "friends-family";
}
