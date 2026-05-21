import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './ProgressBar.module.css';

type ProgressBarColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger';
type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** @default 0 */
  value?: number;
  /** @default 100 */
  max?: number;
  /** @default false */
  indeterminate?: boolean;
  /** @default 'primary' */
  color?: ProgressBarColor;
  /** @default 'md' */
  size?: ProgressBarSize;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      color = 'primary',
      size = 'md',
      className,
      ...props
    },
    ref,
  ) => {
    const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        className={cn(
          styles.progress,
          styles[size],
          indeterminate && styles.indeterminate,
          styles[color],
          className,
        )}
        {...props}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={
          indeterminate ? undefined : `${Math.round(pct)}%`
        }
      >
        <div
          className={styles.fill}
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';
