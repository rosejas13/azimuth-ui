# Azimuth-UI Gap Analysis (Audited)

> Goal: A comprehensive React component library covering UI patterns for business apps, marketing sites, portfolios, client portals, booking pages, storefronts, and more.

---

## Existing Strength (81 components)

Input (17), Display (35), Data (12), Layout (4), Navigation (5), Overlay (8) — plus theme system with OKLCH color tokens, 860 icons, hooks, Toast system, CSS animations, dark mode, WCAG 2.2 AA baseline.

## Overlap Audit Results

Before listing gaps, I audited every proposed addition against existing components. Results:

| Proposed | Actually Exists As | Verdict |
|----------|-------------------|---------|
| Popover | `Flyout` + `InfoButton` — both do popover | ✅ Already covered |
| HoverCard | `Flyout` — hover-triggered rich card | ✅ Already covered |
| Autocomplete | `Combobox`, `Input.autocomplete`, `SearchBar` | ✅ Already covered |
| Switch | `Toggle` with `role="switch"` | ✅ Already covered |
| Collapsible | `SectionView` (standalone), `Accordion` (group) | ✅ Already covered |
| DatePicker | No standalone input-trigger variant, but `DateRangePicker` has the popup calendar pattern | ⚠️ Partial — single-date input-trigger variant could be added |
| ContextMenu | `Menu` — close but lacks right-click trigger | ⚠️ Add right-click mode to Menu |
| RadioGroup | `SegmentedButton` implements radiogroup pattern | ⚠️ Add standalone RadioGroup wrapping `<input type="radio">` |

## Genuine Gaps

### 🎯 Phase 1: Common Primitives (high frequency)

| Component | Why |
|-----------|-----|
| **ScrollArea** | Custom scrollbar styling for cross-browser consistency |
| **AspectRatio** | Maintain media aspect ratio (16:9, 4:3, 1:1) |
| **SkipLink** | Skip-to-content for keyboard users |

### 📈 Phase 2: Marketing Site Sections (for client sites)

| Component | Why |
|-----------|-----|
| **Hero** | Full-width hero with headline, subtitle, CTA, optional media |
| **FeaturesGrid** | Feature showcase grid with icons, titles, descriptions |
| **PricingTable** | Tiered pricing cards with feature comparison |
| **Testimonials** | Customer quote carousel/rotator |
| **CTABanner** | Call-to-action strip |
| **ContactSection** | Contact form layout with optional info |
| **TeamSection** | Team member cards grid |
| **Footer** | Multi-column site footer |
| **StatsSection** | Number/metric showcase |

### ⚡ Phase 3: Form & Data (for business apps)

| Component | Why |
|-----------|-----|
| **Form validation hooks** | Declarative validation with zod in `Form` component |
| **PhoneInput** | International phone with country selector |

### 🧩 Phase 4: App Patterns (for portals & admin)

| Component | Why |
|-----------|-----|
| **ProgressSteps** | Multi-step wizard indicator |
| **DataFilterBar** | Filter/sort controls for data tables |
| **KPICard** | Metric display with trend |
| **ErrorBoundary** | React error boundary with fallback |
| **ActivityFeed** | Scoped timeline for dashboards |

### 🖼 Phase 5: Storefront & Booking

| Component | Why |
|-----------|-----|
| **ProductCard** | Product display with image, title, price, rating |
| **QuantityStepper** | +/- quantity selector |
| **PriceDisplay** | Price with currency, sale, strikethrough |

## Small Enhancements to Existing Components

These aren't new components but additions to existing ones:
- **ContextMenu on `Menu`**: Add `trigger: "click" | "context"` prop (default `"click"`)
- **Single-date `DatePicker` input-trigger**: Extract from DateRangePicker pattern

## Non-Goals

Routing, data fetching, state management, icons, rich text editor — leave to consumer.

## Quality Requirements (all additions)

- Tests (unit + component): vitest
- Storybook stories: CSF 3 with variants
- JSDoc on public types and component functions
- WCAG 2.2 AA: keyboard nav, ARIA roles, focus management, screen reader
- CSS Modules + tokens where applicable
- `forwardRef` + `'use client'`
- Design review via `impeccable` skill

