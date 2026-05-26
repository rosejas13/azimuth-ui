# Changelog

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
- 1017 tests across 87 files, all passing
- TypeScript strict, ESLint zero-error
- Zero external dependencies
