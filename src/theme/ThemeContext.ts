'use client';

import { createContext } from 'react';
import type { ThemeTokens } from './types';
import { DEFAULT_THEME } from './types';

/** Builds the default token object used as the context fallback value. */
function createDefaultTokens(): ThemeTokens {
  return {
    ...DEFAULT_THEME,
    borderRadius: 'var(--azimuth-radius)',
  };
}

/** React context that holds the resolved theme tokens. Consumers access it via `useTheme`. */
export const ThemeContext = createContext<ThemeTokens>(createDefaultTokens());
