// Records email / SMS marketing opt-in on the Swell account for an email
// (2026-09-07). Upserts: finds the account by email, updates it; creates a
// bare account when none exists (footer signups). Never turns an opt-in
// OFF from here: unchecking at checkout just means "no change", so a
// customer who opted in earlier isn't silently removed. Opt-outs happen by
// replying STOP / unsubscribe links in the sending tool.
//
// Fields on the account:
//   email_optin            Swell's native flag (email)
//   content.sms_optin      boolean
//   content.sms_consent_at ISO timestamp of the consent (TCPA record)
//   content.optin_source   where they said yes (checkout, register, footer)
//   phone                  set only when the account has none yet

const API = "https://api.swell.store";

function auth(): string | null {
  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID || process.env.SWELL_STORE_ID;
  const secret = process.env.SWELL_SECRET_KEY;
  if (!storeId || !secret) return null;
  return `Basic ${Buffer.from(`${storeId}:${secret}`).toString("base64")}`;
}

export async function POST(request: Request) {
  let body: { email?: string; phone?: string; emailOptin?: boolean; smsOptin?: boolean; source?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  const phone = (body.phone || "").trim();
  const emailOptin = body.emailOptin === true;
  const smsOptin = body.smsOptin === true && phone.length >= 7;
  const source = (body.source || "site").slice(0, 40);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  if (!emailOptin && !smsOptin) return Response.json({ ok: true, noop: true });
  const authHeader = auth();
  if (!authHeader) return Response.json({ ok: false, error: "Not configured." }, { status: 503 });
  const headers = { Authorization: authHeader, "Content-Type": "application/json" };

  const now = new Date().toISOString();
  const found = await fetch(`${API}/accounts?where[email]=${encodeURIComponent(email)}&limit=1&fields=id,phone,email_optin,content`, { headers });
  const existing = found.ok ? ((await found.json()) as { results?: Array<{ id: string; phone?: string; content?: Record<string, unknown> }> }).results?.[0] : undefined;

  const content: Record<string, unknown> = { ...(existing?.content || {}) };
  if (smsOptin) { content.sms_optin = true; content.sms_consent_at = now; }
  content.optin_source = source;
  content.optin_updated_at = now;

  const patch: Record<string, unknown> = { content };
  if (emailOptin) patch.email_optin = true;
  if (phone && !existing?.phone) patch.phone = phone;

  const res = existing
    ? await fetch(`${API}/accounts/${existing.id}`, { method: "PUT", headers, body: JSON.stringify(patch) })
    : await fetch(`${API}/accounts`, { method: "POST", headers, body: JSON.stringify({ email, ...patch }) });
  if (!res.ok) return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 502 });
  return Response.json({ ok: true });
}
