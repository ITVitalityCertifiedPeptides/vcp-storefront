"use client";

// State dropdown for shipping forms: the continental 48 + DC only (see
// lib/us-states.ts). Same styling contract as the text inputs around it.

import { SHIPPABLE_STATES } from "@/lib/us-states";

export default function StateSelect({
  value,
  onChange,
  className,
  required = true,
  name = "state",
}: {
  value: string;
  onChange: (code: string) => void;
  className?: string;
  required?: boolean;
  name?: string;
}) {
  return (
    <select
      name={name}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${className || ""} ${value ? "text-ink" : "text-ink-soft/50"}`}
      aria-label="State"
    >
      <option value="" disabled>
        State
      </option>
      {SHIPPABLE_STATES.map((s) => (
        <option key={s.code} value={s.code}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
