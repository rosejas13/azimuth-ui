---
name: azimuth-ui
description: Configurable, accessible React component library themed through CSS custom properties
colors:
  slate-teal: oklch(50% 0.13 195deg)
  slate-teal-hover: oklch(45% 0.14 195deg)
  slate-teal-subtle: oklch(92% 0.04 195deg)
  on-slate-teal: oklch(99% 0 0deg)
  accent: '#e8734a'
  accent-hover: oklch(60% 0.18 35deg)
  accent-subtle: oklch(92% 0.05 35deg)
  on-accent: oklch(99% 0 0deg)
  page-bg: oklch(98.5% 0.005 85deg)
  surface: oklch(99% 0.003 85deg)
  surface-hover: oklch(97% 0.005 85deg)
  text-primary: oklch(20% 0.01 85deg)
  text-secondary: oklch(35% 0.012 85deg)
  text-muted: oklch(42% 0.01 85deg)
  border-default: oklch(78% 0.008 85deg)
  border-strong: oklch(80% 0.01 85deg)
  success-bg: oklch(92% 0.04 145deg)
  success-text: oklch(35% 0.06 145deg)
  warning-bg: oklch(94% 0.05 85deg)
  warning-text: oklch(45% 0.08 85deg)
  error-bg: oklch(92% 0.05 30deg)
  error-text: oklch(40% 0.08 30deg)
  danger: oklch(45% 0.12 30deg)
  overlay: rgb(0 0 0 / 50%)
typography:
  display:
    fontFamily: Onest, system-ui, sans-serif
    fontSize: clamp(1.75rem, 4vw, 2.5rem)
    fontWeight: 500
    lineHeight: 1.05
  heading:
    fontFamily: Onest, system-ui, sans-serif
    fontSize: clamp(1.25rem, 3vw, 1.75rem)
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: Onest, system-ui, sans-serif
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Onest, system-ui, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Onest, system-ui, sans-serif
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.5
  mono:
    fontFamily: ui-monospace, Cascadia Code, Fira Code, monospace
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  3xl: 4rem
  4xl: 6rem
components:
  button-primary:
    backgroundColor: oklch(50% 0.13 195deg)
    textColor: oklch(99% 0 0deg)
    rounded: 8px
    padding: 0.5rem 1.5rem
    typography: label
  button-primary-hover:
    backgroundColor: oklch(45% 0.14 195deg)
  button-secondary:
    backgroundColor: oklch(99% 0.003 85deg)
    textColor: oklch(20% 0.01 85deg)
    rounded: 8px
    padding: 0.5rem 1.5rem
    typography: label
  button-ghost:
    backgroundColor: transparent
    textColor: oklch(35% 0.012 85deg)
    rounded: 8px
    padding: 0.5rem 1.5rem
    typography: label
  input-field:
    backgroundColor: oklch(99% 0.003 85deg)
    textColor: oklch(20% 0.01 85deg)
    rounded: 8px
    padding: 0.5rem 1rem
    typography: body
  card-default:
    backgroundColor: oklch(99% 0.003 85deg)
    textColor: oklch(20% 0.01 85deg)
    rounded: 8px
  card-elevated:
    backgroundColor: oklch(99% 0.003 85deg)
    textColor: oklch(20% 0.01 85deg)
    rounded: 8px
---

# Design System: azimuth-ui

## 1. Overview

**Creative North Star: "The Workbench"**

Azimuth-ui is the workbench: a clean, organized surface where every tool is in its place and every interaction gives confident, tactile feedback. Nothing decorative, nothing that doesn't earn its spot. Components ship with sensible defaults that feel good out of the box — not flashy, not invisible, just right. The system explicitly rejects the bloated, opinionated feel of MUI or Ant Design and the generic low-contrast neutrality of SaaS-cream.

Three judgments define every component: tactile interaction (buttons depress, cards lift, inputs snap to focus), accessible by default (WCAG 2.2 AA is never opt-in), and zero lock-in (pure CSS custom properties, no runtime, no framework dependency).

**Key Characteristics:**

- Restrained color with one committed accent (Slate Teal)
- Single sans-serif typeface with deliberate weight contrast for hierarchy
- Flat surfaces that lift on interaction — the workbench comes alive when you touch it
- Snappy motion (150–250ms) with exponential easing
- OKLCH color space, dark mode built in, prefers-reduced-motion respected

## 2. Colors

The palette is restrained by default: tinted warm neutrals, one primary accent (Slate Teal), and one warm accent (Copper) for emphasis. The neutral family leans very slightly warm (chroma 0.003–0.012 at a hue of 85°, a warm yellowish-white) so the surfaces feel natural, not clinical.

