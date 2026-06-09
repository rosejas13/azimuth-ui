# Contributing to Azimuth UI

## Setup

```bash
git clone https://github.com/rosejas13/azimuth-ui.git
cd azimuth-ui
npm install
npm run dev        # Storybook at localhost:6006
npm run demo       # Interactive demo
```

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run test` | Run all 1400+ tests (vitest) |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint + stylelint |
| `npm run build` | Build dist output |
| `npm run verify` | Full gate: lint → typecheck → test → build |
| `npm run dev` | Storybook dev server |
| `npm run demo` | Live component demo |
| `npm run storybook` | Build static Storybook |

## Component Guidelines

### File Structure
```
ComponentName/
  ComponentName.tsx        # Component code
  ComponentName.module.css # Styles (CSS Modules)
  index.ts                 # Barrel export
  __tests__/
    ComponentName.test.tsx  # Unit tests
    ComponentName.stories.tsx  # Storybook stories
```

### Conventions
- `'use client'` directive at top of every component
- `forwardRef` for all components
- JSDoc on all public types and component functions
- CSS Modules with `--azimuth-*` design tokens
- Group related props into objects (e.g. `label: { text, position, hidden }`)
- `cn()` utility for className merging (from `src/utils/cn`)
- `Slot` component for polymorphic `asChild` pattern (from `src/utils/Slot`)
- Storybook stories in CSF 3 format
- Tests with vitest + @testing-library/react

### Accessibility
- WCAG 2.2 AA baseline
- All interactive elements keyboard navigable
- Proper ARIA roles and attributes
- Focus management for overlays (use `useFocusTrap`)
- `prefers-reduced-motion` support
- Test with axe-core (injected in demo mode)

### Styling
- All colors, spacing, typography from CSS custom properties (`--azimuth-*`)
- No hardcoded color or spacing values
- Responsive via breakpoint-aware props or CSS media queries
- Dark mode via `.dark` / `[data-theme='dark']` selectors

### Props Pattern
```typescript
// Good — grouped related props
interface ComponentProps {
  label?: { text: string; position?: 'top' | 'left'; hidden?: boolean };
  data: Record<string, unknown>[];
  size?: 'sm' | 'md' | 'lg';
}
```

## Design Tokens

Tokens are defined in `src/styles/tokens.css` as CSS custom properties:
- `--azimuth-fs-*` — Font sizes (xs through h1)
- `--azimuth-color-*` — Color palette (text, surface, primary, accent, status)
- `--azimuth-space-*` — Spacing scale (xs through 4xl)
- `--azimuth-radius-*` — Border radii
- `--azimuth-shadow-*` — Box shadows
- `--azimuth-font-*` — Font families

ThemeProvider also injects these at runtime. See `src/theme/types.ts` for all configurable values.

## Architecture

```
src/
  components/
    input/       Form controls (Button, Input, Select, Toggle, etc.)
    display/     Visual components (Card, Text, Toast, Skeleton, etc.)
    data/        Data-heavy (DataTable, Calendar, Chart, etc.)
    layout/      Layout primitives (Container, Grid, Stack, Divider)
    navigation/  Nav components (Navbar, Tabs, Breadcrumbs, Menu, Sidebar)
    overlay/     Overlay components (Modal, Dialog, Drawer, Tooltip, etc.)
    sections/    Page sections (Hero, FeaturesGrid, PricingTable, Footer, etc.)
  hooks/         Shared React hooks
  theme/         ThemeProvider, color presets, style presets
  utils/         Utilities (cn, Slot)
  styles/        CSS tokens, reset, animations
```

## Issue Tracking

This project uses **bd** (beads) for issue tracking:
```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

## License

MIT — see [LICENSE](LICENSE).
