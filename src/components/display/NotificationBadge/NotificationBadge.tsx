'use client';

import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './NotificationBadge.module.css';

export interface NotificationBadgeProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'color' | 'children'> {
  count: number;
  max?: number;
  dot?: boolean;
  children: ReactNode;
  size?: 'sm' | 'md';
  color?: 'accent' | 'danger' | 'neutral';
}

export const NotificationBadge = forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  (
    {
      count,
      max = 99,
      dot = false,
      children,
      size = 'md',
      color = 'danger',
      className,
      ...props
    },
    ref,
  ) => {
    const safeCount = count ?? 0;
    const showDot = dot || safeCount <= 0;
    const displayCount = safeCount > max ? `+${max}` : safeCount;

    return (
      <span ref={ref} className={cn(styles.wrapper, className)} {...props}>
        {children}
        {(safeCount > 0 || dot) && (
          <span
            className={cn(
              styles.badge,
              styles[size],
              styles[color],
              showDot && styles.dotMode,
            )}
            aria-label={!showDot ? `${count} notifications` : undefined}
            aria-hidden={showDot || undefined}
          >
            {!showDot && displayCount}
          </span>
        )}
      </span>
    );
  },
);

NotificationBadge.displayName = 'NotificationBadge';
