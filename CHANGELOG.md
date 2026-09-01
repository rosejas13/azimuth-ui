# Changelog

## 0.12.3 (2026-08-31)

### Fixes

- **Combobox listbox no longer renders off-screen at the bottom of the viewport.** The popup is now measured against the available space below the input: when it doesn't fit and there's more room above, it flips above the input (clamped inside the viewport). Previously it always opened downward, going off-screen when the input sat near the page bottom — which forced consumer-side patches to reposition it.

- **Flipped listbox stays anchored to the input while filtering.** Position is re-measured whenever the option count changes while open, so a listbox that shrinks as you type moves with its new height instead of drifting away from the input (the bug consumer flip patches exhibited). It also resets to below the input as soon as space allows.

## 0.12.2 (2026-08-31)

### Fixes

- **DropdownList crash on empty search results.** Same root cause as the Combobox crash fixed in 0.12.1: `setHighlightedIndex(0)` fired on every keystroke even when the filtered list was empty, causing downstream accesses to `filteredOptions[0]` to throw. Now sets `-1` when no results match, and ArrowDown/ArrowUp are no-ops on empty lists.

## 0.12.1 (2026-08-31)

### Fixes

- **Combobox no longer crashes when typing text with no matches.** Typing text that filters to zero results (e.g. `"zzz"`) previously threw `TypeError: Cannot read properties of undefined` because `highlightedIndex` was set to `0` even when the filtered list was empty. Now highlights reset to `-1` and the "No results found" empty state is shown correctly.

- **Combobox gains a `filter` prop** for custom filter logic. The default is still case-insensitive substring match, but you can plug in fuzzy matching, prefix matching, or any other strategy:

  ```tsx
  <Combobox
    filter={(opt, query) => opt.label.toLowerCase().startsWith(query.toLowerCase())}
    // ...
  />
  ```

## 0.12.0 (2026-08-28)

### Features

- **`width` prop on `Toggle` and `DatePicker`.** Both components now accept a `width` CSS property applied to their outer wrapper, letting you control sizing inline:

  ```tsx
  <Toggle label="Notify" width="min-content" />
  <DatePicker width="240px" />
  ```

- **`childWidths` prop on `Row`.** Apply width to each child in a row — a single string applies the same width to all, an array applies widths left-to-right and cycles the last value for remaining children:

  ```tsx
  <Row childWidths="min-content">
    <Toggle label="A" />
    <Toggle label="B" />
  </Row>

  <Row childWidths={['min-content', 'max-content']}>
    <Toggle label="A" />
    <Toggle label="B" />
    <Toggle label="C" /> {/* gets max-content */}
  </Row>
  ```

  Inside a `<Form>`, `childWidths` overrides the default equal-width behavior.

### Fixes

- **Sourcemap ENOENT removed.** The build no longer emits `sourceMappingURL` comments pointing at `.map` files that were stripped before publish. Consumers using Vite dev server no longer crash on `ENOENT: dist/index.css.map`.

- **Form-row children can now override width.** Changed `.formRow > *` from `flex: 1 1 12rem` to `flex: 1 1 auto; min-width: 12rem` so children can set their own `width` without fighting `flex-basis`.

## 0.11.9 (2026-08-25)

### Features

- **Self-registering fields.** Inside `<Form form={form}>`, any control with a `name` wires itself — value, change, and touched handling injected, no wrapper needed:

  ```tsx
  <Form form={form}>
    <Input name="email" />
    <Select name="role" options={roles} />
    <Toggle name="notify" label="Notify me" />
    <DatePicker name="when" />
  </Form>
  ```

  Works for Input, TextArea, Select, Toggle, Checkbox, and DatePicker (`Toggle`/`Checkbox` receive boolean state; `DatePicker` dates; multi-`Select` arrays). Passing explicit `value`/`onChange` opts a control out. `<Form.Field>` remains for label/error display slots and arbitrary children. The wiring lives in a new shared context (`src/components/input/auto-wire.ts`) consumed by each input; forms without the `form` prop are completely unaffected.

## 0.11.8 (2026-08-25)

### Features

- **`DatePicker` accepts real format tokens.** The `format` prop previously supported only four hardcoded presets and **silently fell back to the default** for anything else — `format="MM-dd-yy"` just showed "August 25, 2026". It now parses date-fns-style tokens: `yyyy`/`yy`, `MMMM`/`MMM`/`MM`/`M`, `dd`/`d`. Legacy presets (`P`/`PP`/`PPP`) keep working; unknown patterns still fall back to `PPP`.

## 0.11.7 (2026-08-25)

### Features

- **`Card` gains a `title` prop.** Renders as a styled heading in the header row — `<Card title="Project Alpha">` now just works. A custom `header` node still takes precedence when both are set.
- **ThemeProvider `cardPadding` config.** New `cardPadding?: 'none' | 'compact' | 'normal' | 'spacious'` (default `normal`) emits `--azimuth-card-padding`, consumed by Card's header, body, footer, and content areas. Per-surface density without touching the global spacing scale.

### Fixes

- **Collapsed card bodies no longer overlay neighboring content.** The collapse animation kept `overflow: visible` on the zero-height body, so hidden content kept painting over whatever followed the card. Collapsed bodies are now `visibility: hidden; overflow: hidden` (also removed from the accessibility tree and hit-testing), with `aria-hidden` synced in markup and the fade-out preserved via a delayed visibility transition.

