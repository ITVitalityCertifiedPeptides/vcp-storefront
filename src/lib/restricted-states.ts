// Single source of truth for the states we do not sell or ship to.
// Basis: documented, active state-level enforcement against the RUO
// online-seller model (State-by-State Legal Risk Matrix: AG actions,
// stricter codified law, or pharmacy-board orders). California is
// deliberately NOT on this list per Josh (home state), despite its
// risk-matrix tier. Displayed on /ruo-policy and enforced at checkout.
// Keep in sync with counsel's ongoing review.

export const RESTRICTED_STATES: Array<{ name: string; code: string }> = [
  { name: "Alabama", code: "AL" },
  { name: "Connecticut", code: "CT" },
  { name: "New York", code: "NY" },
  { name: "Ohio", code: "OH" },
  { name: "Washington", code: "WA" },
];

export const restrictedStateNames = RESTRICTED_STATES.map((s) => s.name);

// The checkout state field is free text, so match forgivingly: two-letter
// code or full name, any case, surrounding whitespace and periods ignored
// (e.g. "ny", "N.Y.", "new york", "Ohio "). "Washington DC" must NOT
// match Washington state.
export function isRestrictedState(input: string): { name: string } | null {
  const cleaned = input.trim().toLowerCase().replace(/\./g, "");
  if (!cleaned) return null;
  if (/^(washington,?\s*)?(dc|d\s*c)$/.test(cleaned) || /district of columbia/.test(cleaned)) {
    return null;
  }
  for (const state of RESTRICTED_STATES) {
    if (cleaned === state.code.toLowerCase() || cleaned === state.name.toLowerCase()) {
      return { name: state.name };
    }
  }
  return null;
}
