import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './ProgressBar.module.css';

type ProgressBarColor = 'primary' | 'accent' | 'success' | 'warning' | 'danger';
type ProgressBarSize = 'sm' | 'md' | 'lg';

/** Props for the ProgressBar component. */
export interface ProgressBarProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** The current progress value. @default 0 */
  value?: number;
  /** The maximum progress value. @default 100 */
  max?: number;
  /** Whether the progress bar is in indeterminate mode. @default false */
  indeterminate?: boolean;
  /** Color variant of the progress bar. @default 'primary' */
  color?: ProgressBarColor;
  /** Size variant of the progress bar. @default 'md' */
  size?: ProgressBarSize;
  /** Whether to display the percentage label. @default false */
  showLabel?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      color = 'primary',
      size = 'md',
      showLabel = false,
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
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={
          indeterminate ? undefined : `${Math.round(pct)}%`
        }
        {...props}
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
