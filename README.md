# Project Proposals

A small web app that presents **five software project proposals**. For each one you can **read the proposal** and **try a clickable prototype**. Everything works on a phone and on a computer, in light and dark mode.

| Project | What it is |
|---|---|
| Build Replay | Watch how a software project was built, step by step, with the why |
| Poster Unlocker | Turn a flat poster into an editable design |
| Daftari | Capture paper, remember your work, write your documents |
| Xerote | An AI engineer that plans the work and checks your coding AI |
| 3D Hardware Lab | Learn computer hardware in 3D |

**All prototypes use mock data.** There is no backend, no database, no accounts and no real AI calls. Anything that looks like AI is a short, pre-written simulation.

## Run it

You need Node.js 20 or newer.

```bash
npm install
npm run dev        # development server at http://localhost:3000
npm run lint       # code checks
npm run build      # production build
npm run start      # run the production build
```

This project uses **Next.js 16** (App Router, plain JavaScript, no `src/` folder) with **Tailwind CSS 4**. It is a newer Next.js than many guides describe: before changing routing, caching or config, read the guide in `node_modules/next/dist/docs/` (see `AGENTS.md`). `next.config.mjs` turns on Cache Components, so anything that reads request data (such as `params`) is awaited, and every project page is generated ahead of time from the list of projects.

## What is where

```
app/                         pages (routes) and global styles
  page.js                    home: the five project cards
  about/page.js              about, credits and notes
  projects/[slug]/           one project: landing, docs/ (proposal), prototype/
  globals.css                design tokens (colours, spacing), dark mode, document typography
components/                  shared building blocks
  ui/                        buttons, cards, chips, tabs, sheet, switch, toast, progress ...
  doc-viewer.js              renders a proposal from markdown, with the table of contents
  prototype-frame.js         the frame every prototype lives in (badge, Reset demo, How to use)
  staged-progress.js         the simulated "AI is working" progress used by the prototypes
content/projects/*.md        the written proposal of each project (edit these to change the text)
lib/projects.js              the list of projects (name, tagline, accent colour, tags, order)
features/<slug>/             each prototype, self-contained: components, data/ (mock data), lib/
docs/                        the specs the app was built from, DESIGN-NOTES.md, and docs/reports/
public/                      static files
```

### Change a proposal's text

Edit the markdown file of that project in `content/projects/` (for example `content/projects/daftari.md`). Headings with `##` and `###` appear in the "On this page" list automatically. The first paragraph under `## Summary` is also shown on the project's landing page.

### Change a prototype's mock data

Each prototype keeps its example content in its own folder:

| Prototype | Mock data |
|---|---|
| Build Replay | `features/build-replay/data/index.js` (nodes, edges, steps, files) |
| Poster Unlocker | `features/poster-unlocker/data/` (layers, formats, texts, palette) |
| Daftari | `features/daftari/data/` (scanned pages, Brain, the 50-question bank) |
| Xerote | `features/xerote/data/` (interview, plan, tasks, prompts, reports) |
| 3D Hardware Lab | `features/hardware-lab/data/` (parts, build steps, fix scenarios, quiz) |

### Add or rename a project

Edit `lib/projects.js` (and add `content/projects/<slug>.md` and a prototype in `features/<slug>/`, then register it in `app/projects/[slug]/prototype/page.js`). Give it an accent colour in `app/globals.css` (`--accent-<slug>`).

## Design

Colours, spacing and radii are **design tokens** (CSS variables) in `app/globals.css`, with a light and a dark set. Components use token names (`bg-panel`, `text-ink`, `border-line`, ...), not colour values. The look follows the owner's other app (see `docs/DESIGN-NOTES.md`). A theme toggle in the top bar switches light and dark and remembers the choice; with no choice made, the system setting is used.

The only colour values outside `globals.css` are the colours of artwork and materials: the 3D scene's materials, the sample poster's palette, and the browser's theme colour in `app/layout.js`.

## Notes on the 3D Hardware Lab

The 3D scene (three.js, React Three Fiber, drei) is loaded only on its own page, in the browser (`next/dynamic`, no server rendering), so no other page pays for it. Every part is built in code: no 3D model files are used, so there are no model credits (see `features/hardware-lab/data/part-map.js` if you add any). It draws only when something changes, caps the pixel ratio, and uses small shadow maps on phones. If the browser has no WebGL, a flat tappable picture is shown instead.

## Credits and notes

- 3D drawing: [three.js](https://threejs.org) (MIT) and [React Three Fiber](https://github.com/pmndrs/react-three-fiber).
- Fonts: Figtree, JetBrains Mono, Caveat, Poppins, Montserrat, Playfair Display and Oswald, served by `next/font`.
- The Biology questions in the Daftari prototype are sample content and have not been reviewed by a teacher.
- All people, schools and names in the prototypes are made up.

## Reports

Every build task wrote a report in `docs/reports/` (T0 to T7): what was built, how it was checked, and what is still open.
