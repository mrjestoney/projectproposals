"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Lock } from "lucide-react";
import { StagedProgress } from "@/components/staged-progress";
import { useToast } from "@/components/ui/toast";
import { copyText } from "@/lib/copy-text";
import { CR, INITIAL_ACTIVITY, INITIAL_WARNINGS, VERIFY_STAGES, mcpLines } from "./data/build";
import { INITIAL_TASKS, T13, withDecisions } from "./data/tasks";
import { BuildView } from "./components/build-view";
import { DashboardView } from "./components/dashboard-view";
import { InterviewView } from "./components/interview-view";
import { PlanView } from "./components/plan-view";

const STEPS = [
  { id: "interview", label: "Interview" },
  { id: "plan", label: "Plan" },
  { id: "build", label: "Build" },
  { id: "dashboard", label: "Dashboard" },
];

const LOCK_STAGES = ["Checking for gaps and contradictions…", "Writing the specification…", "Splitting the work into numbered tasks…", "Locking the scope…"];

const initialBuild = { level: "l1", report: "", copied: false, run: null, result: null, cr: null, log: [] };

/**
 * The Xerote prototype: Interview → Plan → Build → Dashboard for a made-up "School Results App". All state lives
 * here, so steps keep their work when you move between them, and "Reset demo" (which remounts this) starts over.
 */
export function Xerote() {
  const toast = useToast();
  const [step, setStep] = useState("interview");
  const [iv, setIv] = useState({ answers: {}, resolved: null, locking: false, locked: false });
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [version, setVersion] = useState(1);
  const [activity, setActivity] = useState([]);
  const [build, setBuild] = useState(initialBuild);
  const runRef = useRef(null);
  const counter = useRef(0);

  const addActivity = useCallback((text) => setActivity((a) => [{ id: `n${++counter.current}`, when: "Just now", text }, ...a]), []);

  const decisions = { approval: iv.answers.q13, grading: iv.answers.q14, reportCards: iv.resolved };
  const shown = withDecisions(tasks, decisions);
  const current = shown.find((t) => t.status === "current") ?? null;
  const doneTasks = shown.filter((t) => t.status === "done");
  const crOpen = build.cr?.status === "open";

  const finishLock = useCallback(() => {
    setIv((v) => ({ ...v, locking: false, locked: true }));
    setActivity(INITIAL_ACTIVITY);
    setStep("plan");
  }, []);

  const verify = (mode, kind) => {
    const lines = mcpLines(current);
    runRef.current = { mode, kind, taskId: current.id, lines, checks: current.checks.length };
    setBuild((b) => ({ ...b, run: { mode, stages: mode === "l2" ? [...lines, ...VERIFY_STAGES] : VERIFY_STAGES }, result: null }));
  };

  const finishRun = useCallback(() => {
    const r = runRef.current;
    if (!r) return;
    runRef.current = null;
    setBuild((b) => ({
      ...b,
      run: null,
      result: { taskId: r.taskId, kind: r.kind },
      cr: r.kind === "problem" && !b.cr ? { status: "open" } : b.cr,
      log: r.mode === "l2" ? r.lines : b.log,
    }));
    addActivity(
      r.kind === "good"
        ? `${r.taskId} report verified: all ${r.checks} checks passed`
        : `${r.taskId} report checked: 1 check failed and an out-of-scope change was found`,
    );
  }, [addActivity]);

  const nextTask = () => {
    setTasks((ts) => {
      const i = ts.findIndex((t) => t.status === "current");
      const next = ts.findIndex((t, j) => j > i && t.status === "pending");
      return ts.map((t, j) => (j === i ? { ...t, status: "done" } : j === next ? { ...t, status: "current" } : t));
    });
    addActivity(`${current.id} done: ${current.title}`);
    setBuild((b) => ({ ...initialBuild, level: b.level }));
  };

  const approve = () => {
    setBuild((b) => ({ ...b, cr: { status: "approved" } }));
    setTasks((ts) => (ts.some((t) => t.id === T13.id) ? ts : [...ts, { ...T13 }]));
    setVersion(2);
    addActivity(`${CR.id} approved: T13 added, the plan is now version 2`);
    toast("Plan is now version 2 (T13 added)");
  };
  const reject = () => {
    setBuild((b) => ({ ...b, cr: { status: "rejected" } }));
    addActivity(`${CR.id} rejected: the fix prompt will remove the button`);
    toast("Rejected: the fix prompt will remove it");
  };

  const warnings = [
    ...INITIAL_WARNINGS,
    ...(build.result?.kind === "problem" ? ["T4: check 3 failed (marks above 100 are accepted).", "T4: out-of-scope change found (a “Delete student” button)."] : []),
    ...(crOpen ? [`${CR.id} is waiting for your decision.`] : []),
  ];

  const enabled = (id) => id === "interview" || iv.locked;

  let content;
  if (iv.locking && !iv.locked) {
    content = <StagedProgress title="Locking the plan…" stages={LOCK_STAGES} onDone={finishLock} titleId="lock-title" />;
  } else if (step === "interview") {
    content = (
      <InterviewView
        iv={iv}
        onAnswer={(id, text) => setIv((v) => ({ ...v, answers: { ...v.answers, [id]: text } }))}
        onResolve={(id) => setIv((v) => ({ ...v, resolved: id }))}
        onLock={() => setIv((v) => ({ ...v, locking: true }))}
        onGoPlan={() => setStep("plan")}
      />
    );
  } else if (step === "plan") {
    content = <PlanView decisions={decisions} version={version} tasks={shown} />;
  } else if (step === "build") {
    content = (
      <BuildView
        tasks={shown}
        current={current}
        doneTasks={doneTasks}
        version={version}
        decisions={decisions}
        build={build}
        setBuild={setBuild}
        onVerify={verify}
        onFinishRun={finishRun}
        onNext={nextTask}
        onApprove={approve}
        onReject={reject}
        onCopy={(text, msg) => copyText(text, toast, msg)}
        onGoDashboard={() => setStep("dashboard")}
      />
    );
  } else {
    content = <DashboardView tasks={shown} current={current} activity={activity} warnings={warnings} crOpen={crOpen} />;
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base p-base md:p-group lg:grid-cols-[12rem_minmax(0,1fr)]">
      <nav aria-label="Steps" className="lg:sticky lg:top-20">
        <ol className="grid grid-cols-4 gap-tight lg:flex lg:flex-col">
          {STEPS.map((s, i) => {
            const active = step === s.id && !(iv.locking && !iv.locked);
            const done = s.id === "interview" && iv.locked;
            return (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  disabled={!enabled(s.id)}
                  title={enabled(s.id) ? undefined : "Lock the plan first"}
                  aria-current={active ? "step" : undefined}
                  onClick={() => setStep(s.id)}
                  className={`flex min-h-14 w-full flex-col items-center justify-center gap-hair rounded-field border px-hair text-xs font-medium transition-colors sm:text-sm lg:min-h-11 lg:flex-row lg:justify-start lg:gap-tight lg:px-base lg:text-base ${
                    active ? "border-transparent bg-primary text-on-primary" : "border-line bg-field text-ink hover:border-line-hover disabled:text-hint disabled:hover:border-line"
                  }`}
                >
                  <span className={`flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${active ? "bg-on-primary/20" : "bg-tint"}`}>
                    {done ? <Check className="size-3.5" aria-hidden="true" /> : enabled(s.id) ? i + 1 : <Lock className="size-3" aria-hidden="true" />}
                  </span>
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="min-w-0">{content}</div>
    </div>
  );
}
