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
  full: '9999px',
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

function setCSSVar(name: string, value: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(name, value);
  }
}

export function ThemeProvider({ config, children }: ThemeProviderProps) {
  const mounted = useRef(false);

  const merged = useMemo((): ThemeTokens => {
    const c: Required<ThemeConfig> = { ...DEFAULT_THEME, ...config };

    return {
      accentColor: c.accentColor,
      borderRadius: c.borderRadius,
      flat: c.flat,
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
    setCSSVar('--azimuth-font-display', c.fontDisplay);
    setCSSVar('--azimuth-font-body', c.fontBody);

    setCSSVar('--azimuth-ease', ease);
    setCSSVar('--azimuth-shadows', c.flat ? 'none' : '');
    setCSSVar('--azimuth-animations', c.animations ? '' : 'none');

    mounted.current = true;
  }, [config]);

  return (
    <ThemeContext.Provider value={merged}>
      {children}
    </ThemeContext.Provider>
  );
}
