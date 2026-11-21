"use client";

import { ArrowLeftRight } from "lucide-react";
import {
  buildExam,
  examHeader,
  sourceTag,
  textOf,
  totalMarks,
} from "../lib/generate";
import { EXAM_FORMAT } from "../data/brain";

function EditableText({ value, onChange, label }) {
  return (
    <textarea
      aria-label={label}
      value={value}
      rows={Math.max(2, Math.ceil(value.length / 52))}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[3px] border border-paper-ink/40 bg-paper p-tight text-base leading-snug text-paper-ink"
    />
  );
}

function SourceRow({ q, exam, onSwap }) {
  return (
    <div className="no-print mt-tight flex flex-wrap items-center gap-tight rounded-[3px] border border-dashed border-paper-ink/30 px-tight py-hair text-xs text-paper-ink/75">
      <span>Source: {sourceTag(q, exam)}</span>
      {q.diagram ? <span className="rounded-full bg-paper-ink/10 px-tight">Diagram question</span> : null}
      <button
        type="button"
        onClick={() => onSwap(q.id)}
        className="ml-auto inline-flex min-h-9 items-center gap-hair rounded-full border border-paper-ink/40 px-base text-sm font-medium text-paper-ink hover:bg-paper-ink/10"
        aria-label={`Swap question ${q.n}`}
      >
        <ArrowLeftRight className="size-4" aria-hidden="true" />
        Swap
      </button>
    </div>
  );
}

function Question({ q, no, exam, edits, onEdit, editing, showSources, onSwap }) {
  const stem = textOf(edits, q.id, q.text);
  return (
    <li className="break-inside-avoid">
      <div className="flex gap-tight">
        <span className="w-7 shrink-0 font-semibold">{no}.</span>
        <div className="min-w-0 flex-1">
          {editing ? <EditableText label={`Question ${no} text`} value={stem} onChange={(v) => onEdit(q.id, v)} /> : <p>{stem}</p>}
          {q.type === "structured" ? (
            <ol className="mt-tight grid grid-cols-[minmax(0,1fr)] gap-tight">
              {q.parts.map((p) => {
                const key = `${q.id}.${p.label}`;
                const t = textOf(edits, key, p.text);
                return (
                  <li key={p.label} className="flex gap-tight">
                    <span className="w-6 shrink-0">({p.label})</span>
                    <div className="min-w-0 flex-1">
                      {editing ? <EditableText label={`Question ${no} part ${p.label}`} value={t} onChange={(v) => onEdit(key, v)} /> : <p>{t}</p>}
                    </div>
                    <span className="shrink-0">[{p.marks}]</span>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </div>
        <span className="shrink-0 font-semibold">[{q.marks}]</span>
      </div>
      {showSources ? <div className="pl-[calc(1.75rem+var(--spacing-tight))]"><SourceRow q={q} exam={exam} onSwap={onSwap} /></div> : null}
    </li>
  );
}

/** The exam as an A4-looking sheet (printable). White paper with dark ink in both themes. */
export function ExamPreview({ exam, version, edits, onEdit, editing, showSources, facts, extras, onSwap }) {
  const h = examHeader(facts);
  const sections = buildExam(exam, version);
  const total = totalMarks(sections);
  return (
    <article
      aria-label="Exam preview (A4)"
      className="print-area mx-auto max-w-[50rem] rounded-field border border-line bg-paper p-base font-serif text-[15px] leading-relaxed text-paper-ink sm:p-group md:p-section md:text-base"
    >
      <header className="text-center">
        <p className="text-lg font-bold tracking-wide uppercase">{h.school}</p>
        <h3 className="mt-hair text-base font-bold md:text-lg">{h.title}</h3>
        <p className="mt-hair">
          {h.term} · Time: {h.time} · Version {version}
        </p>
        {extras.classLine ? <p>{extras.classLine}</p> : null}
        {extras.syllabus ? <p className="text-sm">Syllabus: {extras.syllabus}</p> : null}
      </header>
      <p className="mt-base border-y border-paper-ink/40 py-tight text-sm">
        Name: ______________________ &nbsp; {extras.classLine ? "" : "Class: ________"}
      </p>
      <p className="mt-base italic">{EXAM_FORMAT.instructions}</p>

      {sections.map((s) => (
        <section key={s.key} aria-label={s.label} className="mt-group">
          <h4 className="flex flex-wrap justify-between gap-x-base border-b-2 border-paper-ink font-bold">
            <span>{s.label}</span>
            <span>{s.questions.reduce((m, { q }) => m + q.marks, 0)} marks</span>
          </h4>
          <p className="mt-hair mb-base text-sm italic">{s.note}</p>
          <ol className="grid grid-cols-[minmax(0,1fr)] gap-base">
            {s.questions.map(({ q, no }) => (
              <Question key={q.id} q={q} no={no} exam={exam} edits={edits} onEdit={onEdit} editing={editing} showSources={showSources} onSwap={onSwap} />
            ))}
          </ol>
        </section>
      ))}

      <p className="mt-group border-t-2 border-paper-ink pt-tight text-right font-bold">
        Total: {total}/{EXAM_FORMAT.total} {total === EXAM_FORMAT.total ? "✓" : "✗"}
      </p>
    </article>
  );
}

/** The marking scheme for the same questions, in the same order. */
export function SchemePreview({ exam, version, facts, extras }) {
  const h = examHeader(facts);
  const sections = buildExam(exam, version);
  return (
    <article
      aria-label="Marking scheme preview (A4)"
      className="print-area mx-auto max-w-[50rem] rounded-field border border-line bg-paper p-base font-serif text-[15px] leading-relaxed text-paper-ink sm:p-group md:p-section md:text-base"
    >
      <header className="text-center">
        <p className="text-lg font-bold tracking-wide uppercase">{h.school}</p>
        <h3 className="mt-hair text-base font-bold md:text-lg">MARKING SCHEME — {h.title}</h3>
        <p className="mt-hair">
          {h.term} · Version {version}
        </p>
        {extras.golden ? <p className="mt-hair text-sm italic">Layout follows your example: “{extras.golden}”.</p> : null}
      </header>
      {sections.map((s) => (
        <section key={s.key} aria-label={`${s.label} marking scheme`} className="mt-group">
          <h4 className="border-b-2 border-paper-ink font-bold">{s.label}</h4>
          <ol className="mt-base grid grid-cols-[minmax(0,1fr)] gap-base">
            {s.questions.map(({ q, no }) => (
              <li key={q.id} className="break-inside-avoid">
                <p className="font-semibold">
                  {no}. <span className="font-normal">({q.marks} marks)</span>
                </p>
                {q.type === "short" ? (
                  <ul className="mt-hair list-disc pl-group">
                    {q.marking.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                ) : (
                  <ol className="mt-hair grid grid-cols-[minmax(0,1fr)] gap-tight">
                    {q.parts.map((p) => (
                      <li key={p.label}>
                        <p>
                          ({p.label}) <span className="text-sm">[{p.marks} marks]</span>
                        </p>
                        <ul className="list-disc pl-group">
                          {p.marking.map((m) => (
                            <li key={m}>{m}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
}
