# 01 — Build Replay

> Slug: `build-replay` · Status: Concept + prototype · Type: Open-source developer tool (web app + CLI)

---

# PART A — PROPOSAL
*(Copy everything in PART A into `content/projects/build-replay.md`. This is what readers see.)*

## Summary

**Build Replay turns any software repository into a step-by-step replay of how it was built.**
You give it a project. It shows you, one step at a time, what was added, **why** it was added, and how the pieces connect — while a diagram of the system grows on screen. You choose how deep to go: a simple story, or the exact code.

> **Promise:** *"You vibecoded it. Now watch how it was built."*

## The problem

Software is now written faster than people can understand it.

- Developers already spend most of their working time just understanding code. A large field study of professional developers found that program comprehension takes about **58% of their time** ([Xia et al., IEEE TSE 2018](https://researchportalplus.anu.edu.au/en/publications/measuring-program-comprehension-a-large-scale-field-study-with-pr/)).
- AI now writes a large share of code. A 2026 survey of 1,100+ developers found AI accounts for **42% of committed code**, expected to reach **65% by 2027** ([Sonar State of Code 2026](https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding/)).
- Many developers ship code they don't understand: **59%** say they use AI-generated code they don't fully understand ([Clutch, 2025](https://clutch.co/resources/devs-use-ai-generated-code-they-dont-understand)).

The industry now has a name for this: **comprehension debt** — the gap between how much code exists and how much of it any human actually understands ([Addy Osmani, 2026](https://addyosmani.com/blog/comprehension-debt/)).

People feel it every day:
- A senior engineer inherits a "vibecoded" app and nobody is left to explain it.
- A founder built an app with AI and can't change it safely.
- A new team member stares at hundreds of files with no idea where to start.

Reading a codebase file by file is slow and confusing, because **files show the result, not the story**.

## The idea

Show the **story of construction** instead of the pile of files.

A human understands a building better by watching it go up — foundation, walls, wiring, roof — than by staring at the finished building. Build Replay does this for software:

1. Step 1 — the starting page was created. *Why: it's what the browser loads first.*
2. Step 2 — styling was added. *Why: the page needed its look.*
3. Step 3 — login was added. *Why: the app needs to know who is booking.*
4. …and so on, until the whole system stands.

At every step, a diagram grows. At the end you can switch to the **System** view and explore the finished architecture — and jump back to the exact step where any part first appeared.

## Who it is for

| User | Their pain | What they get |
|------|-----------|---------------|
| Senior dev inheriting a vibecoded app | No docs, no author, no history that makes sense | A guided tour of the whole system in minutes |
| Founder / vibecoder | Built it with AI, doesn't understand it | Confidence to change and maintain their own app |
| New team member | Onboarding takes weeks | A replay instead of a reading marathon |
| Students / learners | Never see how real apps come together | "Watch real apps get built, step by step" |
| Open-source maintainers | Contributors don't understand the project | A "▶ Watch how this was built" badge in the README |

## How it works (user's view)

1. **Give it a repo** — paste a GitHub link (web) or run one command inside the project folder (CLI).
2. **It reconstructs the build** — reads the code and its history, then prepares the replay.
3. **Press Next** — walk through the build one step at a time.
4. **Choose your depth**
   - **Level 1 · Story** — what happened and why, in plain words.
   - **Level 2 · Code** — the exact code added or changed in that step, plus a small map of what it connects to.
5. **Explore the System** — the finished architecture; tap any box ("Booking") or line ("Booking → Database") to learn what it is, why it exists, which files make it real, and when it was created.
6. **Files view** — every file with its purpose, the step that created it, and every step that changed it.

Everything links to everything: **History → System → File → Connection → Code → back to History.**

## Each step answers four questions

| Question | Example |
|---------|---------|
| **What happened?** | `booking.js` was created with a `createBooking()` function. |
| **Why?** | Allowing customers to book rooms is the purpose of the app. |
| **When?** | Step 5 of 8 (with the commit date if known). |
| **What did it affect?** | Created `booking.js`; changed `index.html`; new connection Login → Booking. |

A step is not always a file. It can be: creating a file, running a command, installing a package, adding a function, connecting two parts, fixing a bug, or restructuring.

## Real history + reconstruction

A GitHub repo usually carries its full history (commits, dates, messages, diffs). Build Replay uses **both** real history and AI reconstruction:

| Repo type | What Build Replay does |
|----------|-----------------------|
| **Good history** (many clear commits) | Follows the real order; AI only improves the explanations. |
| **Messy history** (hundreds of "fix", "wip") | Keeps the real order, groups tiny commits into meaningful steps, writes the missing "why". |
| **No useful history** (one big "initial commit" — common with vibecoded uploads) | Fully reconstructs a sensible build order from the code's dependencies. |

Every step carries an honest label: **"From history"** or **"Reconstructed"**, so users know how much to trust it. Mistakes and undo-commits can be folded away to show a clean story, with the raw history still available.

## Optional layer: risks

While replaying, Build Replay can flag things worth attention — *"passwords compared safely ✓"*, *"bookings are only kept in memory — lost on restart"*, *"nothing stops double-booking the same room"*. This is an **extra**, not the core.

## How it would be built (real version)

| Part | Approach |
|------|---------|
| Input | GitHub URL (server clones it) or local CLI (`npx buildreplay`) |
| History | Read git log, commits, diffs |
| Structure | Parse files, build a dependency graph (which file uses which) |
| Ordering | Real commit order where useful; otherwise dependency order (things that depend on nothing first) |
| Grouping & "why" | A large language model groups changes into meaningful steps and writes plain-language explanations |
| Output | A replay file (JSON) + a self-contained HTML viewer that can be shared or hosted |
| Cost control | Users bring their own AI key or local AI coding tool; the project stays free |

## Doability

**Doable — yes.** All parts use proven technology: git history parsing, dependency analysis, and language models for explanation.

Hardest parts:
- **Very large repos** — start with small/medium projects (JavaScript, TypeScript, Python), expand later.
- **Quality of the "why"** — must be grounded in the code; label guesses honestly.

## Competition & difference

| Tool | What it does | Gap Build Replay fills |
|------|-------------|------------------------|
| DeepWiki (Cognition/Devin) | Auto docs + diagrams + Q&A for a repo | Explains the finished system all at once — no build-up story |
| CodeTour (Microsoft) | Hand-recorded guided tours in VS Code | Tours must be written by hand |
| CodeSee (shut down 2024) | Code maps and tours | Gone; also showed that devs rarely pay → we go free/open-source |
| "Codebase time machine" hackathon projects | AI narratives over git history | Text narratives, no guided replay with a growing diagram and depth levels |
| Chatbots ("explain this repo") | Answers questions | Reactive — users don't know what to ask |

**Our difference:** a guided, press-Next replay; a diagram that grows; Story/Code depth; everything cross-linked; honest "from history / reconstructed" labels.

## Goal & growth plan

The goal is **adoption and GitHub stars**, not revenue.

1. Free and open-source; users bring their own AI.
2. One command to run; output is one shareable HTML page.
3. A gallery of replays of famous open-source projects ("Watch how Express was built").
4. A README badge: **▶ Watch how this was built** — every badge brings new users.
5. A short GIF at the top of the README.
6. Launch on Hacker News (Show HN), Reddit AI-coding communities, X.

## Roadmap

| Phase | Deliverable |
|------|-------------|
| 0 | Clickable prototype with mock data *(this app)* |
| 1 | CLI for small JS/TS repos → HTML replay |
| 2 | Real-history + reconstruction merge, "from history / reconstructed" labels |
| 3 | Web version (paste GitHub link), public gallery |
| 4 | Python support, risks layer, README badge |

## Risks

| Risk | Mitigation |
|-----|-----------|
| AI invents wrong reasons | Ground explanations in code/diffs; label reconstructed steps; let users see evidence |
| Big players add a similar feature | Move fast, own the "replay" experience, open-source community |
| Large repos are slow/expensive | Limit scope, cache results, let users choose folders |

## About the prototype

The prototype replays a tiny made-up **booking website** (6 files, 8 steps). It shows the start screen, the reconstruction progress, the step-by-step walkthrough, Story/Code levels, the growing diagram, the System view and the Files view. All data is mock data.

---

# PART B — PROTOTYPE SPEC (builder only — do not render)

## Reference
Port the behaviour and data from `docs/reference/build-replay-prototype.html`. Rebuild it as clean React components using the app's design tokens. Do **not** copy its CSS look.

## Screens & flow

### B1. Start screen (initial state of the prototype)
- Title: "Understand this system"
- Input prefilled: `https://github.com/example/booking-app` (editable, but any value works)
- Button **"Reconstruct"** → staged progress (skippable):
  1. "Downloading repository…"
  2. "Reading 6 files and 8 commits…"
  3. "Mapping how files connect…"
  4. "Grouping changes into steps…"
  5. "Writing explanations…"
- Then the project summary card: **booking-app** — "A small website where customers log in and book a room." · 6 files · 8 steps · history quality: *Partial (some steps reconstructed)*
- Buttons: **Start walkthrough** (primary) · Explore: Files / System
- A small link "Skip intro" goes straight to walkthrough (for returning users).

### B2. Walkthrough
- **Timeline** of 8 steps (chips: "1 · File", "3 · Command"…), current highlighted, past steps marked done. Back / Next buttons; ← → keyboard.
- **Step card:** type chip, "Step n of 8", **source badge** ("From history" or "Reconstructed"), when, title, *What happened?*, *Why?* (highlighted block), *This step created* / *This step changed* (file chips → open Files view at that file), *New connections* (click → select edge in diagram).
- Command steps show a terminal block (`$ npm install bcryptjs` / `added 1 package in 2s`).
- Optional **"Watch out"** block (risk) on steps that have one (see data).
- **Level 1 · Story / Level 2 · Code** global toggle. Level 2 shows diffs (green added / red removed lines with +/−) and the "How it connects" function map where present. In Level 1 show a dashed button "Show the code for this step" that switches to Level 2.
- **Diagram panel** ("System so far"): SVG; nodes/edges appear cumulatively; new ones highlighted with the accent + "NEW" tag; click node/edge → inspector below the diagram.
- Last step: Next becomes "See the System →".

### B3. System view
- Full diagram, all nodes/edges clickable; inspector panel (desktop: right side; mobile: below).
- Node inspector: name, what it is, why, files (chips → Files view), uses, used by (chips → select node), "Appeared: Step n · title" (→ jumps to walkthrough step).
- Edge inspector: "A → B", why connected, created in step n (jump), in Code level show the code snippet + file; buttons "Show the exact code" (switch level) / "Open <file>".
- Default selection: Booking.

### B4. Files view
- List (desktop: left column; mobile: horizontal scroll chips or a select) with file name, part, "from Step n".
- Detail: name, purpose, part (chip), created in step (jump), changed in steps (jumps); Code level shows full final code with line numbers; Story level shows a "Show code" button.

### B5. Global controls
- Top of prototype: segmented **Walkthrough | System | Files** and **Story | Code**.
- Reset demo → back to start screen.

## Mock data
Use the `NODES`, `EDGES`, `STEPS` and `FILES` objects from the reference HTML **exactly** (same text and code), with these additions:

Source labels per step:
| Step | Source |
|------|--------|
| 1 Application started | From history |
| 2 Appearance | From history |
| 3 bcryptjs installed | Reconstructed |
| 4 Login | From history |
| 5 Booking | From history |
| 6 Database | Reconstructed |
| 7 Bookings saved | Reconstructed |
| 8 Past dates blocked | From history |

Risks ("Watch out") per step:
| Step | Risk text |
|------|-----------|
| 4 | No limit on login attempts — someone could keep guessing passwords. |
| 5 | Nothing stops two customers booking the same room on the same date. |
| 6 | Data is kept only in memory — every customer and booking disappears when the app restarts. |

## Diagram layout
Same coordinates as the reference (viewBox 560×400). Must scale to container width. Package node (`bcryptjs`) dashed. Edges are lines with arrowheads clipped to box edges; wide invisible hit area for tapping on mobile. Nodes and edges keyboard-focusable (Enter/Space selects).

## Acceptance checklist (use in your report)
- [ ] Start screen with simulated reconstruction (skippable, reduced-motion instant)
- [ ] 8-step walkthrough with timeline, Back/Next, keyboard arrows
- [ ] Source badge on every step; risks on steps 4–6
- [ ] Story/Code levels; diffs and function maps in Code level
- [ ] Growing diagram with NEW highlights; node/edge inspector
- [ ] System view with cross-links back to steps and files
- [ ] Files view with created/changed links and full code
- [ ] Works at 360px and 1440px; no page-level horizontal scroll
- [ ] Reset demo, How to use hint, mock-data badge
- [ ] lint + build pass
