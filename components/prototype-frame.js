"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";

/**
 * Wrapper every prototype lives in: title bar, "Prototype · mock data" badge, "Reset demo" button and an optional
 * collapsible "How to use this demo" (howTo = array of short steps). Reset remounts the children, which returns any
 * state inside them to its starting point; onReset runs first for anything kept outside.
 */
export function PrototypeFrame({ title, howTo, onReset, children }) {
  const [resetKey, setResetKey] = useState(0);
  const [hintOpen, setHintOpen] = useState(true);

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
            onClick={() => setHintOpen((o) => !o)}
            className="flex min-h-11 w-full items-center justify-between px-base text-left text-sm font-medium text-ink"
          >
            How to use this demo
            <ChevronDown className={`size-4 transition-transform ${hintOpen ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          {hintOpen ? (
            <ol id="how-to-use" className="list-decimal space-y-hair pr-base pb-base pl-[calc(var(--spacing-base)+1.25rem)] text-sm text-ink-soft">
              {howTo.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
      <div key={resetKey}>{children}</div>
    </section>
  );
}