### Primary

- **Slate Teal** (`oklch(50% 0.13 195deg)`): The committed accent. Used for primary buttons, focus indicators, interactive elements, and selected states. It carries roughly 10–20% of surface area on a typical page — enough to establish identity, not so much that it loses impact.
- **Slate Teal Hover** (`oklch(45% 0.14 195deg)`): Darker, more saturated version for button hover states.
- **Slate Teal Subtle** (`oklch(92% 0.04 195deg)`): Tinted backgrounds for selected list items, suggestion highlights, and subtle interactive cues.
- **On Slate Teal** (`oklch(99% 0 0deg)`): Text and icons placed on Slate Teal backgrounds.

### Accent

- **Copper** (`#e8734a` / `oklch(62% 0.16 35deg)`): Reserved for the accent role — think notification badges, sale indicators, or brand moments that need to stand apart from the primary system. Used sparingly.

### Neutral

- **Page Background** (`oklch(98.5% 0.005 85)`): The canvas. Subtly warm white for light mode.
- **Surface** (`oklch(99% 0.003 85)`): Cards, inputs, dropdowns — one step lighter than the page.
- **Surface Hover** (`oklch(97% 0.005 85)`): Hover state for interactive surfaces.
- **Text Primary** (`oklch(20% 0.01 85)`): High-emphasis text — headings, body copy.
- **Text Secondary** (`oklch(35% 0.012 85)`): Lower-emphasis text — descriptions, metadata.
- **Text Muted** (`oklch(42% 0.01 85)`): Placeholder text, disabled labels.
- **Border Default** (`oklch(78% 0.008 85)`): Default dividers and outlines.
- **Border Strong** (`oklch(80% 0.01 85)`): Hovered or emphasized borders.

### Semantic

- **Success** (bg: `oklch(92% 0.04 145)` / text: `oklch(35% 0.06 145)`): Green-tinted for confirmation states.
- **Warning** (bg: `oklch(94% 0.05 85)` / text: `oklch(45% 0.08 85)`): Amber-tinted for caution states.
- **Error** (bg: `oklch(92% 0.05 30)` / text: `oklch(40% 0.08 30)`): Red-tinted for destructive or error states.

### Named Rules

**The Slate Teal Rule.** Slate Teal is the one committed accent. Copper is used only for true accent moments (not as a second primary). If a screen has three colors competing for attention, the design has lost its discipline.

**The Warm Neutral Rule.** Every neutral is tinted toward a warm hue (chroma ≥ 0.003, hue 85°). Pure grays are prohibited — they feel cold and unfinished. The tint should be imperceptible in isolation but unmistakable in aggregate.

## 3. Typography

**Display & Body Font:** Onest, system-ui, sans-serif  
**Mono Font:** ui-monospace, Cascadia Code, Fira Code, monospace

**Character:** Onest is a clean, slightly warm sans-serif with open apertures and good legibility at small sizes. The single-family approach (one typeface for everything) means hierarchy comes from weight and size contrast, not font switching. This reinforces the workbench metaphor — every tool uses the same handle, just different sizes.

### Hierarchy

- **Display** (500, `clamp(1.75rem, 4vw, 2.5rem)`, 1.05): Page-level headings only. Used once per page.
- **Headline** (600, `clamp(1.25rem, 3vw, 1.75rem)`, 1.25): Section headings, hero subtitles.
- **Title** (600, `1.125rem`, 1.3): Card headers, modal titles, panel headers.
- **Body** (400, `1rem`, 1.6): Default paragraph and content text. Max line length: 65–75ch.
- **Label** (500, `0.875rem`, 1.5): Button labels, input labels, navigation links, badges.
- **Mono** (400, `0.875rem`, 1.6): Code blocks, data values, keyboard shortcuts.

### Named Rules

**The Weight-Contrast Rule.** Hierarchy is primarily weight-driven, not size-driven. A Headline at 600 weight over a Body at 400 weight with only 0.75rem of size difference creates clear hierarchy without excessive scaling. Never use weight below 400 for body text.

## 4. Elevation

The system uses a hybrid approach: surfaces are flat at rest (no shadows on default cards, inputs, or panels), and depth appears as a response to interaction. The workbench is a flat surface until you reach for something.

The user wants more elevation than the current three-step shadow scale provides. Shadows will be extended to cover four tiers:

### Shadow Vocabulary

