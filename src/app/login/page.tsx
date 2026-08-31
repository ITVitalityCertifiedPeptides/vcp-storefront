import { redirect } from "next/navigation";

// 2026-08-31 (Josh): retail dropped the researcher-gate login entirely -
// browsing, pricing, and buying are all public now, no sign-in required.
// /account is the one remaining account system (order history, saved
// shipping, optional - never required to buy), so old /login links and
// any bookmarks/search results pointing here land there instead of a 404.
export default async function LoginRedirect({
  searchParams,
}: {
  searchParams: Promise<{ return?: string }>;
}) {
  const { return: rawReturn } = await searchParams;
  const returnTo =
    rawReturn && rawReturn.startsWith("/") && !rawReturn.startsWith("//")
      ? rawReturn
      : "";
  redirect(returnTo ? `/account?return=${encodeURIComponent(returnTo)}` : "/account");
}
