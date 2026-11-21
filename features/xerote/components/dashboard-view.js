"use client";

import { AlertTriangle, Check, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { SYSTEM_LINKS, SYSTEM_PARTS } from "../data/build";

function Ring({ done, total }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-36 shrink-0" role="img" aria-label={`${done} of ${total} tasks done`}>
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-line" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className="stroke-accent transition-[stroke-dashoffset] duration-500"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - (total ? done / total : 0))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums">
          {done}/{total}
        </span>
        <span className="text-sm text-ink-soft">tasks done</span>
      </div>
    </div>
  );
}

function partStatus(part, tasks) {
  const mine = tasks.filter((t) => part.tasks.includes(t.id));
  if (mine.length && mine.every((t) => t.status === "done")) return "done";
  if (mine.some((t) => t.status === "done" || t.status === "current")) return "progress";
  return "todo";
}
const STATUS_TEXT = { done: "Done", progress: "In progress", todo: "Not started" };

/** The system so far: finished parts are filled, parts in progress are outlined, the rest are dashed. */
function SystemDiagram({ tasks }) {
  const byId = Object.fromEntries(SYSTEM_PARTS.map((p) => [p.id, p]));
  return (
    <div className="overflow-x-auto rounded-field border border-line bg-field">
      <svg viewBox="0 0 420 260" role="group" aria-label="System diagram so far" className="block h-auto w-full min-w-[22rem]">
        {SYSTEM_LINKS.map(([a, b]) => (
          <line key={a + b} x1={byId[a].x} y1={byId[a].y + 22} x2={byId[b].x} y2={byId[b].y - 22} className="stroke-line-hover" strokeWidth="1.5" />
        ))}
        {SYSTEM_PARTS.map((p) => {
          const st = partStatus(p, tasks);
          return (
            <g key={p.id} role="img" aria-label={`${p.label}: ${STATUS_TEXT[st]}`}>
              <rect
                x={p.x - 48}
                y={p.y - 22}
                width="96"
                height="44"
                rx="8"
                strokeWidth={st === "todo" ? 1.5 : 2.5}
                strokeDasharray={st === "todo" ? "5 4" : undefined}
                className={st === "done" ? "fill-tint stroke-success" : st === "progress" ? "fill-accent-tint stroke-accent" : "fill-field stroke-line-hover"}
              />
              <text x={p.x} y={p.y - 3} textAnchor="middle" className="fill-ink text-[14px] font-semibold">
                {p.label}
              </text>
              <text x={p.x} y={p.y + 14} textAnchor="middle" className="fill-ink-soft text-[11px]">
                {STATUS_TEXT[st]}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="border-t border-line px-base py-tight text-xs text-hint sm:hidden">Swipe sideways to see the whole diagram.</p>
    </div>
  );
}

/** Step 4: the dashboard, in plain language. */
export function DashboardView({ tasks, current, activity, warnings, crOpen }) {
  const done = tasks.filter((t) => t.status === "done").length;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="grid grid-cols-[minmax(0,1fr)] items-stretch gap-base md:grid-cols-[auto_minmax(0,1fr)]">
        <Card className="flex items-center justify-center p-group">
          <Ring done={done} total={tasks.length} />
        </Card>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-base sm:grid-cols-2">
          <Card className="p-group">
            <p className="text-sm font-semibold text-ink-soft">Current task</p>
            {current ? (
              <>
                <p className="mt-hair text-xl font-semibold">
                  {current.id} — {current.title}
                </p>
                <p className="mt-hair text-sm text-ink-soft">{current.goal}</p>
              </>
            ) : (
              <p className="mt-hair text-xl font-semibold">All tasks are done</p>
            )}
          </Card>
          <Card className="p-group">
            <p className="text-sm font-semibold text-ink-soft">Open change requests</p>
            <p className="mt-hair text-3xl font-semibold tabular-nums">{crOpen ? 1 : 0}</p>
            <p className="mt-hair text-sm text-ink-soft">{crOpen ? "One is waiting for your decision." : "Nothing is waiting for you."}</p>
          </Card>
          <Card className="p-group sm:col-span-2">
            <h3 className="flex items-center gap-tight text-sm font-semibold text-ink-soft">
              <AlertTriangle className="size-4" aria-hidden="true" /> Warnings · {warnings.length}
            </h3>
            {warnings.length ? (
              <ul className="mt-tight grid grid-cols-[minmax(0,1fr)] gap-tight">
                {warnings.map((w) => (
                  <li key={w} className="rounded-field border border-line border-l-[3px] border-l-warning bg-panel p-tight">
                    {w}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-tight text-ink-soft">No warnings.</p>
            )}
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base lg:grid-cols-2">
        <section aria-labelledby="sys-title" className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          <h3 id="sys-title" className="text-lg font-semibold">
            The system so far
          </h3>
          <SystemDiagram tasks={tasks} />
          <ul className="flex flex-wrap gap-tight text-sm" aria-label="Legend">
            <li>
              <Chip tone="success">
                <Check className="size-3.5" aria-hidden="true" /> Done
              </Chip>
            </li>
            <li>
              <Chip tone="accent">
                <Circle className="size-3 fill-current" aria-hidden="true" /> In progress
              </Chip>
            </li>
            <li>
              <Chip>Not started</Chip>
            </li>
          </ul>
        </section>

        <section aria-labelledby="act-title" className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          <h3 id="act-title" className="text-lg font-semibold">
            Recent activity
          </h3>
          <ol className="grid grid-cols-[minmax(0,1fr)] gap-0 border-l-2 border-line pl-base">
            {activity.map((a) => (
              <li key={a.id} className="relative pb-base last:pb-0">
                <span aria-hidden="true" className="absolute top-[0.45rem] -left-[calc(var(--spacing-base)+5px)] size-2.5 rounded-full bg-accent" />
                <p className="text-xs text-hint">{a.when}</p>
                <p>{a.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
