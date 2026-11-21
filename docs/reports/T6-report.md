# Report T6 — 3D Hardware Lab prototype

## Status
DONE — all PART B items are built and were exercised in a real browser; every part is built in code (no third-party model is shipped, see "Models"); lint and build pass. Nothing is committed (the owner commits). T5 (Poster Unlocker) was skipped at the owner's request and is still to do.

## Approved spec changes (recorded here)
1. `docs/05-3d-hardware-lab.md` PART B said "no external model files, primitives only". The owner replaced this with: a realistic, clickable desk setup (PC tower, monitor, keyboard, mouse), real models where good ones can be found, and detailed procedural parts where they cannot. The part list grew from 9 to 14 selectable parts (monitor, keyboard, mouse, case, motherboard, CPU, cooler, RAM, GPU, PSU, SSD, HDD, case fans, CMOS battery).
2. The owner asked for a drei `Environment` with a built-in preset and no downloads at runtime. drei's presets do download an image from a CDN at runtime, so I used three.js's `RoomEnvironment` (a room built in code, turned into reflections with a PMREM generator) instead. It gives the same soft reflections and downloads nothing.

## Models: what I searched, what I downloaded, what I used
I searched the web and Poly Pizza (CC0 / CC-BY, direct GLB download, no login) and Kenney's free asset pack. Sketchfab, CGTrader, itch.io and Fab either need a login, cost money or give no clear CC licence, so I did not use them.

| Candidate | Author | Licence | Source | Inspected | Verdict |
|---|---|---|---|---|---|
| Gaming Computer (glass tower with internals) | Alex Safayan | CC-BY 3.0 | https://poly.pizza/m/5cN7W4ufoII | 340 KB, 145 meshes, **2,616 triangles**, 16 plain colour materials, no textures. Mesh names are anonymous (`mesh549538436`); every part is a box of 12 triangles | **Not used.** It does have separate internal pieces, but they are plain boxes, and the names give no way to tell which box is the GPU or the RAM without guessing from sizes. It would look blocky next to detailed internals |
| Keyboard | Alex Safayan | CC-BY 3.0 | https://poly.pizza/m/fOy2zvPJAj- | 117 KB, 67 meshes, **808 triangles**, box keys | **Not used** (too low-poly) |
| Monitor | CreativeTrio | CC0 | https://poly.pizza/m/PvSjEbz11k | 14 KB, 1 mesh, **84 triangles** | **Not used** (a plain slab) |
| Computer Mouse | CreativeTrio | CC0 | https://poly.pizza/m/V2Ebx3pvo4 | 15 KB, **100 triangles**, faceted | **Not used** (faceted) |
| Computer Mouse | Zsky | CC-BY 3.0 | https://poly.pizza/m/fbmU0OF0G2 | 10 KB, **128 triangles** | **Not used** |
| Furniture Kit (computer screen, keyboard, mouse, laptop) | Kenney | CC0 | https://kenney.nl/assets/furniture-kit (I downloaded the 2017 pack from https://opengameart.org/content/furniture-kit) | OBJ/FBX only. I did not convert or count triangles | **Not used.** Kenney's kits are flat-colour, very simple shapes, and the same quality problem applies |

- **Downloaded into `models-src/`** (git-ignored, about 23 MB, mostly the Kenney pack): the five Poly Pizza GLBs and the Kenney pack, plus their page listings. `models-src/sources.json` has the ids, titles and licences. The downloads were treated as untrusted data: each in its own folder, inspected with `@gltf-transform` (the CLI `inspect` and a small script), never run.
- **Optimisation step:** not needed. No model is shipped, so `public/models/` does not exist and there is nothing to compress with meshopt or webp.
- **Credits:** because nothing from another author is used, the prototype footer says "3D models: none from other authors. Every part of this scene is built in code with three.js." The `/about` page has a "Credits" section that credits three.js (MIT) and React Three Fiber and says the same. The credit lists are wired to `CREDITS` in `features/hardware-lab/data/part-map.js`, so adding a model there makes its title, author, licence and link appear in both places automatically.

