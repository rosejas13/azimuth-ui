# Azimuth UI — Philosophy

## 1. Configurable Consistency

One ThemeProvider config controls every component. Change `borderRadius` once and all
buttons, inputs, cards, modals, and dropdowns follow. No component has its own radius
opinion. This applies to every themable property:

- `accentColor` — accent-colored elements site-wide
- `borderRadius` — from `'none'` (square) to `'full'` (circles)
- `flat` — toggle all shadows on/off
- `spacing` — `'compact'`, `'normal'`, or `'spacious'` density
- `motion` — `'snappy'`, `'smooth'`, or `'reduced'` animation personality
- `mode` — `'light'`, `'dark'`, or `'system'`

The consumer writes one config and every component obeys. No prop drilling.
No per-component theme overrides (use `className`/`style` for edge cases).

## 2. CSS-First Theming

All styling is driven by CSS custom properties prefixed `--azimuth-*`. Components
never hard-code color values, spacing, radii, fonts, or transitions. This means:

- Consumers can override anything with plain CSS on `:root` or a wrapper
- No CSS-in-JS runtime cost
- Animations are `@keyframes` + CSS transitions — no JS-driven animation library
- The library ships a single `styles.css` with tokens, reset, and animations

## 3. Accessibility by Default

WCAG 2.2 AA is a baseline, not an aspiration. Every component ships with:

- Proper ARIA roles (`role="dialog"`, `role="tablist"`, `role="alert"`, etc.)
- Keyboard navigation (Arrow keys, Enter, Escape, Home/End, Tab)
- Focus management (focus traps in modals, auto-focus on open)
- Screen reader text (aria-label, aria-describedby, aria-live regions)
- Visible focus indicators (`:focus-visible` outlines)
- `prefers-reduced-motion` respected for all animations

Accessibility is never opt-in. If a component can't be made accessible, it doesn't ship.

## 4. Snappy, Deliberate Motion

Animations are quick (150–400ms) with personality. The default easing curve is
`cubic-bezier(0.16, 1, 0.3, 1)` — an ease-out with a subtle overshoot feel that
makes interactions feel responsive without being distracting.

- Entry animations use `azimuth-scale-in` or `azimuth-slide-in-*` keyframes
- Hover/active states use `var(--azimuth-transition-fast)` transitions
- The bounce animation (`azimuth-bounce-in`) adds personality to expanding menus
  and the toggle switch uses a distinct `cubic-bezier(0.34, 1.56, 0.64, 1)` curve
  for a satisfying switch-flip feel
- All motion is disabled when `prefers-reduced-motion: reduce` is set or when
  `animations: false` in the ThemeConfig

## 5. TypeScript Strict, Everywhere

- `strict: true` with `noUnusedLocals` and `noUnusedParameters`
- Every component uses `forwardRef` with proper generic typing
- Props extend `ComponentPropsWithoutRef<'element'>` so every standard HTML
  attribute passes through (including `className`, `style`, `aria-*`, `data-*`)
- No `any` types in public APIs
- `displayName` set on all `forwardRef` components for React DevTools

## 6. Zero Lock-In

- **CSS Modules** compiled to vanilla CSS at build time — no runtime CSS-in-JS
- **Tree-shakeable** — import only the components you use; unused components are
  stripped at build time
- **Framework agnostic** — works in Next.js (App Router), Vite, CRA, or any React 18/19 setup
- **No bundled React** — `react` and `react-dom` are peer dependencies
- **No CSS framework dependency** — no Tailwind, Bootstrap, or other CSS library required

## 7. Consumer Can Override Everything

Every component accepts `className` and `style` as first-class props (via
`ComponentPropsWithoutRef` passthrough). The `cn()` utility merges internal
CSS Module classes with the consumer's `className`. No component prevents
customization.

CSS custom properties can be overridden anywhere in the consumer's stylesheet:

```css
.my-app {
  --azimuth-radius: 0px;
  --azimuth-color-primary: oklch(50% 0.2 280);
}
```

## 8. Component Cohesion

Components should compose well together without tight coupling:

- `Form.Field` works with any form element (Input, Select, TextArea, etc.)
- `Card` accepts any content in header/body/footer
- `Modal`, `Drawer`, `SlideSheet` share the same overlay + portal pattern
- `Button` accepts any React node as `icon` (not locked to a specific icon library)
- `DataTable` accepts generic typed data and custom cell renderers

## 9. Sensible Defaults, Not Opinionated Ones

The library looks good out of the box with zero configuration. The default theme uses:
- OKLCH teal as primary, warm coral as accent
- Sora for display/headings, Onest for body text
- Fluid typography with `clamp()`
- 8px border radius (`md`)
- Shadows on, snappy motion

But every default can be changed. No design opinion is forced.

## 10. Security

Components handle user input safely:
- No `dangerouslySetInnerHTML` in component implementations
- Content rendered via React children, not raw HTML strings
- XSS-safe by default (React's JSX escaping)
- No secrets, tokens, or credentials in component code
