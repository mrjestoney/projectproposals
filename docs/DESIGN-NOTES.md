# DESIGN NOTES (T0)

Source app read (read-only): `~/projects/jestoneacademy` ("Collably Academy"). Nothing there was modified, installed or run.

---

## Section 1 — What I found in jestoneacademy

**Key fact: the source app is light-only. It has no dark mode and says so on purpose** (`BRAND.md`, `app/globals.css`: `color-scheme: light`). Master spec §4.3 says to "create a careful dark palette from the same hues" in that case. Section 2 does that.

### Stack
- Next.js 16.3.8, plain JavaScript, `@/` alias, Tailwind v4 via `@tailwindcss/postcss`, `lucide-react` (but see icons below). Source: `package.json`, `jsconfig.json`, `postcss.config.mjs`.

### Palette — `app/globals.css` (`:root`), documented in `BRAND.md`
| Token | Hex | Role |
|---|---|---|
| `--panel` | `#f0f0ea` | page background (warm off-white) |
| `--field` | `#fbfbf7` | inputs, top bar, sheets, secondary buttons, cards |
| `--line` | `#d9d9cf` | thin borders |
| `--line-hover` | `#b9b9ad` | border on hover |
| `--ink` | `#1a1a1c` | text |
| `--ink-soft` | `#55555b` | secondary text |
| `--hint` | `#6b6b72` | placeholders, helper text |
| `--brand` / `--primary` | `#14684b` | forest green: headlines, links, primary button, focus ring |
| `--primary-strong` | `#0f5a40` | primary button hover |
| `--logo-deep` | `#0c4533` | logo strip, phone status bar (`themeColor`) |
| `--danger` | `#c0361a` | errors only |
| `--tint` | `color-mix(brand 9%, panel)` | selected / pressed / highlighted |
No success or warning colour exists. Rule: "One colour. Forest green does the work."

### Typography — `app/layout.js`, `app/fonts/`
- **Figtree**, self-hosted variable woff2, latin subset (~20 KB), loaded with `next/font/local` as `--font-figtree`. No other fonts.
- Headline: Medium 500, 32px phone / 36px from `sm`, tight tracking, balanced wrap, brand green. Body/inputs/buttons 16px (inputs never below 16px). Helper/links/errors 14px. Tab labels 12px. Sheet titles 20px medium.

### Shape, shadow, spacing
- Radius: **4px** for fields, tiles, sheets (`rounded-[4px]`); **full pill** for buttons (47 uses of `rounded-full`). Almost no shadows (one `shadow-sm`); flat with 1px borders.
- Spacing: named 8px grid in `@theme`: `hair 4 · tight 8 · base 16 · group 24 · section 32 · block 48`. The source's lint (`tools/check-spacing.mjs`) bans numeric spacing like `mt-4`. **We do not copy that lint** (the master spec says nothing about it), but we reuse the same token names.
- Touch targets ≥ 44px; buttons 48px tall.

### Component feel
- **Button** (`components/ui/button.js`): full-width green pill, 48px, white text, `.press` dips to 0.98 scale; secondary = bordered `bg-field` pill with `border-line`, hover `border-line-hover`, active `bg-tint`.
- **Card/tile** (`tileClass`): flat bordered `bg-field` box, 4px radius, min-h 96px, `active:bg-tint`.
- **Inputs**: flat 48px boxes, 4px corners, placeholder acts as the label.
- **Top bar** (`components/layout/top-bar.js`): sticky 56px, `bg-field`, hairline bottom border, wordmark in brand green left, round tint button right, content width 30rem.
- **Tab bar** (`tab-bar.js`): fixed bottom, `bg-panel`, top hairline, 64px tall; active tab = icon on a `bg-tint` pill + brand text.
- **Sheet** (`components/ui/sheet.js`): native `<dialog>`, slides up, `bg-field`, 4px top radius, closes on Escape/backdrop.
- **Progress** (`progress-line.js`): 3px line, `bg-line` track, `bg-brand` fill.
- **Focus**: `2px solid var(--brand)`, offset 3px.
- **Motion**: ≤ 260ms, transform/opacity only (`rise`, `pop`, `nudge`, `sheet-in`, `menu-in`, `shimmer`), all disabled under `prefers-reduced-motion`.
- **Icons**: the source uses its own inline SVG set (`components/ui/icons.js`: thick-ish rounded outline icons) though `lucide-react` is a dependency. We use `lucide-react` (master spec §5) with `strokeWidth` 1.75–2.
- **Layout**: everything lives in a **30rem (480px) column** with 24px side padding. This is the "mostly mobile" part — on desktop it is a narrow phone-width column. We cannot reuse that width; see Section 3.

