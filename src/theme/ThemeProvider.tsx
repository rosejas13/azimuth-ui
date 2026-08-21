'use client';

import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import { ThemeContext } from './ThemeContext';
import { DEFAULT_THEME } from './types';
import type { ColorMode, ThemeConfig, ThemeTokens } from './types';

/** Props for the ThemeProvider component. */
interface ThemeProviderProps {
  /** Partial theme configuration. Unset fields inherit defaults. */
  config?: ThemeConfig;
  /** React children wrapped by the theme context. */
  children: ReactNode;
}

const RADIUS_MAP = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

const SPACING_MAP = {
  compact: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
    '4xl': '4rem',
  },
  normal: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  spacious: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
    '4xl': '8rem',
  },
} as const;

const MOTION_MAP = {
  snappy: 'cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  reduced: 'ease-in-out',
} as const;

const SHADOW_MAP = {
  flat: { sm: 'none', md: 'none', lg: 'none', xl: 'none' },
  raised: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
    md: '0 2px 8px 0 rgb(0 0 0 / 0.06)',
    lg: '0 4px 16px 0 rgb(0 0 0 / 0.08)',
    xl: '0 8px 32px 0 rgb(0 0 0 / 0.10)',
  },
  floating: {
    sm: '0 2px 8px 0 rgb(0 0 0 / 0.10)',
    md: '0 6px 24px 0 rgb(0 0 0 / 0.12)',
    lg: '0 12px 48px 0 rgb(0 0 0 / 0.15)',
    xl: '0 20px 64px 0 rgb(0 0 0 / 0.18)',
  },
} as const;

/**
 * Warns once, at runtime, when the base azimuth stylesheet is not loaded.
 * ThemeProvider only emits runtime token overrides; the base tokens and every
 * component's styles ship in `azimuth-ui/styles.css`. Without that import the
 * whole library renders unstyled, so we make the missing import obvious.
 */
let warnedMissingStyles = false;
function warnIfStylesMissing(): void {
  if (warnedMissingStyles) return;
  warnedMissingStyles = true;
  if (typeof document === 'undefined') return;
  // `--azimuth-radius` is defined by tokens.css (base) but not re-defined by
  // anything ThemeProvider injects, so its absence means styles.css is missing.
  const baseLoaded =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--azimuth-radius')
      .trim() !== '';
  if (!baseLoaded) {
    console.warn(
      '[azimuth-ui] Base styles not found. Import "azimuth-ui/styles.css" once at your app entry (e.g. `import \'azimuth-ui/styles.css\';`) so components render styled.',
    );
  }
}

/** Converts a hex color string to normalized sRGB components (0–1). Returns null for invalid input. */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16) / 255,
    g: parseInt(clean.slice(2, 4), 16) / 255,
    b: parseInt(clean.slice(4, 6), 16) / 255,
  };
}

/** Converts an sRGB gamma-encoded component to linear light. */
function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/** Parses an oklch() CSS color string or falls back to hex-to-oklch conversion. Returns null if parsing fails. */
function parseOklch(color: string): { l: number; c: number; h: number } | null {
  const match = color.match(
    /^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+)?\s*\)$/,
  );
  if (match) {
    return {
      l: parseFloat(match[1]),
      c: parseFloat(match[2]),
      h: parseFloat(match[3]),
    };
  }
  // Fallback: convert hex to approximate OKLCH
  const rgb = hexToRgb(color);
  if (!rgb) return null;
  const rl = srgbToLinear(rgb.r);
  const gl = srgbToLinear(rgb.g);
  const bl = srgbToLinear(rgb.b);
  const l_ = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m_ = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s_ = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;
  const lCbrt = Math.cbrt(l_);
  const mCbrt = Math.cbrt(m_);
  const sCbrt = Math.cbrt(s_);
  const L = 0.2104542553 * lCbrt + 0.793617785 * mCbrt - 0.0040720468 * sCbrt;
  const a = 1.9779984951 * lCbrt - 2.428592205 * mCbrt + 0.4505937099 * sCbrt;
  const b_ = 0.0259040371 * lCbrt + 0.7827717662 * mCbrt - 0.808675766 * sCbrt;
  return {
    l: L * 100,
    c: Math.sqrt(a * a + b_ * b_),
    h: (Math.atan2(b_, a) * 180) / Math.PI,
  };
}

/** Darkens an oklch color by reducing its lightness by the given amount. Falls back to color-mix. */
function darken(color: string, amount: number): string {
  const p = parseOklch(color);
  if (!p) return `color-mix(in srgb, ${color}, black 15%)`;
  return `oklch(${Math.max(0, p.l - amount)}% ${p.c} ${p.h})`;
}

