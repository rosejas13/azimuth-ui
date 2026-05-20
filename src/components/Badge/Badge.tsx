import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Badge.module.css';

type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

/** Props for the Badge component. */
export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  /** The visual variant of the badge. @default 'neutral' */
  variant?: BadgeVariant;
  /** The content of the component. */
  children?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(styles.badge, styles[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
