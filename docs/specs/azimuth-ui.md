# Spec: Azimuth — Component Library

## Objective

Build a production-quality React component library (`azimuth-ui`) with a configurable theme system. A single `<ThemeProvider>` config drives every component's appearance — border radius (square to circles), flatness (3D shadows or flat), accent color, spacing density, animation personality, and more. Designed as a standalone open-source repository.

### Users

1. **Me (primary)** — building Portfolio and future projects
2. **Open-source consumers** — public package on npm

### Success looks like

- A single `<ThemeProvider config={{ accentColor, borderRadius, flat, spacing }}>` controls every component
- Components can be individually imported (tree-shakeable)
- All components pass WCAG 2.2 AA
- 100% test coverage on utils/hooks, 90%+ on components
- Storybook with live examples for every component
- Works in Next.js 15 (App Router), Vite, and generic React 19 apps

---

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | React 19 | Latest stable, match Portfolio |
| Language | TypeScript 5.6+ (strict) | Type safety, match existing conventions |
| CSS | CSS Modules compiled to scoped vanilla CSS | No runtime cost, no framework lock-in |
| Build | tsup (esbuild) | Fast, handles CSS, ESM+CJS, declarations |
| Test (unit) | Vitest 2.x + Testing Library | Match Portfolio tooling |
| Test (a11y) | Playwright + axe-core | WCAG 2.2 AA verification |
| Docs | Storybook 8 | Interactive component explorer |
| Package manager | npm | Standard |
| Animations | CSS `@keyframes` + lightweight hook | No Framer Motion dependency |
| Lint | ESLint 9 + Prettier | Match Portfolio |

---

## Commands

```bash
npm run dev            # Storybook + watch mode
npm run build          # tsup (ESM + CJS + CSS + .d.ts)
npm run typecheck      # tsc --noEmit
npm run lint           # stylelint 'src/**/*.css' && eslint src/
npm run format         # prettier --write src/
npm run test           # vitest run
npm run test:watch     # vitest
npm run test:a11y      # playwright test
```

---

## Project Structure

