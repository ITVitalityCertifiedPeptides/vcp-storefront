// Researcher registration - creates a Swell account in the "pending" group
// (never anything else; see the fail-closed note in swell-accounts.ts) and
// does NOT log the visitor in. They land on /pending-approval until staff
// approve them in Swell admin (Customers > edit the account > Group).

import { createPendingAccount } from "@/lib/swell-accounts";

export async function POST(request: Request) {
  let body: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim();
  const password = body.password || "";
  const firstName = (body.firstName || "").trim();
  const lastName = (body.lastName || "").trim();
  const phone = (body.phone || "").trim();

  if (!email || !email.includes("@")) {
    return Response.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return Response.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return Response.json({ ok: false, error: "First and last name are required." }, { status: 400 });
  }
  if (!phone) {
    return Response.json({ ok: false, error: "Phone number is required." }, { status: 400 });
  }

  const result = await createPendingAccount({ email, password, firstName, lastName, phone });
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 400 });
  }

  return Response.json({ ok: true });
}
