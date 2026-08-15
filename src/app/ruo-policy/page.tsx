import type { Metadata } from "next";
import { ruoNotice } from "@/lib/site";

export const metadata: Metadata = {
  title: "Research Use Only Policy",
  description:
    "Vitality Certified Peptides' Research Use Only (RUO) policy: what it means, who can buy, and how we describe compounds.",
  alternates: { canonical: "/ruo-policy" },
};

export default function RuoPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Research Use Only (RUO) Policy</h1>
      <p className="text-neutral-600 mb-4">{ruoNotice}</p>
      <h2 className="text-lg font-medium mt-8 mb-2">How we describe compounds</h2>
      <p className="text-neutral-600 mb-4">
        All public-facing content on this site describes compounds in terms
        of what has been studied or researched in the scientific literature,
        never in terms of what a compound does for a person who takes it.
        We do not publish, link to, or in any way facilitate access to
        dosage or human-consumption information.
      </p>
      <p className="text-neutral-500 text-sm mt-8">
        This page is preliminary and subject to attorney review before
        launch. Final language pending legal sign-off on the state-by-state
        risk matrix and label compliance review.
      </p>
    </div>
  );
}
