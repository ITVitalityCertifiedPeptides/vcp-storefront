import { ShieldCheck, FlaskConical, Microscope, Snowflake, BadgeCheck } from "lucide-react";

// Five factual, documented claims confirmed by Josh as accurate and backed
// by paperwork if challenged (2026-08-16). These are testable operational
// claims, not benefit/efficacy claims, so they're compliance-safe under the
// GTM doc's studied/researched framing - but precisely because they're
// factual claims, they need to stay accurate. If any of these processes
// change, update the wording here (and be ready to produce the paperwork).
export const qualityAssurancePoints = [
  {
    icon: ShieldCheck,
    label: "Research Grade",
    detail:
      "Every compound is sourced and handled to research-grade standards, not consumer-good standards.",
  },
  {
    icon: BadgeCheck,
    label: "Third-Party Tested",
    detail:
      "Each lot is tested by a party independent of Vitality Certified Peptides before it reaches our inventory.",
  },
  {
    icon: FlaskConical,
    label: "Purity Verified",
    detail:
      "Identity and purity are confirmed lot by lot via Certificate of Analysis, documented at the batch level.",
  },
  {
    icon: Microscope,
    label: "Sterility Tested",
    detail:
      "Sterility testing is performed as part of our lot verification process, documented alongside purity data.",
  },
  {
    icon: Snowflake,
    label: "Cold Chain Maintained",
    detail:
      "Products are shipped and stored under temperature-controlled conditions from receipt through fulfillment.",
  },
];
