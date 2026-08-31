import { redirect } from "next/navigation";

// 2026-08-31 (Josh): retail dropped the researcher-gate registration
// (pending review, admin approval, notification email) entirely - account
// creation is now a plain, optional convenience through /account, same as
// signing in. Old /register links and any bookmarks/search results
// pointing here land on /account instead of a 404.
export default function RegisterRedirect() {
  redirect("/account");
}
