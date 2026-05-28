'use client';

import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './NotificationBadge.module.css';

/** A badge that displays a notification count or dot indicator over child content. */
export interface NotificationBadgeProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'color' | 'children'> {
  /** Notification count to display. */
  count: number;
  /** @default 99 */
  max?: number;
  /** @default false */
  dot?: boolean;
  /** The element the badge attaches to. */
  children: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** @default 'danger' */
  color?: 'accent' | 'danger' | 'neutral';
}

/** A badge overlay that shows a notification count or dot on its child element. */
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
