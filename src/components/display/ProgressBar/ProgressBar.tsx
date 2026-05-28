import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './ProgressBar.module.css';

type ProgressBarColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger';
type ProgressBarSize = 'sm' | 'md' | 'lg';

/** A horizontal progress bar with optional percentage display and indeterminate state. */
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
  /** @default false */
  showPercentage?: boolean;
}

/** A horizontal progress bar with fill, indeterminate animation, and optional percentage label. */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      color = 'primary',
      size = 'md',
      showPercentage = false,
      className,
      ...props
    },
    ref,
  ) => {
    const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
    const displayPct = Math.round(pct);

    return (
      <div className={styles.wrapper} {...props}>
        <div
          ref={ref}
          className={cn(
            styles.progress,
            styles[size],
            indeterminate && styles.indeterminate,
            styles[color],
            className,
          )}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuetext={
            indeterminate ? undefined : `${displayPct}%`
          }
        >
          <div
            className={styles.fill}
            style={{ width: `${pct}%` }}
          />
        </div>
        {showPercentage && (
          <span className={styles.percentage}>{displayPct}%</span>
        )}
      </div>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';
