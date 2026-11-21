# Report T1 — Foundation

## Status
DONE — all nine items built; lint and build pass; layouts checked at 360/768/1440px in light and dark. Two small caveats are under "Known issues".

## What I built
- **Design tokens** in `app/globals.css`: light values from the source app, derived dark values, plus `--success`, `--warning`, `--highlight` and the five per-project accents. Dark mode follows the system and can be overridden with `data-theme` on `<html>`. The tokens are exposed to Tailwind through `@theme inline`.
- **Theme toggle** (sun/moon button) that sets `data-theme` and stores it in `localStorage` (try/catch). A tiny inline script in `<head>` applies the saved theme before first paint, so there is no flash.
- **Fonts** via `next/font/google`: Figtree for the UI and JetBrains Mono for code.
- **Shared components:** AppShell (sticky top bar, mobile menu, footer, skip link), ProjectCard, ProjectSubNav, DocViewer (with the TOC components), PrototypeFrame, and the UI primitives Button/ButtonLink, Card, Chip, Tabs, SegmentedControl, Sheet (bottom sheet on mobile, centred dialog from 768px), Progress, Toast and EmptyState.
- **`lib/projects.js`:** metadata for the 5 projects (name, slug, tagline, promise, accent, tags, order, type, status, icon) plus helpers for lookup, prev/next and accent styles.
- **`content/projects/*.md`:** PART A of each spec file, copied programmatically. The `*(Copy everything in PART A…)*` line and the trailing `---` are removed; links are kept.
- **Routes:** `/`, `/about`, `/projects/[slug]`, `/projects/[slug]/docs`, `/projects/[slug]/prototype`, and a not-found page. The prototype pages show a PrototypeFrame containing the "Prototype coming in the next task" EmptyState.
- **DocViewer:** react-markdown + remark-gfm + rehype-slug, typography styled with tokens, TOC from `##` and `###`, left project sidebar and right sticky "On this page" with active-section highlight on desktop, collapsible "On this page" on mobile and tablet, and prev/next project links. Wide tables scroll inside their own box.
- **Home** (intro line, 5 cards, mock-data note) and **project landing** (name, promise, summary taken from the first paragraph after `## Summary`, key-fact chips, "Read the proposal" / "Try the prototype" buttons).
- `generateStaticParams` on the `[slug]` layout and on all three project pages, so all five slugs are prerendered.

