'use client';

import { type ComponentPropsWithoutRef, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import styles from './Meter.module.css';

type MeterTone = 'ok' | 'warn' | 'critical';

export interface MeterProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> {
  /** The current measured value, clamped between min and max. */
  value: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** Accessible name for the meter; falls back to a generated label. */
  label?: string;
  /** @default false */
  showValue?: boolean;
  /** Values at or below this render the critical tone. */
  low?: number;
  /** Values at or above this render the warn tone. */
  high?: number;
  /** Semantic hint mirroring native <meter>; informational only. */
  optimum?: number;
}

/**
 * A scalar gauge within a known range with optional threshold tones.
 * Unlike ProgressBar (task progress), Meter communicates a value
 * against min/max bounds.
 */
export const Meter = forwardRef<HTMLDivElement, MeterProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      label,
      showValue = false,
      low,
      high,
      optimum: _optimum,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const resolvedLabel = label ?? ariaLabel ?? `meter-${autoId}`;
    const percent = Math.min(
      100,
      Math.max(0, ((value - min) / (max - min || 1)) * 100),
    );
    const tone: MeterTone =
      low !== undefined && value <= low
        ? 'critical'
        : high !== undefined && value >= high
          ? 'warn'
          : 'ok';

    return (
      <div className={styles.wrapper}>
        <div
          ref={ref}
          className={cn(styles.meter, styles[tone], className)}
          role="meter"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={resolvedLabel}
          {...props}
        >
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${percent}%` }} />
          </div>
        </div>
        {showValue && <span className={styles.value}>{`${value}/${max}`}</span>}
      </div>
    );
  },
);

Meter.displayName = 'Meter';