## 0.11.6 (2026-08-25)

### Features

- **Automatic field wiring in `Form.Field`.** Inside `<Form form={form}>`, give a field a `name` (or just a label) and its value, change handler, and blur-touched marking are injected from the form hook — no per-field plumbing:

  ```tsx
  <Form form={form}>
    <Form.Field name="email">
      <Input />
    </Form.Field>
  </Form>
  ```

  Boolean controls (`Toggle`, `Checkbox`) receive `checked` instead of `value`. Passing your own `value`/`onChange` on the child opts it out per-field; forms without the `form` prop keep pure uncontrolled FormData behavior.

## 0.11.5 (2026-08-25)

### Features

- **In-editor documentation.** `useForm` is now fully documented in-code — hook and interface docs with `@example` wiring, plus `@remarks` on the non-obvious behaviors: errors are touch-gated until blur or submit, a failed submit marks every field touched, and `Form.Field` resolves its error by matching its `label` to the schema key (case-insensitive). All of it surfaces in VSCode hover/IntelliSense via the shipped `.d.ts`.

### Fixes

- **`<Form form={form}>` now accepts concretely typed forms.** The prop was typed `UseFormReturn<Record<string, unknown>>`, so any real `useForm({ defaultValues: { email: '' } })` failed assignment. It takes `UseFormReturn<any>` at the boundary — your schema type stays intact on the hook for `values`/`setValue`.
- New **WithUseForm** Storybook story: a runnable zod-validated signup form showing the complete wiring (schema → `useForm` → controlled inputs → `Form.Field` errors).

## 0.11.4 (2026-08-25)

### Features

- **`Select` accepts a cleared state.** Single-mode `value`/`defaultValue` now take `string | null`: passing `null`, `''` (or rerendering from a value to `null`) shows no selection — same visual as having no default option — via an injected hidden empty option, so the blank state survives user interaction and form submission.

## 0.11.3 (2026-08-25)

### Fixes

- **Select no longer reserves blank space when it has no label or error.** The header/footer areas rendered unconditionally with reserved line heights; they are now conditional, matching Input's 0.11.1 behavior.

### Breaking

- **`Select` with `multiple` now returns arrays end to end.** Previously `onChange` handed back `e.target.value`, which for a multi-select is only the *first* selected option — a live bug. `value`/`defaultValue`/`onChange` now carry `string[]` in selection order whenever `multiple` is set (`SelectProps` is a discriminated union: single → `string`, multiple → `string[]`). Inside `<Form>`, submissions already serialize multi-selects as arrays.
- **`Toggle` and `Checkbox` adopt the flat input conventions**: `checked`/`defaultChecked` stay boolean, but `onChange` now receives the raw state — `(checked: boolean) => void` instead of the change event, so `onChange={setEnabled}` typechecks directly. The inherited native `value` prop (whose `ReadonlyArray<string>` typing offered meaningless string arrays on a switch) is removed from the curated surface; native attributes remain available via `toggleProps`/`checkboxProps` escape hatches. Migration: `onChange={(e) => set(e.target.checked)}` → `onChange={set}`.
- Fixed duplicate DOM ids in `Toggle`/`Checkbox`: ids were slugged from the label text, so two same-labeled toggles collided. Both now use React's `useId()`.

## 0.11.2 (2026-08-25)

### Features

- **Raw layout primitives: `Row` and `Column`.** Flexbox building blocks with token gaps matching the HTML mental model. `Row` is context-aware: anywhere it is a wrapping flex row, but inside a `<Form>` its children share width evenly (`flex: 1 1 12rem`), align by their input boxes, and wrap on narrow screens — form fields in a shared row with zero configuration. An explicit `align` always wins over the form default.
- **`Box` — the raw surface primitive.** A bare `<Box>` renders an unstyled element; every visual prop is opt-in and token-driven: `padding`/`paddingX`/`paddingY`, `border`, `radius`, `background`, `shadow`, plus polymorphic `as`.
- **`Spacer`** — an aria-hidden flex-grow filler for pushing content apart in rows and toolbars.
- **`DescriptionList`** — semantic term/description pairs (compound: `DescriptionList.Item`), term column collapsing on narrow screens, optional row separators.
- **`Meter`** — a scalar gauge within a known range (`role="meter"` with full value ARIA), distinct from `ProgressBar`: threshold tones via `low`/`high`, optional `n/max` readout.

### Breaking

- **DataTable's column-definition type renamed `Column` → `DataTableColumn`.** The new layout component takes the `Column` name at the package root; module semantics allow only one binding per export. Migration: `import type { Column } from 'azimuth-ui'` → `import type { DataTableColumn }`.

### Fixes

- Audit remediation: previously unreachable public API is now exported from the package root (`useFormContext`, `InputConfigContext`/`InputConfigProvider`/`useInputConfig`, `LabelConfig`, `SelectOption`, `Text*` unions, Card sub-component prop types); dead category barrels removed; `Grid.gap` tightened from bare `string` to the spacing-token union; knip configured with the icon-generation script as an entry.
- `Meter` guards against `min === max` division-by-zero when computing fill width.

## 0.11.1 (2026-08-21)

### Features

