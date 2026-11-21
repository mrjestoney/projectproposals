# Prompt Playbook — Project Proposals app

You are the messenger. Claude Code is the builder. I (Claude, in the chat) am the spec keeper.

---

## Setup (once)

1. Put the files in your project like this:

```
~/projects/projectproposals/
  docs/
    00-MASTER-SPEC.md
    01-build-replay.md
    02-poster-unlocker.md
    03-daftari.md
    04-xerote.md
    05-3d-hardware-lab.md
    reference/
      build-replay-prototype.html
```

(This PROMPTS.md file is for you. Keep it outside the project, or in `docs/` — either is fine.)

2. Commit the clean starting point:

```bash
cd ~/projects/projectproposals
git add -A && git commit -m "Add specs"
```

3. Start Claude Code in the project folder:

```bash
cd ~/projects/projectproposals
claude
```

## The loop (every task)

1. Paste the next prompt below into Claude Code.
2. Let it work. If it asks for permission to read `~/projects/jestoneacademy`, allow it (read only).
3. When it finishes, it prints a **report** (also saved in `docs/reports/`).
4. **Paste the whole report to me in the chat.**
5. I check it against the spec and reply with either **"Approved: run the next prompt"** or a **fix prompt**.
6. After approval, commit:

```bash
git add -A && git commit -m "T<n> done"
```

Rules for you:
- Run **one prompt at a time**. Don't skip ahead.
- If Claude Code asks you a question mid-task, copy the question to me before answering, unless it's trivial.
- If something breaks badly: `git reset --hard` goes back to your last commit.

---

## PROMPT T0: Recon (no code)

```
You are building the "Project Proposals" web app in this folder.

Read these files completely, in order:
1. docs/00-MASTER-SPEC.md  (the boss: rules, routes, design, report format)
2. docs/01-build-replay.md, docs/02-poster-unlocker.md, docs/03-daftari.md, docs/04-xerote.md, docs/05-3d-hardware-lab.md
3. docs/reference/build-replay-prototype.html  (behaviour reference only)
4. AGENTS.md in this project root, if it exists, and follow it.

Then:
A) Inspect this project's setup: Next.js version, JavaScript or TypeScript, src/ directory or not, Tailwind version and how it's configured, ESLint config, existing files. Do not change anything.
B) Read the existing app at ~/projects/jestoneacademy as READ-ONLY reference for visual style. Do NOT modify, install, or run anything there. Extract: colour palette (with hex values and their roles), fonts and type scale, radius, shadows, spacing, button/card/input/chip/nav styles, icon style, light/dark mode handling. Note it's mostly mobile.
C) Write docs/DESIGN-NOTES.md with:
   - Section 1: what you found in jestoneacademy (with file paths where you found it)
   - Section 2: the proposed design tokens for our app (CSS variable names + values, light and dark)
   - Section 3: how you'll extend the mobile style to tablet and desktop (layout rules per breakpoint)
   - Section 4: per-project accent colours (5), derived from the palette
   - Section 5: project setup facts (Next version, JS/TS, src/, Tailwind version)
D) Do NOT write any app code in this task.

Finish with the report exactly as in Section 9 of docs/00-MASTER-SPEC.md, saved to docs/reports/T0-report.md and printed in chat. Under "Decisions needing approval", list any style choices you are unsure about.
```

---

## PROMPT T1: Foundation

*(Only after I approve T0.)*

```
Task T1: Foundation. Follow docs/00-MASTER-SPEC.md and docs/DESIGN-NOTES.md (approved).

Build:
1. Design tokens as CSS variables in the global stylesheet (light + dark via prefers-color-scheme, plus a manual theme toggle that sets data-theme on <html>, stored in localStorage with try/catch). Expose tokens to Tailwind. Load fonts with next/font.
2. Shared components from Section 5: AppShell (top bar, mobile menu, footer), ProjectCard, ProjectSubNav, DocViewer, PrototypeFrame, and UI primitives (Button, Card, Chip, Tabs, SegmentedControl, Sheet/Dialog, Progress, Toast, EmptyState). Use lucide-react icons.
3. Project metadata file (lib/projects) with the 5 projects from Section 1 (name, slug, tagline, promise, accent, tags, order).
4. content/projects/<slug>.md: copy PART A of each docs/0X file exactly (everything between "# PART A — PROPOSAL" and "# PART B"). Remove the line "*(Copy everything in PART A…)*". Keep links.
5. Routes from Section 3: home, about, project landing, docs, prototype, 404. Prototype pages show a PrototypeFrame with a "Prototype coming in the next task" EmptyState for now.
6. DocViewer: react-markdown + remark-gfm + rehype-slug; styled typography (tables, code, blockquotes, lists) using tokens; TOC from ## and ### headings; desktop: left project sidebar + right sticky "On this page" with active-section highlight; mobile: collapsible "On this page"; prev/next project links. External links open in new tab with rel="noopener noreferrer".
7. Home page: short intro ("Five project proposals. Read each one, then try its prototype."), 5 ProjectCards, note that prototypes use mock data.
8. Project landing: name, promise, summary paragraph (first paragraph after "## Summary"), key facts chips, two big buttons: Read the proposal / Try the prototype.
9. Generate static params for the 5 slugs.

Check at 360px, 768px and 1440px, light and dark. Run npm run lint and npm run build; both must pass.

Do not build any prototype content yet. Do not add dependencies beyond those allowed in Section 2.
Finish with the Section 9 report (docs/reports/T1-report.md + chat). Include the acceptance list: tokens, components, metadata, content files, all routes, DocViewer features, home, landing, 404, responsive, lint/build.
```

---

## PROMPT T2: Build Replay prototype

