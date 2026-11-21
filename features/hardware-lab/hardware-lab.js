"use client";

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Box, Cpu, Eye, Maximize2, Power, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { QUIZ } from "./data/quiz";
import { PART_IDS, partById } from "./data/parts";
import { SCENARIOS } from "./data/scenarios";
import { BUILD_START, BUILD_STEPS } from "./data/steps";
import { Fallback } from "./components/fallback";
import { BuildPanel, ExplorePanel, FixPanel, QuizPanel } from "./components/panels";
import Scene from "./lazy-scene";

const MODES = [
  { value: "explore", label: "Explore" },
  { value: "build", label: "Build" },
  { value: "fix", label: "Fix" },
  { value: "quiz", label: "Quiz" },
];
const INTERNAL = new Set(PART_IDS.filter((id) => partById(id).group === "Inside"));
const STEP_OF = Object.fromEntries(BUILD_STEPS.flatMap((s, i) => s.parts.map((p) => [p, i])));

const newBuild = () => ({ step: 0, placed: new Set(BUILD_START), done: false });
const newFix = (scenario = 0) => ({ scenario, inspected: {}, answer: null, fixed: false });
const newQuiz = () => ({ i: 0, answers: [], tapped: null });

let webglChecked = null;
function hasWebGL() {
  if (webglChecked === null) {
    try {
      const c = document.createElement("canvas");
      webglChecked = Boolean(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      webglChecked = false;
    }
  }
  return webglChecked;
}
const noSubscribe = () => () => {};

/** Quiz answer choices: the right part plus three others, in a fixed order. */
function quizOptions(i) {
  const answer = QUIZ[i].answer;
  const others = PART_IDS.filter((id) => id !== answer && partById(id).group === "Inside");
  const picks = [others[(i * 2) % others.length], others[(i * 2 + 3) % others.length], others[(i * 2 + 5) % others.length]];
  const list = [...new Set([answer, ...picks])];
  return list.sort((a, b) => ((a.charCodeAt(0) * (i + 3)) % 7) - ((b.charCodeAt(0) * (i + 3)) % 7));
}

/**
 * The 3D Hardware Lab prototype: a desk with a monitor, keyboard, mouse and a PC tower. Explore, Build, Fix and Quiz.
 * All state lives here, so "Reset demo" (which remounts this) starts over.
 */
export function HardwareLab({ accent }) {
  const reduceMotion = useReducedMotion();
  // null on the server (and during hydration), true or false in the browser: so the first paint always matches.
  const webgl = useSyncExternalStore(noSubscribe, hasWebGL, () => null);
  const [mode, setModeState] = useState("explore");
  const [selected, setSelected] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const [nonce, setNonce] = useState(0);
  const [explode, setExplode] = useState(false);
  const [caseOpen, setCaseOpen] = useState(false);
  const [powered, setPowered] = useState(false);
  const [build, setBuild] = useState(newBuild);
  const [buildMsg, setBuildMsg] = useState("");
  const [fix, setFix] = useState(newFix);
  const [quiz, setQuiz] = useState(newQuiz);
  const live = useRef(null);

  const focus = useCallback((id) => {
    setFocusId(id);
    setNonce((n) => n + 1);
  }, []);

  const setMode = (m) => {
    setModeState(m);
    setSelected(null);
    setExplode(false);
    setBuildMsg("");
    setPowered(false);
    setCaseOpen(m !== "explore");
    if (m === "build") setBuild(newBuild());
    if (m === "fix") setFix(newFix());
    if (m === "quiz") setQuiz(newQuiz());
    focus(null);
  };

  // ---- build helpers
  const place = (id) => {
    setBuild((b) => ({ ...b, placed: new Set([...b.placed, id]) }));
    setBuildMsg("");
    focus(id === "cables" ? "psu" : id);
  };
  const step = BUILD_STEPS[Math.min(build.step, BUILD_STEPS.length - 1)];

  const onPick = (id) => {
    if (id === null) {
      if (mode === "explore") setSelected(null);
      return;
    }
    if (mode === "explore") {
      setSelected(id);
      if (id === "case" || INTERNAL.has(id)) setCaseOpen(true);
      focus(id);
    } else if (mode === "build") {
      if (build.done) return;
      if (step.parts.includes(id) && !build.placed.has(id)) place(id);
      else if (id in STEP_OF && STEP_OF[id] > build.step) setBuildMsg("Not yet. Follow the steps in order.");
      else setBuildMsg(`That is not the part for this step. Look for the glowing part that floats beside the PC.`);
    } else if (mode === "fix") {
      const sc = SCENARIOS[fix.scenario];
      if (sc.full && id in sc.inspect) setFix((f) => ({ ...f, inspected: { ...f.inspected, [id]: sc.inspect[id].ok } }));
      setSelected(id);
      focus(id);
    } else if (mode === "quiz") {
      answerQuiz(id);
    }
  };

  const answerQuiz = (id) => {
    setQuiz((q) => (q.answers[q.i] !== undefined ? q : { ...q, answers: [...q.answers, id], tapped: id }));
  };

  const ui = useMemo(() => {
    const partStates = {};
    const tints = {};
    const tags = {};
    if (mode === "build") {
      for (const [id, s] of Object.entries(STEP_OF)) {
        if (build.placed.has(id)) partStates[id] = "placed";
        else if (s === build.step) {
          partStates[id] = "floating";
          tints[id] = "hint";
        } else partStates[id] = "hidden";
      }
    }
    // In explode view the monitor, keyboard and mouse step aside so the exploded parts and labels are clear.
    if (explode) for (const id of ["monitor", "keyboard", "mouse"]) partStates[id] = "hidden";
    const sc = SCENARIOS[fix.scenario];
    if (mode === "fix" && sc.full) {
      for (const [id, ok] of Object.entries(fix.inspected)) {
        tints[id] = ok ? "good" : "bad";
        if (!ok && !fix.fixed) tags[id] = sc.inspect[id].tag;
      }
      if (fix.fixed) for (const id of Object.keys(fix.inspected)) tints[id] = "good";
    }
    if (mode === "quiz" && quiz.answers[quiz.i] !== undefined) {
      tints[QUIZ[quiz.i].answer] = "good";
      if (quiz.answers[quiz.i] !== QUIZ[quiz.i].answer) tints[quiz.answers[quiz.i]] = "bad";
    }
    return {
      mode, selected, focusId, nonce, explode, labels: true, caseOpen, powered, accent, reduceMotion,
      partStates, tints, tags,
      flags: {
        dust: mode === "fix" && sc.visual === "dust",
        cablesMissing: mode === "fix" && sc.visual === "cable",
        ramUnseated: mode === "fix" && sc.id === "ram" && !fix.fixed,
      },
      selectable: () => true,
      onPick,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selected, focusId, nonce, explode, caseOpen, powered, accent, reduceMotion, build, fix, quiz]);

  const toggleExplode = () => {
    if (!explode) setCaseOpen(true);
    setExplode(!explode);
    focus(explode ? null : "__explode");
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base p-base md:p-group lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
      {/* Below 768px the scene comes first, then the controls, then the panel (see the order classes). */}
      <div className="flex flex-wrap items-center justify-between gap-base max-md:order-2 lg:col-span-2">
        <SegmentedControl label="Mode" options={MODES} value={mode} onChange={setMode} />
        <div className="flex flex-wrap gap-tight" role="group" aria-label="Scene controls">
          <Button variant="secondary" size="sm" onClick={() => setCaseOpen((o) => !o)} aria-pressed={caseOpen}>
            <Eye className="size-4" aria-hidden="true" />
            {caseOpen ? "Close case" : "Open case"}
          </Button>
          <Button variant="secondary" size="sm" onClick={toggleExplode} aria-pressed={explode}>
            <Maximize2 className="size-4" aria-hidden="true" />
            {explode ? "Assemble" : "Explode"}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setPowered((p) => !p)} aria-pressed={powered}>
            <Power className="size-4" aria-hidden="true" />
            {powered ? "Power off" : "Power on"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => focus(null)}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset view
          </Button>
        </div>
      </div>

        <div className="relative h-[55vh] min-h-[22rem] overflow-hidden rounded-field border border-line bg-panel max-md:order-1 lg:sticky lg:top-20 lg:h-[36rem]">
          {webgl === null ? (
            <div className="flex h-full items-center justify-center text-ink-soft" role="status">
              Loading the 3D scene…
            </div>
          ) : webgl ? (
            <Scene ui={ui} />
          ) : (
            <Fallback selected={selected} onPick={onPick} />
          )}
          <p className="pointer-events-none absolute right-tight bottom-tight left-tight flex items-center gap-hair text-xs text-hint">
            <Cpu className="size-3.5 shrink-0" aria-hidden="true" />
            Drag to turn · pinch or scroll to zoom · tap a part
            <Box className="sr-only" aria-hidden="true" />
          </p>
        </div>

        <div className="min-w-0 max-md:order-3" ref={live}>
          {mode === "explore" ? <ExplorePanel selected={selected} onPick={onPick} /> : null}
          {mode === "build" ? (
            <BuildPanel
              build={build}
              message={buildMsg}
              onPlace={place}
              onNext={() => {
                setBuild((b) => ({ ...b, step: b.step + 1 }));
                setBuildMsg("");
                focus(null);
              }}
              onBack={() => {
                setBuild((b) => {
                  const prev = BUILD_STEPS[b.step - 1].parts;
                  const placed = new Set(b.placed);
                  prev.forEach((p) => placed.delete(p));
                  return { ...b, step: b.step - 1, placed };
                });
                setBuildMsg("");
              }}
              onRestart={() => {
                setBuild(newBuild());
                setBuildMsg("");
                setPowered(false);
                setCaseOpen(true);
              }}
              onFinish={() => {
                setBuild((b) => ({ ...b, done: true, step: b.step }));
                setCaseOpen(false);
                setPowered(true);
                focus(null);
              }}
            />
          ) : null}
          {mode === "fix" ? (
            <FixPanel
              fix={fix}
              onScenario={(n) => {
                setFix(newFix(n));
                setSelected(null);
                setPowered(false);
                const visual = SCENARIOS[n].visual;
                focus(visual === "dust" ? "cooler" : visual === "cable" ? "psu" : null);
              }}
              onInspect={onPick}
              onAnswer={(i) => setFix((f) => ({ ...f, answer: i }))}
              onRetry={() => setFix((f) => ({ ...f, answer: null }))}
              onFix={() => {
                setFix((f) => ({ ...f, fixed: true }));
                setPowered(true);
                focus("ram");
              }}
            />
          ) : null}
          {mode === "quiz" ? (
            <QuizPanel
              quiz={quiz}
              options={quiz.i < QUIZ.length ? quizOptions(quiz.i) : []}
              onAnswer={answerQuiz}
              onNext={() => setQuiz((q) => ({ ...q, i: q.i + 1, tapped: null }))}
              onRestart={() => setQuiz(newQuiz())}
            />
          ) : null}
        </div>
    </div>
  );
}
