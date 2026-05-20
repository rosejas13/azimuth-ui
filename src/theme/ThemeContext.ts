'use client';

import { createContext } from 'react';
import type { ThemeTokens } from './types';
import { DEFAULT_THEME } from './types';

function createDefaultTokens(): ThemeTokens {
  return {
    ...DEFAULT_THEME,
    borderRadius: 'var(--azimuth-radius)',
  };
}

export const ThemeContext = createContext<ThemeTokens>(createDefaultTokens());
