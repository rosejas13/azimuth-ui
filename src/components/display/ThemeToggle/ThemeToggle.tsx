'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { useThemeMode } from '@/theme/useThemeMode';
import { MonitorIcon, MoonIcon, SunIcon } from '@/icons';
import styles from './ThemeToggle.module.css';

export interface ThemeToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const { mode, toggle } = useThemeMode();

    const nextLabel =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';

    return (
      <button
        ref={ref}
        type="button"
        className={cn(styles.toggle, styles[size], className)}
        onClick={toggle}
        aria-label={`Switch to ${nextLabel} theme`}
        {...props}
      >
        {mode === 'light' && <SunIcon />}
        {mode === 'dark' && <MoonIcon />}
        {mode === 'system' && <MonitorIcon />}
      </button>
    );
  },
);
ThemeToggle.displayName = 'ThemeToggle';