- **Input: `labelPosition="inner"` actually renders inside the field box.** Previously the inner-position label rendered above the input, identical to `top`. It now sits at the top-left inside the border — small, semibold, and secondary-colored so it reads as a field caption distinct from the input text — and the input reserves vertical room for it. The character counter follows it into the box.
- **New `xl` size across the text-input family.** Input, Select, and TextArea accept `size="xl"`, and `Form`/`InputGroup` group defaults now include it. `xl` pairs with `labelPosition="inner"` for label-inside-the-box layouts with extra headroom.

### Fixes

- **Input `label` accepts a plain string or a structured object** (`{ text, subtitle?, position?, required? }`). Simple usage stays flat; customization stays inline. Top-level `subtitle`/`labelPosition`/`required` props win over the object's fields when both are provided.
- Fixed a conditional `useId()` hook call in Input (`id || useId()`) that violated hook ordering rules and could crash if an explicit `id` was added or removed between renders of the same instance.

## 0.11.0 (2026-08-21)

### Features

- **AddressInput: address entry with injectable suggestion data.** Two layouts over one structured value: `layout="single"` renders a search field with suggestion selection, `layout="multi"` renders the six standard fields (line1, line2, city, state, postal code, country). The value is always `{ line1, line2?, city, state, postalCode, country }` whichever layout is used. azimuth ships no geocoding client — suggestions arrive via the `suggestions` prop and lookups via `onSearch`, so consumers bring their own service (self-hosted Nominatim, Photon, Smarty, Google…) and own any attribution its license requires. Inherits `size` from `Form`/`InputGroup` group defaults; `label`, `subtitle`, `error`, `required`, `disabled` follow the flat input conventions.
- **Group defaults via context.** `<Form size labelPosition>` and `<InputGroup size labelPosition>` set once and every descendant input inherits them as defaults (instance prop > InputGroup > Form > built-in). Proven in the call-intake reference app, where 15 repeated `labelPosition='left'` props collapsed to one.

### Breaking

- **Input, TextArea, and Select props are now flat and idiomatic; Slider's `value` object is flattened.** The structured object props from the 0.8-era "prop consolidation" (`label={{ text }}`, `value={{ value, onChange }}`, `charCount={{ }}`, `stepper={{ }}`, `autocomplete={{ }}`) regressed the API the README, demo, and older consumers already documented and used. Input, TextArea, and Select now accept:
  - `label="Email"`, `labelPosition` (Input), plus independent `subtitle`, `error`, `required`
  - top-level `value`/`defaultValue`/`onChange` where `onChange` receives the raw value (`(value: string) => void`) — `onChange={setText}` typechecks directly
  - `stepper` (boolean), `showCharCount`, and `suggestions={{ options, onSelect, filter? }}` on Input
  - curated native prop surfaces plus `inputProps`/`textareaProps`/`selectProps` escape hatches, so editors no longer suggest ~150 inherited attributes per component
  - Slider flattens `value={{ value, defaultValue, onChange, disabled }}` to top-level props and keeps its cohesive `range`/`display` objects; its native attribute surface is unchanged for now
  - Migration: `label={{ text: X, position }}` → `label={X} labelPosition={position}`; `value={{ value: v, onChange: (e) => ... }}` → `value={v} onChange={(v) => ...}`
- **DateTimePicker props are flat** to match DateRangePicker: `value`/`defaultValue`/`onChange` (was `value={{ ... }}`), `showTime`/`showSeconds` (was `display={{ ... }}`), `minDate`/`maxDate`/`hourStep`/`minuteStep` (was `constraints={{ ... }}`).
- **Text props are flat**: `element={{ as, size, variant }}` → `as`/`size`/`variant` top-level, with a curated native surface replacing the `ComponentPropsWithoutRef<'p'>` inheritance.

### Fixes

- **Input `defaultValue` now actually renders.** It was declared but never passed to the native input, so the uncontrolled path was silently broken; `defaultValue` now reaches the DOM whenever `value` is undefined.
- **Selecting a suggestion updates the field** even in uncontrolled Inputs (the suggestion is now applied through state instead of only firing `onSelect`).
- **Accessibility is default-on, not opt-in** (from the 0.11.0 a11y audit):
  - Input and DateTimePicker stepper buttons are keyboard-reachable (removed `tabIndex={-1}`).
  - Input and Select generate stable unique DOM ids via `useId()` — two fields sharing a label text (e.g. billing + shipping address) no longer produce duplicate ids that break label association.
  - Input's suggestion list implements the combobox pattern: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, non-tabbable options.
  - DateTimePicker time values announce changes via `aria-live="polite"`.
  - AddressInput renders a real `fieldset`/`legend` group; in `multi` layout every field gets `aria-invalid` + `aria-describedby` wired to the single group error; `disabled` on the group disables all fields natively.
- **Input `suggestions` gains `filter: false`** so consumer-provided ranked results (e.g. from a geocoder) are shown as returned instead of being substring-filtered against the typed text.
- **Missing theme CSS is now loud.** `ThemeProvider` emits a one-time dev `console.warn` when `azimuth-ui/styles.css` is not imported — the #1 cause of "no theme is applied". Base-only `--azimuth-radius` is the canary.
- **`@keyframes` now ship in the package.** `build-css.mjs` was silently dropping `animations.css` from `dist/index.css`, so entry animations referenced by component CSS modules had no definitions for consumers.

