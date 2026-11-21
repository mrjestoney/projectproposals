"use client";

import { useEffect, useState } from "react";
import { Check, FolderGit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Progress } from "@/components/ui/progress";
import { FILES, REPO_URL, STEPS } from "../data";

const STAGES = [
  "Downloading repository…",
  `Reading ${Object.keys(FILES).length} files and ${STEPS.length} commits…`,
  "Mapping how files connect…",
  "Grouping changes into steps…",
  "Writing explanations…",
];

/** B1: the first screen. */
export function IntroCard({ onReconstruct, onSkipIntro }) {
  const [url, setUrl] = useState(REPO_URL);
  return (
    <Card as="section" aria-labelledby="intro-title" className="mx-auto max-w-xl p-group md:p-section">
      <h2 id="intro-title" className="text-2xl font-semibold tracking-tight">
        Understand this system
      </h2>
      <p className="mt-tight text-ink-soft">Paste a GitHub link. Build Replay shows how the software was built, one step at a time.</p>
      <form
        className="mt-group grid grid-cols-[minmax(0,1fr)] gap-base"
        onSubmit={(e) => {
          e.preventDefault();
          onReconstruct();
        }}
      >
        <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
          Repository link
          <input
            type="text"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="h-12 w-full rounded-field border border-line bg-panel px-base text-base font-normal text-ink hover:border-line-hover"
          />
        </label>
        <Button type="submit" size="lg" full>
          Reconstruct
        </Button>
      </form>
      <p className="mt-base text-center text-sm text-hint">This demo always uses the same sample project, whatever you type.</p>
      <div className="mt-tight text-center">
        <button type="button" onClick={onSkipIntro} className="min-h-11 text-sm font-medium text-accent underline underline-offset-4">
          Skip intro
        </button>
      </div>
    </Card>
  );
}

/** The simulated reconstruction. Skippable; with reduced motion it runs through instantly. */
export function Working({ onDone }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => (i >= STAGES.length ? onDone() : setI(i + 1)), reduce ? 0 : 650);
    return () => clearTimeout(t);
  }, [i, onDone]);

  return (
    <Card as="section" aria-labelledby="working-title" className="mx-auto max-w-xl p-group md:p-section">
      <h2 id="working-title" className="text-2xl font-semibold tracking-tight">
        Reconstructing…
      </h2>
      <Progress value={i} max={STAGES.length} label="Reconstruction progress" className="mt-base" />
      <ol className="mt-group grid grid-cols-[minmax(0,1fr)] gap-tight" aria-live="polite">
        {STAGES.map((s, n) => {
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

/** The project summary shown when reconstruction finishes. */
export function SummaryCard({ onStart, onExplore }) {
  return (
    <Card as="section" aria-labelledby="summary-title" className="mx-auto max-w-xl p-group md:p-section">
      <div className="flex items-center gap-base">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-field bg-accent-tint text-accent">
          <FolderGit2 className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id="summary-title" className="text-2xl font-semibold tracking-tight">
            booking-app
          </h2>
          <p className="truncate text-sm text-hint">{REPO_URL}</p>
        </div>
      </div>
      <p className="mt-base text-lg">A small website where customers log in and book a room.</p>
      <ul className="mt-base flex flex-wrap gap-tight" aria-label="Project facts">
        <li>
          <Chip>{Object.keys(FILES).length} files</Chip>
        </li>
        <li>
          <Chip>{STEPS.length} steps</Chip>
        </li>
        <li>
          <Chip tone="warning">History quality: Partial (some steps reconstructed)</Chip>
        </li>
      </ul>
      <div className="mt-group grid grid-cols-[minmax(0,1fr)] gap-tight">
        <Button size="lg" full onClick={onStart}>
          Start walkthrough
        </Button>
        <div className="grid grid-cols-2 gap-tight">
          <Button variant="secondary" onClick={() => onExplore("files")}>
            Explore: Files
          </Button>
          <Button variant="secondary" onClick={() => onExplore("system")}>
            Explore: System
          </Button>
        </div>
      </div>
    </Card>
  );
}
