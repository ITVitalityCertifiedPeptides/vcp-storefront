"use client";

import Script from "next/script";
import { useEffect } from "react";
import { tap, TAPFILIATE_ACCOUNT_ID } from "@/lib/tapfiliate";

// Loads Tapfiliate click tracking site-wide. Visitors arriving through an
// affiliate's referral link get the 30-day referral cookie via
// tap('detect'); the conversion itself is reported from checkout (see
// src/lib/tapfiliate.ts).
export default function TapfiliateTracker() {
  useEffect(() => {
    tap("create", TAPFILIATE_ACCOUNT_ID, { integration: "javascript" });
    tap("detect");
  }, []);

  return (
    <Script
      src="https://script.tapfiliate.com/tapfiliate.js"
      strategy="afterInteractive"
    />
  );
}
