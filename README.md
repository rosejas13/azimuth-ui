# Azimuth UI

A configurable, accessible React component library. Theme-driven via a single `<ThemeProvider>` with CSS custom properties. Configure border radius, flatness, accent color, spacing density, animations, and dark mode — every component responds instantly.

```bash
npm install @azimuth/ui
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

- **24 components**: Button, Text, Input, Select, Checkbox, Radio, Toggle, Card, Modal, Dialog, Drawer, SlideSheet, Alert, Toast, Badge, Tag, Avatar, Loader, ProgressBar, Tooltip, Navbar, Tabs, Breadcrumbs, Pagination, DropdownList, DataTable, Form, Menu, SearchBar, Slider, and more
- **ThemeProvider**: Single config controls every component's appearance
- **CSS custom properties**: All styling via `--azimuth-*` tokens
- **Dark mode**: Built-in light/dark/system mode support
- **Accessibility**: WCAG 2.2 AA, ARIA roles, keyboard navigation, screen reader support
- **Tree-shakeable**: Import only what you use
- **TypeScript**: Full type safety with strict mode
- **Zero CSS runtime**: CSS Modules compiled to vanilla CSS
- **Animation**: Snappy easing with `prefers-reduced-motion` support

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
git clone git@github.com:you/azimuth-ui.git
cd azimuth-ui
npm install
npm run test          # 381 tests
npm run typecheck     # Strict TypeScript
npm run demo          # Component showcase
```

## License

MIT
