# Report T4 — Xerote prototype

## Status
DONE — every item of the PART B acceptance checklist is built and was exercised in a real browser; the PrototypeFrame "How to use" change is done and checked; lint and build pass. Nothing is committed (the owner commits).

## What I built
- **PrototypeFrame change (T3 decision 2):** "How to use this demo" now starts **collapsed below 768px and open from 768px up**. Until the visitor taps it, CSS decides the state, so there is no flash on first paint. After that their tap wins. Checked on all three prototypes (see "How I verified").
- **Xerote at `/projects/xerote/prototype`** inside `PrototypeFrame`, for a made-up **School Results App**. A step switcher **Interview · Plan · Build · Dashboard** (a vertical list on desktop, a 4-column grid on phones). It opens on Interview with most answers filled in. Plan, Build and Dashboard stay locked until the plan is locked.
- **Interview:**
  - A chat of 12 answered questions (Xerote bubbles on the left, your answers on the right).
  - A progress panel with the seven categories (Purpose ✓ Users ✓ Features ✓ Data ✓ Screens ● Rules ● Tools ✓).
  - A **Gap detector** that starts at "2 gaps · 1 contradiction" and updates live.
  - Two open questions with quick replies. The grading question also takes your own text ("Custom").
  - A **contradiction** to resolve. You said report cards are only printed at school, and also that parents can download them.
  - **Lock the plan** is disabled until everything is resolved. Then it runs staged progress and opens the Plan.
- **Plan:**
  - A **Locked** badge and "Version 1 · approved by you".
  - Spec cards: Purpose, Users & roles (permissions table), Features (each with "done when…"), Data, Screens, Rules and Constraints.
  - The **Rules card shows your own answers** from the interview. The T7 and T9 tasks change with them (for example, T9 becomes "Report card print layout" if you chose print-only).
  - **12 tasks** (T1–T12): T1–T3 Done, T4 Current, the rest Pending. Each expands to show its goal, files area and 3–5 "done when…" checks.
- **Build (the star):**
  - A **loop strip** (Xerote gives the prompt → Coding AI builds → Report comes back → Xerote verifies) that highlights the current stage.
  - **Level 1 · Copy-paste:** a full realistic prompt for the current task (project context, your decisions, goal, files, numbered checks, scope rules and the required report format) with **Copy prompt** and a toast. Then a report box with **Use sample good report** and **Use sample report with a problem**, and **Verify**.
  - Verification runs staged ("Reading report…", "Checking acceptance checks…", "Comparing with real code changes (GitHub)…", "Checking scope…").
  - The **good report** passes: all 5 checks ✅, "Code changes match the report ✓", "No out-of-scope changes ✓", and a table of changed files with +/− counts. **Next task (T5)** moves the plan on.
  - The **problem report** fails: ❌ check 3 ("Marks above 100 are accepted"), ⚠️ the report lists 5 files but 6 really changed, ⚠️ out-of-scope "Delete student" button, plus a **Fix prompt** (copyable) and a **Change request**.
- **Change request:** Approve (add to plan as T13) turns the plan into **Version 2** and adds task T13. Reject leaves the plan as it is and the fix prompt removes the button. The fix prompt changes to match your decision. While the request is open, **Next task is blocked**.
- **Automation levels:** Level 1 as above. **Level 2 · Connected (MCP)** replaces the prompt card with "Claude Code is connected ●", lists the MCP tools and has Continue. A simulated MCP log (`→ get_next_task()`, `← T4 · Marks entry screen`, `→ submit_report(T4)`, `← report received`) runs, then the same verification appears (and "Continue (the agent drifts)" shows the failing path). **Level 3 · Autopilot** shows "Autopilot (coming later)" and an approval-only view (the open change request can be approved or rejected there).
- **Dashboard:** a progress ring (done/total), current task, open change request count, warnings, a recent-activity timeline (new events appear as you work) and a system diagram (Web app, Auth, Marks, Grades, Report cards, Database) where finished parts are filled and in-progress parts are outlined, with text labels as well.
- **All tasks:** the prompt is generated from the same template for every task, so the loop works from T4 to T12 (and T13 if added), and ends on "All tasks are done".
- **Mock content** is in `features/xerote/data/` and reads like the real thing: the T4 prompt, both T4 reports (headings Status / What I built / Files changed / Acceptance checks / Deviations / Suggestions / Questions), verification results, the fix prompt, the change request and the MCP log.

## Files created / changed
- components/prototype-frame.js — "How to use" collapsed below 768px
- lib/copy-text.js — shared clipboard helper (try/catch + toast), new
- app/projects/[slug]/prototype/page.js — renders Xerote for `xerote`
- features/xerote/index.js, xerote.js — the prototype and its state
- features/xerote/data/interview.js, project.js, tasks.js, build.js — all mock content
- features/xerote/components/interview-view.js, plan-view.js, build-view.js, result-card.js, cr-card.js, dashboard-view.js — the four steps
- docs/reports/T4-report.md — this report

