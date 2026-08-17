"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function Confirmation() {
  const params = useSearchParams();
  const number = params.get("number");

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <CheckCircle2 className="h-12 w-12 text-gold-deep mx-auto mb-6" aria-hidden />
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-4">
        Order received{number ? `: #${number}` : ""}
      </h1>
      <p className="text-ink-soft leading-relaxed mb-3 max-w-md mx-auto">
        Thank you. We will contact you within one business day to arrange
        payment, and your order ships once payment is confirmed.
      </p>
      <p className="text-ink-soft leading-relaxed mb-10 max-w-md mx-auto">
        A confirmation has been sent to the email address on your order.
      </p>
      <Link
        href="/categories"
        className="inline-flex items-center rounded-full bg-ink text-cream px-7 py-3.5 label-eyebrow text-[0.72rem] hover:bg-gold-deep transition-colors"
      >
        Continue Shopping
      </Link>
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
