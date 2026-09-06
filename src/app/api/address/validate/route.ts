import { NextResponse } from "next/server";
import { validateUsAddress } from "@/lib/address-validation";
import { isShippableState, toStateCode } from "@/lib/us-states";

// POST { address1, address2?, city, state, zip } -> AddressValidation.
// Thin wrapper so the provider key stays server-side. See
// lib/address-validation.ts for verdict meanings.

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const address = {
    address1: str("address1"),
    address2: str("address2") || undefined,
    city: str("city"),
    state: toStateCode(str("state")) || str("state"),
    zip: str("zip"),
  };
  if (!address.address1 || !address.city || !address.state || !address.zip) {
    return NextResponse.json({ error: "Address is incomplete" }, { status: 400 });
  }
  if (!isShippableState(address.state)) {
    return NextResponse.json(
      { verdict: "unconfirmed", address, reason: "We ship to the continental United States only." },
      { status: 200 }
    );
  }
  if (!/^\d{5}(-\d{4})?$/.test(address.zip)) {
    return NextResponse.json(
      { verdict: "unconfirmed", address, reason: "ZIP code should be 5 digits." },
      { status: 200 }
    );
  }
  const result = await validateUsAddress(address);
  return NextResponse.json(result);
}
