# Changelog

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
