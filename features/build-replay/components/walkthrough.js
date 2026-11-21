"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EDGES, NODES, STEPS } from "../data";
import { Diagram } from "./diagram";
import { Inspector } from "./inspector";
import { StepCard } from "./step-card";

/** The step timeline, Back/Next, the step card, and the diagram that grows with each step. */
export function Walkthrough({ step, depth, sel, onGo, onPick, onPickNode, onOpenFile, onShowCode, onSystem }) {
  const s = STEPS[step - 1];
  const last = step === STEPS.length;
  const listRef = useRef(null);

  // Keep the current step visible inside the horizontally scrolling timeline.
  useEffect(() => {
    const list = listRef.current;
    const btn = list?.children[step - 1]?.firstElementChild;
    if (list && btn) list.scrollTo({ left: btn.offsetLeft - list.clientWidth / 2 + btn.clientWidth / 2 });
  }, [step]);

  const nodeIds = Object.keys(NODES).filter((k) => NODES[k].step <= step);
  const edgeIds = EDGES.filter((e) => e.step <= step).map((e) => e.id);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <nav aria-label="Steps">
        <ol ref={listRef} className="relative flex gap-tight overflow-x-auto pb-tight">
          {STEPS.map((x) => {
            const current = x.n === step;
            const done = x.n < step;
            return (
              <li key={x.n} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onGo(x.n)}
                  aria-current={current ? "step" : undefined}
                  aria-label={`Step ${x.n}: ${x.title}${done ? " (done)" : ""}`}
                  className={`press flex min-h-11 items-center gap-hair rounded-full border px-base text-sm font-medium whitespace-nowrap transition-colors ${
                    current
                      ? "border-transparent bg-primary text-white"
                      : done
                        ? "border-line bg-tint text-ink hover:border-line-hover"
                        : "border-line bg-field text-ink-soft hover:border-line-hover"
                  }`}
                >
                  {done ? <Check className="size-4" aria-hidden="true" /> : null}
                  {x.n} · {x.type}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
          <StepCard step={s} depth={depth} onShowCode={onShowCode} onOpenFile={onOpenFile} onPickEdge={(id) => onPick({ type: "edge", id })} />
          <div className="flex items-center justify-between gap-base">
            <Button variant="secondary" onClick={() => onGo(step - 1)} disabled={step === 1}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
            <span className="text-sm text-ink-soft tabular-nums" aria-hidden="true">
              {step} / {STEPS.length}
            </span>
            <Button onClick={() => (last ? onSystem() : onGo(step + 1))}>
              {last ? "See the System" : "Next"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <p className="hidden text-sm text-hint lg:block">Tip: use the ← and → keys to move between steps.</p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-base lg:sticky lg:top-20">
          <h3 className="text-sm font-semibold text-ink-soft">System so far</h3>
          <Diagram
            label="System diagram so far"
            nodeIds={nodeIds}
            edgeIds={edgeIds}
            freshNodes={s.newNodes}
            freshEdges={s.newEdges}
            sel={sel}
            onPick={onPick}
          />
          <Inspector
            sel={sel}
            limitStep={step}
            depth={depth}
            onPickNode={onPickNode}
            onOpenFile={onOpenFile}
            onJump={onGo}
            onShowCode={onShowCode}
          />
        </div>
      </div>
    </div>
  );
}
