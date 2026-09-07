import type { Metadata } from "next";
import { currentStaff } from "@/lib/staff-portal-auth";
import StaffLogin from "./StaffLogin";
import PaymentPortal from "./PaymentPortal";

export const metadata: Metadata = { title: "Staff · Payments", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function StaffPaymentsPage() {
  const staff = await currentStaff();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <p className="label-eyebrow text-gold-deep mb-2">Staff portal</p>
        <h1 className="mt-1 font-serif-display text-3xl md:text-4xl text-ink">Log a payment</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Record a payment you saw land. If the order number and amount match an unpaid order, it gets marked paid in Swell and the
          customer gets the &ldquo;Payment received&rdquo; email automatically.
        </p>
      </header>
      {staff ? <PaymentPortal staffName={staff.name} /> : <StaffLogin />}
    </main>
  );
}
