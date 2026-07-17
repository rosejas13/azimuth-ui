# Product

## Register

product

## Users

The primary user is the project author, building UI components for portfolio projects and future applications. Secondary users are open-source consumers who install `azimuth-ui` via npm — developers building React apps who want a configurable, accessible component library without locking into a heavy framework or CSS-in-JS runtime.

## Product Purpose

A configurable, accessible React component library themed entirely through CSS custom properties (`--azimuth-*`). Zero CSS runtime, zero external dependencies (except `@tanstack/react-virtual` for DataTable virtualization), tree-shakeable individual imports, WCAG 2.2 AA compliant by default. A single `<ThemeProvider>` config controls every component — no per-component theme overrides. Style presets and color presets let consumers switch the entire look with a single prop. Built to serve as the shared UI foundation for every project the author builds.

## Brand Personality

**Minimal — Polished — Reliable**

The library should feel thoughtfully edited: nothing unnecessary, every detail intentional. Polished means it passes the hover test, the focus test, the reduced-motion test, the mobile test before anyone asks. Reliable means it works the same way in every framework, never breaks on upgrade, and the types are always correct.

## Anti-references

Two categories to avoid:

**Bloated UI libraries** (MUI, Ant Design, Chakra): heavy bundle, runtime theming, convoluted APIs, hard to override, opinionated look that's hard to escape. If a decision would make azimuth-ui feel like one of these, it's wrong.

**Generic SaaS-cream / enterprise-bootstrap**: neutral everything, low-contrast grays, bloated card patterns, hero-metric templates, side-stripe borders, identical card grids. Avoid the B2B SaaS visual cliché entirely.

## Design Principles

1. **Accessibility by Default** — WCAG 2.2 AA is the baseline, never opt-in. Every component ships with correct ARIA roles, keyboard navigation, focus management, and screen reader support. No `dangerouslySetInnerHTML`.
2. **CSS-First Theming** — All styling flows through `--azimuth-*` custom properties. One `ThemeProvider`, no per-component overrides. Consumers own their theme entirely through CSS — no runtime, no lock-in.
3. **Configurable Consistency** — Color presets (10) and style presets (8) change the entire system with one prop. Sensible defaults out of the box, everything overridable through `className` and `style` on every component.
4. **Zero Lock-In** — No CSS framework dependency, no CSS-in-JS runtime. Pure React + CSS Modules compiled to vanilla CSS. Works in any React 18/19 setup (Next.js App Router, Vite, CRA). Consumer can walk away at any time with zero migration cost.
5. **Snappy, Deliberate Motion** — 150–400ms transitions with `cubic-bezier(0.16, 1, 0.3, 1)` easing. Layout properties are never animated. `prefers-reduced-motion` respected everywhere. Nothing decorative, nothing slow.

## Accessibility & Inclusion

WCAG 2.2 AA is a hard requirement — every component targets it from day one, not as an audit afterthought. `:focus-visible` for keyboard users, `prefers-reduced-motion` for motion sensitivity, proper color contrast ratio, screen-reader-accessible labels via `VisuallyHidden` or ARIA attributes.
