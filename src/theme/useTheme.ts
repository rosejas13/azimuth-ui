'use client';

import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeTokens } from './types';

/**
 * Hook that returns the current resolved theme tokens from the nearest
 * ThemeProvider. Throws if used outside a ThemeProvider.
 *
 * @returns The resolved ThemeTokens object with all fields guaranteed.
 * @example
 * ```tsx
 * const { accentColor, spacing, motion } = useTheme();
 * ```
 */
export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
