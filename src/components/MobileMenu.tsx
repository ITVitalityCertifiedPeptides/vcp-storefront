"use client";

// Mobile / tablet site index (2026-09-14, Josh): below the desktop
// breakpoint the header only had search + Shop Catalog, and every other
// page lived in the footer. This is a menu button beside the cart that
// slides in a panel with the catalog, the research areas, the info pages,
// account, and the legal links. Search stays where it is; this is the
// index next to it.

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

export type MenuLink = { href: string; label: string };

export default function MobileMenu({
  categories = [],
  pages,
  legal,
  footer,
}: {
  categories?: MenuLink[];
  pages: MenuLink[];
  legal: MenuLink[];
  // e.g. a Sign out button on the Inner Circle site
  footer?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock page scroll while open; Escape closes.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const row = "flex items-center justify-between py-3 border-b border-line text-ink";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-line bg-white text-ink hover:border-gold-deep hover:text-gold-deep transition-colors"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <nav
            aria-label="Site menu"
            className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-cream shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <span className="label-eyebrow text-[0.7rem] text-gold-deep">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-line bg-white text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="px-5 pb-8">
              <Link
                href="/shop"
                onClick={close}
                className="mt-4 mb-2 inline-flex w-full items-center justify-center rounded-full bg-ink text-cream px-5 py-3 label-eyebrow text-[0.7rem]"
              >
                Shop Catalog
              </Link>

              {categories.length > 0 && (
                <>
                  <p className="label-eyebrow text-[0.62rem] text-ink-soft mt-6 mb-1">Research areas</p>
                  <ul>
                    {categories.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={close} className={row}>
                          <span className="text-[0.95rem]">{c.label}</span>
                          <ChevronRight className="h-4 w-4 text-ink-soft" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <p className="label-eyebrow text-[0.62rem] text-ink-soft mt-6 mb-1">Company</p>
              <ul>
                {pages.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} onClick={close} className={row}>
                      <span className="text-[0.95rem]">{p.label}</span>
                      <ChevronRight className="h-4 w-4 text-ink-soft" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="label-eyebrow text-[0.62rem] text-ink-soft mt-6 mb-1">Legal</p>
              <ul className="text-sm">
                {legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={close} className="block py-2 text-ink-soft hover:text-gold-deep">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {footer ? <div className="mt-6 pt-4 border-t border-line">{footer}</div> : null}

              <p className="mt-8 text-[0.7rem] text-ink-soft">
                For laboratory research use only. Not for human or veterinary use.
              </p>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
