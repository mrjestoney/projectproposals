# Report T5 — Poster Unlocker prototype

## Status
DONE — every item of the PART B acceptance checklist is built and was exercised in a real browser; the two Hardware Lab phone fixes are done and checked; lint and build pass. Nothing is committed (the owner commits).

## First: the two Hardware Lab phone fixes (T6 decision 2)
- **(a) Canvas first on phones.** Below 768px the order is now **3D scene → mode and scene controls → the mode panel**. From 768px up nothing changes (controls above, scene and panel below or side by side). Checked at 360px: the scene starts at 381px of an 800px-tall screen and is 438px tall, so it is on the first screen; the controls start at 898px and the panel at 994px. At 900px wide the controls are still above the scene.
- **(b) Explode labels on phones.** Below 768px each label is a **short name** (Case, Board, CPU, Cooler, RAM, GPU, PSU, SSD, HDD, CMOS, Fans) in a smaller font, nudged by a fixed offset so they do not sit on top of each other. The selected part shows its full name. From 768px up labels are unchanged. I measured the 11 labels at 360px: **0 overlapping pairs**, and I looked at the screenshot.

## What I built
- **Poster Unlocker at `/projects/poster-unlocker/prototype`** inside `PrototypeFrame`. No external images: the poster is HTML/CSS layers, SVG drawings and a code-made grain.
- **One set of layer data, drawn two ways.** The "Science Fair 2026" poster has the 11 layers from the spec: background, diagonal band, school logo, title, subtitle, illustration, date, time, venue, call to action (pill) and contact. **Flat mode** draws it as one picture (nothing can be touched, slightly soft, with a film grain, labelled "JPG · 1080×1350"). **Unlocked mode** draws the same data with selectable, draggable layers.
- **Start screen:** the flat poster, a disabled-looking upload box ("Available in the full version"; picking a file only shows a friendly note that the sample is used), and **Unlock this poster**. It runs the 4 staged messages (skippable, instant with reduced motion), then a summary: "8 text blocks · 1 image · 1 logo · 2 shapes · background rebuilt · 2 items to check", and **Open the editor**.
- **Editor (desktop):** layers on the left, the poster in the middle, properties and smart actions on the right. **Editor (phone):** the poster on top, then tabs **Layers / Edit / Smart** below it.
- **Layers panel:** top layer first; select, an eye to hide, a lock, and a warning icon on layers that need checking.
- **Poster editing:**
  - Tap to select (outline and corner handles).
  - **Drag to move** with the mouse or a finger (pointer events), kept inside the poster.
  - **Double-click or double-tap text to type** on the poster; arrow keys nudge a selected layer.
  - Locked layers do not move or take typing.
- **Properties:**
  - Text: content, **4 fonts** (Poppins, Montserrat, Playfair Display, Oswald), a size slider, weight (Regular, Medium, Bold, Extra bold), alignment and colour.
  - Shapes, the band and the pill: colour. Background: colour.
  - **Replace image:** cycles 3 drawings (flask, atom, microscope).
  - **5-colour palette:** one click applies a colour to the selected layer.
- **Uncertainty flags:** the subtitle ("Font matched at 86%. Closest match: Poppins Medium.") and the contact line ("One character is low-confidence (“000 000”). Check this number.") show a warning in the list and on the poster, and **Looks right ✓** clears each one.
- **Smart actions (simulated, with a short spinner):**
  - **Change date:** "14 March 2027" is prefilled. It updates the date and the year in the title (both languages) and flashes the changed layers. A bad date such as "31 February 2027" shows an error.
  - **Translate:** English ↔ Swahili with the texts from the spec, keeping the changed date and year; switching back restores English.
  - **Resize:** 4:5, 1:1 and 9:16, each with its own hand-written position map; layers glide into place (instant with reduced motion).
- **Before / after:** a switch that shows the flat original on the left of a slider and your edited poster on the right.
- **Export:** a sheet. PNG, PDF and Project file say "Available in the full version"; **Copy all text** works.
- **Undo / Redo** (buttons, and Ctrl/Cmd+Z and Ctrl+Y or Ctrl+Shift+Z): moves, text edits, colour, font, weight, alignment, hide and lock, image, flags, and the smart actions are all steps. The poster is plain data, so each step is a stored copy.

## Files created / changed
- features/poster-unlocker/index.js, poster-unlocker.js — prototype frame and the state, flow and actions
- features/poster-unlocker/fonts.js — the 4 fonts
- features/poster-unlocker/data/layers.js, formats.js, texts.js, palette.js — the 11 layers and flags, the 3 position maps, English and Swahili texts with date helpers, palette and weights
- features/poster-unlocker/lib/doc.js, use-history.js — the poster document and the undo/redo history
- features/poster-unlocker/components/poster.js, illustrations.js — the poster drawing (flat and edit modes) and the SVG artwork
- features/poster-unlocker/components/start-screen.js, editor.js, layers-panel.js, edit-panel.js, smart-panel.js — screens and panels
- app/projects/[slug]/prototype/page.js — renders the prototype for `poster-unlocker`
- app/globals.css — a short "flash" animation for layers a smart action changed
- features/hardware-lab/hardware-lab.js, data/parts.js, scene/part.js — the two phone fixes
- docs/reports/T5-report.md — this report