/** Produces a desaturated, lighter or darker variant of a color for use as a subtle background. */
function makeSubtle(color: string, dark?: boolean): string {
  const p = parseOklch(color);
  if (!p)
    return `color-mix(in srgb, ${color} 20%, ${dark ? '#1a1a1a' : '#f5f5f5'})`;
  const isLight = p.l > 60;
  const subtleL =
    dark || isLight ? Math.max(5, p.l - 35) : Math.min(100, p.l + 42);
  const subtleC = Math.max(0.05, p.c * 0.3);
  return `oklch(${subtleL}% ${subtleC} ${p.h})`;
}

/**
 * Root component that applies theme tokens as CSS custom properties on
 * `document.documentElement` and provides them through React context.
 *
 * Injects light / dark color schemes, border-radius, spacing, typography,
 * shadow, and motion tokens. Persists the color mode choice in localStorage.
 *
 * @example
 * ```tsx
 * <ThemeProvider config={{ accentColor: 'oklch(60% 0.15 30)', mode: 'system' }}>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ config, children }: ThemeProviderProps) {
  const mounted = useRef(false);

  const merged = useMemo((): ThemeTokens => {
    const c: Required<ThemeConfig> = { ...DEFAULT_THEME, ...config };

    return {
      accentColor: c.accentColor,
      borderRadius: c.borderRadius,
      flat: c.flat,
      elevation: c.elevation,
      spacing: c.spacing,
      animations: c.animations,
      motion: c.motion,
      mode: c.mode,
      fontDisplay: c.fontDisplay,
      fontBody: c.fontBody,
    };
  }, [config]);

  useEffect(() => {
    warnIfStylesMissing();

    const c: Required<ThemeConfig> = { ...DEFAULT_THEME, ...config };
    const radii = RADIUS_MAP[c.borderRadius];
    const spaces = SPACING_MAP[c.spacing];
    const ease = MOTION_MAP[c.motion];
    const elevation = c.flat ? 'flat' : c.elevation;
    const shadows = SHADOW_MAP[elevation];

    // Non-color tokens. Emitted into an injected :root block (inside the
    // azimuth.runtime cascade layer) rather than inline documentElement styles,
    // so a consumer's unlayered CSS can override any of them — inline styles
    // would win by specificity and could not be overridden from a stylesheet.
    const tokenVars = `
      --azimuth-radius: ${radii};
      --azimuth-radius-none: ${RADIUS_MAP.none};
      --azimuth-radius-sm: ${RADIUS_MAP.sm};
      --azimuth-radius-md: ${RADIUS_MAP.md};
      --azimuth-radius-lg: ${RADIUS_MAP.lg};
      --azimuth-radius-full: ${RADIUS_MAP.full};
      --azimuth-space-xs: ${spaces.xs};
      --azimuth-space-sm: ${spaces.sm};
      --azimuth-space-md: ${spaces.md};
      --azimuth-space-lg: ${spaces.lg};
      --azimuth-space-xl: ${spaces.xl};
      --azimuth-space-2xl: ${spaces['2xl']};
      --azimuth-space-3xl: ${spaces['3xl']};
      --azimuth-space-4xl: ${spaces['4xl']};
      --azimuth-font-display: ${c.fontDisplay};
      --azimuth-font-body: ${c.fontBody};
      --azimuth-ease: ${ease};
      --azimuth-shadow-sm: ${shadows.sm};
      --azimuth-shadow-md: ${shadows.md};
      --azimuth-shadow-lg: ${shadows.lg};
      --azimuth-shadow-xl: ${shadows.xl};
    `;

    const savedMode =
      (localStorage.getItem('azimuth-theme-mode') as ColorMode) || null;
    const effectiveMode = savedMode || c.mode;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function applyMode(mode: ColorMode) {
      const isDark =
        mode === 'dark' || (mode === 'system' && prefersDark.matches);
      document.documentElement.setAttribute(
        'data-theme',
        isDark ? 'dark' : 'light',
      );
    }

    applyMode(effectiveMode);

    if (effectiveMode === 'system') {
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.setAttribute(
          'data-theme',
          e.matches ? 'dark' : 'light',
        );
      };
      prefersDark.addEventListener('change', handler);
    }

    // All ThemeProvider output goes into the `azimuth.runtime` cascade layer,
    // which is declared after `azimuth.base` (see tokens.css) so it wins over
    // the base defaults, while any consumer CSS that is not in a layer beats
    // both azimuth layers regardless of specificity or stylesheet load order.
    function injectStyle(id: string, content: string) {
      const existing = document.head.querySelector(`style[data-azimuth-${id}]`);
      if (existing) existing.remove();
      const style = document.createElement('style');
      style.setAttribute(`data-azimuth-${id}`, '');
      style.textContent = `@layer azimuth.runtime {\n${content}\n}`;
      document.head.appendChild(style);
    }

    injectStyle('tokens', `:root {\n${tokenVars}\n}`);

    const darkPrimary = c.darkPrimaryColor || c.primaryColor;
    const darkAccent = c.darkAccentColor || c.accentColor;

    injectStyle(
      'light',
      `
      [data-theme="light"], :root {
        --azimuth-accent: ${c.accentColor};
        --azimuth-color-primary: ${c.primaryColor};
        --azimuth-color-primary-hover: ${darken(c.primaryColor, 5)};
        --azimuth-color-primary-subtle: ${makeSubtle(c.primaryColor, false)};
        --azimuth-color-accent-hover: ${darken(c.accentColor, 5)};
        --azimuth-color-accent-subtle: ${makeSubtle(c.accentColor, false)};
        --azimuth-color-bg: oklch(98.5% 0.005 85);
        --azimuth-color-surface: oklch(99% 0.003 85);
        --azimuth-color-surface-hover: oklch(97% 0.005 85);
        --azimuth-color-text: oklch(20% 0.01 85);
        --azimuth-color-text-secondary: oklch(45% 0.01 85);
        --azimuth-color-text-muted: oklch(55% 0.008 85);
        --azimuth-color-border: oklch(78% 0.008 85);
        --azimuth-color-border-strong: oklch(80% 0.01 85);
        --azimuth-color-on-primary: oklch(99% 0 0);
        --azimuth-color-on-accent: oklch(99% 0 0);
        --azimuth-color-overlay: rgb(0 0 0 / 0.5);
        --azimuth-color-danger: oklch(45% 0.12 30);
        --azimuth-color-primary-ring: oklch(92% 0.04 195);
        --azimuth-color-error-bg: oklch(92% 0.05 30);
        --azimuth-color-error-text: oklch(40% 0.08 30);
        --azimuth-color-success-bg: oklch(92% 0.04 145);
        --azimuth-color-success-text: oklch(35% 0.06 145);
        --azimuth-color-warning-bg: oklch(94% 0.05 85);
        --azimuth-color-warning-text: oklch(45% 0.08 85);
        --azimuth-color-info-bg: oklch(92% 0.04 250);
        --azimuth-color-info-text: oklch(35% 0.06 250);
        --azimuth-font-mono: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
      }
    `,
    );

    injectStyle(
      'dark',
      `
      [data-theme="dark"] {
        --azimuth-accent: ${darkAccent};
        --azimuth-color-primary: ${darkPrimary};
        --azimuth-color-primary-hover: ${darken(darkPrimary, 5)};
        --azimuth-color-accent-hover: ${darken(darkAccent, 5)};
        --azimuth-color-primary-subtle: ${makeSubtle(darkPrimary, true)};
        --azimuth-color-accent-subtle: ${makeSubtle(darkAccent, true)};
        --azimuth-color-bg: oklch(14% 0.008 220);
        --azimuth-color-surface: oklch(19% 0.01 220);
        --azimuth-color-surface-hover: oklch(22% 0.01 220);
        --azimuth-color-text: oklch(90% 0.005 85);
        --azimuth-color-text-secondary: oklch(65% 0.005 85);
        --azimuth-color-text-muted: oklch(45% 0.005 85);
        --azimuth-color-border: oklch(28% 0.01 220);
        --azimuth-color-border-strong: oklch(40% 0.01 220);
        --azimuth-color-on-primary: oklch(14% 0.008 220);
        --azimuth-color-on-accent: oklch(14% 0.008 220);
        --azimuth-color-overlay: rgb(0 0 0 / 0.5);
        --azimuth-color-danger: oklch(65% 0.12 30);
        --azimuth-color-primary-ring: oklch(25% 0.04 195);
        --azimuth-color-error-bg: oklch(22% 0.05 30);
        --azimuth-color-error-text: oklch(65% 0.08 30);
        --azimuth-color-success-bg: oklch(22% 0.04 145);
        --azimuth-color-success-text: oklch(65% 0.06 145);
        --azimuth-color-warning-bg: oklch(25% 0.05 85);
        --azimuth-color-warning-text: oklch(70% 0.08 85);
        --azimuth-color-info-bg: oklch(22% 0.04 250);
        --azimuth-color-info-text: oklch(65% 0.06 250);
        --azimuth-font-mono: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
      }
    `,
    );

    mounted.current = true;
  }, [config]);

  return (
    <ThemeContext.Provider value={merged}>{children}</ThemeContext.Provider>
  );
}
