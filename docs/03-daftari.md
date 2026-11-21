# 03 — Daftari

> Slug: `daftari` · Status: Concept + prototype · Type: Web app (mobile + desktop) for teachers, secretaries and freelancers
> *Daftari* is Swahili for "notebook".

---

# PART A — PROPOSAL
*(Copy everything in PART A into `content/projects/daftari.md`.)*

## Summary

**Daftari is a notebook that reads your paper, remembers your work, and writes your documents.**
It has three parts:

1. **Capture** — flip through paper documents in front of your phone camera; they become accurate, editable digital text.
2. **Brain** — a private library of your knowledge: past documents, data files, facts, formats and examples, all under your control.
3. **Create** — generate your repeated documents (exams, lesson plans, letters, invoices…) in **your exact format**, from **your sources**, with AI help you can edit.

> **Promise:** *"Show it your paper. It remembers your work. It writes your documents."*
> In one line: **"Never type the same thing twice again."**

## The problem

### 1. Getting paper into AI is painful
AI can help with almost any document — but first you have to get the document *into* the AI:
- Photograph every page one by one, upload each, wait.
- The AI misreads handwriting, tables and numbers — and you don't know *which* words it got wrong, so you must re-check everything.
- Structure is lost: question numbers, columns, tables, mark allocations.
- Long documents hit upload limits.

Teachers ask for this constantly: they have years of exams, notes and mark sheets on paper.

### 2. Repeated documents eat hours every week
- **Teachers:** lesson plans, schemes of work, exams + marking schemes, report-card comments, letters to parents.
- **Secretaries:** official letters, meeting minutes, memos, notices — always in the office format.
- **Freelancers:** proposals, invoices, contracts, project reports.

The format is always the same; only the content changes. Yet people start from a blank page or copy-paste old files and fix them by hand — and mistakes slip in (wrong name, old date, repeated exam questions).

## The idea

One tool that covers the whole journey: **paper in → knowledge kept → finished documents out.**

```
 PAPER  ──►  CAPTURE  ──►  BRAIN  ──►  CREATE  ──►  WORD / PDF
             (flip &        (your         (your format,
              scan)         library)       your sources)
```

## Part 1 — Capture: "flip and go"

1. Open Daftari on your phone and point the camera at the document.
2. **Just flip the pages.** Daftari detects each page turn and captures automatically — no button per page, no uploading photo by photo.
3. It reads everything: printed text, handwriting, tables, numbering, simple maths.
4. You get **one clean document** with the original structure kept.

**The key difference — honest uncertainty:**
Every word Daftari isn't sure about is **highlighted in yellow**. You only check those — tap, pick the right word or type it. No re-reading whole pages.

Captured documents go straight into the **Brain**.

## Part 2 — Brain: your knowledge, under your control

A private library of everything Daftari should know about your work:

| Folder | Examples |
|--------|----------|
| **Formats** | An old exam (layout, sections, mark allocation, marking scheme), a letter template, an invoice layout |
| **Question / content banks** | Your questions per subject and topic; your standard paragraphs |
| **Data files** | Excel/CSV: class lists, marks, client lists, price lists |
| **Facts** | School name, headteacher, address, term dates, your rates, signatures |
| **Golden examples** | Documents marked *"do it like this"* |
| **Official material** | e.g. the national syllabus, so lesson plans match it |

Control:
- Turn any item **on/off** for generation.
- Update a fact once (e.g. a new headteacher) → every future document is correct.
- Every generated part shows **where it came from** ("from your 2025 Form 2 Biology bank").

## Part 3 — Create: your documents, your format

Example — **a new exam**:

1. **Pick the sources:** format = "Form 2 Biology Mid-Term (2025)"; questions = "Biology Form 2 bank".
2. **Write instructions in plain words:** *"Form 2 Biology, 50 marks, focus on cells and nutrition, mix easy and hard, no questions from last term."*
3. **Daftari builds it:** follows your exact layout and mark allocation, picks or adapts questions from your bank, **never repeats** questions used before, and writes the matching **marking scheme**.
4. **Review:** swap any question ("give me another like this"), edit anything, see each question's source.
5. **Extras:** Version A/B (shuffled) to stop copying; remembers which questions were used.
6. **Export** to Word or PDF.

The same flow works for everything else:
- **Secretary:** format = letter template, data = Excel list of 50 parents → 50 personalised letters at once.
- **Freelancer:** format = proposal template, facts = rates & portfolio → a proposal in your style in minutes.
- **Teacher:** format = lesson plan template, source = syllabus → lesson plans for the whole topic.

