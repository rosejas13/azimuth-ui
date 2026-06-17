import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Badge.module.css';

type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
type BadgeSize = 'xs' | 'sm' | 'md';

/** A small badge/tag for statuses, counts, or labels. */
export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  /** @default 'neutral' */
  variant?: BadgeVariant;
  /** @default 'md' */
  size?: BadgeSize;
  /** Content displayed inside the badge. */
  children?: React.ReactNode;
}

/** A small badge for statuses, counts, or contextual labels. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = 'neutral', size = 'md', className, children, ...props },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={cn(styles.badge, styles[variant], styles[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
