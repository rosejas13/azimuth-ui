'use client';
import { useCallback, useSyncExternalStore } from 'react';
import type { ColorMode } from './types';

/** Reads the current color mode from localStorage, defaulting to 'system'. */
function getMode(): ColorMode {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('azimuth-theme-mode') as ColorMode) || 'system';
}

/** Subscribes to storage events so cross-tab color-mode changes stay in sync. */
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

/**
 * Hook that reads and sets the color mode. Persists the choice in localStorage
 * and syncs across browser tabs via storage events.
 *
 * @returns An object with the current `mode`, a `setMode` function, and a `toggle` function
 *   that cycles light → dark → system → light.
 *
 * @example
 * ```tsx
 * const { mode, setMode, toggle } = useThemeMode();
 * ```
 */
export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, getMode, () => 'system');

  const setMode = useCallback((newMode: ColorMode) => {
    localStorage.setItem('azimuth-theme-mode', newMode);
    if (newMode === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      document.documentElement.setAttribute(
        'data-theme',
        prefersDark ? 'dark' : 'light',
      );
    } else {
      document.documentElement.setAttribute('data-theme', newMode);
    }
    window.dispatchEvent(new Event('storage'));
  }, []);

  const toggle = useCallback(() => {
    const next: Record<ColorMode, ColorMode> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    setMode(next[getMode()]);
  }, [setMode]);

  return { mode, setMode, toggle };
}
