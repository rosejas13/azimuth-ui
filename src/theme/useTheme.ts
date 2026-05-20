'use client';

import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeTokens } from './types';

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
