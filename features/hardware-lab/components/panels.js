"use client";

import { ArrowLeft, ArrowRight, Check, RotateCcw, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { ChipButton } from "@/components/ui/chip-button";
import { Progress } from "@/components/ui/progress";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { PARTS, partById } from "../data/parts";
import { BUILD_STEPS } from "../data/steps";
import { SCENARIOS } from "../data/scenarios";
import { QUIZ } from "../data/quiz";
import { PartInfo } from "./part-info";

const GROUPS = ["Outside", "Shell", "Inside"];

/** Explore: tap a part (in 3D or in the list) to learn about it. */
export function ExplorePanel({ selected, onPick }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <section aria-labelledby="parts-title">
        <h3 id="parts-title" className="mb-tight text-sm font-semibold text-ink-soft">
          Parts ({PARTS.length}) · tap one to learn about it
        </h3>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          {GROUPS.map((g) => (
            <div key={g} className="flex flex-wrap items-center gap-tight">
              <span className="w-16 text-xs font-semibold tracking-wide text-hint uppercase">{g}</span>
              {PARTS.filter((p) => p.group === g).map((p) => (
                <ChipButton key={p.id} onClick={() => onPick(p.id)} aria-pressed={selected === p.id} className={selected === p.id ? "border-accent bg-accent-tint" : ""}>
                  {p.name.split(" (")[0]}
                </ChipButton>
              ))}
            </div>
          ))}
        </div>
      </section>
      {selected ? <PartInfo id={selected} /> : <p className="rounded-field border border-dashed border-line-hover p-base text-ink-soft">Tap any part of the PC, or pick one from the list, to see what it does. Press <strong className="font-semibold text-ink">Open case</strong> to see inside.</p>}
    </div>
  );
}

