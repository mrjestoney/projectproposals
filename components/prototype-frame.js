"use client";

import { useState, useSyncExternalStore } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";

const wide = "(min-width: 768px)";
const subscribeWide = (cb) => {
  const mq = window.matchMedia(wide);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Wrapper every prototype lives in: title bar, "Prototype · mock data" badge, "Reset demo" button and an optional
 * collapsible "How to use this demo" (howTo = array of short steps). Reset remounts the children, which returns any
 * state inside them to its starting point; onReset runs first for anything kept outside.
 */
export function PrototypeFrame({ title, howTo, onReset, children }) {
  const [resetKey, setResetKey] = useState(0);
  // "How to use" starts collapsed on phones (below 768px) and open from 768px up. Until the visitor taps it, CSS
  // decides (so the first paint is right); after that their choice wins. The server assumes a wide screen.
  const isWide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(wide).matches,
    () => true,
  );
  const [chosen, setChosen] = useState(null);
  const hintOpen = chosen ?? isWide;

  return (
    <section aria-label={`${title} prototype`} className="my-group overflow-hidden rounded-field border border-line bg-field">
      <div className="flex flex-wrap items-center justify-between gap-tight border-b border-line px-base py-tight">
        <div className="flex min-w-0 flex-wrap items-center gap-tight">
          <h2 className="truncate text-base font-semibold">{title}</h2>
          <Chip tone="warning">Prototype · mock data</Chip>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onReset?.();
            setResetKey((k) => k + 1);
          }}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset demo
        </Button>
      </div>
      {howTo?.length ? (
        <div className="border-b border-line bg-accent-tint">
          <button
            type="button"
            aria-expanded={hintOpen}
            aria-controls="how-to-use"
            onClick={() => setChosen(!hintOpen)}
            className="flex min-h-11 w-full items-center justify-between px-base text-left text-sm font-medium text-ink"
          >
            How to use this demo
            <ChevronDown
              className={`size-4 transition-transform ${chosen === null ? "md:rotate-180" : chosen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          <ol
            id="how-to-use"
            className={`list-decimal space-y-hair pr-base pb-base pl-[calc(var(--spacing-base)+1.25rem)] text-sm text-ink-soft ${
              chosen === null ? "hidden md:block" : chosen ? "block" : "hidden"
            }`}
          >
            {howTo.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      ) : null}
      <div key={resetKey}>{children}</div>
    </section>
  );
}
