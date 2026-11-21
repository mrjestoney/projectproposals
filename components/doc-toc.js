"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/** Id of the last heading that has scrolled past the top of the page. */
function useActiveId(headings) {
  const [active, setActive] = useState(headings[0]?.id ?? null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0]?.id ?? null;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 120) current = h.id;
      }
      // At the very bottom of the page the last sections can never reach the top, so highlight the last one.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = headings.at(-1)?.id ?? current;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);
  return active;
}

function TocList({ headings, active, onPick }) {
  return (
    <ul className="space-y-hair text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={onPick}
            aria-current={active === h.id ? "location" : undefined}
            className={`block rounded-field border-l-2 py-hair leading-snug transition-colors ${h.level === 3 ? "pl-group" : "pl-base"} ${
              active === h.id ? "border-accent font-medium text-accent" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Collapsible "On this page" dropdown for mobile and tablet (hidden from 1024px up). */
export function DocTocMobile({ headings }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-group rounded-field border border-line bg-field lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="toc-mobile"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center justify-between px-base text-left font-medium"
      >
        On this page
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <div id="toc-mobile" className="animate-rise max-h-[60dvh] overflow-y-auto border-t border-line p-tight">
          <TocList headings={headings} active={null} onPick={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}

/** Sticky "On this page" list with active-section highlight (desktop only). */
export function DocTocDesktop({ headings }) {
  const active = useActiveId(headings);
  return (
    <nav aria-label="On this page" className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] self-start overflow-y-auto lg:col-start-3 lg:row-start-1 lg:block">
      <p className="mb-tight text-xs font-semibold tracking-wide text-hint uppercase">On this page</p>
      <TocList headings={headings} active={active} />
    </nav>
  );
}