## Who it is for

| User | Biggest time-saver |
|------|-------------------|
| Teachers | Digitise old exams; generate new exams + marking schemes without repeats; lesson plans |
| School admin | Mark sheets → spreadsheets; letters to parents from class lists |
| Secretaries | Letters, memos, minutes in the office format |
| Freelancers | Proposals, invoices, contracts that always look professional |

## How it would be built (real version)

| Part | Approach |
|------|---------|
| Capture in the browser | Phone camera via the browser; page-turn detection by watching for motion then stillness; auto-crop and flatten each page |
| Reading | Vision-language model returns text with structure and per-word confidence |
| Uncertainty | Low-confidence words highlighted; suggestions offered |
| Brain | Per-user file storage + search index so the AI finds the right material |
| Create | Language model fills the chosen format using only selected sources; rules enforce mark totals and no-repeat |
| Export | Generate .docx and PDF |
| Languages | English and Swahili from day one |

## Doability

**Doable — yes. The most practical of the five projects.** Every component uses technology that works well today.

Hardest parts:
- **Messy handwriting** — must be handled honestly with highlights rather than hidden errors.
- **Simplicity** — busy teachers need a tool that feels as easy as WhatsApp.
- **Exact formats** — reproducing a school's Word layout precisely takes careful template work.

## Competition & difference

Scanner apps exist (they give you images or messy text). AI chatbots can write documents (generic, not in your format, no memory of your past work). Template tools exist (rigid, no AI, no capture).

**Daftari's difference:** flip-and-go capture + yellow uncertainty highlights + a Brain you control + generation in your exact format with sources shown + no-repeat memory — one flow, designed for teachers first.

## Fit with existing work

Daftari connects naturally to a school results system: scanned handwritten **mark sheets** can flow straight into results spreadsheets, and class lists from the Brain can drive report-card comments and parent letters.

## Risks

| Risk | Mitigation |
|-----|-----------|
| Handwriting accuracy | Yellow highlights, quick correction, learn from corrections |
| Privacy of student data | Private by default, clear data controls, local storage options |
| Users don't trust AI content | Source shown for every part; everything editable |

## Roadmap

| Phase | Deliverable |
|------|-------------|
| 0 | Clickable prototype with mock data *(this app)* |
| 1 | Capture (flip scan) + uncertainty review + export text |
| 2 | Brain (folders, facts, on/off) |
| 3 | Create: exams + marking schemes, no-repeat memory, Word/PDF export |
| 4 | Letters from data files, lesson plans from syllabus, Swahili UI |

## About the prototype

The prototype follows a teacher, **Mwalimu Neema**, at a made-up school. You can: simulate flip-scanning a 3-page handwritten exam and fix the yellow words; browse the Brain; and generate a new Form 2 Biology exam with a marking scheme, swap questions, create Version B, and preview the result. All data is mock data.

---

# PART B — PROTOTYPE SPEC (builder only — do not render)

## Structure
Top-level segmented control: **Capture · Brain · Create**. Open on **Capture** (the natural first step), with the Brain already filled with mock items so Create works immediately too.

## Mock identity
- Teacher: **Mwalimu Neema Joseph**, Biology, **Mwangaza Secondary School**, Dar es Salaam (made up).
- Headteacher fact: **Mr. Daudi Mollel** (made up). Term: Term 1, 2027.

## B1. Capture
- Fake camera viewport (dark rounded frame with corner guides) showing a "paper page" styled with a lined background and handwriting font (load `Caveat` or `Kalam` via next/font/google).
- 3 mock pages (handwritten exam "Form 2 Biology Test — 2025"):
  - Page 1: header (school name, subject, time 1 hr, 30 marks), Section A instructions, Q1–Q3
  - Page 2: Q4–Q6
  - Page 3: Section B, Q7–Q8 with marks in brackets
- Button **Start scanning** → animation: page appears, "Page turn detected" flash, capture tick, next page slides in (×3), counter "3 pages captured". Skippable; reduced-motion instant.
- Then **Review** screen: extracted text with structure (headings, numbered questions, marks), **yellow highlighted uncertain words** (at least 6, e.g. "photosynthesis" read as "photosyntesis", "chloroplast" as "chlorplast", "[5 marks]" read as "[S marks]", "osmosis" as "osmusis", "nucleus" as "nucleas", a name "Neema" as "Nema").
  - Tapping a yellow word opens a small popover with 2–3 suggestions + custom input; choosing clears the highlight.
  - Counter: "6 words to check" → "All checked ✓".
  - Toggle "Show original page" side-by-side (desktop) / tab (mobile).
