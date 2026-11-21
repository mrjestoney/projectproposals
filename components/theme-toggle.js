"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

// The effective theme is whatever the <html> element currently looks like to the browser:
// data-theme if the user chose one, otherwise the system preference.
function subscribe(cb) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}
function getSnapshot() {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
const getServerSnapshot = () => "light";

/** Switches between light and dark, sets data-theme on <html> and remembers the choice (localStorage, try/catch). */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  const Icon = theme === "dark" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      suppressHydrationWarning
      className="press flex size-11 items-center justify-center rounded-full text-ink-soft hover:bg-tint hover:text-ink"
    >
      <Icon className="size-5" aria-hidden="true" suppressHydrationWarning />
    </button>
  );
}
