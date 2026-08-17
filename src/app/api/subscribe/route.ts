// Stores email signups directly in Swell as opted-in customer contacts,
// so there's no external email service dependency yet. Requires
// SWELL_SECRET_KEY (server-side only, never NEXT_PUBLIC) in the Vercel
// project's environment variables; NEXT_PUBLIC_SWELL_STORE_ID is already
// set for the storefront. Subscribers appear in the Swell admin under
// Customers, filterable by email_optin.

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email || "").trim();
  } catch {
    // fall through to validation
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID;
  const secretKey = process.env.SWELL_SECRET_KEY;
  if (!storeId || !secretKey) {
    return Response.json(
      { error: "Signups are not configured yet. Please email us instead." },
      { status: 503 }
    );
  }

  const auth = Buffer.from(`${storeId}:${secretKey}`).toString("base64");
  const response = await fetch("https://api.swell.store/accounts", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, email_optin: true }),
  });

  // Swell returns a 200 with an errors object when the email already
  // exists; an existing contact asking to subscribe again is a success
  // from the visitor's point of view either way.
  if (!response.ok) {
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
