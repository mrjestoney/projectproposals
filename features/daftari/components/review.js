"use client";

import { useState } from "react";
import { Check, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { ChipButton } from "@/components/ui/chip-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { PAGES, UNCERTAIN, UNCERTAIN_IDS } from "../data/pages";
import { HandwrittenPage } from "./handwritten-page";

/** A line's text with its uncertain words as yellow buttons (or, once checked, as the chosen word with a green underline). */
function RichText({ text, resolved, onPick }) {
  return text.split(/(\{\{\w+\}\})/g).map((part, i) => {
    const m = part.match(/^\{\{(\w+)\}\}$/);
    if (!m) return part;
    const id = m[1];
    const done = id in resolved;
    return (
      <button
        key={i}
        type="button"
        onClick={() => onPick(id)}
        aria-label={done ? `${resolved[id]} (checked). Change` : `Check the word: ${UNCERTAIN[id].read}`}
        className={
          done
            ? "rounded-[3px] px-hair underline decoration-success decoration-2 underline-offset-4 hover:bg-tint"
            : "rounded-[3px] bg-highlight px-hair font-medium underline decoration-warning decoration-dotted decoration-2 underline-offset-4 hover:brightness-95"
        }
      >
        {done ? resolved[id] : UNCERTAIN[id].read}
      </button>
    );
  });
}

function Line({ line, resolved, onPick }) {
  const rich = (t) => <RichText text={t} resolved={resolved} onPick={onPick} />;
  switch (line.kind) {
    case "school":
      return <p className="text-center font-bold tracking-wide">{rich(line.text)}</p>;
    case "title":
      return <p className="text-center font-semibold">{rich(line.text)}</p>;
    case "section":
      return <h4 className="mt-base text-lg font-semibold">{rich(line.text)}</h4>;
    case "instr":
      return <p className="text-ink-soft italic">{rich(line.text)}</p>;
    case "meta":
      return <p className="text-ink-soft">{rich(line.text)}</p>;
    case "q":
      return (
        <p className="flex gap-tight">
          <span className="w-6 shrink-0 font-semibold">{line.no}</span>
          <span>
            {rich(line.text)} {line.marks ? <span className="text-ink-soft">{rich(line.marks)}</span> : null}
          </span>
        </p>
      );
    default:
      return (
        <p className="flex gap-tight pl-group">
          <span className="w-9 shrink-0 font-semibold">{line.no}</span>
          <span>
            {rich(line.text)} {line.marks ? <span className="text-ink-soft">{rich(line.marks)}</span> : null}
          </span>
        </p>
      );
  }
}

function WordSheet({ id, onClose, onChoose }) {
  const [custom, setCustom] = useState("");
  const w = id ? UNCERTAIN[id] : null;
  return (
    <Sheet open={Boolean(id)} onClose={onClose} title="Check this word">
      {w ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
          <p>
            Daftari read: <span className="rounded-[3px] bg-highlight px-hair font-semibold">{w.read}</span>
          </p>
          <div>
            <p className="mb-tight text-sm font-semibold text-ink-soft">Suggestions</p>
            <div className="flex flex-wrap gap-tight">
              {w.options.map((o) => (
                <ChipButton key={o} onClick={() => onChoose(id, o)} className="min-h-11 text-base">
                  {o}
                </ChipButton>
              ))}
            </div>
          </div>
          <form
            className="grid grid-cols-[minmax(0,1fr)] gap-tight"
            onSubmit={(e) => {
              e.preventDefault();
              if (custom.trim()) onChoose(id, custom.trim());
            }}
          >
            <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
              Or type it yourself
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="h-12 w-full rounded-field border border-line bg-panel px-base text-base font-normal text-ink"
              />
            </label>
            <Button type="submit" disabled={!custom.trim()}>
              Use this word
            </Button>
          </form>
        </div>
      ) : null}
    </Sheet>
  );
}

/**
 * The review screen: the extracted text with its structure, uncertain words highlighted in yellow, an optional
 * "original page" (side by side on desktop, a tab on mobile), and Save to Brain.
 */
export function Review({ resolved, onResolve, saved, onSave, onOpenBrain, onRescan }) {
  const [openId, setOpenId] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [pane, setPane] = useState("text"); // mobile only: text | original
  const left = UNCERTAIN_IDS.filter((id) => !(id in resolved)).length;

  const choose = (id, value) => {
    onResolve(id, value);
    setOpenId(null);
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="flex flex-wrap items-center justify-between gap-base">
        <div aria-live="polite">
          {left > 0 ? (
            <Chip tone="warning" className="text-base">
              {left} {left === 1 ? "word" : "words"} to check
            </Chip>
          ) : (
            <Chip tone="success" className="text-base">
              <Check className="size-4" aria-hidden="true" /> All checked ✓
            </Chip>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-base">
          <Switch checked={showOriginal} onChange={(v) => { setShowOriginal(v); setPane(v ? "original" : "text"); }} label="Show original page" />
        </div>
      </div>

      {showOriginal ? (
        <div className="lg:hidden">
          <SegmentedControl
            label="Show"
            value={pane}
            onChange={setPane}
            options={[
              { value: "text", label: "Extracted text" },
              { value: "original", label: "Original page" },
            ]}
          />
        </div>
      ) : null}

      <div className={`grid grid-cols-[minmax(0,1fr)] items-start gap-base ${showOriginal ? "lg:grid-cols-2" : ""}`}>
        <Card as="section" aria-label="Extracted text" className={`p-group ${showOriginal && pane === "original" ? "hidden lg:block" : ""}`}>
          <p className="mb-base flex items-center gap-tight text-sm font-semibold text-ink-soft">
            <FileText className="size-4" aria-hidden="true" /> Extracted text · tap a yellow word to check it
          </p>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-tight text-base leading-relaxed">
            {PAGES.map((p) => (
              <div key={p.n} className="grid grid-cols-[minmax(0,1fr)] gap-tight">
                <p className="mt-base border-t border-line pt-tight text-xs font-semibold tracking-wide text-hint uppercase first:mt-0 first:border-0 first:pt-0">
                  Page {p.n}
                </p>
                {p.lines.map((line, i) => (
                  <Line key={i} line={line} resolved={resolved} onPick={setOpenId} />
                ))}
              </div>
            ))}
          </div>
        </Card>

        {showOriginal ? (
          <section aria-label="Original pages" className={`grid grid-cols-[minmax(0,1fr)] gap-base ${pane === "text" ? "hidden lg:grid" : ""}`}>
            {PAGES.map((p) => (
              <div key={p.n}>
                <p className="mb-hair text-xs font-semibold tracking-wide text-hint uppercase">Page {p.n} (photo)</p>
                <HandwrittenPage n={p.n} className="border border-line" />
              </div>
            ))}
          </section>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-base border-t border-line pt-base">
        {saved ? (
          <>
            <Chip tone="success" className="text-base">
              <Check className="size-4" aria-hidden="true" /> Saved to Brain › Formats
            </Chip>
            <Button variant="secondary" onClick={onOpenBrain}>
              Open Brain
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={onSave}>
            <Save className="size-5" aria-hidden="true" />
            Save to Brain
          </Button>
        )}
        <Button variant="ghost" onClick={onRescan}>
          Scan again
        </Button>
      </div>

      <WordSheet id={openId} onClose={() => setOpenId(null)} onChoose={choose} />
    </div>
  );
}
