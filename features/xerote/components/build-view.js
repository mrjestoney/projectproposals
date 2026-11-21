"use client";

import { ArrowRight, Copy, PartyPopper, PlugZap, Rocket, ShieldCheck } from "lucide-react";
import { StagedProgress } from "@/components/staged-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  MCP_TOOLS,
  T4_GOOD_REPORT,
  T4_ID,
  T4_PROBLEM_REPORT,
  buildPrompt,
  genericReport,
  verification,
} from "../data/build";
import { CrCard } from "./cr-card";
import { ResultCard } from "./result-card";

export const LEVELS = [
  { value: "l1", label: "Level 1 · Copy-paste" },
  { value: "l2", label: "Level 2 · Connected (MCP)" },
  { value: "l3", label: "Level 3 · Autopilot" },
];

/** Where the current task is in the loop: Xerote → Coding AI → Report → Verify. */
function Loop({ stage }) {
  const nodes = ["Xerote gives the prompt", "Coding AI builds", "Report comes back", "Xerote verifies"];
  return (
    <ol className="flex flex-wrap items-center gap-tight" aria-label="The build loop">
      {nodes.map((n, i) => (
        <li key={n} className="flex items-center gap-tight">
          <span
            aria-current={i === stage ? "step" : undefined}
            className={`rounded-full border px-base py-hair text-sm font-medium ${
              i === stage ? "border-transparent bg-primary text-on-primary" : i < stage ? "border-line bg-tint text-ink" : "border-line bg-field text-ink-soft"
            }`}
          >
            {i + 1}. {n}
          </span>
          {i < nodes.length - 1 ? <ArrowRight className="size-4 text-hint" aria-hidden="true" /> : null}
        </li>
      ))}
    </ol>
  );
}

