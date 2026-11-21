# Report T2 — Build Replay prototype

## Status
DONE — every item of the PART B acceptance checklist is built and was exercised in a real browser; lint and build pass. Nothing is committed (the owner commits).

## What I built
- The Build Replay prototype at `/projects/build-replay/prototype`, inside the shared `PrototypeFrame` (mock-data badge, "How to use this demo", "Reset demo").
- **Start screen:** "Understand this system", the repo link prefilled with `https://github.com/example/booking-app` (editable; any value gives the same sample), a **Reconstruct** button, and a "Skip intro" link.
- **Reconstruction:** 5 staged messages with a progress bar. It is skippable, and instant when `prefers-reduced-motion` is on. It ends on the **booking-app** summary card (6 files · 8 steps · "Partial (some steps reconstructed)") with Start walkthrough / Explore: Files / Explore: System.
- **Walkthrough:**
  - A timeline of 8 step chips showing done and current state, plus Back/Next and ← → keys.
  - A step card with type, "Step n of 8", a **From history / Reconstructed** badge, when, what, why, created and changed file chips (open the Files view), new connections (select a line in the diagram), and a terminal block for the command step.
  - A **Watch out** block on steps 4, 5 and 6.
  - A **Level 1 · Story / Level 2 · Code** toggle. Story shows a dashed "Show the code for this step" button. Code shows the "How it connects" map and diffs with +/− gutters and green/red tint.
  - On the last step, Next becomes "See the System".
- **Diagram:** an SVG with the reference's coordinates (viewBox 560×400) that grows with each step. New boxes and lines get an accent highlight and a "NEW" tag. The `bcryptjs` package box is dashed, arrowheads stop at the box edges, and every line has a wide invisible tap area. Boxes and lines are keyboard buttons (Enter or Space).
- **Inspector:** clicking a box shows what it is, why, its files, "Uses", "Used by" (chips select another box) and "Appeared: Step n" (jumps to that step). Clicking a line shows why it is connected, when it was created, the code snippet in Code level, and "Show the exact code" and "Open <file>" buttons. In the walkthrough it only lists connections that exist by that step.
- **System view:** the full diagram with the inspector on the right (below on phones). The default selection is Booking.
- **Files view:** a file list (a vertical column on desktop, scrolling chips on mobile) and a detail card. The card shows purpose, part, created-in step, changed-in steps (all clickable) and the full code with line numbers in Code level, or a "Show code" button in Story level.
- **Global:** the segmented controls **Walkthrough | System | Files** and **Story | Code**; Reset demo returns to the start screen.
- **Data:** `features/build-replay/data/index.js` was generated from the reference HTML. I verified NODES, EDGES, FILES and all 8 STEPS (including derived fields) are identical to the reference. I added only the `source` labels and `risk` texts from PART B.

## Files created / changed
- features/build-replay/data/index.js — mock data (nodes, edges, steps, files) and small helpers
- features/build-replay/index.js — the prototype inside PrototypeFrame, with the "How to use" steps
- features/build-replay/build-replay.js — state, views, keyboard shortcuts
- features/build-replay/components/start-screen.js — intro card, staged reconstruction, summary card
- features/build-replay/components/walkthrough.js — timeline, Back/Next, diagram column
- features/build-replay/components/step-card.js — step content, source badge, risk
- features/build-replay/components/diagram.js — the SVG diagram
- features/build-replay/components/inspector.js — node and line explanations
- features/build-replay/components/system-view.js, files-view.js — the other two views
- features/build-replay/components/code-block.js — diff, full code, snippet, map, terminal
- features/build-replay/components/chip-button.js — small clickable chips and text buttons
- app/projects/[slug]/prototype/page.js — renders the prototype for `build-replay`; the other four keep the placeholder
- docs/reports/T2-report.md — this report

