"use client";

// Shown after address validation when the address either got standardized
// ("corrected") or couldn't be confirmed ("unconfirmed"). The customer
// always stays in control: accept the correction, keep what they typed, go
// back and edit, or knowingly use an unconfirmed address (the caller then
// flags the order/account for manual review). See lib/address-validation.ts.

export type ReviewAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
};

export type ReviewResult = {
  verdict: "confirmed" | "corrected" | "unconfirmed" | "skipped";
  address: ReviewAddress;
  reason?: string;
};

// Calls the validation route. Never throws: a failed call comes back as
// "skipped" so a hiccup can't block a customer.
export async function checkAddress(address: ReviewAddress): Promise<ReviewResult> {
  try {
    const res = await fetch("/api/address/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    if (!res.ok) return { verdict: "skipped", address };
    return (await res.json()) as ReviewResult;
  } catch {
    return { verdict: "skipped", address };
  }
}

function Line({ a }: { a: ReviewAddress }) {
  return (
    <p className="text-sm text-ink leading-relaxed">
      {a.address1}
      {a.address2 ? `, ${a.address2}` : ""}
      <br />
      {a.city}, {a.state} {a.zip}
    </p>
  );
}

export default function AddressReview({
  result,
  entered,
  busy,
  onUseCorrected,
  onKeepEntered,
  onEdit,
  onUseAnyway,
  actionLabel = "Continue",
}: {
  result: ReviewResult;
  entered: ReviewAddress;
  busy?: boolean;
  onUseCorrected: (a: ReviewAddress) => void;
  onKeepEntered: () => void;
  onEdit: () => void;
  onUseAnyway: () => void;
  // Verb for the primary buttons, e.g. "Place Order" or "Save".
  actionLabel?: string;
}) {
  const btn =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 label-eyebrow text-[0.66rem] transition-colors disabled:opacity-60";
  const primary = `${btn} bg-gold-deep text-cream hover:bg-ink`;
  const secondary = `${btn} border border-line bg-white text-ink hover:border-gold-deep`;

  if (result.verdict === "corrected") {
    return (
      <div className="rounded-sm border border-gold-deep/50 bg-cream-soft p-5 mb-6" role="status">
        <p className="label-eyebrow text-[0.62rem] text-gold-deep mb-3">
          Confirm your address
        </p>
        <p className="text-sm text-ink-soft mb-4">
          USPS lists this address a little differently. Use the standardized
          version, or keep exactly what you entered.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div className="rounded-sm border border-gold-deep bg-white p-4">
            <p className="text-[0.68rem] uppercase tracking-wide text-gold-deep mb-2">USPS standardized</p>
            <Line a={result.address} />
          </div>
          <div className="rounded-sm border border-line bg-white p-4">
            <p className="text-[0.68rem] uppercase tracking-wide text-ink-soft mb-2">As entered</p>
            <Line a={entered} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy} className={primary} onClick={() => onUseCorrected(result.address)}>
            Use standardized &amp; {actionLabel}
          </button>
          <button type="button" disabled={busy} className={secondary} onClick={onKeepEntered}>
            Keep as entered &amp; {actionLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-red-300 bg-red-50/60 p-5 mb-6" role="alert">
      <p className="label-eyebrow text-[0.62rem] text-red-700 mb-3">
        We couldn&apos;t confirm this address
      </p>
      <p className="text-sm text-ink mb-3">{result.reason || "USPS couldn't confirm delivery to this address."}</p>
      <div className="rounded-sm border border-line bg-white p-4 mb-4">
        <Line a={entered} />
      </div>
      <p className="text-xs text-ink-soft mb-4">
        Double-check the street number, unit, and ZIP. If you&apos;re sure it&apos;s right
        (new construction and some rural routes aren&apos;t in USPS yet), you can use it
        anyway and our team will confirm it with you before shipping.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} className={primary} onClick={onEdit}>
          Edit address
        </button>
        <button type="button" disabled={busy} className={secondary} onClick={onUseAnyway}>
          Use it anyway &amp; {actionLabel}
        </button>
      </div>
    </div>
  );
}
