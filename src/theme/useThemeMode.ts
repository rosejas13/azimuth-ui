'use client';
import { useCallback, useSyncExternalStore } from 'react';

type ColorMode = 'light' | 'dark' | 'system';

function getMode(): ColorMode {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('azimuth-theme-mode') as ColorMode) || 'system';
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, getMode, () => 'system');

  const setMode = useCallback((newMode: ColorMode) => {
    localStorage.setItem('azimuth-theme-mode', newMode);
    if (newMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newMode);
    }
    window.dispatchEvent(new Event('storage'));
  }, []);

  const toggle = useCallback(() => {
    const next: Record<ColorMode, ColorMode> = { light: 'dark', dark: 'system', system: 'light' };
    setMode(next[getMode()]);
  }, [setMode]);

  return { mode, setMode, toggle };
}
