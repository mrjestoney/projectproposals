"use client";

import { useState } from "react";
import { ChevronDown, Keyboard, ScanLine, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Switch } from "@/components/ui/switch";
import { EXAM_FORMAT, FOLDERS, CLASS_LIST, MARKS } from "../data/brain";
import { QUESTIONS, TOPICS } from "../data/questions";

const SOURCES = {
  scanned: { Icon: ScanLine, label: "Scanned" },
  uploaded: { Icon: Upload, label: "Uploaded" },
  typed: { Icon: Keyboard, label: "Typed" },
};

const DIFF_TONE = { easy: "success", medium: "neutral", hard: "warning" };

function SourceIcon({ source }) {
  const { Icon, label } = SOURCES[source];
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-field bg-accent-tint text-accent" title={label}>
      <Icon className="size-5" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function Table({ head, rows }) {
  return (
    <div className="overflow-x-auto rounded-field border border-line" tabIndex={0} role="region" aria-label="Table preview, scrollable">
      <table className="w-full min-w-[20rem] border-collapse text-sm">
        <thead>
          <tr className="bg-accent-tint text-left">
            {head.map((h) => (
              <th key={h} className="px-base py-tight font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">
              {r.map((c, j) => (
                <td key={j} className="px-base py-tight">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Question bank detail: every question with topic, difficulty, marks and when it was last used. */
function BankDetail() {
  const [topic, setTopic] = useState("All");
  const list = QUESTIONS.filter((q) => topic === "All" || q.topic === topic);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-base">
      <div className="flex flex-wrap gap-tight" role="group" aria-label="Filter by topic">
        {["All", ...TOPICS].map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={topic === t}
            onClick={() => setTopic(t)}
            className={`min-h-9 rounded-full border px-base text-sm font-medium ${
              topic === t ? "border-transparent bg-primary text-white" : "border-line bg-field text-ink-soft hover:border-line-hover"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="text-sm text-ink-soft">
        Showing {list.length} of {QUESTIONS.length} questions
      </p>
      <ul className="grid max-h-[28rem] grid-cols-[minmax(0,1fr)] gap-tight overflow-y-auto pr-hair" tabIndex={0} aria-label="Questions in the bank">
        {list.map((q) => (
          <li key={q.id} className="rounded-field border border-line bg-panel p-base">
            <div className="flex flex-wrap items-center gap-tight text-sm">
              <span className="font-semibold tabular-nums">Q{q.n}</span>
              <Chip>{q.topic}</Chip>
              <Chip tone={DIFF_TONE[q.difficulty]}>{q.difficulty}</Chip>
              <span className="text-ink-soft">{q.marks} marks</span>
              <span className="ml-auto text-ink-soft">{q.lastUsed ? `Last used: ${q.lastUsed}` : "Never used"}</span>
            </div>
            <p className="mt-tight">{q.text}</p>
            {q.type === "structured" ? (
              <p className="mt-hair text-sm text-ink-soft">
                Parts: {q.parts.map((p) => `(${p.label}) ${p.marks}`).join(" · ")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Detail({ item }) {
  switch (item.kind) {
    case "format":
      return (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-tight">
          <p>{item.summary}</p>
          <Table
            head={["Section", "Type", "Questions", "Marks each", "Total"]}
            rows={[
              ...EXAM_FORMAT.sections.map((s) => [s.label, s.type, String(s.count), String(s.marksEach), String(s.count * s.marksEach)]),
              ["Total", "", "", "", String(EXAM_FORMAT.total)],
            ]}
          />
        </div>
      );
    case "bank":
      return <BankDetail />;
    case "bank-sample":
      return <p className="text-ink-soft">{item.summary} The questions of this bank are not included in the prototype.</p>;
    case "table":
      return item.table === "class" ? (
        <Table head={["No.", "Name", "Sex", "Class"]} rows={CLASS_LIST} />
      ) : (
        <Table head={["Name", "Biology", "Chemistry", "Physics"]} rows={MARKS} />
      );
    default:
      return <p>{item.summary}</p>;
  }
}

function ItemCard({ item, onToggle }) {
  const [open, setOpen] = useState(false);
  const panel = `detail-${item.id}`;
  return (
    <Card as="li" className="p-base">
      <div className="flex items-start gap-base">
        <SourceIcon source={item.source} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold break-words">{item.name}</h3>
          <p className="text-sm text-ink-soft">
            {SOURCES[item.source].label} · Updated {item.updated} · Used in {item.usedIn} {item.usedIn === 1 ? "document" : "documents"}
          </p>
        </div>
        <Switch checked={item.on} onChange={onToggle} label={`Use “${item.name}” in documents`} hideLabel />
      </div>
      <div className="mt-tight flex flex-wrap items-center justify-between gap-tight">
        <span className="text-sm text-ink-soft">{item.on ? "Used in documents" : "Turned off"}</span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panel}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-11 items-center gap-hair text-sm font-medium text-accent"
        >
          {open ? "Hide details" : "Show details"}
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
      {open ? (
        <div id={panel} className="animate-rise mt-tight border-t border-line pt-base">
          <Detail item={item} />
        </div>
      ) : null}
    </Card>
  );
}

/** Facts are key/value rows: type to change one; every new document uses the new value. */
function FactsList({ facts, setFacts }) {
  const update = (id, patch) => setFacts((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight">
      {facts.map((f) => (
        <Card as="li" key={f.id} className="p-base">
          <div className="flex items-center gap-base">
            <SourceIcon source="typed" />
            <div className="min-w-0 flex-1">
              <label htmlFor={`fact-${f.id}`} className="text-sm font-semibold text-ink-soft">
                {f.key}
              </label>
              <input
                id={`fact-${f.id}`}
                value={f.value}
                onChange={(e) => update(f.id, { value: e.target.value, updated: "Just now" })}
                autoComplete="off"
                className="mt-hair h-11 w-full rounded-field border border-transparent bg-transparent px-tight text-base font-medium text-ink hover:border-line focus:border-line-hover focus:bg-panel"
              />
              <p className="px-tight text-xs text-hint">
                Updated {f.updated} · Used in {f.usedIn} documents
              </p>
            </div>
            <Switch checked={f.on} onChange={(v) => update(f.id, { on: v })} label={`Use “${f.key}” in documents`} hideLabel />
          </div>
        </Card>
      ))}
    </ul>
  );
}

/** Brain: six folders. Left list on desktop, scrolling chips on mobile. */
export function Brain({ items, setItems, facts, setFacts, folder, setFolder }) {
  const current = FOLDERS.find((f) => f.id === folder);
  const count = (id) => (id === "facts" ? facts.length : items.filter((i) => i.folder === id).length);
  const toggle = (id, on) => setItems((all) => all.map((i) => (i.id === id ? { ...i, on } : i)));
  const list = items.filter((i) => i.folder === folder);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-base lg:grid-cols-[14rem_minmax(0,1fr)]">
      <nav aria-label="Brain folders">
        <ul className="flex gap-tight overflow-x-auto pb-tight lg:flex-col lg:overflow-visible lg:pb-0">
          {FOLDERS.map((f) => (
            <li key={f.id} className="shrink-0">
              <button
                type="button"
                aria-current={f.id === folder ? "true" : undefined}
                onClick={() => setFolder(f.id)}
                className={`press flex min-h-11 w-full items-center justify-between gap-base rounded-full border px-base text-left text-base font-medium whitespace-nowrap lg:rounded-field ${
                  f.id === folder ? "border-accent bg-accent-tint text-accent" : "border-line bg-field text-ink hover:border-line-hover"
                }`}
              >
                {f.label}
                <span className="text-sm font-normal text-ink-soft tabular-nums">{count(f.id)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="folder-title" className="min-w-0">
        <h2 id="folder-title" className="text-2xl font-semibold tracking-tight">
          {current.label}
        </h2>
        <p className="mt-hair mb-base text-ink-soft">
          {current.blurb} Turn an item off to keep it out of new documents.
        </p>
        {folder === "facts" ? (
          <FactsList facts={facts} setFacts={setFacts} />
        ) : (
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-tight">
            {list.map((item) => (
              <ItemCard key={item.id} item={item} onToggle={(on) => toggle(item.id, on)} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
