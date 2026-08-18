"use client";

// Invoice-based order confirmation. Shows the order number and total with
// the manual-payment instructions (Zelle / Venmo / Cash App / Wise).
//
// TODO (Jeff/Tom): actual Zelle / Venmo / Cash App / Wise account details
// are intentionally NOT shown here. They are sent with the invoice by the
// team. If account details should ever appear on this page, they must
// come from Jeff or Tom directly; do not add placeholders or guesses.

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const PAYMENT_METHODS = ["Zelle", "Venmo", "Cash App", "Wise"];

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
          How to complete your purchase
        </p>
        <p className="text-ink-soft leading-relaxed mb-4">
          Your order has been received. To complete your purchase, please
          send payment{total ? ` for $${total}` : ""} via one of the
          following methods:
        </p>
        <ul className="mb-4 space-y-1.5">
          {PAYMENT_METHODS.map((method) => (
            <li key={method} className="flex items-center gap-3 text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden />
              {method}
            </li>
          ))}
        </ul>
        <p className="text-ink-soft leading-relaxed">
          Payment instructions and account details will be sent separately
          by our team{number ? `, referencing order #${number}` : ""}.
          Orders ship once payment is confirmed, typically within one
          business day of payment being received.
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
