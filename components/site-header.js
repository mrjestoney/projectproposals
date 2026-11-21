"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Projects", match: (p) => p === "/" || p.startsWith("/projects") },
  { href: "/about", label: "About", match: (p) => p === "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  // The menu is open only on the page where it was opened, so navigating closes it without an effect.
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === pathname;

  return (
    <header
      className="sticky top-0 z-30 border-b border-line bg-field"
      onKeyDown={(e) => e.key === "Escape" && setOpenAt(null)}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-base md:px-section">
        <Link href="/" className="flex min-h-11 items-center text-lg font-semibold tracking-tight text-brand">
          Project Proposals
        </Link>
        <div className="flex items-center gap-tight">
          <nav aria-label="Main" className="hidden items-center gap-hair md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={l.match(pathname) ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-full px-base text-base font-medium transition-colors hover:bg-tint ${
                  l.match(pathname) ? "bg-tint text-brand" : "text-ink-soft"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className="press flex size-11 items-center justify-center rounded-full text-ink-soft hover:bg-tint hover:text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenAt(open ? null : pathname)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-menu" aria-label="Mobile" className="animate-rise border-t border-line bg-field px-base pb-base md:hidden">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={l.match(pathname) ? "page" : undefined}
                  className={`flex min-h-12 items-center border-b border-line text-lg font-medium last:border-b-0 ${
                    l.match(pathname) ? "text-brand" : "text-ink"
                  }`}
                  onClick={() => setOpenAt(null)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