## Files created / changed
- app/globals.css — tokens, Tailwind theme, motion, `.prose-doc` typography
- app/layout.js — fonts, viewport, theme script, AppShell
- app/page.js — home
- app/about/page.js — About
- app/not-found.js — 404 page
- app/projects/[slug]/layout.js — slug check, sub-nav, `generateStaticParams`
- app/projects/[slug]/page.js — project landing
- app/projects/[slug]/docs/page.js — documentation
- app/projects/[slug]/prototype/page.js — prototype placeholder
- components/app-shell.js, site-header.js, theme-toggle.js — shell, header with mobile menu, theme toggle
- components/project-card.js, project-icon.js, project-sub-nav.js — cards, icons, tabs
- components/doc-viewer.js, doc-toc.js — documentation viewer and TOC
- components/prototype-frame.js — prototype wrapper (badge, Reset demo, How to use)
- components/ui/button.js, card.js, chip.js, tabs.js, segmented-control.js, sheet.js, progress.js, toast.js, empty-state.js — UI primitives
- lib/projects.js, lib/content.js — metadata; markdown loading, summary and heading helpers
- content/projects/build-replay.md, poster-unlocker.md, daftari.md, xerote.md, hardware-lab.md — proposal text
- package.json, package-lock.json — added `react-markdown`, `remark-gfm`, `rehype-slug`, `lucide-react`
- public/*.svg — removed the five unused create-next-app starter images
- docs/ — specs moved here from `project-proposals-specs/docs/` (see Deviations)

## Matches the spec?
- Item 1 Tokens, light and dark, toggle, localStorage try/catch, Tailwind exposure, next/font: ✅
- Item 2 Components (AppShell, ProjectCard, ProjectSubNav, DocViewer, PrototypeFrame, UI primitives, lucide icons): ✅. Only Tabs, Toast, SegmentedControl, Sheet, Progress and Card are not used by any page yet; they are built and lint/build clean but not exercised until T2+.
- Item 3 `lib/projects`: ✅
- Item 4 Content files: ✅ the "Copy everything…" line is removed, links kept
- Item 5 Routes (home, about, landing, docs, prototype, 404): ✅ with the prototype placeholder. Caveat on 404 status in Known issues.
- Item 6 DocViewer features: ✅ checked in the browser:
  - **Heading ids:** all TOC links resolve to heading ids for all 5 documents.
  - **External links:** open in a new tab with `rel="noopener noreferrer"`.
  - **Mobile TOC:** the link jumps to the section and closes the dropdown.
- Item 7 Home: ✅
- Item 8 Landing: ✅
- Item 9 Static params for the 5 slugs: ✅ all 5 prerendered for each of the three pages
- Responsive 360/768/1440, light/dark: ✅ for the 7 routes checked
- `npm run lint`, `npm run build`: ✅

## Deviations from spec
- **Specs folder:** the prompt said the specs had been moved to `docs/`, but they were still in `project-proposals-specs/docs/`. I moved them with `git mv` (history kept) so all paths in the prompt work.
- **Docs link in project sidebar:** the desktop sidebar lists the five proposals, as the spec asked for a "project sidebar". This is not a per-section nav.
- **Starter images:** I deleted the five unused create-next-app SVGs in `public/` because nothing references them now.
- **`themeColor` metadata** in `app/layout.js` has two hard-coded hex values (`#f0f0ea`, `#121513`). That API cannot read CSS variables. They are the only hex values outside `globals.css`.

## Decisions needing approval
- Should an unknown project slug return a real HTTP 404? See Known issues. The fix would be a small `proxy.js` that checks the slug.
- The header title is the text "Project Proposals". Do you want a different name or a logo?
- Should I commit T1 now? Nothing is committed yet. The earlier "T0" commit is yours, and I have only staged the folder move.

## How I verified
- `npm run lint`: passes with no output.
- `npm run build`: passes (Next 16.4.6, Turbopack); 23 static pages generated.
- Routes checked in headless Chrome, light and dark, at 360px, 768px and 1440px: `/`, `/about`, `/projects/build-replay`, `/projects/build-replay/docs`, `/projects/xerote/docs`, `/projects/daftari/prototype`, `/projects/nope`. No horizontal page scroll on any of them (scroll width equals client width). I looked at screenshots of home, landing, docs and prototype in light and dark and they looked right.
- Behaviour checked by script:
  - **Theme toggle:** it sets `data-theme`, saves to `localStorage`, and survives a reload.
  - **Mobile menu:** it opens, and closes on navigation.
  - **TOC:** the mobile dropdown works, and the desktop TOC highlights the current section.
  - **Tables:** 7 of them render inside scroll boxes.
- Not checked: real touch devices, Safari/Firefox, a screen reader.

## Known issues
- **Unknown project slug returns HTTP 200, not 404.** `/projects/nope` shows the styled "We could not find that page" screen with `noindex`, but the status code is 200. Truly unmatched URLs (e.g. `/zzz`) return 404. The Next docs say that with Cache Components the status stays 200 once the response has started streaming, and `dynamicParams = false` is not available. Users see the correct page.
- **Active TOC section near the page end:** headings in the last screenful cannot scroll to the top, so I added a rule that highlights the last heading when the page is scrolled to the bottom. I verified the highlight with a script and saw a screenshot of the TOC, but did not re-run the browser check after adding that last rule (lint and build were re-run).
- `console` was not inspected for warnings.

## Suggestions (not built)
- A real 404 status for unknown slugs through `proxy.js`.
- A "copy link" icon next to headings in the docs.
- A `/brand`-style style guide page for QA in T7.