### Quality

- Input suite expanded to 23 cases (controlled `onChange={setX}` pattern, uncontrolled `defaultValue`, controlled-value immutability, combobox ARIA wiring, unfiltered suggestions, unique ids); TextArea/Select/Slider suites rewritten to the flat API (15/10/14 cases) with `defaultValue` and controlled coverage added.
- New `InputConfigContext` coverage: Form/InputGroup inheritance, descendant overrides, Select inheriting `size`.
- AddressInput ships with 18 tests covering both layouts, controlled/uncontrolled use (including controlled→uncontrolled fallback and layout switching), suggestion selection applying the structured value, group-config inheritance, error aria wiring, and no-props plug-and-play.
- Accessibility verified against WCAG 2.2 AA with an adversarial audit pass; contrast ratios computed from tokens for light and dark themes.

## 0.10.0 (2026-07-29)

### Features

- **Chat: production-grade conversation component** — brought `Chat` from a plain-text demo widget up to something usable as the main UI of an LLM/chat app (markdown, streaming, rich in-bubble content, multiline input). All additions are opt-in; existing plain-text usage is unchanged. Epic azimuth_ui-0ts.
  - **Configurable header & empty state**: `title` (ReactNode), `headerActions`, `hideHeader`, and `emptyState` props so consumers supply their own header chrome and app-specific empty state. Closes azimuth_ui-0ts.5.
  - **Multiline composer**: the single-line input is now an auto-growing `textarea` (grows to a max height then scrolls). Enter sends, Shift+Enter inserts a newline. Preserves focus-on-mount, placeholder, and disabled-when-empty. Closes azimuth_ui-0ts.3.
  - **Custom bubble content**: `renderMessage(msg) => ReactNode` render prop for correction cards, citations, tool-call chips, TTS buttons, etc. Chat still owns layout, alignment, timestamps, auto-scroll, and aria-live; `msg.text` stays required as an a11y/copy fallback. Closes azimuth_ui-0ts.2.
  - **Opt-in markdown**: per-message `format?: 'text' | 'markdown'` renders a safe subset (bold, italic, lists, fenced/inline code, links) via a new dependency-free renderer that builds React elements only — never `dangerouslySetInnerHTML` — so raw HTML in model output is escaped and cannot execute. Link hrefs are scheme-checked (strips `javascript:`/`data:`/control-char obfuscation). Closes azimuth_ui-0ts.1.
  - **Streaming / busy state**: `busy` + `busyLabel` props show a typing indicator and set `aria-busy`. Auto-scroll only pins to the bottom when the user is already near it, so streamed chunks don't yank the viewport during scrollback. A polite live region announces the completed reply once, not on every token. Closes azimuth_ui-0ts.4.

### Design Tokens

- **`--azimuth-shadow-xl` rollout**: `Drawer`, `Modal`, `SlideSheet`, and `CommandPalette` now use `--azimuth-shadow-xl` instead of `shadow-lg` for correct elevation hierarchy. Added an elevation-aware `xl` step to the shadow scale and emit it from `ThemeProvider` (previously only sm/md/lg were emitted), so `xl` stays larger than `lg` under every elevation preset. Closes azimuth_ui-24g.

### Fixes

- **Theming: consumer stylesheets can now override any `--azimuth-*` token.** Previously radius/space/shadow/font/ease tokens were set via inline `documentElement.style`, which beats any stylesheet rule by specificity and could only be worked around with imperative JS. All Azimuth token CSS now lives in an `azimuth` cascade layer (`tokens.css` defaults in `azimuth.base`; `ThemeProvider` runtime output — colors plus the now-injected non-color tokens — in `azimuth.runtime`). Any consumer CSS **outside a layer** beats every token regardless of specificity or stylesheet load order, no imperative `style.setProperty` needed. Documented in the README. Closes azimuth_ui-lqj.
  - **Note**: requires CSS cascade layer support (Chrome/Edge 99+, Firefox 97+, Safari 15.4+ — all shipped 2022). In older engines the layered token rules are ignored; use `ThemeProvider` config for those consumers.

### Quality

- **PageLayout mobile sidebar** now has test coverage — hamburger toggle (mobile-only), open/close, backdrop dismiss, Escape-to-close with focus return, `Tab`/`Shift+Tab` focus trapping, body-scroll lock, and polite open/closed announcements — plus a `MobileSidebar` Storybook story at the mobile viewport. Closes azimuth_ui-ebz.
- **Theming regression tests**: jsdom asserts tokens are emitted into the runtime layer (not inline) and reflect config; a real-browser Playwright spec (`theming-override.a11y.spec.ts`) loads the actual `tokens.css` and proves an unlayered consumer `:root` override wins for radius/space/shadow tokens, including when loaded before Azimuth.

## 0.9.3 (2026-07-17)

### Accessibility (WCAG 2.2 AA)

