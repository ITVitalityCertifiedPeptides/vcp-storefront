"use client";

// Invoice-based order confirmation. The actual payment target (a Zelle
// address or an Apple Cash phone number, whichever the team is using for
// this order) is NOT shown here - it goes out in a follow-up email, since
// only one method is sent per order rather than a menu of choices. This
// page just tells the buyer that email is coming and what to do with it.
//
// TODO (Jeff/Tom): the email itself (Swell Settings > Notifications >
// order confirmation) still needs the real Zelle account / Apple Cash
// phone number filled in. Do not add placeholders or guesses here or
// there.

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function Confirmation() {
  const params = useSearchParams();
  const number = params.get("number");
  const total = params.get("total");

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 md:py-20">
      <div className="text-center mb-10">
        <CheckCircle2 className="h-12 w-12 text-gold-deep mx-auto mb-6" aria-hidden />
        <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
          Order received{number ? `: #${number}` : ""}
        </h1>
        {total && (
          <p className="font-serif-display text-2xl text-ink">
            Order total: ${total}
          </p>
        )}
      </div>

      <div className="rounded-sm border border-line bg-cream-soft px-6 py-6 mb-8">
        <p className="label-eyebrow text-[0.7rem] text-gold-deep mb-3">
          What happens next
        </p>
        <p className="text-ink-soft leading-relaxed mb-4">
          We&apos;ve sent payment instructions to your email
          {number ? ` for order #${number}` : ""}. Please complete payment
          {total ? ` of $${total}` : ""} and reply to that email with a
          screenshot or confirmation number from the transaction.
        </p>
        <p className="text-ink-soft leading-relaxed">
          One of our team members will review and approve your order.
          We process payments Monday through Friday during business
          hours, and your order ships within 1 business day of approval.
        </p>
      </div>

      <p className="text-ink-soft leading-relaxed mb-10 text-center max-w-md mx-auto">
        When your order ships, you will receive tracking and a digital
        copy of the Certificate of Analysis for your lot.
      </p>

      <div className="text-center">
        <Link
          href="/categories"
          className="inline-flex items-center rounded-full bg-ink text-cream px-7 py-3.5 label-eyebrow text-[0.72rem] hover:bg-gold-deep transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={null}>
      <Confirmation />
    </Suspense>
  );
}