```
Azimuth/
├── package.json              # name: azimuth-ui
├── tsconfig.json
├── tsup.config.ts            # Build config
├── vitest.config.ts
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── index.ts              # Public API barrel export
│   ├── theme/
│   │   ├── color-presets.ts   # Predefined color schemes
│   │   ├── style-presets.ts   # Predefined style presets
│   │   ├── ThemeContext.ts     # React.createContext
│   │   ├── ThemeProvider.tsx   # React context + CSS var injection
│   │   ├── types.ts            # ThemeConfig, ThemeTokens
│   │   ├── useTheme.ts         # Hook for consuming theme
│   │   ├── useThemeMode.ts     # Hook for theme mode toggling
│   │   └── index.ts
│   ├── styles/
│   │   ├── tokens.css         # CSS custom properties (generated/injected)
│   │   ├── reset.css          # CSS reset
│   │   ├── animations.css     # Shared keyframes + transitions
│   │   └── global.css         # Barrel import
│   ├── hooks/
│   │   ├── useClickOutside.ts
│   │   ├── useControllableState.ts
│   │   ├── useDisclosure.ts
│   │   ├── useMediaQuery.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── cn.ts              # clsx + className merger
│   │   ├── Slot.tsx           # Slot component for composition
│   │   └── index.ts
│   ├── icons/
│   │   └── ...
│   ├── types/
│   │   └── ...
│   ├── test/
│   │   └── ...
│   └── components/
│       ├── display/
│       │   ├── Accordion/
│       │   ├── Alert/
│       │   ├── Avatar/
│       │   ├── Badge/
│       │   ├── Card/
│       │   ├── Carousel/
│       │   ├── Chat/
│       │   ├── Chip/
│       │   ├── Clock/
│       │   ├── CodeBlock/
│       │   ├── Cursor/
│       │   ├── EmptyState/
│       │   ├── ErrorPage/
│       │   ├── FanMenu/
│       │   ├── Icon/
│       │   ├── IconButton/
│       │   ├── ImageViewer/
│       │   ├── InfoButton/
│       │   ├── Kbd/
│       │   ├── Loader/
│       │   ├── LoginSignup/
│       │   ├── MapDisplay/
│       │   ├── MediaPlayer/
│       │   ├── NotificationBadge/
│       │   ├── PageLayout/
│       │   ├── ProgressBar/
│       │   ├── ResizablePanel/
│       │   ├── SectionView/
│       │   ├── SegmentedButton/
│       │   ├── Skeleton/
│       │   ├── SplitButton/
│       │   ├── Tag/
│       │   ├── Text/
│       │   ├── Toast/
│       │   ├── VisuallyHidden/
│       │   └── index.ts
│       ├── input/
│       │   ├── Button/
│       │   ├── Checkbox/
│       │   ├── Combobox/
│       │   ├── DropdownList/
│       │   ├── FileUpload/
│       │   ├── Form/
│       │   ├── Input/
│       │   ├── InputGroup/
│       │   ├── OTPInput/
│       │   ├── Radio/
│       │   ├── Rating/
│       │   ├── SearchBar/
│       │   ├── Select/
│       │   ├── Slider/
│       │   ├── TextArea/
│       │   ├── TextBox/
│       │   ├── Toggle/
│       │   └── index.ts
│       ├── data/
│       │   ├── Calendar/
│       │   ├── ColorPicker/
│       │   ├── DataTable/
│       │   ├── DateRangePicker/
│       │   ├── DateTimePicker/
│       │   ├── DiffViewer/
│       │   ├── List/
│       │   ├── Pagination/
│       │   ├── SimpleChart/
│       │   ├── Table/
│       │   ├── Timeline/
│       │   ├── TreeList/
│       │   └── index.ts
│       ├── navigation/
│       │   ├── BreadcrumbPageHeader/
│       │   ├── Breadcrumbs/
│       │   ├── Menu/
│       │   ├── Navbar/
│       │   ├── Tabs/
│       │   └── index.ts
│       ├── overlay/
│       │   ├── CommandPalette/
│       │   ├── Dialog/
│       │   ├── Drawer/
│       │   ├── Flyout/
│       │   ├── Modal/
│       │   ├── Sidebar/
│       │   ├── SlideSheet/
│       │   ├── Tooltip/
│       │   └── index.ts
│       └── layout/
│           ├── Container/
│           ├── Divider/
│           ├── Grid/
│           ├── Stack/
│           └── index.ts
├── docs/
│   └── specs/
│       └── azimuth-ui.md      # This file
└── README.md
```

---

## Code Style

### Component pattern

Every component follows this structure:

```tsx
// src/components/input/Button/Button.tsx
'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { useTheme } from '@/theme/useTheme';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link' | 'danger';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const { flat } = useTheme();

    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          flat && styles.flat,
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className={styles.icon}>{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className={styles.icon}>{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
```

### Conventions

- **`forwardRef`** on all interactive components
- **`displayName`** on all `forwardRef` components
- **`'use client'`** on interactive components (Next.js compat)
- **Props extend native element props** (`ComponentPropsWithoutRef<'button'>`)
- **`cn()` utility** merges CSS Module classes with consumer `className`
- **No default exports** — only named exports
- **Tests co-located** with source
- **Files: kebab directories**, PascalCase files
- **Imports use `@/` alias** → `src/`

### CSS Module conventions

```css
/* Button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  gap: var(--azimuth-space-sm);
  padding: var(--azimuth-space-sm) var(--azimuth-space-lg);
  border: none;
  border-radius: var(--azimuth-radius, var(--azimuth-radius-md));
  font-family: var(--azimuth-font-body);
  font-size: var(--azimuth-fs-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--azimuth-transition-fast),
              color var(--azimuth-transition-fast),
              transform var(--azimuth-transition-fast);
}

.button:active {
  transform: scale(0.97);
}

.primary {
  background: var(--azimuth-color-primary);
  color: var(--azimuth-color-on-primary);
}

.primary:hover {
  background: var(--azimuth-color-primary-hover);
}

.flat {
  box-shadow: none;
}
```

