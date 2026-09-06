import "server-only";

// US address validation for checkout and the account address form.
// 2026-09-06 (Josh): a customer registered with an undeliverable address,
// so every address now gets checked before it's saved or an order is
// placed.
//
// Provider: Google Address Validation API (runs on USPS CASS data for US
// addresses, 5,000 free lookups/month, then ~$17 per 1,000). Chosen over
// USPS's own v3 API, which since 2026 needs a signed business license
// agreement, defaults to 60 requests/hour, and is now paid too.
//
// Configuration: ADDRESS_VALIDATION_API_KEY in the environment (Vercel),
// never in the repo. When the key is absent the helper returns "skipped"
// and callers proceed exactly as before, so an unset key can't block a
// sale. The API route (app/api/address/validate) is the only caller; the
// browser never sees the key.
//
// Verdicts:
//   confirmed   - deliverable as entered (USPS DPV = Y), no changes needed
//   corrected   - deliverable, but USPS standardized it (case, ZIP+4,
//                 abbreviations, spelling). Caller shows the corrected
//                 form and lets the customer accept it.
//   unconfirmed - USPS can't confirm delivery to this exact address. The
//                 caller should let the customer fix it, or knowingly use
//                 it anyway with the order flagged for manual review.
//   skipped     - no key configured, or the provider was unreachable.

export type UsAddress = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
};

export type AddressValidation = {
  verdict: "confirmed" | "corrected" | "unconfirmed" | "skipped";
  address: UsAddress;
  // Plain-language reason for an "unconfirmed" verdict, shown to the customer.
  reason?: string;
};

type GoogleResponse = {
  result?: {
    verdict?: {
      addressComplete?: boolean;
      hasUnconfirmedComponents?: boolean;
      hasReplacedComponents?: boolean;
      validationGranularity?: string;
    };
    address?: {
      postalAddress?: {
        addressLines?: string[];
        locality?: string;
        administrativeArea?: string;
        postalCode?: string;
      };
      missingComponentTypes?: string[];
      unconfirmedComponentTypes?: string[];
    };
    uspsData?: {
      dpvConfirmation?: string; // Y | N | S | D
      standardizedAddress?: {
        firstAddressLine?: string;
        secondAddressLine?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        zipCodeExtension?: string;
      };
    };
  };
  error?: { message?: string };
};

const ENDPOINT = "https://addressvalidation.googleapis.com/v1:validateAddress";

function clean(s: string | undefined | null): string {
  return (s || "").trim().replace(/\s+/g, " ");
}

function sameAddress(a: UsAddress, b: UsAddress): boolean {
  const norm = (s: string | undefined) => clean(s).toUpperCase().replace(/[.,]/g, "");
  return (
    norm(a.address1) === norm(b.address1) &&
    norm(a.address2) === norm(b.address2) &&
    norm(a.city) === norm(b.city) &&
    norm(a.state) === norm(b.state) &&
    norm(a.zip).slice(0, 5) === norm(b.zip).slice(0, 5)
  );
}

export async function validateUsAddress(input: UsAddress): Promise<AddressValidation> {
  const key = process.env.ADDRESS_VALIDATION_API_KEY;
  const address: UsAddress = {
    address1: clean(input.address1),
    address2: clean(input.address2) || undefined,
    city: clean(input.city),
    state: clean(input.state).toUpperCase(),
    zip: clean(input.zip),
  };
  if (!key) return { verdict: "skipped", address };

  let data: GoogleResponse;
  try {
    const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: {
          regionCode: "US",
          addressLines: [address.address1, address.address2].filter(Boolean),
          locality: address.city,
          administrativeArea: address.state,
          postalCode: address.zip,
        },
        enableUspsCass: true,
      }),
      // Never let a slow provider hang checkout.
      signal: AbortSignal.timeout(6000),
    });
    data = (await res.json()) as GoogleResponse;
    if (!res.ok || data.error) {
      console.warn("Address validation provider error:", data.error?.message || res.status);
      return { verdict: "skipped", address };
    }
  } catch (err) {
    console.warn("Address validation unreachable:", err);
    return { verdict: "skipped", address };
  }

  const r = data.result || {};
  const usps = r.uspsData?.standardizedAddress;
  const pa = r.address?.postalAddress;
  // Prefer the USPS-standardized form; fall back to Google's postal address.
  const standardized: UsAddress = usps?.firstAddressLine
    ? {
        address1: clean(usps.firstAddressLine),
        address2: clean(usps.secondAddressLine) || undefined,
        city: clean(usps.city),
        state: clean(usps.state).toUpperCase(),
        zip: usps.zipCodeExtension
          ? `${usps.zipCode}-${usps.zipCodeExtension}`
          : clean(usps.zipCode),
      }
    : {
        address1: clean(pa?.addressLines?.[0]) || address.address1,
        address2: clean(pa?.addressLines?.[1]) || undefined,
        city: clean(pa?.locality) || address.city,
        state: clean(pa?.administrativeArea).toUpperCase() || address.state,
        zip: clean(pa?.postalCode) || address.zip,
      };

  const dpv = r.uspsData?.dpvConfirmation;
  const verdictOk = r.verdict?.addressComplete && !r.verdict?.hasUnconfirmedComponents;

  if (dpv === "Y" || (dpv === undefined && verdictOk)) {
    return {
      verdict: sameAddress(address, standardized) ? "confirmed" : "corrected",
      address: standardized,
    };
  }
  if (dpv === "S" || dpv === "D") {
    return {
      verdict: "unconfirmed",
      address: standardized,
      reason:
        dpv === "D"
          ? "This building is deliverable, but it needs an apartment, suite, or unit number."
          : "The street address is deliverable, but the apartment, suite, or unit number wasn't recognized.",
    };
  }
  const missing = r.address?.missingComponentTypes || [];
  const unconfirmed = r.address?.unconfirmedComponentTypes || [];
  const detail = [...missing, ...unconfirmed]
    .map((t) => t.replace(/_/g, " ").toLowerCase())
    .slice(0, 3)
    .join(", ");
  return {
    verdict: "unconfirmed",
    address: standardized,
    reason: detail
      ? `USPS couldn't confirm this address (${detail}).`
      : "USPS couldn't confirm delivery to this address.",
  };
}