- **Button fallback hex**: Replaced light-theme fallback `--azimuth-color-primary` `#2e9e8e` → `#00787a` and `--azimuth-color-primary-hover` `#258a7c` → `#006b6d` in the `@supports not (color: oklch)` block so the fallback matches the oklch primary (which passes AA at 5.29:1) instead of rendering a lighter, AA-failing teal in legacy browsers. Closes azimuth_ui-8hu.
- **Button hover text color**: Added `--azimuth-color-on-primary-hover` and `--azimuth-color-on-accent-hover` tokens in all four theme/path blocks; `.primary:hover` in `Button` and `SplitButton` now re-asserts `color` against the hover background so text contrast holds across themes. Closes azimuth_ui-ck8.
- **Button asChild link underline**: Added `AsChildLink` Storybook story and a vitest + Playwright a11y spec verifying the base `.button` class's `text-decoration: none` reset suppresses the UA anchor underline in every variant. Closes azimuth_ui-c5m.
- **Filled-accent AA**: Added `--azimuth-color-accent-strong` (`oklch(56% 0.16 35deg)` → `#c0482a`, 5.00:1 vs white) for filled-accent surfaces that overlay white `on-accent` text; swapped `NotificationBadge.accent`, `Chip.accent.selected`, `ProductCard.badge`, and `Timeline.dot` to use it. Base Copper `#e8734a` retained for non-text accent usages per DESIGN.md's "Copper Rule". Closes azimuth_ui-yfc.

### Quality

- **Token contrast guard**: New automated test `src/styles/__tests__/tokens.contrast.test.ts` (29 assertions) using `culori` — asserts every filled-button variant (primary/secondary/danger/accent-filled) × rest+hover × light/dark × oklch/fallback paths meets >=4.5:1. Guards against future per-theme token drift breaking AA.
- **Dev deps**: Added `culori` + `@types/culori` for authoritative oklch→sRGB color math (sRGB gamut mapping matches browser behavior).

## 0.9.2 (2026-06-27)

### Features

- **ThemeToggle**: New built-in component cycling light → dark → system theme modes via `useThemeMode().toggle`. Shows SunIcon, MoonIcon, or MonitorIcon per state with dynamic `aria-label`. Accepts `size` prop (`sm`/`md`/`lg`). Ships with tests and Storybook story.
- **Icons**: Added `MonitorIcon` for system-mode theme indicator.
- **Input**: Added explicit `inputProps` prop (`InputHTMLAttributes`) for discoverable passthrough of native HTML attributes (`autoComplete`, `inputMode`, `pattern`, etc.). Spreads after `{...props}` so consumers can override.

## 0.9.1 (2026-06-26)

### Features

- **PageLayout**: Responsive mobile sidebar with hamburger toggle, backdrop overlay, and `breakpoint` prop. Focus trapped while open, closes on Escape, announces state to screen readers.
- **Icons**: 6 new regular icons — Lock, LockOpen, Shield, Search, ArrowLeft, ArrowRight.
- **PRODUCT.md + DESIGN.md**: Added strategic design context and visual system documentation via `/impeccable`.
- **AGENTS.md**: Added Design Context pointer with 9 key design facts for agent reference.

### Design Tokens

- **`--azimuth-shadow-xl`**: New 4th shadow tier (`0 8px 32px 0 rgb(0 0 0 / 10%)`) for full-screen overlays, drawers, and command palette. Extends the existing sm/md/lg scale.
- **Spacing aliases**: Added `--azimuth-spacing-*` variables mapping to existing `--azimuth-space-*` tokens for API consistency.

### Accessibility (WCAG 2.2 AA)

- **PageLayout mobile sidebar**: Added focus trap (Tab/Shift+Tab cycling), `aria-controls` on hamburger, `aria-live="polite"` status announcement, `:focus-within` outline on overlay, and `prefers-reduced-motion` overrides in CSS module.
- **`a:hover` indicator**: Re-added `text-decoration: underline` as non-color link hover indicator (removed by issue closure, reverted per a11y audit).
- **Icon SVGs**: Added `role="img"` and `<title>` to all icon components for screen reader identification.

### Quality

- **Beads config**: Switched from external Dolt server to embedded mode with auto-export to JSONL. Resolves `bd` compatibility with local workflow.
- **Style presets**: Fixed `--azimuth-background` typo → `--azimuth-color-bg` in Minimal and Crisp presets.
- **A11y audit**: Ran full WCAG 2.2 AA audit across changed files (PageLayout, reset.css, icon SVGs). All 8 findings closed.

## 0.9.0 (2026-06-19)

### Features

- **PageLayout**: New responsive mobile sidebar — hamburger toggle, backdrop overlay, configurable `breakpoint` prop (default `768px`), keyboard dismiss (Escape). Sidebar slides in from left/right matching desktop position.
- **Icons**: 7 new regular icons — Lock, LockOpen, Shield, Search, ArrowLeft, ArrowRight, History.
- **Spacing tokens**: Added `--azimuth-spacing-*` CSS alias variables for all 8 `--azimuth-space-*` scale steps.

### Fixes

- **Beads config**: Fixed stale `data_dir` path (`personal/` → `nova-mir/`). Switched from external Dolt server to embedded Dolt mode with `export.auto: true` — beads now works fully offline with auto-export to JSONL.
- **Global `a:hover`**: Removed default `text-decoration: underline` from anchor hover style (was redundant with color change and clashed with component-level link styling).

### Chores

- **Issue tracking**: Closed 3 completed items (DataTable keyboard sort, SidebarNav nested items, Dropdown menu placement).

## 0.8.0 (2026-06-17)

### Features

