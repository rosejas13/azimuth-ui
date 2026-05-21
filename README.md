# Azimuth UI

[![version](https://img.shields.io/npm/v/@azimuth/ui?style=flat-square)](https://www.npmjs.com/package/@azimuth/ui)
[![license](https://img.shields.io/github/license/rosejas13/azimuth-ui?style=flat-square)](LICENSE)

A configurable, accessible React component library. Theme-driven via a single `<ThemeProvider>` with CSS custom properties. Configure border radius, flatness, accent color, spacing density, animations, and dark mode — every component responds instantly.

```bash
npm install @azimuth/ui react react-dom
```

```tsx
import { ThemeProvider, Button, Text, Card, Input, Modal } from '@azimuth/ui';
import '@azimuth/ui/styles.css';

function App() {
  return (
    <ThemeProvider config={{ accentColor: '#e8734a', borderRadius: 'full' }}>
      <Button variant="primary">Get Started</Button>
      <Input label="Email" type="email" />
      <Card header={<Text weight="semibold">Title</Text>}>
        Content here
      </Card>
    </ThemeProvider>
  );
}
```

## Features

- **58 components**: Primitives, layout utilities, and full-featured UI components
- **ThemeProvider**: Single config controls every component's appearance
- **CSS custom properties**: All styling via `--azimuth-*` tokens
- **Dark mode**: Built-in light/dark/system mode support
- **Accessibility**: WCAG 2.2 AA, ARIA roles, keyboard navigation, screen reader support
- **Tree-shakeable**: Import only what you use
- **TypeScript**: Full type safety with strict mode
- **Zero CSS runtime**: CSS Modules compiled to vanilla CSS
- **Animation**: Snappy easing with `prefers-reduced-motion` support

## Components

### Primitives (8)

`Button` `Checkbox` `Icon` `Input` `Radio` `Select` `Text` `Toggle`

### Layout (4)

`Container` `Divider` `Grid` `Stack`

### Components (48)

`Alert` `Avatar` `Badge` `Breadcrumbs` `Calendar` `Card` `Carousel` `Chat` `Chip` `CodeBlock` `Cursor` `DataTable` `DateRangePicker` `DateTimePicker` `Dialog` `Drawer` `DropdownList` `EmptyState` `FanMenu` `FileUpload` `Flyout` `Form` `InputGroup` `Kbd` `List` `Loader` `LoginSignup` `Menu` `Modal` `Navbar` `PageLayout` `Pagination` `ProgressBar` `ResizablePanel` `SearchBar` `SectionView` `SegmentedButton` `Skeleton` `Slider` `SlideSheet` `Table` `Tabs` `Tag` `TextArea` `TextBox` `Toast` `Tooltip` `TreeList` `VisuallyHidden`

## Quick Start

```bash
npm install @azimuth/ui react react-dom
```

```tsx
// Wrap your app
import { ThemeProvider } from '@azimuth/ui';
import '@azimuth/ui/styles.css';

<ThemeProvider config={{ borderRadius: 'md', motion: 'snappy' }}>
  <App />
</ThemeProvider>
```

## Theme Config

```ts
interface ThemeConfig {
  accentColor?: string;        // '#e8734a', 'oklch(...)', etc.
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  flat?: boolean;              // true = flat design (no shadows)
  spacing?: 'compact' | 'normal' | 'spacious';
  animations?: boolean;
  motion?: 'snappy' | 'smooth' | 'reduced';
  mode?: 'light' | 'dark' | 'system';
  fontDisplay?: string;
  fontBody?: string;
}
```

## Development

```bash
git clone https://github.com/rosejas13/azimuth-ui.git
cd azimuth-ui
npm install
npm run test          # 619 tests
npm run typecheck     # Strict TypeScript
npm run demo          # Component showcase
```

## Contributing

Contributions are welcome. Please follow the coding conventions outlined in `AGENTS.md`. Before submitting a PR, ensure:

- All existing tests pass (`npm run test`)
- TypeScript compiles without errors (`npm run typecheck`)
- The build succeeds (`npm run build`)
- New components include tests and follow existing patterns

## License

Dual-licensed: **AGPL v3** (free, with conditions) or **Commercial License** (paid, no restrictions).

- **Personal / open-source projects**: Use under AGPL v3. Free, but your project must also be AGPL v3.
- **Commercial / proprietary use**: Requires a commercial license. Contact licenses@azimuth.dev for pricing.

See [LICENSE](LICENSE) for details.
