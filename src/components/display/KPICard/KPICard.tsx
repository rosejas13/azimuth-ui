'use client';

import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './KPICard.module.css';

type KPICardVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger';
type KPICardTrend = 'up' | 'down' | 'neutral';

/** Props for the KPICard component. */
export interface KPICardProps extends ComponentPropsWithoutRef<'div'> {
  /** Metric value (formatted string, e.g. "$12.4K", "85%") */
  value: string;
  /** Metric label */
  label: string;
  /** Optional trend direction */
  trend?: KPICardTrend;
  /** Trend value text (e.g. "+12.5%") */
  trendValue?: string;
  /** Optional icon displayed alongside the value */
  icon?: ReactNode;
  /** Optional description/context shown below the metric */
  description?: string;
  /** @default 'default' */
  variant?: KPICardVariant;
  /** Optional click handler — makes the card interactive */
  onClick?: () => void;
}

const trendArrows: Record<KPICardTrend, string> = {
  up: '\u25B2',
  down: '\u25BC',
  neutral: '\u25C6',
};

/** A metric display card with value, label, trend indicator, and optional icon. */
export const KPICard = forwardRef<HTMLDivElement, KPICardProps>(
  (
    {
      value,
      label,
      trend,
      trendValue,
      icon,
      description,
      variant = 'default',
      onClick,
      className,
      ...props
    },
    ref,
  ) => {
    const isClickable = !!onClick;

    return (
      <div
        ref={ref}
        className={cn(
          styles.root,
          styles[variant],
          isClickable && styles.clickable,
          className,
        )}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          isClickable
            ? (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.value}>{value}</span>
          {icon && <span className={styles.icon}>{icon}</span>}
        </div>
        <span className={styles.label}>{label}</span>
        {(trend || trendValue) && (
          <div
            className={cn(
              styles.footer,
              trend === 'up' && styles.trendUp,
              trend === 'down' && styles.trendDown,
              trend === 'neutral' && styles.trendNeutral,
            )}
          >
            {trend && (
              <span
                className={styles.trendIndicator}
                aria-label={`Trend: ${trend}`}
              >
                {trendArrows[trend]}
              </span>
            )}
            {trendValue && (
              <span className={styles.trendValue}>{trendValue}</span>
            )}
          </div>
        )}
        {description && <p className={styles.description}>{description}</p>}
      </div>
    );
  },
);

KPICard.displayName = 'KPICard';
