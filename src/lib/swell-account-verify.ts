// Server-to-server check that an account id/email pair the client claims
// (from swell-js's own login()/create()/get() response) is a real Swell
// account, before this app signs a GLP-1 session cookie for it. Without
// this, /api/session would sign a valid cookie for any accountId a
// visitor's browser cared to POST, whether or not they'd actually ever
// created an account.
//
// Same Swell Backend API auth pattern as ff-app's / wholesale-app's
// swell-accounts.ts (Basic auth with SWELL_SECRET_KEY - already
// configured in this app's Vercel env for the order-paid webhook and the
// subscribe route, see src/app/api/webhooks/swell-order-paid/route.ts
// and src/app/api/subscribe/route.ts).

import "server-only";

function swellAuthHeader() {
  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID;
  const secretKey = process.env.SWELL_SECRET_KEY;
  if (!storeId || !secretKey) {
    throw new Error("SWELL_SECRET_KEY / NEXT_PUBLIC_SWELL_STORE_ID not configured");
  }
  return "Basic " + Buffer.from(`${storeId}:${secretKey}`).toString("base64");
}

export async function verifyAccountExists(accountId: string, email: string): Promise<boolean> {
  if (!accountId || !email) return false;
  const res = await fetch(`https://api.swell.store/accounts/${encodeURIComponent(accountId)}`, {
    headers: { Authorization: swellAuthHeader() },
  });
  if (!res.ok) return false;
  let account: { id?: string; email?: string } | null = null;
  try {
    account = await res.json();
  } catch {
    return false;
  }
  return (
    !!account?.id &&
    account.id === accountId &&
    !!account.email &&
    account.email.toLowerCase() === email.toLowerCase()
  );
}
