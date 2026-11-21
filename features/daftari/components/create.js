"use client";

import { useCallback, useState } from "react";
import { Check, Copy, FileDown, FilePlus2, FileText, Mail, Printer, Receipt, Save, Sparkles } from "lucide-react";
import { StagedProgress } from "@/components/staged-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { EXAM_FORMAT } from "../data/brain";
import {
  CHIPS,
  buildExam,
  examToText,
  generateExam,
  parseInstructions,
  schemeToText,
  swapQuestion,
  termLabel,
  toggleChip,
  totalMarks,
  usedCount,
} from "../lib/generate";
import { ExamPreview, SchemePreview } from "./exam-preview";

const STEPS = ["Document type", "Sources", "Instructions"];
const STAGES = ["Reading your format…", "Choosing questions from your bank…", "Checking past exams for repeats…", "Writing the marking scheme…"];

const TYPES = [
  { id: "exam", label: "Exam", Icon: FileText, ready: true },
  { id: "lesson", label: "Lesson plan", Icon: FileDown },
  { id: "letter", label: "Letter", Icon: Mail },
  { id: "invoice", label: "Invoice", Icon: Receipt },
];

const selectClass = "h-12 w-full rounded-field border border-line bg-panel px-base text-base text-ink";

/** Create: a 3-step wizard (type, sources, instructions), then the generated exam with marking scheme. */
export function Create({ cr, setCr, items, facts, onSaveGolden }) {
  const toast = useToast();
  const [exportOpen, setExportOpen] = useState(false);
  const item = (id) => items.find((i) => i.id === id);
  const on = (id) => Boolean(item(id)?.on);
  const set = (patch) => setCr((c) => ({ ...c, ...patch }));
  const setSrc = (patch) => setCr((c) => ({ ...c, src: { ...c.src, ...patch } }));

  const finishGenerate = useCallback(
    () => setCr((c) => ({ ...c, phase: "result", exam: generateExam(c.instructions), version: "A", edits: {}, tab: "exam", editing: false })),
    [setCr],
  );

  const sourcesOk = on(cr.src.format) && on(cr.src.bank);

  // ---------- generating
  if (cr.phase === "generating") {
    return <StagedProgress title="Writing your exam…" stages={STAGES} onDone={finishGenerate} titleId="generating-title" />;
  }

  // ---------- wizard
  if (cr.phase === "wizard") {
    const parsed = parseInstructions(cr.instructions);
    return (
      <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
        <ol className="flex gap-tight overflow-x-auto" aria-label="Steps">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const current = cr.step === n;
            const done = cr.step > n;
            return (
              <li key={label} className="shrink-0">
                <button
                  type="button"
                  disabled={n > cr.step}
                  onClick={() => set({ step: n })}
                  aria-current={current ? "step" : undefined}
                  className={`flex min-h-11 items-center gap-tight rounded-full border px-base text-sm font-medium whitespace-nowrap ${
                    current ? "border-transparent bg-primary text-white" : done ? "border-line bg-tint text-ink" : "border-line bg-field text-ink-soft"
                  }`}
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-field text-xs font-semibold text-ink tabular-nums">
                    {done ? <Check className="size-3.5" aria-hidden="true" /> : n}
                  </span>
                  {label}
                </button>
              </li>
            );
          })}
        </ol>

        {cr.step === 1 ? (
          <section aria-labelledby="s1" className="grid grid-cols-[minmax(0,1fr)] gap-base">
            <h2 id="s1" className="text-2xl font-semibold tracking-tight">
              What do you want to create?
            </h2>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight sm:grid-cols-2 lg:grid-cols-4">
              {TYPES.map(({ id, label, Icon, ready }) => (
                <li key={id}>
                  <button
                    type="button"
                    disabled={!ready}
                    aria-pressed={ready ? true : undefined}
                    className={`press flex h-full min-h-28 w-full flex-col items-start gap-tight rounded-field border p-base text-left ${
                      ready ? "border-accent bg-accent-tint" : "border-line bg-field opacity-70"
                    }`}
                  >
                    <Icon className="size-6 text-accent" aria-hidden="true" />
                    <span className="font-semibold">{label}</span>
                    {ready ? <Chip tone="accent">Selected</Chip> : <span className="text-sm text-ink-soft">Coming in the full version</span>}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {cr.step === 2 ? (
          <section aria-labelledby="s2" className="grid grid-cols-[minmax(0,1fr)] gap-base">
            <h2 id="s2" className="text-2xl font-semibold tracking-tight">
              Pick your sources
            </h2>
            <p className="text-ink-soft">Only items that are turned on in your Brain can be used.</p>

            <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
              Format
              <select className={selectClass} value={cr.src.format} onChange={(e) => setSrc({ format: e.target.value })}>
                {items
                  .filter((i) => i.folder === "formats")
                  .map((i) => {
                    const usable = i.id === "fmt-midterm" && i.on;
                    return (
                      <option key={i.id} value={i.id} disabled={!usable}>
                        {i.name}
                        {!i.on ? " — turned off in Brain" : i.id !== "fmt-midterm" ? " — not an exam format" : ""}
                      </option>
                    );
                  })}
              </select>
            </label>

            <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
              Question bank
              <select className={selectClass} value={cr.src.bank} onChange={(e) => setSrc({ bank: e.target.value })}>
                {items
                  .filter((i) => i.folder === "banks")
                  .map((i) => {
                    const usable = i.id === "bank-b2" && i.on;
                    return (
                      <option key={i.id} value={i.id} disabled={!usable}>
                        {i.name}
                        {!i.on ? " — turned off in Brain" : i.id !== "bank-b2" ? " — sample not loaded in this demo" : ""}
                      </option>
                    );
                  })}
              </select>
            </label>

            <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
              Data file (optional)
              <select className={selectClass} value={cr.src.data} onChange={(e) => setSrc({ data: e.target.value })}>
                <option value="none">None</option>
                {items
                  .filter((i) => i.folder === "data")
                  .map((i) => (
                    <option key={i.id} value={i.id} disabled={!i.on}>
                      {i.name}
                      {!i.on ? " — turned off in Brain" : ""}
                    </option>
                  ))}
              </select>
            </label>

            <fieldset className="grid grid-cols-[minmax(0,1fr)] gap-tight">
              <legend className="mb-tight text-sm font-semibold text-ink-soft">Also use</legend>
              {[
                ["golden", "gold-scheme", "Follow my marking-scheme style"],
                ["official", "off-syllabus", "Match the official syllabus"],
              ].map(([key, id, label]) => (
                <Switch
                  key={key}
                  checked={cr.src[key] && on(id)}
                  onChange={(v) => setSrc({ [key]: v })}
                  label={`${label} — ${item(id).name}${on(id) ? "" : " (turned off in Brain)"}`}
                />
              ))}
            </fieldset>
            {!sourcesOk ? (
              <p role="alert" className="rounded-field border border-line border-l-[3px] border-l-warning bg-highlight p-base text-sm">
                The format or the question bank is turned off in your Brain. Turn it on again to continue.
              </p>
            ) : null}
          </section>
        ) : null}

        {cr.step === 3 ? (
          <section aria-labelledby="s3" className="grid grid-cols-[minmax(0,1fr)] gap-base">
            <h2 id="s3" className="text-2xl font-semibold tracking-tight">
              Tell Daftari what you need
            </h2>
            <label className="grid grid-cols-[minmax(0,1fr)] gap-tight text-sm font-semibold text-ink-soft">
              Instructions, in your own words
              <textarea
                value={cr.instructions}
                onChange={(e) => set({ instructions: e.target.value })}
                rows={5}
                className="w-full rounded-field border border-line bg-panel p-base text-base font-normal text-ink"
              />
            </label>
            <div className="flex flex-wrap gap-tight" role="group" aria-label="Quick instructions">
              {CHIPS.map((chip) => {
                const active = chip.test.test(cr.instructions);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => set({ instructions: toggleChip(cr.instructions, chip) })}
                    className={`flex min-h-11 items-center gap-hair rounded-full border px-base text-sm font-medium ${
                      active ? "border-transparent bg-primary text-white" : "border-line bg-field text-ink hover:border-line-hover"
                    }`}
                  >
                    {active ? <Check className="size-4" aria-hidden="true" /> : null}
                    {chip.label}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-ink-soft">
              Daftari understood: topics {parsed.topics.join(", ")} · {parsed.noRepeat ? "no repeats" : "repeats allowed"} ·{" "}
              {parsed.mix ? "mixed difficulty" : "any difficulty"}
              {parsed.diagram ? " · diagram question" : ""}.
            </p>
          </section>
        ) : null}

        <div className="flex items-center justify-between gap-base border-t border-line pt-base">
          <Button variant="secondary" onClick={() => set({ step: cr.step - 1 })} disabled={cr.step === 1}>
            Back
          </Button>
          {cr.step < 3 ? (
            <Button onClick={() => set({ step: cr.step + 1 })} disabled={cr.step === 2 && !sourcesOk}>
              Next
            </Button>
          ) : (
            <Button size="lg" onClick={() => set({ phase: "generating" })} disabled={!sourcesOk || !cr.instructions.trim()}>
              <Sparkles className="size-5" aria-hidden="true" />
              Generate
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ---------- result
  const { exam, version, edits, editing, showSources } = cr;
  const sections = buildExam(exam, version);
  const total = totalMarks(sections);
  const used = usedCount(exam);
  const className = cr.src.data === "data-class" && on("data-class") ? "Class: Form 2B · 38 students" : null;
  const extras = {
    classLine: className,
    syllabus: cr.src.official && on("off-syllabus") ? "Biology Form I–IV" : null,
    golden: cr.src.golden && on("gold-scheme") ? item("gold-scheme").name : null,
  };
  const termText = termLabel(facts.find((f) => f.id === "term")?.value ?? "");

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied as text");
    } catch {
      toast("Copying is not available in this browser");
    }
  };
  const print = () => {
    setExportOpen(false);
    setTimeout(() => {
      try {
        window.print();
      } catch {}
    }, 150);
  };
  const swap = (qid) => {
    const next = swapQuestion(exam, qid);
    if (!next) {
      toast("No unused question left for this slot");
      return;
    }
    set({ exam: next });
    toast("Swapped for an unused question from your bank");
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="flex flex-wrap items-center gap-tight">
        <Chip tone={total === EXAM_FORMAT.total ? "success" : "danger"} className="text-base">
          Total: {total}/{EXAM_FORMAT.total} {total === EXAM_FORMAT.total ? "✓" : ""}
        </Chip>
        <Chip tone={used === 0 ? "success" : "warning"} className="text-base">
          {used === 0 ? "No repeats · " : ""}
          {used} {used === 1 ? "question" : "questions"} from 2025 exams
        </Chip>
        {exam.swapped.length ? <Chip>{exam.swapped.length} swapped</Chip> : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-base">
        <SegmentedControl
          label="Version"
          value={version}
          onChange={(v) => set({ version: v })}
          options={[
            { value: "A", label: "Version A" },
            { value: "B", label: "Version B" },
          ]}
        />
        <div className="flex flex-wrap items-center gap-x-base">
          <Switch checked={editing} onChange={(v) => set({ editing: v })} label="Edit text" />
          <Switch checked={showSources} onChange={(v) => set({ showSources: v })} label="Show sources" />
        </div>
      </div>

      <Tabs
        label="Document"
        value={cr.tab}
        onChange={(tab) => set({ tab })}
        tabs={[
          {
            id: "exam",
            label: "Exam",
            content: (
              <ExamPreview
                exam={exam}
                version={version}
                edits={edits}
                onEdit={(key, value) => setCr((c) => ({ ...c, edits: { ...c.edits, [key]: value } }))}
                editing={editing}
                showSources={showSources}
                facts={facts}
                extras={extras}
                onSwap={swap}
              />
            ),
          },
          { id: "scheme", label: "Marking scheme", content: <SchemePreview exam={exam} version={version} facts={facts} extras={extras} /> },
        ]}
      />

      <div className="flex flex-wrap items-center gap-tight border-t border-line pt-base">
        <Button onClick={() => setExportOpen(true)}>
          <FileDown className="size-5" aria-hidden="true" />
          Export
        </Button>
        {cr.savedGolden ? (
          <Chip tone="success" className="text-base">
            <Check className="size-4" aria-hidden="true" /> Saved to Brain › Golden examples
          </Chip>
        ) : (
          <Button variant="secondary" onClick={() => onSaveGolden(`Form 2 Biology Mid-Term · ${termText} (generated)`)}>
            <Save className="size-5" aria-hidden="true" />
            Save to Brain › Golden examples
          </Button>
        )}
        <Button variant="ghost" onClick={() => set({ phase: "wizard", step: 3 })}>
          <FilePlus2 className="size-5" aria-hidden="true" />
          Change instructions
        </Button>
      </div>

      <Sheet open={exportOpen} onClose={() => setExportOpen(false)} title="Export">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          {["Word (.docx)", "PDF"].map((f) => (
            <li key={f} className="flex items-center justify-between gap-base rounded-field border border-line p-base">
              <span className="font-medium">{f}</span>
              <span className="text-sm text-ink-soft">Available in the full version</span>
            </li>
          ))}
          <li>
            <Button variant="secondary" full onClick={print}>
              <Printer className="size-5" aria-hidden="true" />
              Print this page
            </Button>
          </li>
          <li>
            <Button
              variant="secondary"
              full
              onClick={() => {
                copy(cr.tab === "scheme" ? schemeToText({ exam, version, facts }) : examToText({ exam, version, edits, facts }));
                setExportOpen(false);
              }}
            >
              <Copy className="size-5" aria-hidden="true" />
              Copy as text ({cr.tab === "scheme" ? "marking scheme" : "exam"})
            </Button>
          </li>
        </ul>
      </Sheet>
    </div>
  );
}
