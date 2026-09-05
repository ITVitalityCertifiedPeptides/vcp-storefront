// Server-component helper: does this request carry a valid GLP-1
// session cookie (see session.ts)? Used by the GLP-1 product page to
// decide whether to render or redirect to sign-in, and by every listing
// surface (shop, categories, search, homepage) to decide whether to
// call filterVisible() with access or not.

import "server-only";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "./session";

export async function hasGlp1Access(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  return session !== null;
}
