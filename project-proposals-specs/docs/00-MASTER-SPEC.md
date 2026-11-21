# 00 — MASTER SPEC: "Project Proposals" Web App

> **Who this is for:** the coding agent (Claude Code) building this app.
> **Read this file first, completely, before touching any code.** Then read the project file for whatever task you are given.
> This file is the boss. If anything in a prompt or another file conflicts with it, stop and report the conflict instead of guessing.

---

## 1. What we are building

One clean Next.js web app that presents **five software project proposals**. For each project the app has:

1. **Documentation** — a properly navigable, readable proposal: what the project is, the problem, how it works, features, doability, risks, roadmap.
2. **Prototype** — a clickable, working demo with **mock data only** (no backend, no real AI calls) so a reader can *try* the idea.

The audience is a person the owner will share the app with (a reviewer, partner or funder). They must be able to: open the app → pick a project → read about it → test the prototype — on **both mobile and desktop**.

### The five projects

| # | Slug | Name | One-line promise | Spec file |
|---|------|------|------------------|-----------|
| 1 | `build-replay` | **Build Replay** | Feed it a repo, watch how the software was built — step by step, with the *why*. | `docs/01-build-replay.md` |
| 2 | `poster-unlocker` | **Poster Unlocker** | Turn any flat poster into an editable design. | `docs/02-poster-unlocker.md` |
| 3 | `daftari` | **Daftari** | Show it your paper. It remembers your work. It writes your documents. | `docs/03-daftari.md` |
| 4 | `xerote` | **Xerote** | An AI engineer that interviews you, then instructs your coding AI step by step — and never drifts from the plan. | `docs/04-xerote.md` |
| 5 | `hardware-lab` | **3D Hardware Lab** | Learn computer hardware by exploring, building and fixing a PC in 3D. | `docs/05-3d-hardware-lab.md` |

Reference material: `docs/reference/build-replay-prototype.html` — a working single-file HTML prototype of Build Replay. Use it for behaviour and content, **not** for its visual style (visual style comes from Section 4).

---

## 2. Hard rules (never break these)

1. **No backend, no database, no API keys, no real AI calls.** Everything is mock data shipped in the code. Any "AI" step is simulated (short fake progress, then pre-written results).
2. **Do not modify anything outside this project folder.** In particular, `~/projects/jestoneacademy` is **read-only** — you only read it to learn the visual style.
3. **Dependencies:** you may add only these without asking:
   - `react-markdown`, `remark-gfm`, `rehype-slug` (documentation rendering)
   - `three`, `@react-three/fiber`, `@react-three/drei` (only for the 3D Hardware Lab)
   - `lucide-react` (icons)
   Anything else → stop and ask in your report under "Decisions needing approval".
4. **Mobile and desktop are both first-class.** Every page must work at 360px wide and at 1440px wide. No horizontal page scrolling (code blocks/diagrams may scroll inside their own box).
5. **Stay in scope.** Build exactly what the current task asks. If you think something extra is needed, list it under "Suggestions" in your report — do not build it.
6. **Follow the project's existing setup.** Check whether the project uses JavaScript or TypeScript, `src/` or not, and the installed Next.js version. Match them. If `AGENTS.md` exists in the project root, read and follow it (it has version-specific Next.js guidance — e.g. route `params` may be async in this version).
7. **Never leave the build broken.** At the end of every task, `npm run build` and `npm run lint` must pass.
8. **Report after every task** in the exact format in Section 9. No report = task not done.

---

## 3. Information architecture & routes

```
/                                   Home — intro + 5 project cards
/projects/[slug]                    Project landing — summary, key facts, two big buttons: "Read the proposal" / "Try the prototype"
/projects/[slug]/docs               Documentation (rendered from markdown) with table of contents
/projects/[slug]/prototype          The interactive prototype
/about                              Short page: what this collection is, how to use it, note that prototypes use mock data
```

- Unknown slug → proper 404 page in the app's style.
- Every project page has a **project sub-nav** with two tabs: **Proposal** | **Prototype** (plus a back link to all projects).
- Prev/next project links at the bottom of each docs page.

### Content source (single source of truth)

- Each project's documentation is the **"PART A — PROPOSAL"** section of its `docs/0X-*.md` file.
- Copy PART A of each file into `content/projects/<slug>.md` (create the `content/` folder at project root). The app renders those files. Do **not** paste proposal text into JSX.
- **PART B — PROTOTYPE SPEC** is for you (the builder) only. It is never shown in the app.
- Project metadata (name, slug, tagline, promise, icon, accent, status tags) lives in one file, e.g. `lib/projects.(js|ts)`, and is used by the home cards, landing pages and nav.

---

## 4. Visual style

### 4.1 Where the style comes from
The owner's existing app is at `~/projects/jestoneacademy`. It is **mostly mobile**. Read it (read-only) to extract:
- the colour palette (primary, accent, backgrounds, text, borders, success/warning/error)
- fonts and type scale
- corner radius, shadows, spacing rhythm
- the feel of buttons, cards, inputs, chips/tags, nav bars, icons

Write what you find into `docs/DESIGN-NOTES.md` (Task 0) and then implement it as **design tokens** (CSS variables in `globals.css`, exposed to Tailwind via the theme). All components use tokens — never hard-coded hex values inside components.

### 4.2 Extending it to desktop
The source app is mobile-first; ours must be equally good on desktop:
- **Mobile (< 768px):** single column, sticky top bar, bottom-safe spacing, docs TOC in a collapsible "On this page" dropdown, prototype panels stack vertically.
- **Tablet (768–1024px):** two columns where useful.
- **Desktop (≥ 1024px):** max content width ~1200px centred; docs use a **left sidebar** (project nav) + **right "On this page" TOC** + readable centre column (~70 characters per line); prototypes use side-by-side panels.

