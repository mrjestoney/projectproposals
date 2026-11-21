# Report T7 — Polish & QA

## Status
DONE — every route and 112 prototype states were checked at 360px, 768px and 1440px in light and dark; the problems found were fixed; the three owner items are done; lint and build pass. Nothing is committed (the owner commits). No new features were added.

## What I did
- **Owner items from the T5 decision:**
  1. **Poster warning badge.** The warning is now part of the text itself, placed right after the last word, so it sits next to the words whether the text is left-aligned, centred or right-aligned (I checked the centred subtitle and the contact line). Text boxes are now as wide as their text, so the selection outline hugs the words too.
  2. **About page "Credits & notes".** The heading is now "Credits & notes" and says that the Biology questions and answers in the Daftari prototype are sample content written to Form 2 level and not yet reviewed by a Biology teacher. The README says the same.
  3. **768px.** Every page, and the main states of every prototype, were checked at 768px (see the tables).
- **Responsive and layout:** swept 18 routes × 3 widths × 2 themes (108 combinations) for sideways overflow, console errors, unnamed controls and headings; then 112 states inside the prototypes (start screens, every tab and mode, results, dialogs) at 768px light and dark and at 360px and 1440px light. I also looked at screenshots at 768px (home, project landing, docs, About, the Poster editor and the 3D lab).
- **Consistency:** every prototype is inside `PrototypeFrame` with the mock-data badge, "How to use" and "Reset demo"; the shared staged-progress, chips, switch and copy helpers are used; the Daftari copy code was moved to the shared helper in T6.
- **Accessibility:** keyboard walk-through, focus rings, accessible names, headings, contrast, reduced motion (see below).
- **Performance:** measured the JavaScript each page really downloads and made prototype pages smaller (see below).
- **Metadata and favicon:** titles, descriptions and link-preview (Open Graph) tags on every route, and a new favicon.
- **README:** rewritten (what it is, how to run, folder map, how to edit proposal text and mock data, design tokens, 3D notes, credits).

## Problems found and fixed
| # | Problem | Fix |
|---|---|---|
| 1 | The docs and prototype pages had **no `<h1>`** (only landing, home and About had one) | The project name in the project header is now the page's `<h1>` on the docs and prototype pages |
| 2 | **Every prototype page downloaded the code of all five prototypes** (about 254 KB gzipped each) | Each prototype now loads only on its own page (`components/prototype-loader.js`), with a framed "Loading the prototype…" placeholder. Measured in the browser: 161–174 KB per prototype page (and 417 KB for the 3D lab, which includes the 3D code) |
| 3 | The "Skip to content" link scrolled to `#main` but kept keyboard focus where it was | `main` can now take focus, so Enter on the skip link moves focus into the page |
| 4 | The favicon was still the default Next.js icon | New `app/icon.svg` in the app's green (a small document), default `favicon.ico` removed |
| 5 | Link previews used the site-wide title on every page | Per-route titles and descriptions with matching Open Graph tags (`lib/meta.js`) |
| 6 | 14 components used raw white (`text-white`, `bg-white`) | A new token `--on-primary` (white, same in both themes) replaces them; no raw white/black classes remain |
| 7 | The Poster's selected-layer outline and warning badge sat far from centred text; the weight option "Extra bold" overflowed its panel | Badge made inline (above); label shortened to "Black" |

## Route × width × theme
OK means: no sideways page scroll, nothing sticking out of its box, no console errors, every button, link and field has a name, and one `<h1>`. Light and dark were both OK in every cell.

| Route | 360px | 768px | 1440px | Title (every route also has a description and Open Graph tags) |
|---|---|---|---|---|
| `/` | OK | OK | OK | Project Proposals |
| `/about` | OK | OK | OK | About · Project Proposals |
| `/projects/<slug>` ×5 | OK | OK | OK | `<Name>` · Project Proposals |
| `/projects/<slug>/docs` ×5 | OK | OK | OK | `<Name>` · Proposal · Project Proposals |
| `/projects/<slug>/prototype` ×5 | OK | OK | OK | `<Name>` · Prototype · Project Proposals |
| `/projects/nope` (404 page) | OK | OK | OK | Page not found · Project Proposals |

Inside the prototypes (112 states: Build Replay start, walkthrough, code level, System and Files; Daftari capture, scanning, review, Brain, question bank, Create step 3, exam and marking scheme; Xerote interview, plan, build, problem result with change request, dashboard; Poster start, summary, editor, Smart tab, story format; 3D lab home, explode, Build, Fix, Quiz): **no overflow and no console errors at 768px light and dark, and at 360px and 1440px light.**

## First-load JavaScript (what the browser really downloads, from a cold cache)
| Page | Before | After | 3D code (three.js) loaded? |
|---|---|---|---|
| `/` (home) | 143 KB | 143 KB | no |
| Docs page (Build Replay) | 149 KB | 149 KB | no |
| Build Replay prototype | ~254 KB gzipped (all five prototypes) | 161 KB | no |
| Daftari prototype | same | 174 KB | no |
| Xerote prototype | same | 168 KB | no |
| Poster Unlocker prototype | same | 166 KB | no |
| 3D Hardware Lab prototype | same | 417 KB | yes, as its own lazy chunk (962 KB raw, about 253 KB gzipped); it is never part of any other page |

