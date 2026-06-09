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

- **104 components**: 13 data, 48 display, 21 input, 4 layout, 5 navigation, 8 overlay, 9 sections
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

All 104 components live under `src/components/` grouped by category.

### Input (17)

`Button` `Checkbox` `Combobox` `DropdownList` `FileUpload` `Form` `Input` `InputGroup` `OTPInput` `Radio` `Rating` `SearchBar` `Select` `Slider` `TextArea` `TextBox` `Toggle`

### Display (35)

`Accordion` `Alert` `Avatar` `Badge` `Card` `Carousel` `Chat` `Chip` `Clock` `CodeBlock` `Cursor` `EmptyState` `ErrorPage` `FanMenu` `Icon` `IconButton` `ImageViewer` `InfoButton` `Kbd` `Loader` `LoginSignup` `MapDisplay` `MediaPlayer` `NotificationBadge` `PageLayout` `ProgressBar` `ResizablePanel` `SectionView` `SegmentedButton` `Skeleton` `SplitButton` `Tag` `Text` `Toast` `VisuallyHidden`

### Data (12)

`Calendar` `ColorPicker` `DataTable` `DateRangePicker` `DateTimePicker` `DiffViewer` `List` `Pagination` `SimpleChart` `Table` `Timeline` `TreeList`

### Layout (4)

`Container` `Divider` `Grid` `Stack`

### Navigation (5)

`BreadcrumbPageHeader` `Breadcrumbs` `Menu` `Navbar` `Tabs`

### Overlay (8)

`CommandPalette` `Dialog` `Drawer` `Flyout` `Modal` `Sidebar` `SlideSheet` `Tooltip`

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
npm run test          # 1413 tests across 110 files
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
