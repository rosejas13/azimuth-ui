# Azimuth UI

[![version](https://img.shields.io/npm/v/azimuth-ui?style=flat-square)](https://www.npmjs.com/package/azimuth-ui)
[![license](https://img.shields.io/github/license/rosejas13/azimuth-ui?style=flat-square)](LICENSE)

A configurable, accessible React component library. Theme-driven via a single `<ThemeProvider>` with CSS custom properties. Configure colors, border radius, shadows, spacing density, animations, fonts, and dark mode — every component responds instantly.

```bash
npm install azimuth-ui react react-dom
```

```tsx
import {
  ThemeProvider,
  Button,
  Card,
  Text,
  Input,
  Modal,
  Chat,
} from 'azimuth-ui';
import 'azimuth-ui/styles.css';

function App() {
  return (
    <ThemeProvider
      config={{ accentColor: 'oklch(60% 0.15 30)', borderRadius: 'md' }}
    >
      <Button variant="primary">Get Started</Button>
      <Input label="Email" type="email" />
      <Card header={<Text weight="semibold">Title</Text>}>Content here</Card>
    </ThemeProvider>
  );
}
```

## Features

- **109 components**: 14 data, 46 display, 19 input, 8 layout, 5 navigation, 8 overlay, 9 sections
- **860 SVG icons**: Tree-shakeable React icon components (Font Awesome subset, regular + brands)
- **ThemeProvider**: Single config controls every component's appearance
- **CSS custom properties**: All styling via `--azimuth-*` tokens
- **Dark mode**: Built-in light/dark/system mode with `useThemeMode()` hook
- **Accessibility**: WCAG 2.2 AA baseline — ARIA roles, keyboard navigation, focus management, screen reader support
- **Tree-shakeable**: Import only what you use
- **TypeScript**: Full type safety with strict mode
- **Zero CSS runtime**: CSS Modules compiled to vanilla CSS
- **Animation**: Snappy easing with `prefers-reduced-motion` support
- **MIT licensed**: Free for personal and commercial use
- **Playground**: Interactive code sandbox with `React.createElement` evaluation for every component
- **Color presets**: 10 built-in color schemes (Ocean, Midnight, Forest, etc.)
- **Style presets**: 8 style presets (Balanced, Minimal, Bold, etc.)
- **OKLCH color space**: Perceptually uniform color manipulation with hex fallback
- **Zero external dependencies**: Pure React + CSS Modules

## Components

All 109 components live under `src/components/` grouped by category.

### Input (19)

`AddressInput` `Button` `Checkbox` `Combobox` `DropdownList` `FileUpload` `Form` `Input` `InputGroup` `OTPInput` `PhoneInput` `QuantityStepper` `Radio` `Rating` `SearchBar` `Select` `Slider` `TextArea` `TextBox` `Toggle`

### Display (46)

`Accordion` `ActivityFeed` `Alert` `AspectRatio` `Avatar` `Badge` `Card` `Carousel` `Chat` `Chip` `Clock` `CodeBlock` `Cursor` `DescriptionList` `EmptyState` `ErrorBoundary` `ErrorPage` `FanMenu` `Icon` `IconButton` `ImageViewer` `InfoButton` `Kbd` `KPICard` `Loader` `LoginSignup` `MapDisplay` `MediaPlayer` `Meter` `NotificationBadge` `PageLayout` `PriceDisplay` `ProductCard` `ProgressBar` `ProgressSteps` `ResizablePanel` `ScrollArea` `SectionView` `SegmentedButton` `Skeleton` `SkipLink` `SplitButton` `Tag` `Text` `Toast` `VisuallyHidden`

### Data (14)

`Calendar` `ColorPicker` `DataFilterBar` `DataTable` `DatePicker` `DateRangePicker` `DateTimePicker` `DiffViewer` `List` `Pagination` `SimpleChart` `Table` `Timeline` `TreeList`

### Layout (8)

`Box` `Column` `Container` `Divider` `Grid` `Row` `Spacer` `Stack`

### Navigation (5)

`BreadcrumbPageHeader` `Breadcrumbs` `Menu` `Navbar` `Tabs`

### Overlay (8)

`CommandPalette` `Dialog` `Drawer` `Flyout` `Modal` `Sidebar` `SlideSheet` `Tooltip`

### Sections (9)

`Hero` `FeaturesGrid` `PricingTable` `Testimonials` `CTABanner` `ContactSection` `TeamSection` `Footer` `StatsSection`

## Icons

Azimuth UI ships 860 tree-shakeable SVG icons (273 regular + 587 brands) as typed React components. Each icon is a `forwardRef` SVG element that inherits `currentColor` and accepts all standard SVG attributes.

```tsx
import { Icon } from 'azimuth-ui';
import { SearchIcon, BellIcon, GithubIcon } from 'azimuth-ui/icons';

// With Icon wrapper
<Icon size="lg"><SearchIcon width={20} height={20} /></Icon>

// With IconButton
<IconButton icon={<BellIcon width={16} height={16} />} aria-label="Notifications" />

// Direct use
<SearchIcon width={24} height={24} className="my-icon" />
```

Icons are auto-generated from Font Awesome Free SVGs via `scripts/generate-icons.mjs`.

## Quick Start

```bash
npm install azimuth-ui react react-dom
```

```tsx
// Wrap your app
import { ThemeProvider } from 'azimuth-ui';
import 'azimuth-ui/styles.css';

<ThemeProvider config={{ borderRadius: 'md', motion: 'snappy' }}>
  <App />
</ThemeProvider>;
```

### A form with an address field

```tsx
import { useState } from 'react';
import { AddressInput, Form, ThemeProvider } from 'azimuth-ui';
import type { AddressSuggestion, AddressValue } from 'azimuth-ui';
import 'azimuth-ui/styles.css';

function SignupForm() {
  const [address, setAddress] = useState<AddressValue | undefined>();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);

  // Debounced lookup against YOUR geocoding service (any debounce helper works).
  // azimuth ships no geocoding client — you pick the service and own its
  // attribution/terms. Do NOT point this at the public
  // nominatim.openstreetmap.org endpoint: its usage policy forbids
  // autocomplete and caps at 1 request/second across all your users.
  // Use a self-hosted Nominatim instance, Photon, or a commercial provider.
  const onSearch = useDebouncedCallback( // 300ms debounce wrapper of your choice
    async (query: string) => {
      const results = await myGeocoder.search(query); // YOUR service
      setSuggestions(
        results.map((r) => ({ label: r.formatted, value: r.address })),
      );
    },
    300,
  );

  return (
    <Form labelPosition="left">
      <AddressInput
        layout="single"                    // or "multi" for structured fields
        label="Business address"
        required
        value={address}
        onChange={setAddress}
        onSearch={onSearch}
        suggestions={{ options: suggestions }}
      />
    </Form>
  );
}
```

`<Form>` sets `size`/`labelPosition` once for every field inside it; any field can still override. `AddressInput` always produces a structured value — `{ line1, line2?, city, state, postalCode, country }` — in either layout.

### Input labels and sizes

Inputs follow flat prop conventions: `label`, `subtitle`, `error`, `required`, `value`, `onChange` at the top level, with `onChange` receiving the raw value.

```tsx
// Plain string label — the common case
<Input label="Email" value={email} onChange={setEmail} />

// Structured label when you need more inline
<Input
  label={{ text: 'Work email', subtitle: 'Use your company address.', required: true }}
/>

// Label positions: 'top' (default), 'left', or 'inner'
<Input label="Search" labelPosition="inner" placeholder="Type here" />

// Sizes: 'sm' | 'md' | 'lg' | 'xl'. xl pairs with inner for a label inside the box.
<Form size="xl" labelPosition="inner">
  <Input label="Project name" />
</Form>
```

With `labelPosition="inner"` the label renders inside the field box at the top-left — small and muted so it reads as a field caption distinct from the input text. The character counter (when `showCharCount`) follows it into the box.

### Raw layout primitives

`Row`, `Column`, `Box`, and `Spacer` are raw building blocks alongside `Stack`/`Grid`. `Row` is context-aware: anywhere it is a wrapping flex row with a token gap, but inside a `<Form>` its children share width evenly, align by their input boxes, and wrap on narrow screens.

```tsx
// Anywhere: a wrapping flex row
<Row gap="md">
  <Button>Cancel</Button>
  <Button variant="primary">Save</Button>
</Row>

// Inside Form: fields in a shared row that collapses on mobile
<Form>
  <Row>
    <Input label="City" />
    <Input label="State" />
    <Input label="ZIP" />
  </Row>
</Form>

// Column is the vertical counterpart; Box is an unstyled surface with opt-in
// token-driven padding/border/radius/background/shadow; Spacer fills free space.
<Box border radius="md" background="surface" padding="lg" shadow="sm">
  <Stack direction="horizontal" justify="between">
    <Text weight="semibold">Storage</Text>
    <Spacer />
    <Meter value={82} low={20} high={80} showValue />
  </Stack>
</Box>
```

Choosing between them: `Stack`/`Grid` for content flow and responsive column layouts; `Row`/`Column` when you want the HTML mental model or form-row behavior; `Box` when `Card` carries too much opinion. Using them interchangeably is harmless — tree-shaking drops whatever you don't import. `DescriptionList` pairs semantic terms with descriptions (settings pages, spec sheets), and `Meter` renders a value within a known range (`role="meter"`) with threshold tones.

## Theme Config

```ts
interface ThemeConfig {
  accentColor?: string; // 'oklch(60% 0.15 30)', '#e8734a', etc.
  primaryColor?: string; // Brand color
  darkPrimaryColor?: string; // Override for dark mode
  darkAccentColor?: string; // Override for dark mode
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  flat?: boolean; // true = no shadows
  elevation?: 'flat' | 'raised' | 'floating';
  spacing?: 'compact' | 'normal' | 'spacious';
  animations?: boolean;
  motion?: 'snappy' | 'smooth' | 'reduced';
  mode?: 'light' | 'dark' | 'system';
  fontDisplay?: string;
  fontBody?: string;
}
```

## Overriding tokens from your own CSS

`<ThemeProvider>` is the primary way to theme Azimuth, but you can override any
`--azimuth-*` token directly from your own stylesheet. All of Azimuth's tokens —
the base defaults (`tokens.css`) and everything `ThemeProvider` emits at runtime —
live in the `azimuth` [CSS cascade layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer).

Any CSS you write **outside a layer** beats Azimuth regardless of specificity or
stylesheet load order — no `!important`, no imperative `style.setProperty`, no
selector-specificity tricks:

```css
/* your stylesheet — wins over every --azimuth-* token */
:root {
  --azimuth-radius-md: 2px;
  --azimuth-space-md: 0.75rem;
  --azimuth-color-primary: oklch(55% 0.15 250);
  --azimuth-shadow-lg: none;
}
```

Scope overrides to a subtree by targeting any ancestor instead of `:root`:

```css
.marketing-page {
  --azimuth-radius-md: 16px;
}
```

> Requires a browser with CSS cascade layer support (Chrome/Edge 99+, Firefox 97+,
> Safari 15.4+ — all shipped in 2022). In older engines the layered token rules are
> ignored entirely; use `ThemeProvider` config for those consumers.

## Color Presets

10 preset color schemes available via `COLOR_PRESETS`:

`ocean` `midnight` `forest` `sunset` `plum` `slate` `rose` `cyber` `amber` `mint`

```tsx
import { ThemeProvider, COLOR_PRESETS } from 'azimuth-ui';

<ThemeProvider config={COLOR_PRESETS.ocean.config}>
  <App />
</ThemeProvider>;
```

## Development

```bash
git clone https://github.com/rosejas13/azimuth-ui.git
cd azimuth-ui
npm install
npm run test          # vitest unit suite
npm run test:a11y     # Playwright + axe-core a11y tests (starts Storybook)
npm run ci            # Full pipeline: lint → typecheck → test → build → a11y
npm run typecheck     # Strict TypeScript
npm run demo          # Component showcase with live playground
npm run lint          # ESLint (zero-error)
```

## Contributing

Contributions welcome. See `tasks/LESSONS.md` for project conventions, and the system AGENTS.md for AI agent instructions. Before submitting a PR:

- All tests pass (`npm run test`)
- TypeScript compiles without errors (`npm run typecheck`)
- Build succeeds (`npm run build`)
- New components include tests and follow the checklist in `tasks/LESSONS.md`

## License

MIT — see [LICENSE](LICENSE) for details.
