'use client';

import { type ButtonHTMLAttributes, forwardRef, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { useThemeMode } from '@/theme/useThemeMode';
import type { ColorMode } from '@/theme/types';
import { MonitorIcon, MoonIcon, SunIcon } from '@/icons';
import styles from './ThemeToggle.module.css';

/** Cycle order shared by the hook and controlled usage. */
const NEXT: Record<ColorMode, ColorMode> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  /**
   * Controlled color mode. When set, the toggle stops reading/writing
   * localStorage and reports clicks through `onModeChange` instead —
   * letting a provider-style consumer own the mode (syncing via its own
   * `useThemeMode` or ThemeProvider runtime).
   */
  mode?: ColorMode;
  /** Fired with the next mode in the cycle when `mode` is controlled. */
  onModeChange?: (mode: ColorMode) => void;
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, size = 'md', mode, onModeChange, ...props }, ref) => {
    const { mode: contextMode, setMode: contextSetMode } = useThemeMode();
    const current: ColorMode = mode ?? contextMode;

    const toggle = useCallback(() => {
      const next = NEXT[current];
      if (mode !== undefined) {
        onModeChange?.(next);
      } else {
        contextSetMode(next);
      }
    }, [current, mode, onModeChange, contextSetMode]);

    const nextLabel = NEXT[current];

    return (
      <button
        ref={ref}
        type="button"
        className={cn(styles.toggle, styles[size], className)}
        onClick={toggle}
        aria-label={`Switch to ${nextLabel} theme`}
        {...props}
      >
        {current === 'light' && <SunIcon />}
        {current === 'dark' && <MoonIcon />}
        {current === 'system' && <MonitorIcon />}
      </button>
    );
  },
);
ThemeToggle.displayName = 'ThemeToggle';
