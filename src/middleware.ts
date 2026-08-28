// Researcher-gate (2026-08-28, revised per Josh): the catalog is public -
// product/category pages, descriptions, CAS numbers, COAs, lab results,
// and search all serve their research/reference value to anyone, signed
// in or not, which keeps the site indexable and useful as a reference.
// What actually requires an approved account is BUYING: seeing a real
// price and putting something in a cart. That's enforced two ways:
//   1. Here: /cart and /checkout hard-redirect to /login if not approved,
//      as a backstop.
//   2. In the pages themselves: ProductCard and BuyBox never render a
//      price or an Add to Cart control for an unapproved visitor - they
//      show "Sign in to see pricing" instead (see filterVisible() in
//      catalog-shared.ts, and the `approved` prop threaded through the
//      product-listing pages and components).
// A small number of individual products can also be hidden ENTIRELY
// (not just their price) via the per-product "Researcher Only" flag in
// Swell - that's handled in products/[slug]/page.tsx (redirects if
// !approved) and filterVisible() (removes it from every listing/search/
// related-products/header-search for anyone not approved), not here -
// checking that flag per-request in middleware would mean a Swell lookup
// on every catalog page view.
//
// (Earlier version of this file gated the whole catalog - see git history
// / claude/Researcher Gate - Build Notes.md for that design and why it
// changed.)

import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

const GATED_PREFIXES = ["/cart", "/checkout"];

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
  matcher: ["/cart/:path*", "/checkout/:path*"],
};