- **Container**: New `maxWidth` prop accepts numbers (px) or CSS strings — eliminates `style={{ maxWidth: 960 }}` workaround on every page. Use `<Container maxWidth={960}>` or `<Container maxWidth="60rem">`.
- **Text**: New `align` prop (`left` | `center` | `right` | `justify`) — replaces 30+ instances of `style={{ textAlign: 'center' }}` across the codebase.
- **Grid**: New `minWidth` prop for auto-fill responsive columns — replaces hardcoded `250px` with configurable values. `<Grid cols={{ base: 'auto' }} minWidth={280} />`.
- **Divider**: New `margin` prop accepts azimuth space tokens (`xs`/`sm`/`md`/`lg`/`xl`) — eliminates inline margin styles around dividers.
- **Card**: New `variant` prop (`outline`/`elevated`/`dashed`) for border style presets. New `fill` prop for equal-height grid card layouts (`height: 100%`).
- **Badge**: New `primary` variant with solid primary background and white text.
- **Icons**: All 860 SVG icons now include `width="1em" height="1em"` — renders at correct size even without the `<Icon>` wrapper.

### Quality

- **CSS structure tests**: Added for Container, Text, Divider, Grid, Card, and Badge — verifies CSS module class names are applied to correct DOM elements.

## 0.7.1 (2026-06-12)

### Fixes

- **Card**: `Card.body` now renders as a flex column, allowing children to use `flex: 1` or `margin-top: auto` to push the footer to the bottom of the card. Previously the body had `flex: 1` in the card's column layout but wasn't itself a flex container, so children couldn't fill available space.

## 0.7.0 (2026-06-09)

### Features
- **23 new components + 1 new hook** across 6 categories

#### Phase 1 — UI Primitives
- **ScrollArea**: Custom-styled scrollable container with vertical/horizontal/both orientations, optional hide-scrollbar, smooth scroll
- **AspectRatio**: Maintains width-to-height ratio for media (16:9, 4:3, 1:1, etc.) with CSS `aspect-ratio` + fallback
- **SkipLink**: Skip-to-content link for keyboard users — visually hidden until focused, WCAG requirement

#### Phase 2 — Marketing Site Sections
- **Hero**: Full-width hero with center/split layouts, background image overlay, CTA buttons, 4 variants
- **FeaturesGrid**: Feature showcase with icons, titles, descriptions; configurable columns (2/3/4)
- **PricingTable**: Tiered pricing cards with feature comparison, highlighted tier, badges, CTA
- **Testimonials**: Quote cards with avatar, star ratings, configurable columns
- **CTABanner**: Focused call-to-action strip with title, description, buttons
- **ContactSection**: Contact form with info sidebar (address, email, phone, social links)
- **TeamSection**: Team member grid with avatars, roles, bios, social links
- **Footer**: Multi-column site footer with brand, navigation, social links, newsletter signup
- **StatsSection**: Number/metric showcase with icons, prefixes/suffixes, grid layout

#### Phase 3 — Form & Data
- **useForm hook**: Form state management with optional Zod validation — tracks values, errors, touched, dirty/submitting states; integrates with existing Form.Field error display
- **PhoneInput**: International phone input with searchable country code selector (36 countries), flag emojis, controlled/uncontrolled
- **DatePicker**: Single-date input trigger with Calendar popup, date formatting (PPP/PP/P/ISO), min/max constraints
- **ContextMenu mode on Menu**: Added `triggerMode="context"` prop to Menu — right-click opens at mouse position

#### Phase 4 — App/Dashboard Patterns
- **ProgressSteps**: Multi-step wizard indicator with default/numbered/compact variants, horizontal/vertical orientation, click-to-navigate
- **DataFilterBar**: Table filter bar with search input, filter dropdowns, sort controls, active filter chips, result count
- **KPICard**: Dashboard metric card with value, label, trend arrow, 5 color variants, interactive mode
- **ErrorBoundary**: React error boundary with ErrorPage fallback, custom fallback renderer, reset capability
- **ActivityFeed**: Dashboard activity timeline with color-coded event dots, timestamps, show-more pagination, empty state

#### Phase 5 — Storefront
- **ProductCard**: Product display card with image, title, price, rating, sale badge, out-of-stock state
- **QuantityStepper**: +/- quantity selector with min/max/step, size variants, disabled state
- **PriceDisplay**: Formatted price with currency, sale strikethrough, suffix, size variants

### Quality
- **All new components**: 100% with tests (vitest), Storybook stories (CSF 3), JSDoc, WCAG 2.2 AA keyboard/ARIA, CSS Modules, forwardRef + 'use client', design tokens
- **zod** added as peer dependency for useForm validation

### Cross-Browser & Responsive
- **Playwright browser matrix**: Added Firefox, WebKit, Pixel 7 (mobile Chrome), iPhone 15 (mobile Safari), and iPad landscape to a11y test projects — 6 browser/device targets per component
- **Responsive viewport tests**: Key layout components tested at 320px, 375px, 768px, and 1280px with axe-core scanning at each breakpoint

### Testing & Coverage
- **1427 tests** (+14 from 1413): ThemeProvider (4), color-presets (5), style-presets (5)
- **Coverage thresholds**: Enforced at 60% lines, 75% branches, 45% functions in vitest config
- **Theme tests**: ThemeProvider renders children, provides context, applies CSS vars + `<style>` tags
- **CI pipeline**: `npm run ci` = verify + Playwright a11y suite (auto-starts Storybook)
- **Keyboard e2e test**: Smoke test tabbing through interactive components

