// Researcher-gate: blocks the catalog/pricing/checkout routes from anyone
// without an approved session (2026-08-27, Josh's spec - "gate the whole
// catalog", approved manually per-account in Swell admin).
//
// Only covers routes that actually show product names/prices or let
// someone buy - NOT the whole site. Marketing/compliance pages
// (/, /about, /research, /quality-assurance, /affiliates, legal pages,
// /support, /login, /register, /pending-approval, /account) stay public on
// purpose: that's what keeps them indexable and is where a prospective
// researcher lands before they can see pricing. The homepage additionally
// hides its own product grid client-side when logged out/pending (see
// src/app/page.tsx) rather than being redirected here, so the root domain
// still renders real marketing content instead of bouncing to /login.
//
// Gated: /products, /categories, /search, /cart, /checkout, /coa,
// /lab-results - anywhere a product name or price actually renders.
//
// This only checks our own signed cookie (see src/lib/session.ts), which
// is fast and works on any runtime - it never calls Swell on each request.
// A staff approval in Swell admin (group: pending -> researcher) takes
// effect the next time the visitor logs in, or within 24h since the
// session is short-lived. See "Known limitations" in
// claude/Researcher Gate - Build Notes.md.

import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

const GATED_PREFIXES = [
  "/products",
  "/categories",
  "/search",
  "/cart",
  "/checkout",
  "/coa",
  "/lab-results",
];

function isGated(pathname: string): boolean {
  return GATED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isGated(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  // Fail closed: no session, an expired/tampered one, or a group other
  // than the two approved ones all fall through to the same redirect.
  if (!session || (session.group !== "researcher" && session.group !== "friends-family")) {
    const loginUrl = new URL("/login", request.url);
    const returnTo = pathname + search;
    if (returnTo.startsWith("/") && !returnTo.startsWith("//")) {
      loginUrl.searchParams.set("return", returnTo);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products/:path*",
    "/categories/:path*",
    "/search/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/coa/:path*",
    "/lab-results/:path*",
  ],
};