## Matches the spec? (PART B acceptance checklist)
- [x] Interview with categories, pre-filled Q&A, quick replies, gap/contradiction detector, lock plan — ✅ 12 answers, 2 open questions, 1 contradiction; counters update live; Lock is disabled until done
- [x] Plan: spec cards, locked badge, 12 tasks with acceptance checks and statuses — ✅ T1–T3 done, T4 current; every task has 4–5 checks
- [x] Build loop: copy prompt, paste/sample reports, staged verification, pass and fail outcomes, fix prompt — ✅
- [x] Change request approve/reject updates plan version and tasks — ✅ approve: Version 2 and T13 added; reject: no new task, the fix prompt changes
- [x] Dashboard with progress, activity, diagram — ✅
- [x] Level 1/2/3 switcher with simulated MCP log — ✅
- [x] Mobile and desktop layouts; Reset, How to use, mock-data badge — ✅
- [x] lint + build pass — ✅

## Deviations from spec
- **Plan, Build and Dashboard are locked until you lock the plan** (shown with a lock icon). The spec opens on Interview, and the plan depends on your answers, so this keeps them consistent.
- **Lock icon, not 🔒:** the spec's "Locked 🔒" badge uses a lucide `Lock` icon (the rule is no emoji as icons).
- **Next task is blocked while a change request is open.** The spec does not say this; it makes the "scope lock" real.
- **The fix prompt depends on the decision** (open, approved or rejected), which the spec did not ask for.
- **Sample reports and the drift button exist for T4 only.** For other tasks "Use sample good report" creates a good report from the task's own checks, and the problem sample is disabled.
- **Reuse (T3 decision 3):** I reused the shared **StagedProgress** (lock, verification and Level 2 log), **ChipButton**, the **Card/Chip/Button/SegmentedControl/EmptyState** primitives and the reduced-motion behaviour (through StagedProgress, which uses the hook). I did **not** use `Switch`: Xerote has no on/off setting, and adding one would only be to use it. I also added a small shared `lib/copy-text.js` (Daftari still has its own inline copy code).
- **Diagram on very narrow phones:** the dashboard diagram keeps a minimum width of 22rem and scrolls inside its own box at 360px, with a "Swipe sideways" hint (same approach you accepted for Build Replay).

## Decisions needing approval
- None blocking. Should Daftari's inline copy code move to the new `lib/copy-text.js` for consistency? (A tiny cleanup, not required.)

## How I verified
- **"How to use" behaviour (T3 decision 2), headless Chrome, tested on Build Replay, Daftari and Xerote at 360px, 768px and 1440px.** At 360px it starts collapsed (`aria-expanded=false`, list hidden). At 768px and 1440px it starts open. One tap flips it and a second tap flips it back, at every width and on all three prototypes.
- `npm run lint`: passes with no output.
- `npm run build`: passes (23 static pages).
- **End-to-end in headless Chrome (scripted):**
  - **Interview:** the counters, categories, "Custom" focusing its text box, resolving, answering and locking, plus staged lock progress.
  - **Plan:** badges, rules from my answers, the 12 tasks, an expanded task.
  - **Build, Level 1:** prompt text (context, decisions, checks, rules, report format), copy (toast), loop stage changes, Verify disabled without text, and both sample reports.
  - **Verification:** the problem result (the failed check, the 5 vs 6 files, the out-of-scope warning, the fix prompt with the "owner has not decided" note), approve (CR card, fix prompt item 2 changes, toast, plan "Version 2" and 13 tasks with T13 "Added in v2"), the good result and Next task (CR cleared).
  - **Reject path:** the fix prompt then says "Remove the button"; the good report still passes and Next task is enabled.
  - **Levels and dashboard:** Level 2 (panel, running log lines, level switch locked while running, result, MCP log, the drift button only for T4), Level 3 (explainer and approval-only view; Reject worked from there), Dashboard (4/13 ring, current task, warnings, activity, diagram).
  - **Whole project:** running all tasks to the end ("All tasks are done", ring 13 of 13, 26 activity entries).
- **Copy:** the prompt copy calls `clipboard.writeText` and shows the toast "Prompt copied" (I intercepted the call to confirm it ran).
- **Reduced motion:** with `prefers-reduced-motion` the lock step and the verification finish in about 50ms.
- **Widths and themes:** 360px and 1440px, light and dark, across about 17 states each (interview, resolved, locking, plan, task open, Build Level 1, with report, verifying, problem result with change request, Level 2, Level 3, good result, next task, dashboard, plan v2): no page-level horizontal scroll and no element sticking out past the screen. I looked at screenshots at 360px and 1440px.
- **Not checked:** 768px for Xerote beyond the "How to use" test, Safari/Firefox, real touch devices, screen readers.

## Known issues
- **Fixed during this task:** at 360px the long "Approve… / Reject…" buttons in the change request card ran past the screen. They now wrap. The step switcher also showed a scrollbar on phones; it is now a 4-column grid with no scrolling.
- The dashboard diagram at 360px scrolls sideways inside its box (the "Swipe sideways" hint shows).
- Other typed report text is checked like the good sample (stated on screen).

## Suggestions (not built)
- Use Xerote's task data to generate a Build Replay-style replay at the end ("Level 3 / Build Replay export" in the roadmap).
- Move Daftari's inline copy code to `lib/copy-text.js`.