The "before" figure is from the build's script list (gzipped); the "after" figures are bytes actually transferred, measured in the browser, so the two are close but not identical measurements.

## Accessibility
- **Keyboard:** from the first Tab, the order is Skip to content → app name → Projects → About → …; I pressed Tab 12 to 22 times on the home page, a docs page, the Build Replay prototype and the 3D lab: **every stop had a visible focus ring, and focus was never lost** (apart from leaving the end of the page). Escape closes sheets and dialogs.
- **Names and structure:** every button, link, switch, tab, radio and field has an accessible name; no images without alt text; `lang="en"`; one `<h1>` per page; landmarks (header, nav, main, footer); the skip link works.
- **Contrast (WCAG AA):** I measured **1,062 text elements** on the home, About, landing, docs and prototype pages in light and dark. The only two below AA are the disabled "Lock the plan" button in Xerote (disabled controls are exempt). The poster and the 3D canvas are artwork and were not measured.
- **Reduced motion:** the global rule turns animations off; the shared staged progress, scan, case-opening, camera moves and poster resize were each checked earlier and still finish instantly.
- **Not checked:** a real screen reader, real phones.

## Hard-coded colours (grep outside the token file)
Components use tokens only. The only colour values outside `app/globals.css` are artwork and material colours, not interface colours:
- `features/hardware-lab/scene/materials.js` (39): physical material colours (steel, copper, glass, PCB…) and the PCB and wallpaper textures drawn in code.
- `features/poster-unlocker/data/palette.js` (6) and `components/poster.js` (3): the sample poster's own colours, shadows and grain.
- `features/hardware-lab/scene/scene.js`, `part.js` (4) and `features/hardware-lab/index.js` (1): the 3D scene's accent glow, right/wrong glow and lights.
- `app/layout.js` (2): the browser's `themeColor` (the metadata API cannot read CSS variables).

## Files created / changed
- app/globals.css — `--on-primary` token
- app/layout.js — site-wide Open Graph metadata
- app/icon.svg (new), app/favicon.ico (removed) — favicon
- app/about/page.js — "Credits & notes", page metadata
- app/projects/[slug]/page.js, docs/page.js, prototype/page.js — page metadata; the prototype page now uses the loader
- lib/meta.js (new) — title, description and Open Graph in one helper
- components/prototype-loader.js (new) — loads one prototype per page
- components/project-sub-nav.js — the project name is the `<h1>` on docs and prototype pages
- components/app-shell.js — `main` can take focus for the skip link
- components/ui/switch.js, segmented-control.js and 9 feature components — `--on-primary` instead of raw white
- features/poster-unlocker/components/poster.js, edit-panel.js, editor.js, data/palette.js — inline warning badge, text boxes hug their text, "Black" weight label, tokens
- README.md — rewritten
- docs/reports/T7-report.md — this report

## Matches the task?
- ✅ Every route at 360 / 768 / 1440, light and dark: layout bugs fixed (none left)
- ✅ Consistency: PrototypeFrame, mock-data badge, How to use, Reset demo on all five prototypes; no hard-coded interface colours (the exceptions are listed above)
- ✅ Accessibility: keyboard, focus, names, contrast AA, reduced motion
- ✅ Performance: table above; 3D code is split
- ✅ Metadata: titles, descriptions, Open Graph, favicon
- ✅ README
- ✅ `npm run lint` and `npm run build` pass
- ✅ The three owner items

## Deviations from spec
- The prototype pages now show a short "Loading the prototype…" box (inside the normal frame) for a moment before the prototype appears, because each prototype is fetched on demand. Before, the prototype was in the first HTML.
- Favicon: a simple generated icon in the app's colours (the app has no logo of its own).

## Decisions needing approval
- None.

## How I verified
- `npm run lint`: passes with no output. `npm run build`: passes (23 static pages).
- The sweeps were run in headless Chrome against the production build, twice: once to find the problems and once after all fixes (and again after the loader change). The final runs: 108 of 108 route combinations clean, 112 of 112 prototype states clean, zero console errors.
- Poster interactions re-tested after the text-layer change: drag (title, venue, button, illustration), locked layer does not move, double-click typing, warning stays inline after an edit.
- Skip link, focus rings, contrast and download sizes measured with scripts as described.
- **Not checked:** Safari and Firefox, a real phone (including how smoothly the 3D scene runs; the headless browser draws it in software), real touch input, screen readers.

## Known issues (all accepted earlier or outside this task)
- An unknown project address such as `/projects/nope` shows the styled "not found" page but with HTTP status 200 (a documented effect of Cache Components; T1 decision).
- Build Replay's and Xerote's diagrams scroll sideways inside their own box on screens narrower than about 420px, with a "Swipe sideways" hint (T2 and T4 decisions).
- The phone explode view in the 3D lab is small; labels are short and do not overlap.
- Real-phone frame rate of the 3D scene is unmeasured.

## Suggestions (not built)
- Add a visible "Loading" skeleton that matches each prototype's first screen, to avoid the brief placeholder.
- Run Lighthouse and a screen-reader pass on a real device before sharing the link widely.
- Have a Biology teacher review the Daftari question bank, then remove the "sample content" note.