### Chart/diagram colours
None exist. `#4285F4/#EA4335/#FBBC05/#34A853` are Google's logo colours only (not part of the palette).

---

## Section 2 — Proposed design tokens for our app

Same names as the source where they exist. Light values are copied exactly; dark values are new (derived from the same warm-neutral + forest-green hues). Contrast measured against `--panel`.

```css
:root {
  --panel: #f0f0ea;  --field: #fbfbf7;  --line: #d9d9cf;  --line-hover: #b9b9ad;
  --ink: #1a1a1c;    --ink-soft: #55555b; --hint: #6b6b72;
  --brand: #14684b;  --brand-ink: #ffffff;
  --primary: #14684b; --primary-strong: #0f5a40; --logo-deep: #0c4533;
  --danger: #c0361a;
  --success: #14684b;   /* NEW: reuse brand green */
  --warning: #8a5a00;   /* NEW: ≥ 4.5:1 on panel — only for "Watch out" / uncertainty text */
  --highlight: #fff1a8; /* NEW: yellow "uncertain word" background (Daftari, Poster) */
  --tint: color-mix(in srgb, var(--brand) 9%, var(--panel));
  --overlay: color-mix(in srgb, var(--ink) 45%, transparent);
}

:root[data-theme="dark"]  /* and @media (prefers-color-scheme: dark) :root:not([data-theme="light"]) */ {
  --panel: #121513;  --field: #1b201d;  --line: #2e342f;  --line-hover: #444c46;
  --ink: #ecece6;    --ink-soft: #b4b5ad; --hint: #9a9b93;
  --brand: #4fb98d;  --brand-ink: #0b0d0c;
  --primary: #14684b; --primary-strong: #1a7d5b; --logo-deep: #0c4533; /* button stays the same green, white text 6.75:1 */
  --danger: #ff8a70; --success: #4fb98d; --warning: #f0b05c; --highlight: #5a4a00;
}
```

Dark contrast on `#121513`: ink 15.5, ink-soft 8.9, hint 6.6, brand 7.6, danger 8.0. `--line` is a border (1.4:1 is normal for borders). All AA.

**Tailwind exposure** (v4 `@theme inline`): `--color-panel/field/line/line-hover/ink/ink-soft/hint/brand/primary/primary-strong/danger/success/warning/highlight/tint`, plus the source's spacing names (`hair/tight/base/group/section/block`) and `--font-sans`.

**Radii:** `--radius-field: 4px` (inputs, cards, sheets, chips) and pill (buttons, segmented controls), matching the source. **Shadows:** none by default; one subtle `--shadow-pop` only for dialogs/popovers on desktop.
**Fonts:** Figtree as the UI font. The source loads a local woff2. We use `next/font/google` `Figtree` instead (same font, SIL OFL; it self-hosts at build time), so nothing is copied out of the source app. Mono for code: `Geist_Mono` (already in the starter) or `JetBrains_Mono`. Daftari handwriting: `Caveat` (spec says Caveat or Kalam).
**Theme toggle:** `data-theme` on `<html>` ("light" | "dark" | absent = system), stored in `localStorage` in try/catch, applied by a small inline script in `<head>` to avoid a flash.

---

## Section 3 — Extending the mobile style to tablet and desktop

The source's 30rem column becomes the **mobile** layout exactly; wider screens add structure, not new visual language (same tokens, flat bordered cards, 4px radii, pills for buttons, no shadows).