/** Build: 8 guided steps. Parts float beside the tower; tap one (or press Place part) to put it in. */
export function BuildPanel({ build, onPlace, onNext, onBack, onRestart, onFinish, message }) {
  const { step, placed, done } = build;
  const total = BUILD_STEPS.length;
  const s = BUILD_STEPS[Math.min(step, total - 1)];
  const need = s.parts.filter((p) => !placed.has(p));
  const complete = need.length === 0;
  const last = step === total - 1;

  if (done) {
    return (
      <Card className="grid grid-cols-[minmax(0,1fr)] gap-base border-l-[3px] border-l-success p-group">
        <h3 className="flex items-center gap-tight text-xl font-semibold">
          <Check className="size-6 text-success" aria-hidden="true" /> Your PC is built and running
        </h3>
        <p>The case is closed, the fans are spinning and the lights are on. Everything you placed is working together.</p>
        <div className="flex flex-wrap gap-tight">
          <Button variant="secondary" onClick={onRestart}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Build again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div>
        <div className="mb-hair flex justify-between text-sm font-medium">
          <span>
            Step {step + 1} of {total}
          </span>
          <span className="text-ink-soft tabular-nums">{step}/{total} done</span>
        </div>
        <Progress value={step} max={total} label="Build progress" />
      </div>
      <Card as="section" aria-labelledby="step-title" className="grid grid-cols-[minmax(0,1fr)] gap-base p-group">
        <h3 id="step-title" className="text-xl font-semibold tracking-tight">
          {step + 1}. {s.title}
        </h3>
        <div className="rounded-field border-l-[3px] border-accent bg-accent-tint p-base">
          <p className="text-sm font-semibold text-ink-soft">Why?</p>
          <p>{s.why}</p>
        </div>
        {!last ? (
          <>
            <p className="text-ink-soft">{s.hint}</p>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight">
              {s.parts.map((id) => (
                <li key={id} className="flex items-center justify-between gap-base rounded-field border border-line bg-panel p-tight pl-base">
                  <span className="font-medium">{id === "cables" ? "Power cables" : partById(id).name}</span>
                  {placed.has(id) ? (
                    <Chip tone="success">
                      <Check className="size-3.5" aria-hidden="true" /> Placed
                    </Chip>
                  ) : (
                    <Button size="sm" onClick={() => onPlace(id)}>
                      Place part
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-sm text-hint">The glowing part floats beside the PC. Tap it in 3D, or press “Place part”.</p>
          </>
        ) : (
          <Button size="lg" onClick={onFinish}>
            Close case and power on
          </Button>
        )}
        {message ? (
          <p role="status" className="rounded-field border border-line border-l-[3px] border-l-warning bg-highlight p-base text-sm">
            {message}
          </p>
        ) : null}
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-tight">
        <Button variant="secondary" onClick={onBack} disabled={step === 0}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <Button variant="ghost" onClick={onRestart}>
          Restart
        </Button>
        {!last ? (
          <Button onClick={onNext} disabled={!complete}>
            Next step
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/** Fix: diagnose a fault. Scenario 1 is interactive in 3D; 2 and 3 are short multiple choice. */
export function FixPanel({ fix, onScenario, onInspect, onAnswer, onFix, onRetry }) {
  const sc = SCENARIOS[fix.scenario];
  const answered = fix.answer !== null;
  const correct = answered && fix.answer === sc.correct;
  const inspected = Object.entries(fix.inspected);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <SegmentedControl
        label="Scenario"
        value={String(fix.scenario)}
        onChange={(v) => onScenario(Number(v))}
        options={SCENARIOS.map((s, i) => ({ value: String(i), label: `Fault ${i + 1}` }))}
      />
      <Card as="section" aria-labelledby="scenario-title" className="grid grid-cols-[minmax(0,1fr)] gap-base p-group">
        <h3 id="scenario-title" className="flex items-center gap-tight text-xl font-semibold tracking-tight">
          <Wrench className="size-5 text-accent" aria-hidden="true" /> {sc.title}
        </h3>
        <p>{sc.symptom}</p>
        {sc.clues ? (
          <ul className="list-disc pl-group text-ink-soft">
            {sc.clues.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}
        {sc.full ? (
          <div>
            <p className="text-sm font-semibold text-ink-soft">Inspect the parts: tap them in 3D, or pick one here</p>
            <div className="mt-tight flex flex-wrap gap-tight" role="group" aria-label="Parts to inspect">
              {Object.keys(sc.inspect).map((id) => (
                <ChipButton key={id} onClick={() => onInspect(id)} aria-pressed={id in fix.inspected}>
                  {partById(id).name.split(" (")[0]}
                </ChipButton>
              ))}
            </div>
            {inspected.length ? (
              <ul className="mt-tight grid grid-cols-[minmax(0,1fr)] gap-tight">
                {inspected.map(([id, ok]) => (
                  <li key={id} className="flex gap-tight rounded-field border border-line bg-panel p-tight">
                    {ok ? <Check className="mt-hair size-4 shrink-0 text-success" aria-hidden="true" /> : <X className="mt-hair size-4 shrink-0 text-danger" aria-hidden="true" />}
                    <span>
                      <span className="font-medium">{partById(id).name}: </span>
                      <span className="text-ink-soft">{sc.inspect[id].text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-hair text-sm text-hint">Nothing inspected yet.</p>
            )}
          </div>
        ) : null}
      </Card>

      <fieldset className="grid grid-cols-[minmax(0,1fr)] gap-tight">
        <legend className="mb-tight text-sm font-semibold text-ink-soft">What is the fault?</legend>
        {sc.options.map((o, i) => (
          <label
            key={o}
            className={`flex min-h-12 cursor-pointer items-center gap-tight rounded-field border p-base ${
              answered && i === sc.correct ? "border-success bg-tint" : answered && i === fix.answer ? "border-danger" : "border-line bg-field hover:border-line-hover"
            }`}
          >
            <input type="radio" name="diagnosis" className="size-4 accent-[var(--primary)]" checked={fix.answer === i} disabled={correct} onChange={() => onAnswer(i)} />
            {o}
          </label>
        ))}
      </fieldset>

      {answered ? (
        <Card role="status" className={`border-l-[3px] p-group ${correct ? "border-l-success" : "border-l-danger"}`}>
          <p className="flex items-center gap-tight font-semibold">
            {correct ? <Check className="size-5 text-success" aria-hidden="true" /> : <X className="size-5 text-danger" aria-hidden="true" />}
            {correct ? "Correct diagnosis" : "Not quite"}
          </p>
          <p className="mt-tight">{correct ? sc.explain : "Look at the clues again and think about which part could cause exactly these signs."}</p>
          <div className="mt-base flex flex-wrap items-center gap-tight">
            {correct && sc.full && !fix.fixed ? <Button onClick={onFix}>Fix it</Button> : null}
            {fix.fixed ? (
              <Chip tone="success" className="text-base">
                <Check className="size-4" aria-hidden="true" /> PC boots ✓
              </Chip>
            ) : null}
            {!correct ? (
              <Button variant="secondary" onClick={onRetry}>
                Try again
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

/** Quiz: 6 questions. Answer by tapping the part in 3D or by choosing from the list. */
export function QuizPanel({ quiz, options, onAnswer, onNext, onRestart }) {
  const { i, answers } = quiz;
  const finished = i >= QUIZ.length;
  if (finished) {
    const score = answers.filter((a, n) => a === QUIZ[n].answer).length;
    return (
      <Card as="section" aria-labelledby="score-title" className="grid grid-cols-[minmax(0,1fr)] gap-base p-group">
        <h3 id="score-title" className="text-xl font-semibold">
          Your score: {score} of {QUIZ.length}
        </h3>
        <ol className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          {QUIZ.map((q, n) => {
            const ok = answers[n] === q.answer;
            return (
              <li key={q.q} className="rounded-field border border-line bg-panel p-base">
                <p className="flex gap-tight font-medium">
                  {ok ? <Check className="mt-hair size-4 shrink-0 text-success" aria-hidden="true" /> : <X className="mt-hair size-4 shrink-0 text-danger" aria-hidden="true" />}
                  <span>
                    <span className="sr-only">{ok ? "Correct. " : "Wrong. "}</span>
                    {q.q}
                  </span>
                </p>
                <p className="mt-hair text-sm text-ink-soft">
                  Your answer: {partById(answers[n]).name}. Correct: {partById(q.answer).name}. {q.why}
                </p>
              </li>
            );
          })}
        </ol>
        <div>
          <Button onClick={onRestart}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try the quiz again
          </Button>
        </div>
      </Card>
    );
  }
  const q = QUIZ[i];
  const given = answers[i];
  return (
    <Card as="section" aria-labelledby="quiz-title" className="grid grid-cols-[minmax(0,1fr)] gap-base p-group">
      <div>
        <div className="mb-hair flex justify-between text-sm font-medium">
          <span>
            Question {i + 1} of {QUIZ.length}
          </span>
        </div>
        <Progress value={i} max={QUIZ.length} label="Quiz progress" />
      </div>
      <h3 id="quiz-title" className="text-xl font-semibold tracking-tight">
        {q.q}
      </h3>
      <p className="text-sm text-ink-soft">Tap the part in the 3D scene, or choose from the list.</p>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight sm:grid-cols-2">
        {options.map((id) => (
          <li key={id}>
            <button
              type="button"
              disabled={given !== undefined}
              onClick={() => onAnswer(id)}
              className={`press min-h-12 w-full rounded-field border px-base text-left font-medium ${
                given === undefined ? "border-line bg-field hover:border-line-hover" : id === q.answer ? "border-success bg-tint" : id === given ? "border-danger" : "border-line bg-field opacity-70"
              }`}
            >
              {partById(id).name}
            </button>
          </li>
        ))}
      </ul>
      {given !== undefined ? (
        <p role="status" className={`rounded-field border border-l-[3px] bg-panel p-base ${given === q.answer ? "border-line border-l-success" : "border-line border-l-danger"}`}>
          <span className="font-semibold">{given === q.answer ? "Correct. " : `Not quite. The answer is ${partById(q.answer).name}. `}</span>
          {q.why}
        </p>
      ) : null}
      {given !== undefined ? (
        <div>
          <Button onClick={onNext}>
            {i === QUIZ.length - 1 ? "See my score" : "Next question"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
