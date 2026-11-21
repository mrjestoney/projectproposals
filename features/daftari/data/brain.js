import { QUESTIONS, BANK_NAME } from "./questions.js";

// Mock Brain: the teacher's private library (made-up school and people).

export const TEACHER = { name: "Mwalimu Neema Joseph", subject: "Biology", school: "Mwangaza Secondary School", city: "Dar es Salaam" };

export const FOLDERS = [
  { id: "formats", label: "Formats", blurb: "Layouts your documents should follow." },
  { id: "banks", label: "Question banks", blurb: "Your questions by subject and topic." },
  { id: "data", label: "Data files", blurb: "Spreadsheets: class lists, marks, price lists." },
  { id: "facts", label: "Facts", blurb: "Things Daftari should always get right." },
  { id: "golden", label: "Golden examples", blurb: "Documents marked “do it like this”." },
  { id: "official", label: "Official", blurb: "Syllabus and other official material." },
];

/** Exam layout the Create step follows. */
export const EXAM_FORMAT = {
  id: "fmt-midterm",
  title: "BIOLOGY — FORM TWO — MID-TERM EXAMINATION",
  time: "2 hrs",
  instructions: "Answer all questions. Write your answers in the spaces provided. Mark allocation is shown in brackets.",
  sections: [
    { key: "A", label: "SECTION A", type: "short", count: 10, marksEach: 2, note: "Answer all questions in this section." },
    { key: "B", label: "SECTION B", type: "structured", count: 3, marksEach: 10, note: "Answer all questions in this section." },
  ],
  total: 50,
};

const BANK_COUNT = QUESTIONS.length;

/** source: scanned | uploaded | typed. kind decides the detail view. */
export const ITEMS = [
  {
    id: "fmt-midterm",
    folder: "formats",
    name: "Form 2 Biology Mid-Term (2025)",
    kind: "format",
    source: "scanned",
    updated: "12 Mar 2025",
    usedIn: 3,
    on: true,
    summary: "Exam format: Section A 10 short questions × 2 marks = 20, Section B 3 structured × 10 = 30. Total 50.",
  },
  {
    id: "fmt-letter",
    folder: "formats",
    name: "Letter to parents (school letterhead)",
    kind: "text",
    source: "uploaded",
    updated: "03 Feb 2025",
    usedIn: 5,
    on: true,
    summary: "Letterhead, date line, greeting, three paragraphs, headteacher signature block.",
  },
  {
    id: "bank-b2",
    folder: "banks",
    name: `${BANK_NAME} — ${BANK_COUNT} questions`,
    kind: "bank",
    source: "typed",
    updated: "20 Oct 2025",
    usedIn: 3,
    on: true,
    summary: "Topics: Cells, Nutrition, Transport, Classification.",
  },
  {
    id: "bank-b1",
    folder: "banks",
    name: "Biology Form 1 — 35 questions",
    kind: "bank-sample",
    source: "scanned",
    updated: "18 Aug 2025",
    usedIn: 1,
    on: true,
    summary: "Topics: Introduction to Biology, Laboratory safety, Cells, Classification.",
  },
  {
    id: "data-class",
    folder: "data",
    name: "Form 2B class list.xlsx — 38 students",
    kind: "table",
    table: "class",
    source: "uploaded",
    updated: "09 Jan 2027",
    usedIn: 4,
    on: true,
    summary: "Columns: No., Name, Sex, Class.",
  },
  {
    id: "data-marks",
    folder: "data",
    name: "Term 1 marks.xlsx",
    kind: "table",
    table: "marks",
    source: "scanned",
    updated: "02 Apr 2027",
    usedIn: 2,
    on: true,
    summary: "Columns: Name, Biology, Chemistry, Physics.",
  },
  {
    id: "gold-scheme",
    folder: "golden",
    name: "Best marking scheme example (2024)",
    kind: "text",
    source: "uploaded",
    updated: "14 Dec 2024",
    usedIn: 3,
    on: true,
    summary: "Each answer on its own line, marks in brackets at the end, “any two” rules written out.",
  },
  {
    id: "off-syllabus",
    folder: "official",
    name: "Biology syllabus Form I–IV (excerpt)",
    kind: "text",
    source: "uploaded",
    updated: "05 Jan 2025",
    usedIn: 2,
    on: true,
    summary: "Topic list and learning outcomes for Form 1 to Form 4 Biology.",
  },
];

/** Facts: key/value list, editable inline. */
export const FACTS = [
  { id: "school", key: "School", value: "Mwangaza Secondary School", updated: "09 Jan 2027", usedIn: 6, on: true },
  { id: "head", key: "Headteacher", value: "Mr. Daudi Mollel", updated: "09 Jan 2027", usedIn: 4, on: true },
  { id: "address", key: "Address", value: "P.O. Box 1234, Dar es Salaam", updated: "09 Jan 2027", usedIn: 4, on: true },
  { id: "term", key: "Term dates", value: "Term 1, 2027: 12 Jan – 10 Apr 2027", updated: "09 Jan 2027", usedIn: 3, on: true },
  { id: "teacher", key: "Teacher", value: "Mwalimu Neema Joseph", updated: "09 Jan 2027", usedIn: 5, on: true },
];

export const CLASS_LIST = [
  ["1", "Amina Said", "F", "Form 2B"],
  ["2", "Baraka Mushi", "M", "Form 2B"],
  ["3", "Catherine Mrema", "F", "Form 2B"],
  ["4", "Daniel Kimaro", "M", "Form 2B"],
  ["5", "Elizabeth Mtui", "F", "Form 2B"],
];
export const MARKS = [
  ["Amina Said", "72", "65", "58"],
  ["Baraka Mushi", "55", "61", "49"],
  ["Catherine Mrema", "81", "77", "70"],
  ["Daniel Kimaro", "47", "52", "44"],
  ["Elizabeth Mtui", "68", "59", "63"],
];

/** What gets saved into the Brain after Capture. */
export const SCANNED_ITEM = {
  id: "fmt-scanned",
  folder: "formats",
  name: "Form 2 Biology Test (2025) — scanned",
  kind: "text",
  source: "scanned",
  updated: "Just now",
  usedIn: 0,
  on: true,
  summary: "Scanned from 3 handwritten pages: 8 questions, 30 marks, Section A and Section B.",
};
