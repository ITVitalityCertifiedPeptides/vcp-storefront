"use client";

// Checkout payment-method picker (2026-09-21). Nothing is charged online;
// the customer tells us HOW they will pay so the invoice email can show
// that one method only, with a pre-filled pay link where possible. No
// default: they have to choose.

import { paymentMethodsFor, type PaymentMethodId } from "@/lib/payment-methods";

type Props = {
  total: number;
  value: PaymentMethodId | null;
  onChange: (id: PaymentMethodId) => void;
  className?: string;
};

export default function PaymentMethodPicker({ total, value, onChange, className }: Props) {
  const methods = paymentMethodsFor(total);
  return (
    <div className={className}>
      <p className="label-eyebrow text-[0.7rem] text-gold-deep mb-1">Payment Method</p>
      <p className="text-xs text-ink-soft mb-3 leading-relaxed">
        Choose how you will pay. Your invoice email will have the details for that method only, with the exact
        amount. Nothing is charged online.
      </p>
      <div className="border border-line rounded-sm divide-y divide-line mb-8">
        {methods.map((m) => {
          const checked = m.id === value;
          return (
            <label
              key={m.id}
              className={`flex items-start gap-3 p-4 cursor-pointer ${checked ? "bg-cream-soft/60" : ""}`}
            >
              <input
                type="radio"
                name="payment-method"
                required
                className="mt-1 h-4 w-4 accent-[#a67c24]"
                checked={checked}
                onChange={() => onChange(m.id)}
              />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-ink">{m.label}</span>
                <span className="block text-xs text-ink-soft mt-1 leading-relaxed">{m.blurb}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