### 4.3 General look
- Clean, calm, professional. Plenty of white space. One accent colour per project (derived from the palette) used sparingly to tell projects apart.
- Light and dark mode: follow the system preference; if the source app has a dark mode, match it, otherwise create a careful dark palette from the same hues.
- Every prototype shows a small, clear badge: **"Prototype · mock data"**.
- Visible keyboard focus, sufficient contrast (WCAG AA), `prefers-reduced-motion` respected.
- No emoji as icons — use `lucide-react`.

If the source app cannot be read or has no clear style, **stop and report** — do not invent a style without approval.

---

## 5. Shared components (build once, reuse)

- `AppShell` — top bar (app name, links: Projects, About, theme toggle), responsive menu on mobile, footer.
- `ProjectCard` — name, tagline, 2–3 tags, accent, link.
- `ProjectSubNav` — tabs Proposal / Prototype, back to projects.
- `DocViewer` — renders markdown (GFM tables, code blocks, headings with anchor ids), builds the TOC from `##` and `###` headings, highlights the current section while scrolling (desktop), collapsible TOC on mobile, prev/next project links.
- `PrototypeFrame` — wrapper with title bar, "Prototype · mock data" badge, "Reset demo" button, optional "How to use this demo" collapsible hint.
- UI primitives: `Button` (primary/secondary/ghost), `Card`, `Chip/Tag`, `Tabs`, `Segmented control`, `Modal/Sheet` (sheet on mobile, dialog on desktop), `Progress`, `Toast`, `EmptyState`.

Rules: no `alert()/confirm()/prompt()`; build dialogs in the page. Copy buttons use `navigator.clipboard.writeText` inside a try/catch and show a toast.

---

## 6. Prototype principles (apply to all five)

1. **Opens in a realistic working state** with example data already loaded — never an empty shell.
2. **Simulated AI:** when the user triggers an "AI" action, show 1–3 seconds of staged progress text (e.g. "Reading files… Mapping connections… Writing explanations…"), then show the pre-written result. Make the timing skippable (a "Skip" link) and instant when `prefers-reduced-motion` is on.
3. **Mock data lives in separate data files** per project (e.g. `features/<slug>/data.js`), not mixed into components.
4. **"How to use this demo"** — a short 3–5 step hint at the top of each prototype, collapsible.
5. **Reset demo** always returns to the initial state.
6. State can live in React state; `localStorage` only for small conveniences, wrapped in try/catch.
7. Each prototype is self-contained in its own folder (e.g. `features/<slug>/`), so they don't break each other.

---

## 7. Suggested folder structure (adapt to the project's src/ and JS/TS choice)

```
app/
  layout
  page                       (home)
  about/page
  projects/[slug]/page       (landing)
  projects/[slug]/docs/page
  projects/[slug]/prototype/page
  not-found
components/                  (shared UI)
features/
  build-replay/
  poster-unlocker/
  daftari/
  xerote/
  hardware-lab/
content/projects/*.md        (PART A of each docs file)
lib/projects                 (metadata)
docs/                        (these spec files + reports — do not ship-render these except via content/)
docs/reports/                (your task reports)
```

The 3D Hardware Lab must be **client-only and lazy-loaded** (dynamic import, no SSR) so it does not slow down other pages.

---

## 8. Task plan

| Task | Title | Depends on |
|------|-------|-----------|
| T0 | Recon: read specs, read the source app's style, inspect project setup. Write `docs/DESIGN-NOTES.md`. **No app code.** | — |
| T1 | Foundation: tokens, theme, AppShell, home, routes, project metadata, content files, DocViewer, placeholders for prototypes | T0 approved |
| T2 | Prototype: Build Replay | T1 |
| T3 | Prototype: Daftari | T1 |
| T4 | Prototype: Xerote | T1 |
| T5 | Prototype: Poster Unlocker | T1 |
| T6 | Prototype: 3D Hardware Lab | T1 |
| T7 | Polish & QA: responsive pass, accessibility, performance, README | T2–T6 |

Do one task per prompt. Do not start the next task until told.

---

## 9. Report format (mandatory after every task)

Write the report to `docs/reports/T<n>-report.md` **and** print the same report as your final chat message. Use exactly these headings:

```markdown
# Report T<n> — <task title>

## Status
DONE | PARTIAL | BLOCKED  (one word, then one sentence)

## What I built
- bullet list, plain words

## Files created / changed
- path — one-line purpose

## Matches the spec?
- For each requirement in the task's checklist: ✅ done / ⚠️ partly / ❌ not done — short note

## Deviations from spec
- anything I did differently and why (write "None" if none)

## Decisions needing approval
- questions or choices for the owner (write "None" if none)

## How I verified
- `npm run lint` result
- `npm run build` result
- pages I checked and at which widths (360px / 768px / 1440px)

## Known issues
- (write "None" if none)

## Suggestions (not built)
- ideas outside scope (optional)
```

Keep reports honest. "PARTIAL" with clear notes is better than a false "DONE".

---

## 10. Definition of done (whole app)

- All routes in Section 3 work; 404 works.
- All five proposals render from `content/projects/*.md` with working TOC, anchors, prev/next.
- All five prototypes work end to end with mock data, have "How to use", "Reset demo", and the mock-data badge.
- Looks consistent with the source app's style, on mobile and desktop, light and dark.
- `npm run lint` and `npm run build` pass with no errors.
- `README.md` explains how to run, the structure, and how to edit proposal text (edit `content/projects/*.md`).
