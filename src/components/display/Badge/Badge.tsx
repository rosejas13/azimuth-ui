import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
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

/** Curated native surface for the Badge span; anything native not listed goes through `spanProps`. */
export interface BadgeProps extends CuratedSurface<
  'span',
  ['className', 'style', 'id']
> {
  /** @default 'neutral' */
  variant?: BadgeVariant;
  /** @default 'md' */
  size?: BadgeSize;
  /** Content displayed inside the badge. */
  children?: React.ReactNode;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  spanProps?: NativeRest<'span'>;
}

/** A small badge for statuses, counts, or contextual labels. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      className,
      children,
      spanProps,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={cn(styles.badge, styles[variant], styles[size], className)}
        {...props}
        {...(spanProps as ComponentPropsWithoutRef<'span'>)}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