### Cross-Browser & Responsive
- **Playwright browser matrix**: Chromium, Firefox, WebKit, Pixel 7, iPhone 15, iPad — tests a11y on each

### Developer Experience
- **browserslist** + **engines** added to package.json (Node >=18, modern browsers)
- **Minimal setup**: `npm install azimuth-ui` + `import 'azimuth-ui/styles.css'` + `<ThemeProvider>` wraps app — 3 steps to production use
- **zod peer dep relaxed**: `^4.0.0` instead of exact `4.4.3` to avoid version conflicts

### Documentation
- **CONTRIBUTING.md**: Added collaborator guide covering setup, conventions, file structure, accessibility standards, design tokens, and architecture overview

### Accessibility
- **Automated a11y test suite**: Added Playwright + axe-core WCAG 2.2 AA scanning for all 104 components. 7 category-level spec files covering input, display, data, sections, layout, navigation, and overlay — runs `npm run test:a11y` against Storybook
- **Form a11y fixes**: Labels now use `htmlFor` with cloned child `id` via `cloneElement`; `aria-invalid` and `aria-describedby` on form child inputs
- **ContactSection a11y**: Added `role="status"` with `aria-live="polite"` for submit state screen reader announcements
- **DatePicker a11y**: Popup has `role="dialog"` + `aria-modal`; input has `aria-describedby` linking to error/help text
- **ActivityFeed a11y**: Event type dots have `aria-label` so color is not the only indicator
- **ErrorBoundary a11y**: Fallback container has `role="alert"` with focus target
- **PhoneInput a11y**: Flag emoji marked `aria-hidden="true"` (country code text suffices)
- **Footer a11y**: Subscribe newsletter rendered as `<button>` with native keyboard support

## 0.5.2 (2026-06-09)

### Accessibility
- **Heading font-size CSS variables**: Added `--azimuth-fs-h6` (1rem); bundled `tokens.css` into `dist/index.css` so heading font-size vars actually reach consumers
- **Text contrast WCAG AA**: Darkened `--azimuth-color-text-secondary` to `oklch(35% ...)` and `--azimuth-color-text-muted` to `oklch(42% ...)` — now pass WCAG AA 4.5:1 on white backgrounds. Updated hex fallbacks.

### Build
- **CSS reset bundled**: Added `scripts/build-css.mjs` to concatenate `tokens.css` + `reset.css` + component CSS into `dist/index.css` during build. Consumers importing `azimuth-ui/styles.css` now get global baseline styles (box-sizing, font-smoothing, reduced-motion, etc.) and all design tokens.

## 0.5.1 (2026-06-08)

### Features
- **Storybook 100% coverage**: Added 23 story files for all remaining components (Data: Calendar, ColorPicker, DataTable, DateRangePicker, DateTimePicker, DiffViewer, SimpleChart; Display: Chat, Clock, CodeBlock, Cursor, FanMenu, ImageViewer, LoginSignup, MapDisplay, MediaPlayer, PageLayout, ResizablePanel, SectionView, Toast; Overlay: CommandPalette, Flyout, Sidebar). 81 stories for 81 component directories.
- **Container size prop**: Added `size` prop (`'sm' | 'md' | 'lg' | 'xl' | 'full'`, default `'lg'`) with corresponding max-width CSS classes.

### Quality
- **1119 tests total** (+4 from 0.5.0), 87 test files, all passing
- **Focus indicators**: Added `:focus-visible` to SearchBar suggestions, Input stepper buttons, Input suggestions, Combobox options, CommandPalette input + items
- **Color tokens**: Added `--azimuth-color-text-inverse` token (both oklch and hex fallback), filled 6 missing hex fallbacks in `@supports` block
- **SearchBar a11y**: Changed nested `<button>` elements in suggestions to `<div role="option" tabIndex={-1}>` with keyboard handler — fixes WAI-ARIA nested interactive pattern violation
- **Beads Dolt server mode**: Project now uses shared Dolt server for issue tracking

## 0.5.0 (2026-05-30)

### Features
- **Icons barrel**: `export * from './icons'` added to `src/index.ts`. Icons now importable from `'azimuth-ui'` directly, plus `./icons` subpath export in `package.json`
- **Dolt server mode**: Switched beads from embedded to external Dolt SQL server for VSCode extension compatibility
- **Playwright a11y tests**: 3 `*.a11y.spec.ts` files for Button, Accordion, Dialog (run with `npm run test:a11y`)
- **Pre-commit hooks**: husky + lint-staged with eslint --fix and prettier --write on staged files

### Quality
- **1115 tests total**, 87 test files, all passing. Typecheck and lint clean (0 errors, 0 warnings)
- **23 a11y lint errors fixed** across 15 components (keyboard handlers, focusable roles, redundant roles)
- **Arrow key edge cases**: Calendar month/year boundary wrapping, ResizablePanel minSize clamping, Input Escape dismiss
- **Strict TS rules re-enabled**: `no-floating-promises`, `require-await`, `no-misused-spread`, `no-unnecessary-type-assertion` (all warnings)
- **MegaLinter wired into CI**: secret scanning (Gitleaks, TruffleHog) runs on every push
- **React act() warnings eliminated**: All Flyout, Tooltip, Alert, Button tests now properly wrap state updates