## Matches the spec? (PART B acceptance checklist)
- [x] Flat poster looks like a single image; Unlock with staged progress — ✅ nothing on the flat poster can be touched (0 interactive layers); 4 staged messages, skippable; reduced motion finishes in ~50ms
- [x] Layers panel (select, hide, lock, flags) — ✅
- [x] Drag to move with mouse and touch; text editing; font/size/colour; image replace — ✅ mouse drag (60 px moved for a 64 px drag), touch drag (46 × −38 px), locked layer does not move, inline editing of the subtitle, font/size/weight/alignment/colour applied (checked in computed styles), replace image cycles
- [x] Uncertainty flags with "Looks right" confirmation — ✅
- [x] Smart actions: change date, translate EN↔SW, resize 3 formats — ✅
- [x] Before/after comparison — ✅
- [x] Undo/Redo, Reset, How to use, mock-data badge — ✅ (Reset, How to use and the badge come from PrototypeFrame)
- [x] Desktop 3-panel and mobile canvas + bottom sheet layouts — ✅ 3 panels on desktop; ⚠️ on phones the tabs are a panel under the canvas, not a sheet that slides over it (see Deviations)
- [x] lint + build pass — ✅

## Deviations from spec
- **Weekday for 14 March 2027:** the spec's Swahili example says "Jumamosi, 14 Machi 2027", but 14 March 2027 is a **Sunday**. The tool works out the real weekday, so it shows **"Sunday, 14 March 2027"** and **"Jumapili, 14 Machi 2027"**. (13 March 2026 is a Friday, so the starting texts match the spec.)
- **Phone panel:** the Layers / Edit / Smart tabs sit **below the canvas** instead of in a bottom sheet over it, so the poster stays visible while you edit.
- **Smart actions use a spinner,** not the full staged-progress card, so the poster stays in view.
- **"8 text blocks · 2 items to check"** in the summary are the fixed numbers from the spec (the poster has 7 text layers plus the logo text).
- **Before/after** shows the original content laid out in the *current* format, so it also works after a resize.
- **Lock** stops moving and typing in a layer; colour and other properties can still be changed.
- **Quick double-tap:** a tap followed by another tap within about 0.35 s on text always starts typing (that is the double-tap), so it will not start a drag.
- **Short format labels** (4:5, 1:1, 9:16) in the panel, with the full name and size shown below.

## Decisions needing approval
- None.

## How I verified
- `npm run lint`: passes with no output. `npm run build`: passes (23 static pages).
- **Flow in headless Chrome (scripted):** start, Unlock (4 stages), summary chips, the editor; 11 layers in the list and on the poster; selecting by tap; mouse drag, then Undo and Redo; touch drag (touch emulation); locking; hiding and showing; keyboard nudge; double-click typing and Undo of the text; the two warnings and "Looks right"; text, font, size, weight, alignment and colour; shape colour; Replace image; background note; Smart date (spinner, flash, bad-date error), Translate there and back, Resize through the three formats (aspect 0.800, 1.000, 0.562); Before / after with the slider; Export sheet and the copied text (8 lines); zero console errors.
- **Widths and themes:** 360px and 1440px, light and dark, through start, unlocking, summary, editor, a selected layer, the phone Layers and Smart tabs, the story format, compare and the export sheet: no horizontal page scroll anywhere. (The dark 360px run listed the rotated band as extending past the screen; the poster clips it, and the page width equals the screen width.) I looked at screenshots at 360px and 1440px.
- **Bug found and fixed while testing:** selecting the Background layer raised it above all the others and hid the whole poster. Selected layers now keep their place.
- **Reduced motion:** unlock-to-summary in about 52 ms.
- **Hardware Lab phone fixes:** measured positions and label overlaps as described at the top.
- **Not checked:** a real touch device (I used touch emulation), Safari and Firefox (the poster uses container-query units, which need Safari 16 or newer), screen readers, a real double-tap on a phone.

## Known issues
- Smart actions are individual Undo steps, but I did not test each one's Undo separately; the history logic is the same for all of them and the others were tested.
- Because of the tap-then-drag rule above, a very quick tap followed by a drag on a text layer begins typing.
- The warning badge sits at the top right of a text layer, which for centre-aligned text is not next to the words.

## Suggestions (not built)
- Resize handles on shapes and the illustration.
- A "brand kit" to save the palette and fonts (listed in the proposal).
