"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { FILES, NODES, stepTitle } from "../data";
import { ChipButton, TextButton } from "./chip-button";
import { FullCode } from "./code-block";

/** Every file with its purpose, the step that created it and the steps that changed it. */
export function FilesView({ file, depth, onOpenFile, onPickNode, onJump, onShowCode }) {
  const F = FILES[file];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base lg:grid-cols-[16rem_minmax(0,1fr)]">
      <nav aria-label="Files">
        <ul className="flex gap-tight overflow-x-auto pb-tight lg:flex-col lg:overflow-visible lg:pb-0">
          {Object.keys(FILES).map((f) => {
            const active = f === file;
            return (
              <li key={f} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenFile(f)}
                  aria-current={active ? "true" : undefined}
                  className={`press flex min-h-11 w-full flex-col justify-center rounded-field border px-base py-tight text-left transition-colors ${
                    active ? "border-accent bg-accent-tint" : "border-line bg-field hover:border-line-hover"
                  }`}
                >
                  <span className="font-mono text-[13px] font-medium">{f}</span>
                  <span className="text-xs whitespace-nowrap text-ink-soft">
                    {NODES[FILES[f].part].label} · from Step {FILES[f].created}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Card as="section" aria-label={`File ${file}`} className="min-w-0 p-group">
        <h2 className="font-mono text-xl font-semibold break-all">{file}</h2>
        <p className="mt-tight">{F.purpose}</p>
        <dl className="mt-group grid grid-cols-[minmax(0,1fr)] gap-base">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-hair">
            <dt className="text-sm font-semibold text-ink-soft">Part of</dt>
            <dd>
              <ChipButton onClick={() => onPickNode(F.part)}>{NODES[F.part].label}</ChipButton>
            </dd>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-hair">
            <dt className="text-sm font-semibold text-ink-soft">Created</dt>
            <dd>
              <TextButton onClick={() => onJump(F.created)}>
                Step {F.created} · {stepTitle(F.created)}
              </TextButton>
            </dd>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-hair">
            <dt className="text-sm font-semibold text-ink-soft">Changed</dt>
            <dd className="grid">
              {F.changedIn.length ? (
                F.changedIn.map((n) => (
                  <TextButton key={n} onClick={() => onJump(n)}>
                    Step {n} · {stepTitle(n)}
                  </TextButton>
                ))
              ) : (
                <Chip className="w-fit">Never changed after it was created</Chip>
              )}
            </dd>
          </div>
        </dl>
        <div className="mt-group">
          {depth === "code" ? (
            <FullCode code={F.code} />
          ) : (
            <Button variant="secondary" onClick={onShowCode}>
              Show code
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