```
Task T2: Build the Build Replay prototype.
Spec: docs/01-build-replay.md PART B (and the master spec Sections 2, 4, 5, 6).
Behaviour/data reference: docs/reference/build-replay-prototype.html. Port its data (NODES, EDGES, STEPS, FILES) exactly into features/build-replay/data, then add the source labels and risks from PART B. Rebuild the UI as clean React components using our tokens and shared components. Do not copy the reference's CSS look.

Put everything in features/build-replay/ and render it on /projects/build-replay/prototype inside PrototypeFrame.

Work through every item of the PART B acceptance checklist. Check at 360px and 1440px. lint + build must pass.
Finish with the Section 9 report (docs/reports/T2-report.md + chat). In "Matches the spec?" copy the PART B acceptance checklist and mark each item.
```

---

## PROMPT T3: Daftari prototype

```
Task T3: Build the Daftari prototype.
Spec: docs/03-daftari.md PART B (and master spec Sections 2, 4, 5, 6).
All mock data (pages, uncertain words, Brain items, facts, the 42+ question bank with answers) goes in features/daftari/data. Questions must be correct Form 2 Biology content.
Put everything in features/daftari/ and render on /projects/daftari/prototype inside PrototypeFrame.

Work through every item of the PART B acceptance checklist. Check at 360px and 1440px. lint + build must pass.
Finish with the Section 9 report (docs/reports/T3-report.md + chat), with the PART B checklist marked item by item.
```

---

## PROMPT T4: Xerote prototype

```
Task T4: Build the Xerote prototype.
Spec: docs/04-xerote.md PART B (and master spec Sections 2, 4, 5, 6).
Write all mock content (interview Q&A, plan, 12 tasks with acceptance checks, the T4 prompt text, the good and problem sample reports, verification results, change request, MCP log) in features/xerote/data. Make the prompt and reports realistic: they should look like real Claude Code prompts/reports.
Put everything in features/xerote/ and render on /projects/xerote/prototype inside PrototypeFrame.

Work through every item of the PART B acceptance checklist. Check at 360px and 1440px. lint + build must pass.
Finish with the Section 9 report (docs/reports/T4-report.md + chat), with the PART B checklist marked item by item.
```

---

## PROMPT T5: Poster Unlocker prototype

```
Task T5: Build the Poster Unlocker prototype.
Spec: docs/02-poster-unlocker.md PART B (and master spec Sections 2, 4, 5, 6).
The poster is built from HTML/CSS layers (no external images). Flat mode and unlocked mode use the same layer data. Write the 3 format position maps (4:5, 1:1, 9:16) and the English/Swahili texts in features/poster-unlocker/data. Dragging must work with mouse and touch (pointer events).
Put everything in features/poster-unlocker/ and render on /projects/poster-unlocker/prototype inside PrototypeFrame.

Work through every item of the PART B acceptance checklist. Check at 360px and 1440px. lint + build must pass.
Finish with the Section 9 report (docs/reports/T5-report.md + chat), with the PART B checklist marked item by item.
```

---

## PROMPT T6: 3D Hardware Lab prototype

```
Task T6: Build the 3D Hardware Lab prototype.
Spec: docs/05-3d-hardware-lab.md PART B (and master spec Sections 2, 4, 5, 6).
You may install three, @react-three/fiber and @react-three/drei (versions compatible with the installed React/Next). The 3D canvas must be client-only and lazy-loaded with next/dynamic (ssr: false). Build the PC from primitives, no external model files. Parts, build steps, scenarios and quiz go in features/hardware-lab/data.
Put everything in features/hardware-lab/ and render on /projects/hardware-lab/prototype inside PrototypeFrame.

Work through every item of the PART B acceptance checklist. Check at 360px and 1440px, and confirm with the build output that other routes' first-load JS did not grow because of three.js. lint + build must pass.
Finish with the Section 9 report (docs/reports/T6-report.md + chat), with the PART B checklist marked item by item, and include the relevant lines of the build output.
```

---

## PROMPT T7: Polish & QA

```
Task T7: Polish and QA across the whole app. Do not add new features.
1. Check every route at 360px, 768px, 1440px, light and dark. Fix layout bugs, overflow, clipped text, inconsistent spacing.
2. Consistency: all prototypes use PrototypeFrame, the mock-data badge, How to use, and Reset demo; shared components used consistently; no hard-coded colours in components (grep for hex values outside the token file and report them).
3. Accessibility: keyboard navigation through nav, tabs, prototypes; visible focus; alt text/aria labels; contrast AA; prefers-reduced-motion respected.
4. Performance: report first-load JS per route from the build output; make sure 3D code is split.
5. Metadata: page titles and descriptions per route, favicon from the design style, Open Graph title/description.
6. README.md: what the app is, how to run (npm install, npm run dev), folder structure, how to edit proposal text (content/projects/*.md), how to edit mock data (features/<slug>/data).
7. Final: npm run lint and npm run build pass.
Finish with the Section 9 report (docs/reports/T7-report.md + chat), including a table: route × (360/768/1440) × (light/dark) = OK/fixed, and the first-load JS table.
```

---

## Templates for problems

**Fix prompt** (I'll usually write these for you, but here's the shape):

```
Fix for T<n>. Do only these fixes, nothing else:
1. ...
2. ...
Then re-run lint and build and send an updated report (docs/reports/T<n>-report.md, overwrite) in the Section 9 format, marking which fixes are done.
```

**If Claude Code loses context** (new session, or it seems confused):

```
Re-read docs/00-MASTER-SPEC.md and the latest file in docs/reports/. Tell me in 5 bullet points: what's done, what task we're on, and what's left in that task. Don't change any code.
```
