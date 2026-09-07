import { NextResponse } from "next/server";
import { makeStaffToken, passwordMatches, STAFF_COOKIE } from "@/lib/staff-portal-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: string; name?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const name = (body.name || "").trim().slice(0, 60);
  if (!name) return NextResponse.json({ error: "Enter your name so payments are logged under it." }, { status: 400 });
  if (!passwordMatches(body.password || "")) {
    return NextResponse.json({ error: "That password isn't right." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, name });
  res.cookies.set(STAFF_COOKIE, makeStaffToken(name), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
