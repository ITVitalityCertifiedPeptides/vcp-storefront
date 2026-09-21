// Is this customer approved for local pickup? (2026-09-21)
//
// POST { email } -> { approved: boolean }
//
// Approval lives on the Swell account: metadata.pickup_approved === true
// (set with scripts/approve-pickup.js, or content.pickup_approved if the
// field is added to the customer model in Swell). Only a boolean leaves
// this route, so looking up by email is safe for guests too.

const API = "https://api.swell.store";

function auth(): string | null {
  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID || process.env.SWELL_STORE_ID;
  const secret = process.env.SWELL_SECRET_KEY;
  if (!storeId || !secret) return null;
  return `Basic ${Buffer.from(`${storeId}:${secret}`).toString("base64")}`;
}

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ approved: false }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return Response.json({ approved: false });
  const a = auth();
  if (!a) return Response.json({ approved: false });
  try {
    const res = await fetch(`${API}/accounts?where[email]=${encodeURIComponent(email)}&limit=1&fields=id,metadata,content`, {
      headers: { Authorization: a },
      cache: "no-store",
    });
    if (!res.ok) return Response.json({ approved: false });
    const json = (await res.json()) as { results?: Array<{ metadata?: { pickup_approved?: unknown }; content?: { pickup_approved?: unknown } }> };
    const acct = json.results?.[0];
    const approved = acct?.metadata?.pickup_approved === true || acct?.content?.pickup_approved === true;
    return Response.json({ approved });
  } catch {
    return Response.json({ approved: false });
  }
}
