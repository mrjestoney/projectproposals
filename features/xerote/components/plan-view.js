"use client";

import { useState } from "react";
import { Check, ChevronDown, Circle, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { RULE_TEXT } from "../data/interview";
import { CONSTRAINTS, ENTITIES, FEATURES, PROJECT, ROLES, SCREENS } from "../data/project";

const STATUS = {
  done: { label: "Done", tone: "success" },
  current: { label: "Current", tone: "accent" },
  pending: { label: "Pending", tone: "neutral" },
};

function SpecCard({ title, children, className = "" }) {
  return (
    <Card as="section" aria-label={title} className={`min-w-0 p-group ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-tight">{children}</div>
    </Card>
  );
}

function TaskRow({ task }) {
  const [open, setOpen] = useState(false);
  const s = STATUS[task.status];
  return (
    <li className="rounded-field border border-line bg-field">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`task-${task.id}`}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center gap-base px-base text-left"
      >
        <span className="w-9 shrink-0 font-mono text-sm font-semibold">{task.id}</span>
        <span className="min-w-0 flex-1 font-medium">{task.title}</span>
        {task.added ? <Chip tone="warning">Added in v2</Chip> : null}
        <Chip tone={s.tone}>
          {task.status === "done" ? <Check className="size-3.5" aria-hidden="true" /> : task.status === "current" ? <Circle className="size-3 fill-current" aria-hidden="true" /> : null}
          {s.label}
        </Chip>
        <ChevronDown className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <div id={`task-${task.id}`} className="animate-rise grid grid-cols-[minmax(0,1fr)] gap-base border-t border-line p-base">
          <p>
            <span className="font-semibold">Goal: </span>
            {task.goal}
          </p>
          <div>
            <p className="text-sm font-semibold text-ink-soft">Files area</p>
            <ul className="mt-hair flex flex-wrap gap-tight">
              {task.files.map((f) => (
                <li key={f} className="rounded-full border border-line bg-panel px-tight font-mono text-[13px]">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-soft">Done when…</p>
            <ol className="mt-hair list-decimal space-y-hair pl-group">
              {task.checks.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </li>
  );
}

/** Step 2: the locked plan: spec cards, a "Locked" badge with the version, and the numbered task list. */
export function PlanView({ decisions, version, tasks }) {
  const done = tasks.filter((t) => t.status === "done").length;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="flex flex-wrap items-center gap-tight">
        <Chip tone="success" className="text-base">
          <Lock className="size-4" aria-hidden="true" /> Locked
        </Chip>
        <Chip className="text-base">Version {version} · approved by you</Chip>
        {version > 1 ? <Chip tone="warning">v2 added task T13</Chip> : null}
        <span className="text-sm text-ink-soft">Nothing outside this plan is built unless you approve a change.</span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base md:grid-cols-2">
        <SpecCard title="Purpose">
          <p>{PROJECT.purpose}</p>
          <p className="mt-tight text-sm text-ink-soft">
            Tool: {PROJECT.tool} · Hosting: {PROJECT.hosting} · Stack: {PROJECT.stack}
          </p>
        </SpecCard>

        <SpecCard title="Users & roles">
          <div className="overflow-x-auto rounded-field border border-line" tabIndex={0} role="region" aria-label="Permissions table, scrollable">
            <table className="w-full min-w-[22rem] border-collapse text-sm">
              <thead>
                <tr className="bg-accent-tint text-left">
                  {ROLES.head.map((h) => (
                    <th key={h} className="px-tight py-tight font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROLES.rows.map((r) => (
                  <tr key={r[0]} className="border-t border-line">
                    {r.map((c, i) => (
                      <td key={i} className="px-tight py-tight">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpecCard>

        <SpecCard title="Features" className="md:col-span-2">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight md:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f.name} className="rounded-field border border-line bg-panel p-base">
                <p className="font-semibold">{f.name}</p>
                <p className="mt-hair text-sm text-ink-soft">
                  <span className="font-medium text-ink">Done when: </span>
                  {f.done}
                </p>
              </li>
            ))}
          </ul>
        </SpecCard>

        <SpecCard title="Data">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-hair">
            {ENTITIES.map(([n, d]) => (
              <li key={n}>
                <span className="font-mono text-[13px] font-semibold">{n}</span> <span className="text-ink-soft">· {d}</span>
              </li>
            ))}
          </ul>
        </SpecCard>

        <SpecCard title="Screens">
          <ul className="flex flex-wrap gap-tight">
            {SCREENS.map((s) => (
              <li key={s}>
                <Chip>{s}</Chip>
              </li>
            ))}
          </ul>
        </SpecCard>

        <SpecCard title="Rules (your decisions)">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight">
            <li>
              <span className="font-semibold">Grading scale. </span>
              {decisions.grading === "Custom" || (decisions.grading && !decisions.grading.startsWith("NECTA")) ? `Custom: ${decisions.grading}` : decisions.grading}
            </li>
            <li>
              <span className="font-semibold">Approval lock. </span>
              {RULE_TEXT.approval[decisions.approval] ?? decisions.approval}
            </li>
            <li>
              <span className="font-semibold">Report cards. </span>
              {RULE_TEXT.reportCards[decisions.reportCards]}
            </li>
          </ul>
        </SpecCard>

        <SpecCard title="Constraints">
          <ul className="list-disc pl-group">
            {CONSTRAINTS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </SpecCard>
      </div>

      <section aria-labelledby="tasks-title" className="grid grid-cols-[minmax(0,1fr)] gap-tight">
        <h3 id="tasks-title" className="text-xl font-semibold">
          Tasks · {done} of {tasks.length} done
        </h3>
        <ol className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </ol>
      </section>
    </div>
  );
}