## Matches the spec? (PART B acceptance checklist)
- [x] Start screen with simulated reconstruction (skippable, reduced-motion instant) — ✅ ~3.9s normally, Skip works, ~50ms with reduced motion
- [x] 8-step walkthrough with timeline, Back/Next, keyboard arrows — ✅ ← → verified; arrows are ignored while a form control has focus
- [x] Source badge on every step; risks on steps 4–6 — ✅ labels match the PART B table; risk text appears only on 4, 5, 6
- [x] Story/Code levels; diffs and function maps in Code level — ✅ the map is shown for steps 4, 5 and 7, which are the steps that have one in the reference data
- [x] Growing diagram with NEW highlights; node/edge inspector — ✅ nodes per step 1,2,3,4,5,6,6,6; edges 0,1,1,3,5,6,7,7
- [x] System view with cross-links back to steps and files — ✅ "Appeared" and "Created" jump to the step; file chips open Files
- [x] Files view with created/changed links and full code — ✅
- [x] Works at 360px and 1440px; no page-level horizontal scroll — ✅ see "Deviations" for the diagram on phones
- [x] Reset demo, How to use hint, mock-data badge — ✅ (provided by PrototypeFrame)
- [x] lint + build pass — ✅

## Deviations from spec
- **Diagram on very narrow phones:** the SVG keeps a minimum width of 22rem (352px), so at 360px it scrolls sideways *inside its own box* (the spec allows diagrams to scroll in their own box) and a "Swipe sideways" hint shows. Shrinking it to fit would make the labels ~9px, which is unreadable. From about 420px up it fits without scrolling.
- **"Skip" before the summary:** the spec says the reconstruction is skippable; I show a "Skip" link, and "Skip intro" on the first screen goes straight to the walkthrough, as the spec says.
- **Staged progress is local:** the progress component lives in `features/build-replay/components/start-screen.js` (the spec says to keep everything inside the feature folder). T3–T6 need the same behaviour, so it could be hoisted into `components/`.

## Decisions needing approval
- Should I hoist the staged-progress logic into a shared component (`components/`) before T3, or keep each prototype self-contained as T2 does?

## How I verified
- **Carried over from T1 — TOC "last heading highlighted at page bottom" rule:** re-checked in headless Chrome at 1440px on the docs of `build-replay`, `xerote` and `hardware-lab`. At the top the active item is "Summary", in the middle it is the section in view, and scrolled to the very bottom it is **"About the prototype"**, which is the last heading in each case. The rule works.
- `npm run lint`: passes with no output.
- `npm run build`: passes (23 static pages).
- Data fidelity: a script compared my data file with the reference HTML (NODES, EDGES, FILES, STEPS incl. derived fields); identical.
- End-to-end in headless Chrome (a scripted run): start, Reconstruct, summary, Start walkthrough, all 8 steps (checked title, source badge, risk, and counts of nodes, lines and NEW tags per step), Story to Code (diff headers NEW FILE/CHANGED and the map), clicking a box and a line, keyboard selecting a line with Enter, ← → keys, files chip, "Step n" jump links from the inspector and Files view, System default selection, line inspector in both levels, "Show the exact code" and "Open <file>", "See the System", Reset demo, Skip, and "any text works" in the link field.
- Reduced motion: with `prefers-reduced-motion: reduce` the summary appears in ~50ms.
- Widths and themes: 360px and 1440px, light and dark, across start, summary, walkthrough steps 1/4/6/8 in Story and 4/6 in Code, System and Files: no page-level horizontal scroll, and no element sticks out past the screen (I fixed one real bug here, see Known issues). I looked at screenshots at 360px and 1440px.
- Not checked: 768px for this prototype (not required by T2), touch input on a real device (the tap areas are just larger SVG hit lines), Safari/Firefox, screen readers.

## Known issues
- **Fixed during this task:** at 360px the Files view first stretched wider than the screen, hidden by the page's `overflow-x: clip`. Cause: grid columns sized to their content. I fixed it in every grid in the feature (`minmax(0,1fr)`) and re-checked at both widths.
- "Reset demo" returns to the start screen, so the Booking selection in System and the Story level also reset (intended).
- The inspector is announced with `aria-live="polite"`; I did not test how verbose that is with a screen reader.

## Suggestions (not built)
- Hoist the staged-progress and chip-button pieces into shared components (see Decisions).
- A small "mini-map" of which step you are on inside the diagram for very narrow screens.
