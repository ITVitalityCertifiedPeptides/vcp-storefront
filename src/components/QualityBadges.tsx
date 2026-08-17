import { qualityAssurancePoints } from "@/lib/quality-assurance";

// Reusable QA badge row - real markup (not an embedded image) so the claims
// are readable by search engines and screen readers, and so wording stays
// centralized in one place (src/lib/quality-assurance.ts) if a claim ever
// needs to be corrected or removed.
export default function QualityBadges({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";
  return (
    <div
      className={
        isDark
          ? "bg-ink text-cream"
          : "bg-white border border-line"
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        {qualityAssurancePoints.map((point) => (
          <div key={point.label} className="flex flex-col items-center text-center gap-2.5">
            <span
              className={`flex items-center justify-center h-11 w-11 rounded-full border ${
                isDark ? "border-gold/40 text-gold" : "border-gold-deep/30 text-gold-deep"
              }`}
            >
              <point.icon className="h-5 w-5" aria-hidden />
            </span>
            <span
              className={`label-eyebrow text-[0.62rem] ${
                isDark ? "text-cream" : "text-ink"
              }`}
            >
              {point.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