- **`--azimuth-shadow-sm`** (`0 1px 2px 0 rgb(0 0 0 / 4%)`): Subtle lift for interactive elements — buttons at rest, small dropdowns.
- **`--azimuth-shadow-md`** (`0 2px 8px 0 rgb(0 0 0 / 6%)`): Card hover state, medium dropdowns, small modals.
- **`--azimuth-shadow-lg`** (`0 4px 16px 0 rgb(0 0 0 / 8%)`): Large dropdowns, modal dialogs, elevated cards.
- **`--azimuth-shadow-xl`** (new, `0 8px 32px 0 rgb(0 0 0 / 10%)`): Full-screen overlays, drawers, command palette.

### Named Rules

**The Lift-on-Interaction Rule.** Shadows appear when the user engages — button hover, card hover, dropdown open, modal open. At rest, surfaces are flat. This keeps the visual baseline clean while making interactive moments feel physically responsive.

## 5. Components

### Buttons

- **Shape:** Gently rounded corners (8px default radius). Straight enough to feel precise, rounded enough to feel approachable.
- **Primary:** Slate Teal background, On Slate Teal text, 8px radius. `0.5rem 1.5rem` padding. 500 weight label. Depresses on `:active` (`scale(0.97)`).
- **Hover / Focus:** Primary darkens by increasing saturation and lowering lightness. All buttons get a `:focus-visible` ring (2px solid Slate Teal, 2px offset). Background, color, border, and box-shadow transition at 150ms with cubic-bezier easing.
- **Secondary:** Surface background, default border, Primary text. Hover strengthens the border and uses Surface Hover background.
- **Tertiary (Ghost):** Transparent background, Secondary text color. Hover adds Surface Hover background and Primary text.
- **Danger:** Error-bg background, Error-text color. Hover inverts to Error-text background with white text.
- **Link:** Transparent, zero padding. Primary color, hover underlines and shifts to Primary Hover.

### Cards

- **Corner Style:** Gently rounded (8px radius).
- **Default:** Surface background, 1px solid Border border. Hover lifts (shadow-md) and uses Surface Hover background.
- **Elevated:** No border, starts with shadow-md. Hover lifts to shadow-lg.
- **Dashed:** 2px dashed Slate Teal border for placeholder/add-new cards. No shadow on hover.
- **Internal Padding:** 1rem for the body, header, and content sections. Sections are separated by 1px border.

### Inputs / Fields

- **Style:** Surface background, 1px solid Border stroke, 8px radius. Padding `0.5rem 1rem`. Body typography.
- **Focus:** Stroke changes to Slate Teal, a 3px Slate Teal Subtle glow (`--azimuth-shadow-focus`) replaces the default ring. No separate outline — the glow IS the focus indicator.
- **Error:** Stroke shifts to Error-text, glow shifts to Error-bg tint. Error message appears below in Error-text at `--azimuth-fs-xs`.
- **Disabled:** Opacity 0.5, Surface Hover background, not-allowed cursor. No interaction.

### Navigation

- **Style:** Text-based, Label typography. Hover shifts to Primary color with optional subtle background tint. Active/current uses Primary color with Slate Teal Subtle background. The mobile sidebar uses a backdrop overlay with a slide-in panel — focus is trapped inside while open, and Escape closes it.

## 6. Do's and Don'ts

### Do:

- **Do** use Slate Teal as the primary accent — buttons, links, focus indicators, selected states.
- **Do** use Copper sparingly for true accent moments (badges, sale tags, brand highlights).
- **Do** keep shadows invisible at rest, present on interaction (the Lift-on-Interaction Rule).
- **Do** use weight contrast for typographic hierarchy — 600 weight headings over 400 weight body text.
- **Do** respect `prefers-reduced-motion`: suppress all animations except the focus ring.
- **Do** tint every neutral toward warm (chroma ≥ 0.003, hue 85°) — never pure gray.

### Don't:

- **Don't** use side-stripe borders (border-left/right >1px as a colored accent on cards, list items, or alerts). Use full borders, background tints, or nothing.
- **Don't** use gradient text (`background-clip: text`). Use a single solid color. Emphasize with weight or size.
- **Don't** use glassmorphism as a default. Blurs and glass cards are rare and purposeful, not decorative.
- **Don't** use the hero-metric template (big number + small label + supporting stats + gradient accent). Default SaaS cliché.
- **Don't** use identical card grids (same-sized cards with icon + heading + text repeated endlessly).
- **Don't** open a modal as a first thought. Exhaust inline and progressive alternatives first.
- **Don't** add a third accent color. Slate Teal + Copper is the palette; a third weakens both.
- **Don't** use CSS-in-JS or a runtime theming system. All styling goes through `--azimuth-*` custom properties.
- **Don't** ship components without WCAG 2.2 AA keyboard navigation and ARIA attributes.
