# Changelog

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