/** Step 3: the build loop for the current task. */
export function BuildView({ tasks, current, doneTasks, version, decisions, build, setBuild, onVerify, onFinishRun, onNext, onApprove, onReject, onCopy, onGoDashboard }) {
  const { level, report, copied, run, result, cr, log } = build;
  const set = (patch) => setBuild((b) => ({ ...b, ...patch }));

  if (!current) {
    return (
      <EmptyState icon={<PartyPopper className="size-7" />} title="All tasks are done" action={<Button onClick={onGoDashboard}>See the dashboard</Button>}>
        Every task in the plan has been built and verified.
      </EmptyState>
    );
  }

  const prompt = buildPrompt(current, doneTasks, version, decisions);
  const isT4 = current.id === T4_ID;
  const resultTask = result && tasks.find((t) => t.id === result.taskId);
  const vf = result && resultTask ? verification(resultTask, result.kind) : null;
  const crOpen = cr?.status === "open";
  const stage = result || run ? 3 : report.trim() ? 2 : copied || level !== "l1" ? 1 : 0;
  const last = tasks.filter((t) => t.status === "pending").length === 0;
  const nextTask = tasks.find((t) => t.status === "pending");

  const loadSample = (kind) => set({ report: kind === "problem" ? T4_PROBLEM_REPORT : isT4 ? T4_GOOD_REPORT : genericReport(current), result: null });
  const kindOf = (text) => (isT4 && text.trim() === T4_PROBLEM_REPORT.trim() ? "problem" : "good");

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="flex flex-wrap items-center justify-between gap-base">
        <SegmentedControl label="Automation level" options={LEVELS} value={level} onChange={(v) => !run && set({ level: v })} />
        <Chip tone="accent">{current.id} is the current task</Chip>
      </div>
      <Loop stage={stage} />

      <Card as="section" aria-labelledby="task-title" className="p-group">
        <p className="text-sm font-semibold text-ink-soft">Current task</p>
        <h2 id="task-title" className="text-2xl font-semibold tracking-tight">
          {current.id} — {current.title}
        </h2>
        <p className="mt-tight text-ink-soft">{current.goal}</p>
        <p className="mt-tight text-sm text-hint">
          {doneTasks.length} done · {tasks.filter((t) => t.status === "pending").length} to go
        </p>
      </Card>

      {run ? (
        <StagedProgress
          title={run.mode === "l2" ? "Claude Code is working…" : "Verifying…"}
          stages={run.stages}
          onDone={onFinishRun}
          titleId="run-title"
          stepMs={run.mode === "l2" ? 480 : 650}
          className="w-full max-w-none"
        />
      ) : null}

      {!run && level === "l1" ? (
        <>
          <Card as="section" aria-labelledby="prompt-title" className="grid grid-cols-[minmax(0,1fr)] gap-tight p-group">
            <div className="flex flex-wrap items-center justify-between gap-tight">
              <h3 id="prompt-title" className="text-lg font-semibold">
                1. Copy this prompt into your coding AI
              </h3>
              <Button onClick={() => { onCopy(prompt, "Prompt copied"); set({ copied: true }); }}>
                <Copy className="size-4" aria-hidden="true" />
                Copy prompt
              </Button>
            </div>
            <pre tabIndex={0} aria-label={`Prompt for ${current.id}`} className="max-h-96 overflow-auto rounded-field border border-line bg-code p-base font-mono text-[13px] leading-6 whitespace-pre-wrap">{prompt}</pre>
            {copied ? <p className="text-sm text-success">Copied. Now let your coding AI work, then paste its report below.</p> : null}
          </Card>

          <Card as="section" aria-labelledby="report-title" className="grid grid-cols-[minmax(0,1fr)] gap-tight p-group">
            <h3 id="report-title" className="text-lg font-semibold">
              2. Paste the report from your coding AI here
            </h3>
            <textarea
              value={report}
              onChange={(e) => set({ report: e.target.value, result: null })}
              rows={10}
              aria-labelledby="report-title"
              placeholder="Paste the report here…"
              className="w-full rounded-field border border-line bg-panel p-base font-mono text-[13px] leading-6 text-ink"
            />
            <div className="flex flex-wrap gap-tight">
              <Button variant="secondary" size="sm" onClick={() => loadSample("good")}>
                Use sample good report
              </Button>
              <Button variant="secondary" size="sm" onClick={() => loadSample("problem")} disabled={!isT4}>
                Use sample report with a problem
              </Button>
            </div>
            <p className="text-sm text-hint">
              Demo: only the two sample reports for T4 have prepared results. Any other text is checked like the good sample.
            </p>
            <div>
              <Button size="lg" disabled={!report.trim()} onClick={() => onVerify("l1", kindOf(report))}>
                <ShieldCheck className="size-5" aria-hidden="true" />
                Verify
              </Button>
            </div>
          </Card>
        </>
      ) : null}

      {!run && level === "l2" ? (
        <Card as="section" aria-labelledby="mcp-title" className="grid grid-cols-[minmax(0,1fr)] gap-base p-group">
          <div className="flex flex-wrap items-center gap-tight">
            <h3 id="mcp-title" className="flex items-center gap-tight text-lg font-semibold">
              <PlugZap className="size-5 text-accent" aria-hidden="true" />
              Claude Code is connected
            </h3>
            <Chip tone="success">
              <span className="size-2 rounded-full bg-success" aria-hidden="true" /> Connected
            </Chip>
          </div>
          <p className="text-ink-soft">
            Claude Code asks Xerote for its next task and sends its own report. You only press Continue. Tools Xerote offers:
          </p>
          <ul className="flex flex-wrap gap-tight">
            {MCP_TOOLS.map((t) => (
              <li key={t} className="rounded-full border border-line bg-panel px-base font-mono text-[13px]">
                {t}()
              </li>
            ))}
          </ul>
          {log.length ? (
            <pre tabIndex={0} aria-label="MCP log" className="overflow-x-auto rounded-field border border-line bg-code p-base font-mono text-[13px] leading-6">{log.join("\n")}</pre>
          ) : null}
          <div className="flex flex-wrap gap-tight">
            <Button size="lg" onClick={() => onVerify("l2", "good")}>
              Continue
            </Button>
            {isT4 ? (
              <Button variant="secondary" size="lg" onClick={() => onVerify("l2", "problem")}>
                Continue (the agent drifts)
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {!run && level === "l3" ? (
        <Card as="section" aria-labelledby="auto-title" className="grid grid-cols-[minmax(0,1fr)] gap-base p-group">
          <div className="flex flex-wrap items-center gap-tight">
            <h3 id="auto-title" className="flex items-center gap-tight text-lg font-semibold">
              <Rocket className="size-5 text-accent" aria-hidden="true" />
              Autopilot (coming later)
            </h3>
            <Chip tone="warning">Not available yet</Chip>
          </div>
          <p className="text-ink-soft">
            In the full version, Xerote runs the coding agent itself, one task after another, and stops only when it needs you. Until then, use Level 1 or Level 2.
          </p>
          <div>
            <p className="mb-tight text-sm font-semibold text-ink-soft">What you would see: approvals only</p>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight">
              {crOpen ? (
                <li className="rounded-field border border-line border-l-[3px] border-l-warning bg-panel p-base">
                  <p className="font-medium">Approve change request: “Delete student” (add as T13)?</p>
                  <div className="mt-tight flex flex-wrap gap-tight">
                    <Button size="sm" onClick={onApprove}>
                      Approve
                    </Button>
                    <Button size="sm" variant="secondary" onClick={onReject}>
                      Reject
                    </Button>
                  </div>
                </li>
              ) : (
                <li className="rounded-field border border-line bg-panel p-base text-ink-soft">Nothing needs your approval right now.</li>
              )}
              <li className="rounded-field border border-line bg-panel p-base text-ink-soft">
                Deploy to production (T12): you will be asked before it goes live.
              </li>
            </ul>
          </div>
        </Card>
      ) : null}

      {!run && result && vf ? (
        <>
          <ResultCard task={resultTask} kind={result.kind} vf={vf} crStatus={cr?.status} onCopy={onCopy} />
          {result.kind === "good" ? (
            <div className="grid grid-cols-[minmax(0,1fr)] gap-tight">
              {crOpen ? (
                <p role="alert" className="rounded-field border border-line border-l-[3px] border-l-warning bg-highlight p-base text-sm">
                  A change request is waiting for your decision. Decide it before moving on.
                </p>
              ) : null}
              <div>
                <Button size="lg" onClick={onNext} disabled={crOpen}>
                  {last ? "Finish the build" : `Next task (${nextTask.id})`}
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-ink-soft">
              {level === "l1"
                ? "Send the fix prompt to your coding AI, then paste its new report above (or use the sample good report) and verify again."
                : "Xerote sends the fix prompt to Claude Code through MCP. Press Continue to let it submit a new report."}
            </p>
          )}
        </>
      ) : null}

      {cr ? <CrCard status={cr.status} onApprove={onApprove} onReject={onReject} /> : null}
    </div>
  );
}
