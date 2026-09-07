import { NextResponse } from "next/server";
import { checkStaffLogin, makeStaffToken, STAFF_COOKIE } from "@/lib/staff-portal-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: string; username?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const username = (body.username || "").trim().slice(0, 120);
  if (!username) return NextResponse.json({ error: "Enter your email." }, { status: 400 });
  const name = checkStaffLogin(username, body.password || "");
  if (!name) {
    return NextResponse.json({ error: "That email or password isn't right." }, { status: 401 });
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