| Breakpoint | Layout |
|---|---|
| **< 768px (mobile)** | Single column, 24px side padding, content full width. Sticky 56px top bar (`bg-field`, hairline): wordmark left, menu button right opening a sheet menu (Projects, About, theme). Docs: "On this page" collapsible at the top. Prototypes stack panels vertically; bottom sheets for popovers/inspectors. Min touch target 44px. Project cards 1-up. |
| **768–1023px (tablet)** | 32px side padding, max width 720px for reading pages. Top bar shows inline links instead of the menu button. Project cards 2-up. Prototype panels 2 columns where useful (canvas + panel, list + detail). Docs stay single column with collapsible TOC. |
| **≥ 1024px (desktop)** | Content max-width 1200px centred, 32px padding. Project cards 3-up (5 cards: 3+2). Docs: **left sidebar (240px, project nav)** + **centre column (max ~70ch ≈ 44rem)** + **right sticky "On this page" TOC (220px)** with active-section highlight. Prototypes side-by-side panels; dialogs instead of sheets. Hardware lab canvas ≈ 65% / panel 35%. |

Rules: never horizontal page scroll (code/diagrams scroll in their own box); `min-h-dvh`; respect `env(safe-area-inset-*)`; type scale stays 16px body on all sizes with headlines growing 32 → 36 → 44px at `lg`; the source's 56px top bar stays 56px.

---

## Section 4 — Per-project accent colours

The source palette has exactly one hue (green), so five distinct accents have to come from new hues. To keep them in the same family, each is a **medium-saturation, slightly warm** colour that passes AA as text on `--panel` (light) and has a lighter twin for dark. Accents are used only for the card's icon tile, a 3px top rule, chips and active-tab underline, never for body text or buttons (buttons stay brand green).

| Project | Light accent | Contrast on `#f0f0ea` | Dark accent | Contrast on `#121513` |
|---|---|---|---|---|
| build-replay | `#0e6a72` (teal) | 5.5 | `#5cc7cf` | 9.2 |
| poster-unlocker | `#8a3a8f` (plum) | 6.0 | `#d99ade` | 8.4 |
| daftari | `#a35a00` (amber-brown) | 4.6 | `#f0b05c` | 9.7 |
| xerote | `#3a4fb5` (indigo) | 6.2 | `#9fb0ff` | 8.9 |
| hardware-lab | `#b23a48` (brick red) | 5.1 | `#f2929c` | 8.2 |

Each also gets a tint: `color-mix(in srgb, <accent> 10%, var(--panel))`. Note: brick red is close to `--danger` (`#c0361a`); it is only ever used decoratively, never for error states.

---

## Section 5 — Project setup facts (this repo, unchanged)

- **Next.js 16.4.6**, React 19.3.0, App Router (`app/`), **plain JavaScript** (`jsconfig.json`, `@/*` → `./*`).
- **No `src/` directory.** Files: `app/layout.js`, `app/page.js`, `app/globals.css`, `app/favicon.ico`, `public/*.svg`.
- **Tailwind 4.3.3** through **`@tailwindcss/turbopack`** (not postcss): configured in `next.config.mjs` via `turbopack.rules["*.css"]`. No `tailwind.config`, no `postcss.config`. Theme is declared in CSS with `@theme inline` in `app/globals.css`.
- `next.config.mjs` also sets `cacheComponents: true`, `partialPrefetching: true`, `experimental.agentFeedback: true`.
- ESLint 9 flat config (`eslint.config.mjs`, `eslint-config-next/core-web-vitals`); `npm run lint` = `eslint`.
- Dependencies installed: only `next`, `react`, `react-dom` (+ dev: eslint, tailwind). None of the allowed extras are installed yet.
- `AGENTS.md` exists: this is a newer Next.js; read `node_modules/next/dist/docs/` before coding. Docs read so far: `cacheComponents.md`, `agentFeedback.md`.
- Starter files (`app/page.js`, default metadata, Geist fonts, Arial body, `public/*.svg`) are the create-next-app defaults and will be replaced in T1.

**Implications for T1 (flagged now so they are not surprises):**
1. `cacheComponents: true` means **uncached runtime data (e.g. `params`, `cookies()`, `Date.now()`) must be wrapped in `<Suspense>` or handled via `generateStaticParams`**; route `params` is a Promise. I will read the relevant docs (`generateStaticParams`, `use cache`, `layout`/`page` conventions) before writing routes. Components reading `localStorage` must be client components.
2. With Activity-based navigation, hidden routes keep state and unmount effects; prototype `Reset demo` and any timers must clean up in effects.
3. Reading `content/projects/*.md` from disk needs `fs` in a Server Component (fine under static generation).