All themable values use **CSS custom properties** prefixed with `--azimuth-`. Never hard-code colors or spacing values.

---

## Theme System

### ThemeConfig

```ts
export interface ThemeConfig {
  accentColor?: string;        // CSS color value (hex, oklch, etc.)
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  flat?: boolean;              // true = no shadows, false = 3D depth
  spacing?: 'compact' | 'normal' | 'spacious';
  animations?: boolean;        // true = animations on, false = disabled
  motion?: 'snappy' | 'smooth' | 'reduced';
  mode?: 'light' | 'dark' | 'system';
  fontDisplay?: string;
  fontBody?: string;
}
```

### ThemeProvider

```tsx
<ThemeProvider
  config={{
    accentColor: '#e8734a',
    borderRadius: 'full',
    flat: false,
    spacing: 'normal',
    animations: true,
    motion: 'snappy',
  }}
>
  <App />
</ThemeProvider>
```

Sets CSS custom properties on `:root` (or a scoped wrapper). Components read from CSS vars — no prop drilling.

---

## Testing Strategy

### Unit tests (Vitest + Testing Library)

- Every component has `*.test.tsx` co-located
- Cover: render states, interaction, edge cases, a11y attributes
- Coverage: **90%+ components, 100% utils/hooks**

```tsx
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined();
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('respects disabled', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility tests (Playwright + axe-core)

- Dedicated a11y test suite
- Every component variant checked for ARIA roles, keyboard nav, focus management
- Run as CI gate

### Visual regression (future)

- Storybook + Chromatic for visual snapshots (Phase 2+)

---

## Boundaries

### Always do
- Run `typecheck` and `lint` before committing
- Write tests before component logic (TDD)
- Use CSS custom properties for all themable values
- Add `displayName` to `forwardRef` components
- Include `'use client'` on interactive components
- Keep components tree-shakeable (named exports)
- Test with keyboard navigation
- Follow WCAG 2.2 AA

### Ask first
- Adding new dependencies
- Changing build tooling
- Deviating from spec
- Adding unplanned components

### Never do
- Bundle React or React-DOM (peer deps)
- Hard-code colors, spacing, or themable values
- Skip tests
- Export default from components
- Use CSS-in-JS runtime libraries
- Introduce framework dependencies (Tailwind, Bootstrap)
- Remove failing tests without approval

---

## Success Criteria

- [ ] `<ThemeProvider config={...}>` wraps app and controls all components
- [ ] Changing `borderRadius` from `'full'` to `'none'` re-shapes all components
- [ ] Changing `flat` toggles all shadows on/off
- [ ] Changing `accentColor` re-themes all accent-colored elements
- [ ] Every component individually importable (tree-shakeable)
- [ ] `npm run typecheck` passes strict TypeScript
- [ ] `npm run test` passes with 90%+ coverage
- [ ] `npm run build` produces ESM + CJS + CSS
- [ ] Portfolio imports and renders azimuth-ui correctly
- [ ] All components pass axe-core a11y checks
- [ ] Dark mode switches all components correctly
- [ ] `prefers-reduced-motion` disables animations
- [ ] Works in Next.js 15 App Router, Vite, generic React 19

---

## Open Questions

1. **CSS prefix**: `--azimuth-` prefix for all CSS custom properties. CSS Modules scope class names; consumer can still override via `className` or `style` props.

2. **Icon set**: Components accept any React node as icon (no bundled icon set). Keeps bundle minimal.

3. **Form validation**: Delegate to consumer. Components provide `required`, `disabled`, and pass-through for libraries like Zod or React Hook Form.

4. **Bundle size**: Target <2KB gzipped per leaf component.

5. **RTL support**: Phase 2+. CSS logical properties where applicable from day one.

6. **CSS reset scope**: Opt-in via `<ThemeProvider>` wrapper. Consumers wrap their app in `<ThemeProvider>`.
