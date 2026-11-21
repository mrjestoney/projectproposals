# Report T3 — Daftari prototype

## Status
DONE — every item of the PART B acceptance checklist is built and was exercised in a real browser; the T2 refactor and the Build Replay re-checks (including 768px) are done; lint and build pass. Nothing is committed (the owner commits).

## What I built
- **Refactor you approved (T2 decision 2):** I moved the staged-progress logic into a shared `components/staged-progress.js`, and the generic chip buttons into `components/ui/chip-button.js`. Build Replay now uses both. I added a small `lib/use-reduced-motion.js` hook that both prototypes use. Build Replay's own "Working" screen is now a thin wrapper around the shared component.
- **Daftari at `/projects/daftari/prototype`** inside `PrototypeFrame`, with a top segmented control **Capture · Brain · Create**. It opens on Capture with the Brain already filled. Switching tabs keeps your work; Reset demo returns to the start.
- **Capture:**
  - A fake camera viewfinder (dark frame, corner guides) shows lined paper in a handwriting font (Caveat via `next/font/google`).
  - **Start scanning** runs the flip-scan animation: page appears, "Page turn detected", "Page n captured", next page slides in, with a "n pages captured" counter. It is skippable, and instant with reduced motion.
  - The **review** screen shows the extracted text with its structure and **8 yellow uncertain words**: Nema→Neema, photosyntesis, chlorplast, osmusis, mitocondria, nucleas, "[S marks]"→[5 marks], difusion.
  - Tapping a yellow word opens a sheet with 3 suggestions and a "type it yourself" box. Fixing a word clears the highlight, and the counter goes from "8 words to check" to "All checked ✓".
  - "Show original page" shows the handwritten pages **side by side on desktop**, and as an **Extracted text / Original page** tab on mobile.
  - **Save to Brain** shows the toast "Saved to Brain › Formats", and the scan appears in the Brain.
- **Brain:**
  - Six folders (a left list on desktop, scrolling chips on mobile). Every item has a source icon (scanned / uploaded / typed), a last-updated date, "used in N documents", and an on/off switch.
  - Each item has a details panel. The exam format shows its structure table, the data files show a 5-row preview, and the Form 2 bank lists all questions with a topic filter.
  - **Facts** are editable inline, and a changed fact is used in the next document. I tested this: changing the school and term dates changed the exam header.
- **Create:**
  - A 3-step wizard (document type, sources, instructions). Only **Exam** is available; Lesson plan, Letter and Invoice say "Coming in the full version".
  - Step 2 respects the Brain: anything turned off there cannot be picked, and **Generate** is blocked with a message.
  - Step 3 has the prefilled instructions and three quick chips. The instructions text is actually read (topics, no repeats, mix difficulty, diagram question), and "Daftari understood: …" shows what it read.
  - **Generate** shows staged progress, then an **A4-looking preview**:
    - The header is built from Facts. Sections A (10 × 2) and B (3 × 10) add up to a live **Total: 50/50 ✓**.
    - Each question has a source tag ("Biology Form 2 bank · Q1 · never used") and a **Swap** button. Swap picks another unused question of the same kind and marks (same topic first) and tags it "swapped".
    - A "0 questions from 2025 exams" badge, a **Version A/B** toggle (B shuffles within sections, always the same shuffle), and a **Marking scheme** tab with the mark points per question.
    - **Edit text** makes every question and part editable inline.
    - **Export** opens a sheet: Word and PDF say "Available in the full version", and **Print** and **Copy as text** work.
    - **Save to Brain › Golden examples** adds an item to that folder.
- **Question bank:** `features/daftari/data/questions.js` has **50 Form 2 Biology questions** (Cells, Nutrition, Transport and Classification: 36 short × 2 marks, 14 structured × 10 marks with parts). Each has an answer or marking points, a difficulty, and a "last used" value (11 are marked "Mid-Term 2025"). I wrote the content to Form 2 level and checked it carefully, but a Biology teacher should still review it. A script confirmed that every question's marking points add up to its marks and every structured question's parts add up to 10.

## Files created / changed
- features/daftari/index.js — prototype inside PrototypeFrame, with the "How to use" steps
- features/daftari/daftari.js — state for the three tabs
- features/daftari/fonts.js — handwriting font
- features/daftari/data/questions.js, pages.js, brain.js — mock data (bank, scanned pages and uncertain words, Brain items, facts, class list)
- features/daftari/lib/generate.js — instruction parsing, question choice, swap, Version B, plain-text export
- features/daftari/components/capture.js, scan-simulation.js, review.js, handwritten-page.js — Capture
- features/daftari/components/brain.js — Brain
- features/daftari/components/create.js, exam-preview.js — Create, exam and marking scheme preview
- components/staged-progress.js — shared simulated-AI progress (new, from the refactor)
- components/ui/chip-button.js — moved from `features/build-replay/components/`
- components/ui/switch.js — on/off switch (new)
- lib/use-reduced-motion.js — reduced-motion hook (new)
- components/ui/tabs.js, segmented-control.js — added `overflow-y-hidden` (a stray scrollbar showed on dark mode)
- app/globals.css — new tokens `--paper`, `--paper-ink`, `--camera` (same in both themes: printed paper and the camera frame) and the print rules
- app/projects/[slug]/prototype/page.js — renders Daftari for `daftari`
- features/build-replay/components/start-screen.js, step-card.js, files-view.js, inspector.js — now use the shared components
- docs/reports/T3-report.md — this report

