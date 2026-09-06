// The only states we ship to: the continental 48 plus DC. Alaska, Hawaii,
// Puerto Rico, the territories, and military addresses are deliberately
// absent, so the checkout/account state dropdown can't select them and the
// question of international shipping never reaches the form. Country is
// always "US". Restricted states (lib/restricted-states.ts) are still
// listed here on purpose: the customer picks one, and the checkout tells
// them plainly why we can't ship there, instead of a silent gap in the
// list. 2026-09-06 (Josh).

export const SHIPPABLE_STATES: ReadonlyArray<{ code: string; name: string }> = [
  { code: "AL", name: "Alabama" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const BY_CODE = new Map(SHIPPABLE_STATES.map((s) => [s.code, s]));
const BY_NAME = new Map(SHIPPABLE_STATES.map((s) => [s.name.toLowerCase(), s]));

// Accepts a saved value in either form ("TX" or "Texas", any case) and
// returns the two-letter code, or "" when it isn't a shippable state.
// Lets addresses saved before the dropdown existed still pre-select.
export function toStateCode(value: string | undefined | null): string {
  const v = (value || "").trim();
  if (!v) return "";
  const code = v.toUpperCase().replace(/\./g, "");
  if (BY_CODE.has(code)) return code;
  return BY_NAME.get(v.toLowerCase())?.code || "";
}

export function isShippableState(value: string | undefined | null): boolean {
  return toStateCode(value) !== "";
}
