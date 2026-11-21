"use client";

import { useRef, useState } from "react";
import { AlertTriangle, ArrowDown, Check, Lock, Circle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { ChipButton } from "@/components/ui/chip-button";
import { ANSWERED, CATEGORIES, CONTRADICTION, OPEN } from "../data/interview";

function Bubble({ who, cat, children }) {
  const user = who === "user";
  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-field border p-base sm:max-w-[80%] ${
          user ? "border-transparent bg-accent-tint" : "border-line bg-field"
        }`}
      >
        <p className="mb-hair text-xs font-semibold tracking-wide text-hint uppercase">{user ? "You" : `Xerote · ${cat}`}</p>
        {children}
      </div>
    </div>
  );
}

function OpenQuestion({ item, answer, locked, onAnswer }) {
  const [text, setText] = useState("");
  const input = useRef(null);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-tight">
      <Bubble who="xerote" cat={item.cat}>
        <p className="font-medium">{item.q}</p>
        {answer === undefined && !locked ? (
          <div className="mt-base grid grid-cols-[minmax(0,1fr)] gap-tight">
            <div className="flex flex-wrap gap-tight" role="group" aria-label="Quick replies">
              {item.chips.map((c) => (
                <ChipButton key={c} className="min-h-11 text-base" onClick={() => (c === "Custom" ? input.current?.focus() : onAnswer(item.id, c))}>
                  {c}
                </ChipButton>
              ))}
            </div>
            {item.custom ? (
              <form
                className="flex gap-tight"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (text.trim()) onAnswer(item.id, text.trim());
                }}
              >
                <input
                  ref={input}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Or type your own scale (for “Custom”)"
                  aria-label="Type your own answer"
                  className="h-11 min-w-0 flex-1 rounded-field border border-line bg-panel px-base text-base"
                />
                <Button type="submit" variant="secondary" disabled={!text.trim()}>
                  Use
                </Button>
              </form>
            ) : null}
          </div>
        ) : null}
      </Bubble>
      {answer !== undefined ? (
        <Bubble who="user">
          <p>{answer}</p>
        </Bubble>
      ) : null}
    </div>
  );
}

/** Step 1: the interview. Chat bubbles, category progress, a gap and contradiction detector, and Lock the plan. */
export function InterviewView({ iv, onAnswer, onResolve, onLock, onGoPlan }) {
  const { answers, resolved, locked } = iv;
  const gaps = OPEN.filter((o) => !(o.id in answers)).length;
  const conflicts = resolved === null ? 1 : 0;
  const ready = gaps === 0 && conflicts === 0;
  const catDone = (c) => (c === "Screens" ? conflicts === 0 : c === "Rules" ? gaps === 0 : true);
  const doneCount = CATEGORIES.filter(catDone).length;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base lg:grid-cols-[minmax(0,1fr)_20rem]">
      <aside className="grid grid-cols-[minmax(0,1fr)] gap-base lg:sticky lg:top-20 lg:order-2">
        <Card>
          <h3 className="text-sm font-semibold text-ink-soft">
            Interview progress · {doneCount} of {CATEGORIES.length} done
          </h3>
          <ul className="mt-tight flex flex-wrap gap-tight" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Chip tone={catDone(c) ? "success" : "warning"}>
                  {catDone(c) ? <Check className="size-3.5" aria-hidden="true" /> : <Circle className="size-3 fill-current" aria-hidden="true" />}
                  {c}
                  <span className="sr-only">{catDone(c) ? " (complete)" : " (in progress)"}</span>
                </Chip>
              </li>
            ))}
          </ul>
        </Card>

        <Card aria-live="polite" className={ready ? "" : "border-l-[3px] border-l-warning"}>
          <h3 className="flex items-center gap-tight font-semibold">
            {ready ? <Check className="size-5 text-success" aria-hidden="true" /> : <AlertTriangle className="size-5 text-warning" aria-hidden="true" />}
            Gap detector
          </h3>
          <p className="mt-hair text-ink-soft">
            {gaps} {gaps === 1 ? "gap" : "gaps"} · {conflicts} {conflicts === 1 ? "contradiction" : "contradictions"}
          </p>
          {!ready ? (
            <a href="#open-questions" className="mt-tight inline-flex min-h-11 items-center gap-hair text-sm font-medium text-accent underline underline-offset-4">
              <ArrowDown className="size-4" aria-hidden="true" /> Go to the open items
            </a>
          ) : (
            <p className="mt-tight text-sm text-success">Nothing left to decide.</p>
          )}
        </Card>

        {locked ? (
          <Card className="grid grid-cols-[minmax(0,1fr)] gap-tight">
            <p className="flex items-center gap-tight font-semibold">
              <Lock className="size-5 text-accent" aria-hidden="true" /> The plan is locked
            </p>
            <Button onClick={onGoPlan}>See the plan</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-hair">
            <Button size="lg" full disabled={!ready} onClick={onLock}>
              <Lock className="size-5" aria-hidden="true" />
              Lock the plan
            </Button>
            {!ready ? <p className="text-sm text-hint">Answer the open questions and resolve the contradiction first.</p> : null}
          </div>
        )}
      </aside>

      <section aria-label="Interview" className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-base lg:order-1">
        <p className="text-ink-soft">
          Project: <strong className="font-semibold text-ink">School Results App</strong>. Xerote asks until there are no gaps.
        </p>
        {ANSWERED.map((x) => (
          <div key={x.id} className="grid grid-cols-[minmax(0,1fr)] gap-tight">
            <Bubble who="xerote" cat={x.cat}>
              <p className="font-medium">{x.q}</p>
            </Bubble>
            <Bubble who="user">
              <p>{x.a}</p>
            </Bubble>
          </div>
        ))}

        <div id="open-questions" className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-base">
          <Bubble who="xerote" cat={CONTRADICTION.cat}>
            <p className="flex items-center gap-tight font-semibold">
              <AlertTriangle className="size-5 text-warning" aria-hidden="true" /> I found a contradiction
            </p>
            <ul className="mt-tight list-disc pl-group text-ink-soft">
              {CONTRADICTION.said.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-tight font-medium">{CONTRADICTION.question}</p>
            {resolved === null && !locked ? (
              <div className="mt-base flex flex-wrap gap-tight" role="group" aria-label="Resolve the contradiction">
                {CONTRADICTION.options.map((o) => (
                  <ChipButton key={o.id} className="min-h-11 text-base" onClick={() => onResolve(o.id)}>
                    {o.label}
                  </ChipButton>
                ))}
              </div>
            ) : null}
          </Bubble>
          {resolved !== null ? (
            <Bubble who="user">
              <p>{CONTRADICTION.options.find((o) => o.id === resolved).label}</p>
            </Bubble>
          ) : null}

          {OPEN.map((o) => (
            <OpenQuestion key={o.id} item={o} answer={answers[o.id]} locked={locked} onAnswer={onAnswer} />
          ))}
        </div>
      </section>
    </div>
  );
}
