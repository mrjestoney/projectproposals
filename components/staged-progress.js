"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Simulated "AI" progress used by every prototype: shows each stage in turn (about 0.65 s apart), then calls onDone.
 * "Skip" calls onDone at once; with prefers-reduced-motion the stages run through instantly.
 * Props: title, stages (array of strings), onDone, titleId (optional), stepMs (optional).
 */
export function StagedProgress({ title, stages, onDone, titleId = "staged-title", stepMs = 650, className = "" }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => (i >= stages.length ? onDone() : setI(i + 1)), reduce ? 0 : stepMs);
    return () => clearTimeout(t);
  }, [i, onDone, stages.length, reduce, stepMs]);

  return (
    <Card as="section" aria-labelledby={titleId} className={`mx-auto max-w-xl p-group md:p-section ${className}`}>
      <h2 id={titleId} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <Progress value={i} max={stages.length} label={`${title} progress`} className="mt-base" />
      <ol className="mt-group grid grid-cols-[minmax(0,1fr)] gap-tight" aria-live="polite">
        {stages.map((s, n) => {
          const done = n < i;
          const current = n === i;
          return (
            <li key={s} className={`flex items-center gap-tight ${done || current ? "text-ink" : "text-hint"}`}>
              <span className="flex size-6 shrink-0 items-center justify-center">
                {done ? (
                  <Check className="size-5 text-success" aria-hidden="true" />
                ) : current ? (
                  <Loader2 className="size-5 animate-spin text-accent" aria-hidden="true" />
                ) : (
                  <span className="size-2 rounded-full bg-line-hover" aria-hidden="true" />
                )}
              </span>
              {s}
            </li>
          );
        })}
      </ol>
      <div className="mt-group">
        <button type="button" onClick={onDone} className="min-h-11 text-sm font-medium text-accent underline underline-offset-4">
          Skip
        </button>
      </div>
    </Card>
  );
}
