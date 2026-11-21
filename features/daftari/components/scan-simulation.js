"use client";

import { useEffect, useState } from "react";
import { Check, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PAGES } from "../data/pages";
import { HandwrittenPage } from "./handwritten-page";

/** Camera viewfinder: dark frame with corner guides around whatever is "seen". */
export function CameraFrame({ children, overlay }) {
  const corner = "absolute size-8 border-white/80";
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-field bg-camera p-group">
      <span aria-hidden="true" className={`${corner} top-tight left-tight rounded-tl-field border-t-[3px] border-l-[3px]`} />
      <span aria-hidden="true" className={`${corner} top-tight right-tight rounded-tr-field border-t-[3px] border-r-[3px]`} />
      <span aria-hidden="true" className={`${corner} bottom-tight left-tight rounded-bl-field border-b-[3px] border-l-[3px]`} />
      <span aria-hidden="true" className={`${corner} right-tight bottom-tight rounded-br-field border-r-[3px] border-b-[3px]`} />
      <div className="relative min-h-[24rem]">{children}</div>
      {overlay}
    </div>
  );
}

// One "frame" per moment: the page appears, is captured, then the page turn is detected.
const FRAMES = PAGES.flatMap((p) => [
  { page: p.n, state: "show" },
  { page: p.n, state: "captured" },
  ...(p.n < PAGES.length ? [{ page: p.n, state: "turn" }] : []),
]);

/**
 * Simulated flip-scan of the 3 pages: page appears → "Page turn detected" → capture tick → next page slides in.
 * Skippable; with reduced motion it finishes at once. Calls onDone() when finished.
 */
export function ScanSimulation({ onDone }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const frame = FRAMES[Math.min(i, FRAMES.length - 1)];
  const captured = FRAMES.slice(0, i + 1).filter((f) => f.state === "captured").length;
  const finished = i >= FRAMES.length;

  useEffect(() => {
    const t = setTimeout(() => (finished ? onDone() : setI(i + 1)), reduce ? 0 : finished ? 700 : 750);
    return () => clearTimeout(t);
  }, [i, finished, onDone, reduce]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <CameraFrame
        overlay={
          <div className="pointer-events-none absolute inset-x-0 top-group flex justify-center" aria-hidden="true">
            {frame.state === "turn" ? (
              <span className="animate-pop-in flex items-center gap-tight rounded-full bg-white px-base py-tight text-sm font-semibold text-camera">
                <Hand className="size-4" /> Page turn detected
              </span>
            ) : frame.state === "captured" ? (
              <span className="animate-pop-in flex items-center gap-tight rounded-full bg-white px-base py-tight text-sm font-semibold text-camera">
                <Check className="size-4" /> Page {frame.page} captured
              </span>
            ) : null}
          </div>
        }
      >
        <div key={frame.page} className="animate-pop-in">
          <HandwrittenPage n={frame.page} />
        </div>
      </CameraFrame>

      <div className="mx-auto w-full max-w-md" role="status" aria-live="polite">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>
            {captured} {captured === 1 ? "page" : "pages"} captured
          </span>
          <span className="text-ink-soft">{PAGES.length} pages in total</span>
        </div>
        <Progress value={captured} max={PAGES.length} label="Pages captured" className="mt-tight" />
        <div className="mt-base">
          <Button variant="ghost" size="sm" onClick={onDone}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
