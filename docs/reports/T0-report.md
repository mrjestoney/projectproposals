# Report T0 — Recon

## Status
DONE — all specs, the source app and the project setup were read; `DESIGN-NOTES.md` written; no app code touched.

## What I built
- No app code (as required). Wrote the design notes and this report.
- Read: master spec, all five project specs, `AGENTS.md`, and the Next.js docs on `cacheComponents` and `agentFeedback`.
- Did not open `docs/reference/build-replay-prototype.html` (behaviour reference for T2 only).
- Read `~/projects/jestoneacademy` read-only: `BRAND.md`, `app/globals.css`, `app/layout.js`, `package.json`, and the button, tile, sheet, progress, top-bar and tab-bar components. Nothing there was changed or run.

## Files created / changed
- project-proposals-specs/docs/DESIGN-NOTES.md — the five sections requested
- project-proposals-specs/docs/reports/T0-report.md — this report

## Matches the spec?
- A) Inspect project setup: ✅ Next 16.4.6, JS, no `src/`, Tailwind 4.3.3 via `@tailwindcss/turbopack`, ESLint 9 flat config
- B) Extract style from jestoneacademy: ✅ palette, fonts, radius, shadows, spacing, component feel, icons, motion
- C) DESIGN-NOTES Sections 1–5: ✅
- D) No app code: ✅

## Deviations from spec
- The specs live in `project-proposals-specs/docs/`, not `docs/` at the project root (this is how the folder was committed). I wrote the notes and report there too. T1 should either read from there or we move the folder.

## Decisions needing approval
1. **No dark mode in the source.** jestoneacademy is deliberately light-only. I derived a dark palette (Section 2) per master spec §4.3. Approve, or keep light-only?
2. **Accent hues.** The source has one hue (green), so the five project accents (teal, plum, amber-brown, indigo, brick red) are new. Approve or change?
3. **New semantic tokens:** `--success`, `--warning`, `--highlight` (yellow for uncertain words) do not exist in the source. Approve?
4. **Figtree via `next/font/google`** instead of copying the source's local woff2. OK?
5. **Wider layout.** The source's 30rem column becomes the mobile layout only; desktop uses the 1200px layout in Section 3. OK?
6. **Spacing lint.** The source bans numeric spacing (`mt-4`) via a custom lint. I propose reusing its spacing names but not the lint. OK?
7. **Where specs live** (see Deviations).

## How I verified
- `npm run lint` / `npm run build`: not run (no code changed).
- Contrast ratios computed with a script for ink/soft/hint/brand/danger and all accents, light and dark (all ≥ 4.5:1 for text).
- Viewports: n/a for this task.

## Known issues
- `next.config.mjs` has `cacheComponents: true`. T1 must follow the new rules (Suspense around uncached runtime data, async `params`). I have only skimmed the docs so far and will read the routing/caching ones fully in T1.
- Brick red (`hardware-lab`) sits near `--danger`; use decoratively only.

## Suggestions (not built)
- A `/brand`-style style guide page in our app (like the source has) could help QA in T7.
