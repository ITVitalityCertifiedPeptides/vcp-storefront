// Simple line-art vial illustration used as product art until real
// photography exists. Deliberately drawn rather than reusing the emblem
// as a placeholder watermark, so product cards read as "this is a vial of
// something" at a glance instead of a generic logo-in-a-box.
export default function VialIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 96"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect x="24" y="4" width="16" height="10" rx="1.5" className="fill-current opacity-90" />
      <rect x="22" y="14" width="20" height="5" rx="1" className="fill-current opacity-60" />
      <path
        d="M20 19h24v58a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8V19Z"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-80"
      />
      <path d="M20 52h24" stroke="currentColor" strokeWidth="1.5" className="opacity-40" />
      <path
        d="M24 60c2.5 1.5 4.5 1.5 7 0s4.5-1.5 7 0 4.5 1.5 7 0"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-30"
      />
    </svg>
  );
}
