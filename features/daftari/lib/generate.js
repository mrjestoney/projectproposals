// Pure functions behind "Create": read the teacher's instructions, pick questions from the bank, swap one for
// another, shuffle for Version B, and turn the exam into plain text. No randomness: the same input always gives
// the same exam, which keeps the demo predictable.

import { BANK_NAME, QUESTIONS, TOPICS, questionById } from "../data/questions.js";
import { EXAM_FORMAT } from "../data/brain.js";

const DIFFS = ["easy", "medium", "hard"];

/** Quick instruction chips: the sentence they add, and how to tell the instructions already say it. */
export const CHIPS = [
  { id: "noRepeat", label: "No repeats", sentence: "Don't reuse questions from 2025.", test: /(don['’]?t|do not|never)\s+(re-?use|repeat)|no repeats?/i },
  { id: "mix", label: "Mix difficulty", sentence: "Mix easy and hard.", test: /\bmix\b/i },
  { id: "diagram", label: "Include diagram question", sentence: "Include a diagram question.", test: /diagram/i },
];

export const DEFAULT_INSTRUCTIONS =
  "Form 2 Biology Mid-Term, 50 marks. Focus on Cells and Nutrition. Mix easy and hard. Don't reuse questions from 2025.";

/** What the plain-words instructions mean. */
export function parseInstructions(text) {
  const lower = text.toLowerCase();
  const found = TOPICS.filter((t) => lower.includes(t.toLowerCase()));
  return {
    topics: found.length ? found : TOPICS,
    noRepeat: CHIPS[0].test.test(text),
    mix: CHIPS[1].test.test(text),
    diagram: CHIPS[2].test.test(text),
  };
}

export function toggleChip(text, chip) {
  if (chip.test.test(text)) {
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((s) => !chip.test.test(s))
      .join(" ")
      .trim();
  }
  return `${text.trim()} ${chip.sentence}`.trim();
}

/** Take items from several lists in turn: a1, b1, c1, a2, b2, ... */
function roundRobin(lists) {
  const out = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const l of lists) if (l[i]) out.push(l[i]);
  return out;
}

const byTopic = (qs) => TOPICS.map((t) => qs.filter((q) => q.topic === t)).filter((l) => l.length);

/** Order candidates so topics (and difficulties, when asked) are spread out. */
function order(qs, { mix, diagramFirst }) {
  const sorted = [...qs].sort((a, b) => a.n - b.n);
  const spread = (list) => roundRobin(byTopic(list));
  let result = mix ? roundRobin(DIFFS.map((d) => spread(sorted.filter((q) => q.difficulty === d)))) : spread(sorted);
  if (diagramFirst) result = [...result.filter((q) => q.diagram), ...result.filter((q) => !q.diagram)];
  return result;
}

function pickSection(section, opts) {
  const ofType = QUESTIONS.filter((q) => q.type === section.type);
  const ok = (q) => !(opts.noRepeat && q.lastUsed);
  const wanted = order(ofType.filter((q) => ok(q) && opts.topics.includes(q.topic)), {
    mix: opts.mix,
    diagramFirst: opts.diagram && section.type === "structured",
  });
  const others = order(ofType.filter((q) => ok(q) && !opts.topics.includes(q.topic)), { mix: opts.mix });
  return [...wanted, ...others].slice(0, section.count).map((q) => q.id);
}

/** Build a new exam from the instructions text. */
export function generateExam(instructions) {
  const opts = parseInstructions(instructions);
  return {
    opts,
    ids: Object.fromEntries(EXAM_FORMAT.sections.map((s) => [s.key, pickSection(s, opts)])),
    swapped: [],
    removed: [],
  };
}

export const examIds = (exam) => EXAM_FORMAT.sections.flatMap((s) => exam.ids[s.key]);

/**
 * Replace one question with another unused one of the same kind and marks (same topic first, then same
 * difficulty). Used questions (from past exams) are never chosen. Returns the new exam, or null if there is none left.
 */
export function swapQuestion(exam, qid) {
  const q = questionById(qid);
  const taken = new Set([...examIds(exam), ...exam.removed]);
  const candidates = QUESTIONS.filter((c) => c.type === q.type && c.marks === q.marks && !c.lastUsed && !taken.has(c.id));
  if (!candidates.length) return null;
  candidates.sort(
    (a, b) =>
      (a.topic !== q.topic) - (b.topic !== q.topic) ||
      (!exam.opts.topics.includes(a.topic)) - (!exam.opts.topics.includes(b.topic)) ||
      (a.difficulty !== q.difficulty) - (b.difficulty !== q.difficulty) ||
      a.n - b.n,
  );
  const next = candidates[0];
  const ids = Object.fromEntries(Object.entries(exam.ids).map(([k, list]) => [k, list.map((id) => (id === qid ? next.id : id))]));
  return { ...exam, ids, swapped: [...exam.swapped, next.id], removed: [...exam.removed, qid] };
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Version A keeps the order; Version B shuffles questions within each section (always the same shuffle). */
export function sectionQuestions(exam, key, version) {
  const list = exam.ids[key].map(questionById);
  return version === "B" ? [...list].sort((a, b) => hash(`B${a.id}`) - hash(`B${b.id}`)) : list;
}

/** The exam as displayed: sections with continuously numbered questions. */
export function buildExam(exam, version) {
  let no = 0;
  return EXAM_FORMAT.sections.map((s) => ({
    ...s,
    questions: sectionQuestions(exam, s.key, version).map((q) => ({ q, no: ++no })),
  }));
}

export const totalMarks = (sections) => sections.reduce((sum, s) => sum + s.questions.reduce((m, { q }) => m + q.marks, 0), 0);

export const usedCount = (exam) => examIds(exam).filter((id) => questionById(id).lastUsed).length;

export function sourceTag(q, exam) {
  const swapped = exam.swapped.includes(q.id);
  return `${BANK_NAME} bank · Q${q.n} · ${q.lastUsed ? `used in ${q.lastUsed}` : "never used"}${swapped ? " · swapped" : ""}`;
}

/** Texts the teacher edited ("c01" for the stem, "c10.a" for a part). */
export const textOf = (edits, key, fallback) => edits[key] ?? fallback;

/** "Term 1, 2027: 12 Jan – 10 Apr 2027" → "Term 1 2027" */
export const termLabel = (value) => value.split(":")[0].replace(",", "").trim();

export function examHeader(facts) {
  const f = Object.fromEntries(facts.map((x) => [x.id, x.value]));
  return { school: f.school, title: EXAM_FORMAT.title, term: termLabel(f.term ?? ""), time: EXAM_FORMAT.time };
}

function questionLines(q, no, edits) {
  const lines = [`${no}. ${textOf(edits, q.id, q.text)} [${q.marks} marks]`];
  if (q.type === "structured") for (const p of q.parts) lines.push(`   (${p.label}) ${textOf(edits, `${q.id}.${p.label}`, p.text)} [${p.marks}]`);
  return lines;
}

export function examToText({ exam, version, edits, facts }) {
  const h = examHeader(facts);
  const sections = buildExam(exam, version);
  const out = [h.school, h.title, `${h.term} · Time: ${h.time} · Version ${version}`, "", EXAM_FORMAT.instructions, ""];
  for (const s of sections) {
    const marks = s.questions.reduce((m, { q }) => m + q.marks, 0);
    out.push(`${s.label} (${marks} marks)`, s.note, "");
    for (const { q, no } of s.questions) out.push(...questionLines(q, no, edits), "");
  }
  out.push(`Total: ${totalMarks(sections)}/${EXAM_FORMAT.total}`);
  return out.join("\n");
}

export function schemeToText({ exam, version, facts }) {
  const h = examHeader(facts);
  const out = [`MARKING SCHEME — ${h.title} — Version ${version}`, ""];
  for (const s of buildExam(exam, version)) {
    out.push(s.label);
    for (const { q, no } of s.questions) {
      out.push(`${no}. (${q.marks} marks)`);
      if (q.type === "short") out.push(...q.marking.map((m) => `   - ${m}`));
      else for (const p of q.parts) out.push(`   (${p.label}) [${p.marks}]`, ...p.marking.map((m) => `      - ${m}`));
    }
    out.push("");
  }
  return out.join("\n");
}
