# Azimuth UI - AI Agent Instructions

## Build & Test

```bash
npm run typecheck   # TypeScript strict check (tsc --noEmit)
npm run lint        # ESLint on src/
npm run test        # Vitest: ~968 tests across 82 files
npm run build       # tsup: ESM + CJS + DTS + CSS
npm run dev         # Storybook on port 6006
npm run demo        # Vite playground on port 3173
```

## Architecture

- **79 components** (67 in `src/components/`, 8 primitives in `src/primitives/`, 4 layout in `src/layout/`)
- **Zero runtime CSS** - all CSS Modules compiled to vanilla `.css` by tsup
- **Single barrel export** - `src/index.ts` exports everything; consumers import `{ Button } from 'azimuth-ui'`
- **ThemeProvider** writes CSS custom properties on DOM; all components consume `--azimuth-*` tokens
- **OKLCH color space** with 10 color presets; WCAG 2.2 AA baseline

## Conventions

- Every component: `ComponentName.tsx` + `ComponentName.module.css` + `index.ts` + `ComponentName.test.tsx`
- All components use `forwardRef`, typed props interface, CSS Modules `styles.*`, `cn()` utility
- `'use client'` directive on all component entry files
- Tests use `@testing-library/react`, `userEvent`, `vitest` (vi.fn, vi.useFakeTimers)
- Icons: `src/icons/` has 860 SVGs (not yet integrated)
- Issue tracking via `bd` (beads) - run `bd prime` for workflow context
