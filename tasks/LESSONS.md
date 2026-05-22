# Azimuth UI — Workspace Lessons

Project-specific knowledge for both human contributors and AI agents working on this codebase. Read this before writing any component.

## Component Development Checklist

Every new component **must** satisfy all items before being considered complete. This is non-negotiable — a component is not "done" until every box is checked.

### Conventions (every component)

- [ ] Uses `'use client'` directive at the top of the file
- [ ] Uses `forwardRef` wrapping the render function
- [ ] Extends `ComponentPropsWithoutRef<'element'>` for the props interface
- [ ] Uses `cn()` from `@/utils/cn` for class merging
- [ ] Imports CSS module (`import styles from './Component.module.css'`)
- [ ] All styling uses `var(--azimuth-*)` CSS custom properties (no hardcoded colors/radii/spacing)
- [ ] Sets `displayName` after the component
- [ ] Named export only (no `export default`)
- [ ] Has a barrel `index.ts` re-exporting the component and its types
- [ ] Registered in `src/index.ts` (barrel export with type exports)

### Files required

- [ ] `ComponentName.tsx` — the component implementation
- [ ] `ComponentName.module.css` — scoped styles using `var(--azimuth-*)` tokens
- [ ] `index.ts` — barrel export
- [ ] `ComponentName.test.tsx` — test file

### Accessibility (WCAG 2.2 AA)

- [ ] All interactive elements are keyboard accessible (Tab + Enter/Space)
- [ ] Appropriate ARIA roles on custom interactive elements
- [ ] `aria-label` or visible label on all inputs and interactive controls
- [ ] `aria-expanded` on disclosure triggers (dropdowns, accordions, toggles)
- [ ] `aria-live` regions for content that updates dynamically (toasts, chat, file lists)
- [ ] Focus management in modals/drawers/dialogs (trap focus, restore on close)
- [ ] `:focus-visible` styles present on all interactive elements
- [ ] Color is never the sole indicator of meaning (add icon/text/pattern)
- [ ] Text contrast meets 4.5:1 (normal text) / 3:1 (large text) against background

### Impeccable (UI quality)

- [ ] No emojis as UI elements (use text, CSS shapes, or SVG icons)
- [ ] No inline styles unless genuinely dynamic (prefer CSS module classes)
- [ ] No gradient text
- [ ] No glassmorphism as default
- [ ] No side-stripe borders (border-left/right > 1px as colored accent)
- [ ] No hero-metric template (big number + small label + gradient)
- [ ] No identical card grids without variation
- [ ] Typography: hierarchy via scale + weight contrast (≥1.25 ratio between steps)
- [ ] Layout: vary spacing for rhythm — don't use the same padding everywhere
- [ ] Consistent sizing: adjacent elements (e.g. Input + Button) should have equal heights

### Documentation

- [ ] JSDoc on all props with `@default` where applicable
- [ ] Component-level JSDoc if the component behavior is non-obvious
- [ ] Listed in `demo/component-data.ts` with accurate props, types, CSS vars, features, variants
- [ ] Has a preview in `demo/ComponentsPage.tsx`
- [ ] Has a playground template in `demo/Playground.tsx`
- [ ] Listed in `demo/componentMap.ts`
- [ ] Listed in `README.md` component catalog
- [ ] README component count is up to date

### Tests

- [ ] Renders without crashing (basic smoke test)
- [ ] Renders with default props
- [ ] Test each visual variant (if applicable)
- [ ] Test each size variant (if applicable)
- [ ] Test disabled state (if applicable)
- [ ] Test error state (if applicable)
- [ ] Test empty state (if applicable)
- [ ] Test callback props fire correctly (onChange, onSelect, onClick)
- [ ] Test keyboard interaction (if interactive)
- [ ] Test aria attributes are present (if interactive)
- [ ] Use `@testing-library/react` and `userEvent` for interaction tests
- [ ] Use `vi.fn()` for mock callbacks
- [ ] Follow existing test patterns in the codebase