### Props Consolidation
- **Carousel**: `autoPlay`/`interval`/`autoRotate` merged into `autoplay: { enabled, interval }`
- **DropdownList**: `data.searchable` → `data.search: { enabled }`

## 0.4.2 (2026-05-28)

### Test Coverage
- **Keyboard interaction**: 35 new tests across 9 components — Checkbox, Radio, Toggle, Navbar, Flyout, Tooltip, Carousel, Sidebar, IconButton
- **Edge cases**: 16 new tests — SimpleChart empty data, Timeline no items, Input stepper/charCount/label positions, DateRangePicker constraints, DiffViewer edge states
- **Controlled modes**: 6 new tests — Select, SearchBar, FanMenu
- **CSS variants**: 11 new tests — ProgressBar colors/sizes, Grid aligns, Stack justify/spacing/wrap
- **Accessibility**: 6 test fixes + 4 new role/aria assertions — Drawer/Modal/SlideSheet class checks, DiffViewer, Table, List, TextBox, Timeline

### Security
- **MapDisplay**: iframe `src` now validates URL scheme (rejects `javascript:`/`data:`)
- **CodeBlock**: HTML escaping hardened with `&quot;` defense-in-depth
- **Build**: Sourcemaps removed from published `dist/` (`rm -f dist/*.map`)

### Quality
- **1115 tests total** (+77 from previous), 87 test files, all passing
- Typecheck clean

## 0.4.1 (2026-05-27)

### Documentation
- **JSDoc audit**: Added interface-level JSDoc to 71 component interfaces and 19 exported sub-types
- **`@default` coverage**: Added 50+ missing `@default` annotations across all components
- **Component function docs**: Added doc comments to 74 component functions
- **Fixed stale docs**: 4 misleading descriptions (Alert icon, Toast dismissible, Dialog Escape, Carousel interval), DataTable grammar, ToastProvider inconsistency
- **Spec rewrite**: `docs/specs/azimuth-ui.md` rebuilt to match current structure — no more `primitives/`, `tokens/`, or stale hook listings
- **Housekeeping**: `.beads/README.md` repo links updated, `LICENSING_TODO.md` checkbox confirmed

## 0.4.0 (2026-05-27)

### Features
- **Component restructuring**: Merged `src/primitives/` into `src/components/` — all components now live under one of 6 sub-categories: `input/`, `display/`, `data/`, `layout/`, `navigation/`, `overlay/`
- **Prop consolidation**: Batch rename of flat prop names to grouped names across all components (e.g., `accentColor` → `color.accent`, `size` → `size.width`/`size.height`)
- **Arrow key tests**: Added keyboard navigation tests for Combobox, DropdownList, Select, Tabs, Slider, and other arrow-key-interactive components
- **CI setup**: GitHub Actions workflow — lint, typecheck, test, build on push and PR

### Improvements
- Barrel export (`src/index.ts`) simplified — imports now map directly to sub-category paths internally
- Component directory cleanup — removed stale `src/primitives/` directory and updated all internal import paths

### Quality
- 1038 tests across 87 files, all passing
- TypeScript strict, ESLint zero-error
- Zero external dependencies

## 0.3.2 (2026-05-25)

### Changes
- **DataTable**: Virtualization now uses `@tanstack/react-virtual` for variable row heights. Auto-enabled by default. Removed `virtualizedRowHeight` prop (measured automatically).

## 0.3.1 (2026-05-25)

### Changes
- **DataTable**: Virtualization now auto-enabled by default when data exceeds threshold. Set `virtualized={false}` to force-off.

## 0.3.0 (2026-05-25)

### Features
- **Icons**: 860 tree-shakeable SVG icon components (273 regular + 587 brands), auto-generated from Font Awesome Free
- **IconButton**: Circular icon-only button primitive wrapping Button with circle shape
- **InfoButton**: Circular 'i' popover component with WCAG 2.2 AA accessibility
- **DataTable virtualization**: Virtualized scrolling for large datasets, configurable threshold and row height, decoupled from pagination
- **Button asChild**: Slot-based polymorphic rendering via `asChild` prop

### Improvements
- **Alert/Toast**: SVG icons replace unicode/emoji for all variants
- **ThemeProvider**: All 30+ color tokens now injected for both light/dark modes — fixes surface/border/text visibility
- **Missing CSS variables**: Added `--azimuth-fs-xl`, `--azimuth-fs-2xl`, `--azimuth-color-danger`, `--azimuth-color-primary-ring`
- **Old CSS naming**: Fixed `--azimuth-font-size-*` → `--azimuth-fs-*` and `--azimuth-spacing-*` → `--azimuth-space-*` in MediaPlayer, SimpleChart, MapDisplay
- **CLAUDE.md**: Deduplicated with project-specific agent instructions
- **Elevation type**: Now exported from public barrel

### Fixes
- Lint errors in DiffViewer and MediaPlayer fixed
- Tests added for DateRangePicker and Tooltip
- Missing tests for Slot utility added
- Duplicate `ColorMode` type in useThemeMode.ts consolidated
- Dead CSS variable `--azimuth-transition-slow` removed

### Quality
- 1038 tests across 87 files, all passing
- TypeScript strict, ESLint zero-error
- Zero external dependencies
