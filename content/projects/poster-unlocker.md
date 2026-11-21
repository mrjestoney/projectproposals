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