### Dependencies

- [ ] Zero external runtime dependencies — only React
- [ ] No npm packages unless absolutely essential and approved
- [ ] If a feature requires an external library, flag it before implementing

## Theme System Gotchas

- `DEFAULT_THEME` colors **must** use OKLCH format (e.g. `oklch(50% 0.10 185)`) — hex values break `makeSubtle()` and `darken()`
- `makeSubtle(color, isDark)` — pass `true` for dark mode accent/primary, `false` for light
- Do NOT set color CSS variables via inline style (`element.style.setProperty`) — inline styles have higher specificity than `[data-theme="dark"]` selectors and will block dark mode. Use injected `<style>` elements instead
- `useThemeMode()` for programmatic theme toggling — `useTheme()` only reads current tokens

## Demo Page Conventions

- The demo is a stress-test for every component — exercise all variants and states
- No hotfixes in the demo — if a component-level behavior is needed, add it to the library
- Use `useToast()` (not manual toast state) for toast notifications
- Mock data lives in `demo/mock-data.ts`
- Component documentation lives in `demo/component-data.ts` (alphabetically sorted)
- Component import map lives in `demo/componentMap.ts`

## Responsive Design

Every component must work correctly across these viewport ranges:

| Label | Width | Examples |
|-------|-------|----------|
| Small phone | 320px | iPhone SE, small Android |
| Large phone | 414px | iPhone 16 Pro, Pixel |
| Tablet | 768px | iPad portrait |
| Small desktop | 1024px | Laptop, iPad landscape |
| Large desktop | 1440px+ | External monitor |

**Checklist for every component:**
- [ ] Does not overflow horizontally at 320px width
- [ ] Text does not truncate in unintended ways on small screens
- [ ] Interactive elements have adequate touch targets (≥44px per WCAG 2.5.5)
- [ ] Modals/drawers fit within the viewport without scrolling the body
- [ ] Uses relative units (`rem`, `%`, `vw`) over fixed `px` where possible
- [ ] Uses media queries in CSS module files for layout breakpoints
- [ ] Supports `env(safe-area-inset-*)` for notched devices (bottom bars, side panels)
- [ ] Navbar: supports `mobilePosition='bottom'` for iOS-style tab bar layout
- [ ] Grid: supports responsive `cols` object syntax (`{ base: 1, md: 2 }`)

## Cross-Browser Compatibility

Supported browsers: Chrome, Firefox, Safari, Edge (latest 2 versions each)

**Checklist for every component:**
- [ ] No Chrome-only CSS features without fallback
- [ ] CSS custom properties (`var()`) have fallback values for older browsers
- [ ] `@supports` guards for OKLCH-dependent styles (see `tokens.css`)
- [ ] Flexbox and grid used — no float-based layouts
- [ ] `:focus-visible` works across all browsers
- [ ] Touch events work on mobile Safari
- [ ] `appearance: none` used for custom form control styling
- [ ] `user-select: none` used only where appropriate

## Known Gaps

- **LoginSignup** uses raw `<input>` elements instead of Azimuth's `Input` — refactoring this changes its internal form contract. Deferred.
- **No responsive font scaling** — font sizes don't adapt to viewport. Deferred.
- **No cascading theme config** — nested ThemeProviders replace rather than merge. Deferred.
- **npm audit** shows 8 moderate vulnerabilities in dev dependencies (esbuild/vite/storybook) — all dev-only, no runtime impact. Monitor for fixes.

## Reference: Component File Structure

```
src/components/ComponentName/
├── ComponentName.tsx      # Component (use client, forwardRef, cn(), CSS module)
├── ComponentName.module.css  # Styles (var(--azimuth-*) only)
├── index.ts                # Barrel export
└── ComponentName.test.tsx   # Tests (describe/it/expect + testing-library)
```