## What I built
- **Prototype at `/projects/hardware-lab/prototype`** inside `PrototypeFrame`. A top segmented control **Explore · Build · Fix · Quiz**, and scene controls **Open case · Explode · Power on · Reset view**.
- **Scene (all procedural):**
  - **Desk setup:** a desk with a mat, a 27" **monitor** (thin bezel, neck, flat metal base, a glossy screen that shows a desktop when the PC is on), a tenkeyless **keyboard** with 87 individual keycaps (instanced) and a light strip, and a smooth glossy **mouse** with buttons and a scroll wheel.
  - **Tower case:** a steel body, a front panel with a mesh intake, power button with a glowing ring, USB ports, a rear panel with I/O shield, slot covers and a fan opening, and a **tempered-glass side panel** (transparent, with reflections) on a hinge. It **opens with an animation** when you press Open case or tap the tower.
  - **Motherboard** (dark PCB with a procedural trace texture): CPU socket, 4 RAM slots with latches, 2 PCIe slots, M.2 slot, VRM heatsinks with fins, chipset heatsink, capacitors, rear I/O cover with ports, 24-pin and 8-pin connectors, SATA ports, screws.
  - **CPU:** substrate with a nickel heat spreader. **Cooler:** copper base, 4 copper heat pipes, **48 thin aluminium fins**, a top cap and a 120 mm fan.
  - **RAM:** 2 sticks with two rows of memory chips, heat spreaders with a window, gold contacts and an RGB bar.
  - **Graphics card:** shroud, **two fans with blades**, a brushed backplate with a light strip, a PCIe bracket with ports, gold contacts and a power plug.
  - **PSU:** with a fan grille (rings and spokes), a label and cable sockets. **M.2 SSD:** chips and a heatsink plate. **Hard drive:** in a bay (3.5" metal case, label, circuit board, connectors). **3 case fans** with blades and RGB rings. **CMOS battery.** **3 smooth sleeved cables** (tube geometry) to the motherboard (24-pin, 8-pin) and the graphics card.
  - **Materials and light:** PBR materials (brushed aluminium, steel, copper, gold, matte and glossy plastic, glass, PCB), reflections from a code-built room environment, a soft-shadow key light, a fill light, two small lights inside the case, and a baked contact shadow under the desk items. Glowing parts (fans, rings, LEDs, screen) light up with **Power on**.
- **14 selectable parts**, each its own component in `scene/parts/` and its own wrapper (`Part`), so any one can be replaced by a real model later. Hover highlight (desktop), tap to select (amber glow), the camera **smoothly flies** to the part from a good angle (inside parts are seen through the glass side), and an info panel with: what it is, what it does, an everyday comparison, what it connects to, and common faults and signs. A parts list gives a way to select without the 3D.
- **Explode:** parts move apart with name labels (the monitor, keyboard and mouse step aside so the labels are clear). **Assemble** brings them back.
- **Build (8 steps):** power supply, CPU, cooler, RAM, storage (SSD and HDD), graphics card, cables, then "Close case and power on". Each step shows the why, the part floats beside the PC glowing, you tap it (or press **Place part**), a progress bar counts 0/8 to 8/8, wrong taps give a friendly hint, and the finish closes the case and powers on (fans spin, screen lights).
- **Fix:** scenario 1 (full): no picture, 3 beeps; tap parts (or use the "inspect" chips) to see clues; the RAM stick is visibly **raised and tilted** with a "Not fully inserted" tag; pick one of 4 diagnoses; **Fix it** seats the stick with an animation and the PC boots. Scenarios 2 and 3 (short): overheating (a dusty cooler is shown, with dust clumps) and no power (the main power cable is missing), each with an explanation.
- **Quiz:** 6 "tap the part that…" questions; answer by tapping the part in 3D or from a list of 4; correct and wrong parts glow green and red; a score with a review.
- **Fallback:** if the browser has no WebGL, a flat labelled picture of the PC replaces the 3D (tappable), and all four modes still work.

## Files created / changed
- features/hardware-lab/index.js, hardware-lab.js, lazy-scene.js — prototype frame and credits line, page state and layout, lazy loader for the scene
- features/hardware-lab/data/parts.js, steps.js, scenarios.js, quiz.js, part-map.js — the 14 parts' info, build steps, fix scenarios, quiz, and the part-to-source map and credits list
- features/hardware-lab/scene/scene.js, context.js, part.js, camera-rig.js, materials.js — the 3D canvas and lights, the part wrapper, camera moves, shared materials
- features/hardware-lab/scene/parts/*.js — one file per part: monitor, keyboard, mouse, desk, pc-case, motherboard, cpu, cooler, ram, gpu, psu, ssd, hdd, battery, case-fans, cables, plus fan.js and helpers.js
- features/hardware-lab/components/panels.js, part-info.js, fallback.js — the four mode panels, the info card, and the no-WebGL picture
- app/projects/[slug]/prototype/page.js — renders the Hardware Lab for `hardware-lab`
- app/about/page.js — the Credits section
- features/daftari/components/create.js — uses the shared `lib/copy-text.js` (T4 decision 2)
- package.json, package-lock.json — added `three`, `@react-three/fiber`, `@react-three/drei`
- .gitignore — ignores `/models-src/`
- docs/reports/T6-report.md — this report

## Matches the spec? (PART B acceptance checklist)
- [x] Lazy-loaded client-only 3D canvas with loading state and WebGL fallback — ✅ (a text loading state, not a progress bar; see Deviations)
- [x] PC model with selectable parts; orbit controls; works with touch — ✅ 14 parts (the spec's 9 plus monitor, keyboard, mouse, HDD, battery); built in code, not from a downloaded model
- [x] Explore: info panel, part list focus, explode/assemble with labels — ✅
- [x] Build: 8 guided steps with why, wrong-part hints, power-on finish — ✅
- [x] Fix: 1 full interactive scenario + 2 short scenarios — ✅
- [x] Quiz: 6 questions, tap-in-3D or list answer, score review — ✅
- [x] Mobile (canvas + panel) and desktop (canvas + side panel) layouts; smooth on a mid-range phone — ✅ layouts; ⚠️ smoothness on a real phone was **not measured** (see How I verified)
- [x] Reset, How to use, mock-data badge — ✅
- [x] lint + build pass; other pages' bundle size not affected (3D code split) — ✅

## Deviations from spec
- **No third-party models are used** (see Models). The owner's rule allowed this: low-quality downloads are replaced by detailed procedural parts, and "mixing is fine".
- **`RoomEnvironment` instead of a drei preset** (the preset downloads an image at runtime). Recorded above.
- **Loading state is a text message, not a progress bar.** With no model files, there is nothing for `useProgress` to track, so a progress bar would not mean anything. Textures (the PCB and the desktop wallpaper) are drawn in code at start-up.
- **No `models-src/` optimisation and no `public/models/`**: nothing is shipped from there.
- **Contact shadow is drawn once** (`frames={1}`) to save work; moving parts cast shadows through the main light, not through the baked contact shadow.

## Decisions needing approval
- If you still want a real model for any part, the cheapest honest option is a better source (for example a purchased or self-made model). Each part component can then be swapped one at a time. Tell me which part and where the file is.

## How I verified
- **Daftari clipboard move (T4 decision 2):** "Copy as text" now uses `lib/copy-text.js`. In the browser: the "Copied as text" toast shows, the text written is the full exam (it ends with "Total: 50/50"), and when the clipboard is blocked the fallback toast "Copying is not available in this browser" shows.
- `npm run lint`: passes with no output.
- `npm run build`: passes (23 static pages).
- **WebGL in headless Chrome (software rendering):** the scene renders at 1440px and 360px; I looked at many screenshots (home, case open, powered, every inside part close-up, explode, build, fix, quiz).
- **Taps in 3D (real mouse events):** I tapped the monitor, keyboard, mouse, case, motherboard, SSD, graphics card and hard drive and each gave its own info; hover shows a pointer cursor.
- **Flows (scripted):** Build all 8 steps (the next button is disabled until the part is placed, then the finish closes the case and powers on); Fix scenario 1 (wrong answer, "Try again", right answer, "Fix it", PC boots, power on) and scenarios 2 and 3; Quiz 6 questions (one deliberately wrong gave 5 of 6); all via the buttons and lists.
- **Console:** zero runtime errors across Explore, open case, focus, explode, Build, Fix and Quiz at 360px and 1440px. I found and fixed one problem on the way: a hydration error (React #418) on this page, caused by detecting WebGL on the server. It is now detected in the browser only.
- **Reduced motion:** with `prefers-reduced-motion`, the case is fully open 350 ms after the click; without it, the picture is still changing at 350 ms. Camera moves jump in that mode.
- **No WebGL:** with WebGL blocked, the flat picture shows, tapping "Graphics card" opens its info, and the Quiz works.
- **Widths and themes:** 360px and 1440px, light and dark: no page-level horizontal scroll and nothing sticking out past the screen in Explore, selected part, exploded, Build, Fix (both scenarios shown) and Quiz. At 360px the Build step buttons stuck out; I let them wrap.
- **Bundle:** the 3D code (three.js, React Three Fiber, drei and the scene) is one lazy chunk, 962 KB raw and about 252 KB gzipped. It is **not** in the initial scripts of any route. The initial scripts of the other routes are unchanged (`/` 176 KB gzipped; prototype pages 238 KB gzipped, same as before for Build Replay, Daftari and Xerote).
- **Not measured:** frame rate or memory on a phone. The headless browser draws in software, so its speed says nothing about a real phone. I have only designed for it (see Performance).
- **Not checked:** Safari, Firefox, a real touch device, screen readers.

## Performance (by design, not measured)
- `frameloop="demand"`: the scene only draws when something changes (a drag, a move, an animation) and keeps drawing only while the PC is powered on (spinning fans).
- Pixel ratio capped at 2 (1.5 on phones). Key-light shadow map 1536 on desktop and 512 on phones; the contact shadow is 512 on phones and drawn once.
- Fins, keycaps, chips, capacitors and fan blades are instanced; the glass is a simple transparent material (no transmission pass).
- I could not get the triangle count or draw-call count from the browser tools; I did not guess them.

## Known issues
- **Phone explode view is crowded:** at 360px the exploded parts are small and their labels overlap a little (labels are smaller on phones, and the camera is closer). The parts list and info card still work.
- On a phone the controls take the first screen; the scene is just below them.
- Real-phone smoothness is untested (see above).
- The "glow" highlight is amber for every selection; red and green are kept for wrong and right answers.

## Suggestions (not built)
- Replace single parts with real models later (the case first), using the swap points in `scene/parts/`.
- A "tour" button that flies the camera through the parts in order.
- Add Swahili names for the parts (the proposal lists Swahili as a later phase).
