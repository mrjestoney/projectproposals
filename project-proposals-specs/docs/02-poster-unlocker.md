# 02 — Poster Unlocker

> Slug: `poster-unlocker` · Status: Concept + prototype · Type: Web app (AI-assisted design tool)

---

# PART A — PROPOSAL
*(Copy everything in PART A into `content/projects/poster-unlocker.md`.)*

## Summary

**Poster Unlocker turns a finished, flat poster back into an editable design.**
Upload a photo, PNG or PDF of any poster. The AI separates it into layers — real editable text, images, logos, shapes and a clean background — and opens it in a simple editor. Change the date, swap the photo, translate the text, resize for another format, and export.

> **Promise:** *"Any poster. Editable in seconds."*

## The problem

Every day, people need to change a poster they don't have the source file for:
- A church, school or NGO reuses last year's event poster — but only has the JPG from WhatsApp.
- A small business wants the same flyer with new prices.
- A designer left; the original Canva/Photoshop file is lost.
- A poster needs to be translated (English ↔ Swahili) or resized for Instagram, A4 and a banner.

Today the options are bad:
1. Redesign from scratch (slow, costs money).
2. Paint over text in a photo editor (looks messy, fonts don't match).
3. Ask an AI image generator to "change the date" (it often changes other things, garbles text, and the result still isn't editable).

AI image generators can *create* posters, but what people often need is to **edit the poster they already have** — precisely, without losing anything.

## The idea

Instead of generating a new picture, **take the existing poster apart** into its real pieces and rebuild it as an editable design:

| Detected from the flat image | Becomes |
|-----------------------------|---------|
| Headings, body text, dates, phone numbers | **Real text boxes** with matched font, size, weight, colour, alignment |
| Photos, illustrations | **Separate image layers** you can move, resize or replace |
| Logos | **Logo layers** (kept sharp) |
| Shapes, bands, buttons | **Shape layers** with editable colour |
| Background | **Rebuilt background** — the AI fills in what was hidden behind the text and images |
| Colours & layout | A **palette** and a **layout grid** for consistent edits |

## Who it is for

| User | Use case |
|------|----------|
| Schools, churches, NGOs, community groups | Reuse event posters every term/year |
| Small businesses | Update prices, dates, offers |
| Social media managers | Resize one poster into many formats |
| Designers | Recover lost source files; speed up client edits |
| Anyone with a WhatsApp poster | "Just change the date" |

## How it works (user's view)

1. **Upload** a poster (photo, PNG, JPG or PDF) — or take a photo of a printed one.
2. **Unlock** — the AI analyses it (a few seconds) and shows what it found: *7 text blocks, 2 images, 1 logo, 3 shapes, background rebuilt*.
3. **Check** — anything the AI was unsure about is marked (e.g. a font it couldn't match exactly, or a word it couldn't read). Tap to confirm or fix.
4. **Edit** — click any text to type, drag images, swap a photo, change colours, apply the palette.
5. **Smart actions** (AI-assisted):
   - *"Change the event to 14 March 2027"* — updates every place the date appears
   - *"Translate to Swahili"* — translates all text, keeps layout
   - *"Make an Instagram square version"* — re-flows the layers
6. **Export** — PNG, PDF, or an editable project file.

## Key features

- **Layer separation** — text, images, logos, shapes, background.
- **Font matching** — closest available font; user can pick another.
- **Uncertainty markers** — the tool tells you what it isn't sure about instead of silently guessing.
- **Before/after slider** — compare original and unlocked version.
- **Smart replace** — one instruction updates all matching text (dates, names, prices).
- **Resize to formats** — A4, A3, Instagram post/story, WhatsApp status, banner.
- **Brand kit** — save colours, fonts and logos for next time.

## How it would be built (real version)

| Step | Technology approach |
|------|---------------------|
| Read text + positions | OCR / vision-language model returning text blocks with bounding boxes, size, colour |
| Separate objects | Image segmentation model to cut out photos, logos, people |
| Rebuild background | Inpainting model fills the areas behind removed text/objects |
| Fonts | Font-recognition model → nearest open font (e.g. Google Fonts) |
| Structure | Vision-language model labels roles (title, date, venue, call-to-action) |
| Editor | Browser canvas editor (e.g. Fabric.js / Konva) |
| Export | Canvas → PNG/PDF; project JSON for re-editing |

## Doability

**Doable — yes, at roughly 80% quality today.** Every step above exists as working technology.

Hardest parts:
- **Exact font matching** — sometimes "very close", not identical.
- **Complex effects** — 3D text, heavy shadows, textures, text on curves.
- **Low-quality photos** — blurry WhatsApp images need clean-up first.

## Competition & difference

Big design tools (e.g. Canva's AI features, Adobe) already offer early versions of "grab text from an image" and object cut-outs. Our difference must be sharp:
- **Whole-poster unlock in one click** (all layers at once, not one object at a time).
- **Honest uncertainty markers.**
- **Smart replace + translate** (including Swahili) that keeps the design intact.
- **Built for reuse workflows** — the yearly event poster, the weekly price flyer.
- Simple enough for non-designers; works on a phone.

## Risks

| Risk | Mitigation |
|-----|-----------|
| Big tools improve the same feature | Focus on a niche (community/school/business reuse, local languages) and speed |
| Copyright misuse (editing others' designs) | Terms of use; designed for editing your own or permitted posters |
| Quality disappoints on hard posters | Show uncertainty; allow manual fixes; set expectations |

## Roadmap

| Phase | Deliverable |
|------|-------------|
| 0 | Clickable prototype with a mock poster *(this app)* |
| 1 | Text + background unlock for simple posters; basic editor; PNG export |
| 2 | Image/logo separation, font matching, PDF export |
| 3 | Smart replace, translate, resize to formats |
| 4 | Brand kit, templates from unlocked posters |

## About the prototype

The prototype uses one made-up **school event poster** ("Science Fair 2026"). You see the flat poster, press **Unlock**, watch the simulated analysis, then edit the layers: change text, move items, change colours, try a smart replace, and switch formats. All data is mock data; no images are uploaded anywhere.

---

# PART B — PROTOTYPE SPEC (builder only — do not render)

## Concept for faking it
The "flat poster" and the "unlocked poster" are the **same layer data** rendered two ways:
- **Flat mode:** layers rendered inside a container with `pointer-events: none`, a subtle image-like filter (slight blur 0.2px + a faint noise overlay), and a "JPG · 1080×1350" label. It must look like a single picture.
- **Unlocked mode:** layers are individually selectable/editable.

Build the poster with HTML/CSS (absolutely positioned layers inside a fixed-aspect 4:5 canvas that scales to the container). No external images: use CSS gradients, simple inline SVG illustrations (e.g. a flask/atom icon from lucide or a simple SVG) and a made-up text logo.

## Mock poster: "Science Fair 2026"
Layers (id · type · content):
1. `bg` · background · gradient (deep blue → teal) — "rebuilt" badge
2. `band` · shape · diagonal band, accent colour
3. `logo` · logo · "MWANGAZA SECONDARY SCHOOL" text-logo with a small round emblem (made-up school)
4. `title` · text · "SCIENCE FAIR 2026" (large, bold)
5. `subtitle` · text · "Ideas that change our community"
6. `illustration` · image · SVG of a flask/atom (stand-in for a photo)
7. `date` · text · "Friday, 13 March 2026"
8. `time` · text · "9:00 AM – 3:00 PM"
9. `venue` · text · "School Main Hall, Dar es Salaam"
10. `cta` · shape+text · "Everyone is welcome!" pill
11. `contact` · text · "Info: +255 700 000 000"

Uncertainty flags (mock):
- `subtitle`: font matched at 86% — "Closest match: Poppins Medium"
- `contact`: one character low-confidence ("000 000") — "Check this number"

## Screens & flow

### B1. Upload/Start
- Card showing the flat poster + "Sample: Science Fair poster (JPG)". A disabled-looking upload dropzone with text "Upload your own poster — available in the full version" (it may accept a file but must show a friendly note that the prototype uses the sample).
- Button **Unlock this poster** → staged progress: "Reading text…", "Separating images and logos…", "Rebuilding the background…", "Matching fonts…" (skippable).
- Result summary chips: "8 text blocks · 1 image · 1 logo · 2 shapes · background rebuilt · 2 items to check".

### B2. Editor
Layout — desktop: left **Layers panel**, centre **canvas**, right **Properties panel**; mobile: canvas on top, a bottom sheet with tabs Layers / Edit / Smart.
- **Layers panel:** list with type icon, name, eye (hide/show), lock; selecting highlights on canvas; ⚠ icon on flagged layers.
- **Canvas:** click/tap to select (outline + handles look); **drag to move** (pointer events, works with touch); double-click/tap "Edit text" to edit text inline (contentEditable or an input in the panel).
- **Properties panel:** for text — content, font (select from 4 fonts), size slider, weight, colour swatches (palette), alignment; for shapes — colour; for image — "Replace image" (cycles between 3 built-in SVG illustrations); for flagged items — the uncertainty message + "Looks right ✓" button that clears the flag.
- **Palette:** 5 detected colours shown as swatches; clicking applies to the selected layer.
- **Before/After** toggle or slider comparing flat original vs current edit.

### B3. Smart actions (simulated AI)
Panel with 3 buttons:
1. **Change date** → input prefilled "14 March 2027" → updates the `date` layer (and the year in `title` to 2027) with a highlight flash on changed layers.
2. **Translate to Swahili** → replaces texts with:
   - title: "MAONESHO YA SAYANSI 2026" (keep year consistent with current state)
   - subtitle: "Mawazo yanayobadilisha jamii yetu"
   - date: "Ijumaa, 13 Machi 2026" (or the changed date in Swahili form if changed: "Jumamosi, 14 Machi 2027")
   - time: "Saa 3:00 asubuhi – 9:00 alasiri"
   - venue: "Ukumbi Mkuu wa Shule, Dar es Salaam"
   - cta: "Wote mnakaribishwa!"
   - contact: "Maelezo: +255 700 000 000"
   Toggle back to English available.
3. **Resize** → segmented: Poster 4:5 · Square 1:1 · Story 9:16. Each format has a predefined layer position map (write 3 position maps by hand). Animate positions (respect reduced motion).

### B4. Export
- Button "Export" opens a sheet: PNG / PDF / Project file — each shows "Available in the full version" note. Provide "Copy all text" (clipboard) as the one working export.

### B5. Global
- Undo/Redo for at least: text edits, moves, colour changes, smart actions (simple history stack).
- Reset demo.

## Acceptance checklist
- [ ] Flat poster looks like a single image; Unlock with staged progress
- [ ] Layers panel (select, hide, lock, flags)
- [ ] Drag to move with mouse and touch; text editing; font/size/colour; image replace
- [ ] Uncertainty flags with "Looks right" confirmation
- [ ] Smart actions: change date, translate EN↔SW, resize 3 formats
- [ ] Before/after comparison
- [ ] Undo/Redo, Reset, How to use, mock-data badge
- [ ] Desktop 3-panel and mobile canvas + bottom sheet layouts
- [ ] lint + build pass
