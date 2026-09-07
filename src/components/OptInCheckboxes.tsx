"use client";

// Email + SMS opt-in checkboxes (2026-09-07, Josh: "we might occasionally
// have closeouts or deals we release only through text and email").
// Shown at checkout, registration, and the retail footer. Email defaults
// on; SMS defaults OFF and carries the consent wording carriers and the
// TCPA expect (frequency, rates, STOP). The values are written to the Swell
// account by /api/optin (email_optin + content.sms_optin), which is the
// single list any email or text tool reads from later.

export type OptIn = { email: boolean; sms: boolean };

export default function OptInCheckboxes({
  value,
  onChange,
  className = "",
  compact = false,
  already,
}: {
  value: OptIn;
  onChange: (v: OptIn) => void;
  className?: string;
  compact?: boolean;
  // What the signed-in account already has on file (checkout reads it from
  // the Swell account). A box that's already on is hidden; when both are,
  // the whole block collapses to a one-liner.
  already?: { email?: boolean; sms?: boolean };
}) {
  const box = "mt-1 h-4 w-4 shrink-0 accent-[#a67c24]";
  const text = compact ? "text-xs" : "text-sm";
  const showEmail = !already?.email;
  const showSms = !already?.sms;
  if (!showEmail && !showSms) {
    return (
      <p className={`${text} text-ink-soft ${className}`}>
        You&rsquo;re on the closeout list (email and text).
      </p>
    );
  }
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {showEmail && (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className={box}
          checked={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.checked })}
        />
        <span className={`${text} text-ink-soft leading-relaxed`}>
          Email me about closeouts, limited runs, and new compounds. Occasional, never spam.
        </span>
      </label>
      )}
      {showSms && (
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className={box}
          checked={value.sms}
          onChange={(e) => onChange({ ...value, sms: e.target.checked })}
        />
        <span className={`${text} text-ink-soft leading-relaxed`}>
          Text me too. Some closeouts go out by text only.
          <span className="block text-[0.7rem] text-ink-soft/70 mt-0.5">
            By checking this box you agree to receive occasional automated marketing texts from
            Vitality Certified Peptides at the number provided. Consent is not a condition of
            purchase. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help.
          </span>
        </span>
      </label>
      )}
    </div>
  );
}
