'use client';

import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import { ThemeContext } from './ThemeContext';
import { DEFAULT_THEME } from './types';
import type { ThemeConfig, ThemeTokens } from './types';

/** Props for the ThemeProvider component. */
interface ThemeProviderProps {
  /** Theme configuration overrides merging with defaults. */
  config?: ThemeConfig;
  /** The content rendered within the theme context. */
  children: ReactNode;
}

const RADIUS_MAP = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '14px',
} as const;

const SPACING_MAP = {
  compact: { xs: '0.125rem', sm: '0.25rem', md: '0.5rem', lg: '1rem', xl: '1.5rem', '2xl': '2rem', '3xl': '3rem', '4xl': '4rem' },
  normal: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem', '3xl': '4rem', '4xl': '6rem' },
  spacious: { xs: '0.5rem', sm: '0.75rem', md: '1.5rem', lg: '2rem', xl: '3rem', '2xl': '4rem', '3xl': '6rem', '4xl': '8rem' },
} as const;

const MOTION_MAP = {
  snappy: 'cubic-bezier(0.16, 1, 0.3, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  reduced: 'ease',
} as const;

const SHADOW_MAP = {
  flat: { sm: 'none', md: 'none', lg: 'none' },
  raised: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)', md: '0 2px 8px 0 rgb(0 0 0 / 0.06)', lg: '0 4px 16px 0 rgb(0 0 0 / 0.08)' },
  floating: { sm: '0 2px 8px 0 rgb(0 0 0 / 0.10)', md: '0 6px 24px 0 rgb(0 0 0 / 0.12)', lg: '0 12px 48px 0 rgb(0 0 0 / 0.15)' },
} as const;

function setCSSVar(name: string, value: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(name, value);
  }
}

function parseOklch(color: string): { l: number; c: number; h: number } | null {
  const match = color.match(/^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+)?\s*\)$/);
  if (!match) return null;
  return { l: parseFloat(match[1]), c: parseFloat(match[2]), h: parseFloat(match[3]) };
}

function darken(color: string, amount: number): string {
  const p = parseOklch(color);
  if (!p) return color;
  return `oklch(${Math.max(0, p.l - amount)}% ${p.c} ${p.h})`;
}

function makeSubtle(color: string): string {
  const p = parseOklch(color);
  if (!p) return color;
  const subtleL = Math.min(100, p.l + 42);
  const subtleC = Math.max(0.05, p.c * 0.3);
  return `oklch(${subtleL}% ${subtleC} ${p.h})`;
}

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
    const c: Required<ThemeConfig> = { ...DEFAULT_THEME, ...config };
    const radii = RADIUS_MAP[c.borderRadius];
    const spaces = SPACING_MAP[c.spacing];
    const ease = MOTION_MAP[c.motion];

    setCSSVar('--azimuth-radius', radii);
    setCSSVar('--azimuth-radius-none', RADIUS_MAP.none);
    setCSSVar('--azimuth-radius-sm', RADIUS_MAP.sm);
    setCSSVar('--azimuth-radius-md', RADIUS_MAP.md);
    setCSSVar('--azimuth-radius-lg', RADIUS_MAP.lg);
    setCSSVar('--azimuth-radius-full', RADIUS_MAP.full);

    setCSSVar('--azimuth-space-xs', spaces.xs);
    setCSSVar('--azimuth-space-sm', spaces.sm);
    setCSSVar('--azimuth-space-md', spaces.md);
    setCSSVar('--azimuth-space-lg', spaces.lg);
    setCSSVar('--azimuth-space-xl', spaces.xl);
    setCSSVar('--azimuth-space-2xl', spaces['2xl']);
    setCSSVar('--azimuth-space-3xl', spaces['3xl']);
    setCSSVar('--azimuth-space-4xl', spaces['4xl']);

    setCSSVar('--azimuth-accent', c.accentColor);
    setCSSVar('--azimuth-color-primary', c.primaryColor);
    setCSSVar('--azimuth-color-primary-hover', darken(c.primaryColor, 5));
    setCSSVar('--azimuth-color-primary-subtle', makeSubtle(c.primaryColor));
    setCSSVar('--azimuth-color-accent-hover', darken(c.accentColor, 5));
    setCSSVar('--azimuth-color-accent-subtle', makeSubtle(c.accentColor));
    setCSSVar('--azimuth-font-display', c.fontDisplay);
    setCSSVar('--azimuth-font-body', c.fontBody);

    setCSSVar('--azimuth-ease', ease);
    setCSSVar('--azimuth-animations', c.animations ? '' : 'none');

    const elevation = c.flat ? 'flat' : c.elevation;
    const shadows = SHADOW_MAP[elevation];
    setCSSVar('--azimuth-shadow-sm', shadows.sm);
    setCSSVar('--azimuth-shadow-md', shadows.md);
    setCSSVar('--azimuth-shadow-lg', shadows.lg);
    setCSSVar('--azimuth-shadows', elevation === 'flat' ? 'none' : '');

    mounted.current = true;
  }, [config]);

  return (
    <ThemeContext.Provider value={merged}>
      {children}
    </ThemeContext.Provider>
  );
}
