"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { STEPS } from "./data";
import { FilesView } from "./components/files-view";
import { IntroCard, SummaryCard, Working } from "./components/start-screen";
import { SystemView } from "./components/system-view";
import { Walkthrough } from "./components/walkthrough";

const VIEWS = [
  { value: "walk", label: "Walkthrough" },
  { value: "system", label: "System" },
  { value: "files", label: "Files" },
];
const DEPTHS = [
  { value: "story", label: "Level 1 · Story" },
  { value: "code", label: "Level 2 · Code" },
];

/**
 * The Build Replay prototype. All state lives here, so "Reset demo" (which remounts this component) returns to the
 * start screen. phase: start → working → summary → app. Opens with the Booking box selected in the System view.
 */
export function BuildReplay() {
  const [phase, setPhase] = useState("start");
  const [view, setView] = useState("walk");
  const [depth, setDepth] = useState("story");
  const [step, setStep] = useState(1);
  const [walkSel, setWalkSel] = useState(null);
  const [sysSel, setSysSel] = useState({ type: "node", id: "booking" });
  const [file, setFile] = useState("booking.js");
  const root = useRef(null);

  const toTop = () => requestAnimationFrame(() => root.current?.scrollIntoView({ block: "start" }));

  const go = useCallback((n) => {
    setStep(Math.max(1, Math.min(STEPS.length, n)));
    setWalkSel(null);
    setView("walk");
  }, []);
  const jump = (n) => {
    go(n);
    toTop();
  };
  const openFile = (f) => {
    setFile(f);
    setView("files");
    toTop();
  };
  const pickNode = (id) => {
    if (view === "walk") setWalkSel({ type: "node", id });
    else {
      setSysSel({ type: "node", id });
      setView("system");
    }
  };
  const showCode = () => setDepth("code");
  const finish = useCallback(() => setPhase("summary"), []);
  const enter = (v) => {
    setView(v);
    setPhase("app");
  };

  // ← and → move between steps in the walkthrough (not while typing or choosing in a control).
  useEffect(() => {
    if (phase !== "app" || view !== "walk") return;
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, select") || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") step === STEPS.length ? setView("system") : go(step + 1);
      if (e.key === "ArrowLeft" && step > 1) go(step - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, view, step, go]);

  return (
    <div ref={root} className="scroll-mt-20 p-base md:p-group">
      {phase === "start" ? <IntroCard onReconstruct={() => setPhase("working")} onSkipIntro={() => enter("walk")} /> : null}
      {phase === "working" ? <Working onDone={finish} /> : null}
      {phase === "summary" ? <SummaryCard onStart={() => enter("walk")} onExplore={enter} /> : null}

      {phase === "app" ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
          <div className="flex flex-wrap items-center justify-between gap-base">
            <SegmentedControl label="View" options={VIEWS} value={view} onChange={setView} />
            <SegmentedControl label="Depth" options={DEPTHS} value={depth} onChange={setDepth} />
          </div>

          {view === "walk" ? (
            <Walkthrough
              step={step}
              depth={depth}
              sel={walkSel}
              onGo={go}
              onPick={setWalkSel}
              onPickNode={pickNode}
              onOpenFile={openFile}
              onShowCode={showCode}
              onSystem={() => setView("system")}
            />
          ) : null}
          {view === "system" ? (
            <SystemView
              sel={sysSel}
              depth={depth}
              onPick={setSysSel}
              onPickNode={pickNode}
              onOpenFile={openFile}
              onJump={jump}
              onShowCode={showCode}
            />
          ) : null}
          {view === "files" ? (
            <FilesView file={file} depth={depth} onOpenFile={setFile} onPickNode={pickNode} onJump={jump} onShowCode={showCode} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
