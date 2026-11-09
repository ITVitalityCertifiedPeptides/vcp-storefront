import type { Metadata } from "next";
import { currentStaff } from "@/lib/staff-portal-auth";
import StaffLogin from "../payments/StaffLogin";
import InvoicePortal from "./InvoicePortal";

export const metadata: Metadata = { title: "Staff · Send invoice", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function StaffInvoicesPage() {
  const staff = await currentStaff();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <p className="label-eyebrow text-gold-deep mb-2">Staff portal</p>
        <h1 className="mt-1 font-serif-display text-3xl md:text-4xl text-ink">Send an invoice</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Look up an unpaid order and email the customer their invoice with every way to pay, including the QR codes. Use this instead of
          the &ldquo;Send invoice&rdquo; button in Swell.
        </p>
      </header>
      {staff ? <InvoicePortal staffName={staff.name} /> : <StaffLogin />}
    </main>
  );
}