## Matches the spec? (PART B acceptance checklist)
- [x] Capture: simulated flip scan of 3 pages; review with ≥ 6 yellow words; fix via suggestions; save to Brain — ✅ 8 words; suggestions and custom input both work; saved item appears under Formats
- [x] Brain: 6 folders with mock items, on/off toggles, editable facts, bank detail — ✅
- [x] Create: 3-step wizard, staged generation, A4 preview, totals check, source tags, swap (no repeats), marking scheme, Version A/B, inline edit, print + copy as text — ✅ see Deviations (source tags are always visible, not hover-only)
- [x] Mobile (stacked, sheet popovers) and desktop (side-by-side) layouts — ✅ checked at 360px and 1440px
- [x] Reset, How to use, mock-data badge — ✅ (PrototypeFrame)
- [x] lint + build pass — ✅

## Deviations from spec
- **Source tag and Swap are always shown** under each question (a dashed bar that is hidden in print), with a "Show sources" switch to turn them off. The spec said "on hover/tap"; hover-only would be unreachable on touch and keyboard.
- **Word popover is the shared Sheet:** a bottom sheet on phones and a centred dialog on desktop (not a small popover next to the word).
- **Brain count text:** the bank item reads "Biology Form 2 — 50 questions" (the spec example said 42), because the number is taken from the real bank.
- **Data file and "also use" options have light effects:** a chosen class list adds "Class: Form 2B · 38 students" to the header; "Follow my marking-scheme style" adds a note to the marking scheme; "Match the syllabus" adds a "Syllabus: Biology Form I–IV" line. They are there to show the idea, not full features.
- **"Include diagram question" prefers questions that ask the student to draw and label a diagram** (3 such questions are flagged). No figures are rendered.
- **Save to Brain is allowed at any time**, not only when all words are checked.
- **Staged-progress for scanning** uses its own timeline (page by page), not the shared StagedProgress, because it needs per-page frames.

## Decisions needing approval
- None blocking. A Biology teacher could review the 50 questions and answers before the prototype is shown to others.

## How I verified
- **Refactor and Build Replay re-check (T2 decision 2)** in headless Chrome at 1440px: start → Reconstruct → shared staged progress shows 5 stages → **Skip** → summary → Start walkthrough → step 1; file chips (now from `components/ui`) still open the Files view; with `prefers-reduced-motion` the summary appears in ~42ms. All as before the refactor.
- **Build Replay at 768px (as requested):** start, summary, walkthrough step 1, Code level steps 4, 6 and 8, System and Files views. There is no page-level horizontal scroll and nothing sticks out past the screen. The diagram is 637px wide and fits without scrolling. At 768px the layout is a single column (the two-column layout starts at 1024px). I looked at screenshots of step 4 and Files.
- `npm run lint`: passes with no output.
- `npm run build`: passes (23 static pages).
- **Question bank:** a script checked that marking points add up to each question's marks, structured parts add up to 10, and counts (50 total; 9 short per topic; Cells 4, Nutrition 4, Transport 3, Classification 3 structured).
- **Question choice, tested by script:** the default instructions give exactly 50 marks with 0 questions from 2025 and mixed difficulty. Version B has the same questions in a different order. Repeated swaps never choose a used question. The diagram chip picks the diagram questions.
- **End-to-end in headless Chrome (scripted):** the scan frames (counter 0→3, page turn, captures); the review counter 8→7→"All checked ✓"; both suggestion and typed fixes; original page side by side on desktop and the tab on mobile; Save to Brain toast and the new Brain item; all 6 folders; bank details and topic filter; data preview (5 rows); fact edit; Create steps 1–3 and chip toggling; staged generation; header, total, source tag; Swap (tag changes to "swapped"); Version B; marking scheme tab; Edit text; Export sheet; Print called `window.print`; Copy as text; Save to Golden examples; switching Brain items off blocks Create; Reset demo; fact changes appear in the next exam header.
- **Print:** with print media emulated, the page header, footer, sub-nav and toolbar disappear and only the exam sheet remains (1368px tall), with the source bars hidden. I did not open the real print dialog.
- **Copy:** I intercepted `writeText` and read the text it was given: the full exam (ends "Total: 50/50") and the marking scheme. The headless browser would not let me read the real clipboard back, so the "Copied" toast plus this check is my evidence.
- **Widths and themes:** 360px and 1440px, light and dark, across about 17 states each (capture idle, scanning, review, word sheet, original page, all Brain views, all 3 Create steps, result in Version A, B, edit mode, marking scheme, export sheet). No page-level horizontal scroll and no element sticking out past the screen. I also checked review and result at 768px. I looked at screenshots at 360px and 1440px.
- **Not checked:** real phone cameras (there is none; it is a simulation), a real printed page, Safari/Firefox, touch input on a device, screen readers.

## Known issues
- "How to use this demo" is open by default (PrototypeFrame behaviour from T1) and takes about half a phone screen before the prototype starts. Collapsing it by default on small screens would help.
- The scan simulation takes about 7 seconds; Skip is available.
- Brain items other than the Form 2 bank, class list and marks have short text details only.
- Word and PDF export are not available (as specified).

## Suggestions (not built)
- A real figure for the diagram questions.
- Collapse "How to use" by default below 768px for all prototypes.
- A "Letter to parents" generator using the class list (the spec marks it as a bonus).