- Button **Save to Brain** → toast "Saved to Brain › Formats" and the item appears in Brain.

## B2. Brain
Folders (left list on desktop; chips on mobile): Formats · Question banks · Data files · Facts · Golden examples · Official.
Mock items:
- Formats: "Form 2 Biology Mid-Term (2025)" — exam format: Section A 10 short questions × 2 marks = 20, Section B 3 structured × 10 = 30; total 50 · "Letter to parents (school letterhead)"
- Question banks: "Biology Form 2 — 42 questions" (topics: Cells, Nutrition, Transport, Classification) · "Biology Form 1 — 35 questions"
- Data files: "Form 2B class list.xlsx — 38 students" (show a small table preview of 5 rows) · "Term 1 marks.xlsx"
- Facts: key/value list (School, Headteacher, Address, Term dates, Teacher) — editable inline
- Golden examples: "Best marking scheme example (2024)"
- Official: "Biology syllabus Form I–IV (excerpt)"
Each item: on/off toggle "Use in documents", source icon (scanned / uploaded / typed), last updated, "used in 3 documents".
Question bank detail: list of questions with topic, difficulty (easy/medium/hard), marks, "last used: Mid-Term 2025" or "never used".

## B3. Create (the star of the prototype)
Wizard with 3 steps (stepper):
1. **Document type:** cards: Exam (selected) · Lesson plan · Letter · Invoice (others show "coming in full version" but letter can be a simple bonus if time allows — not required).
2. **Sources:** pick Format (select, default Form 2 Biology Mid-Term) + Question bank (default Biology Form 2) + optional Data file. Show checkboxes from Brain items that are "on".
3. **Instructions:** textarea prefilled: "Form 2 Biology Mid-Term, 50 marks. Focus on Cells and Nutrition. Mix easy and hard. Don't reuse questions from 2025." + quick chips ("No repeats", "Mix difficulty", "Include diagram question").
→ **Generate** → staged progress: "Reading your format…", "Choosing questions from your bank…", "Checking past exams for repeats…", "Writing the marking scheme…".

**Result view** (A4-looking preview card, scrollable):
- Header built from Facts: school name, "BIOLOGY — FORM TWO — MID-TERM EXAMINATION", Term 1 2027, Time 2 hrs, instructions.
- Section A (10 × 2 marks) and Section B (3 × 10 marks). Totals must add to 50 — show a live "Total: 50/50 ✓" check.
- Each question shows on hover/tap a **source tag** ("Biology Form 2 bank · Q17 · never used") and a **Swap** button → replaces with another unused question of the same topic/marks from the bank (keep a mock bank of ≥ 42 questions so swaps work; never pick used ones; mark swapped question as "swapped").
- **Marking scheme** tab: answer per question with marks breakdown.
- **Version A / B** toggle: B shuffles question order within sections (deterministic shuffle).
- "No repeats" badge: "0 questions from 2025 exams".
- Actions: Edit (makes question text editable inline), Export (sheet: Word / PDF → "available in full version"; working options: **Print** (`window.print()` with a print stylesheet that prints only the A4 preview) and **Copy as text**).
- "Save to Brain › Golden examples" button.

## Mock question bank
Write ≥ 42 Form 2 Biology questions (realistic, correct science) across Cells, Nutrition, Transport, Classification, each with: id, topic, difficulty, marks (2 for short, 10 for structured), text, answer/marking points, lastUsed (some "Mid-Term 2025", most null). Structured questions should have parts (a)(b)(c) with marks summing to 10.

## Acceptance checklist
- [ ] Capture: simulated flip scan of 3 pages; review with ≥ 6 yellow words; fix via suggestions; save to Brain
- [ ] Brain: 6 folders with mock items, on/off toggles, editable facts, bank detail
- [ ] Create: 3-step wizard, staged generation, A4 preview, totals check, source tags, swap (no repeats), marking scheme, Version A/B, inline edit, print + copy as text
- [ ] Mobile (stacked, sheet popovers) and desktop (side-by-side) layouts
- [ ] Reset, How to use, mock-data badge
- [ ] lint + build pass
