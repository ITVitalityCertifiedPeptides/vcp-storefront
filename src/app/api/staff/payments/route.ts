import { NextResponse } from "next/server";
import { currentStaff } from "@/lib/staff-portal-auth";
import { recentPayments, recordPayment, validatePaymentInput } from "@/lib/staff-payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const staff = await currentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    return NextResponse.json({ payments: await recentPayments(50) });
  } catch (e) {
    console.error("staff payments list failed", e);
    return NextResponse.json({ error: "Couldn't load recent payments." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const staff = await currentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  let raw: Record<string, unknown> = {};
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid", message: "Bad request" }, { status: 400 });
  }
  const parsed = validatePaymentInput({ ...raw, recordedBy: staff.name });
  if (!parsed.ok) return NextResponse.json({ ok: false, code: "invalid", message: parsed.message }, { status: 400 });
  try {
    const result = await recordPayment(parsed.value);
    return NextResponse.json(result, { status: result.ok ? 200 : 409 });
  } catch (e) {
    console.error("staff payment record failed", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, code: "invalid", message: `Something went wrong talking to Swell: ${msg}` }, { status: 500 });
  }
}
