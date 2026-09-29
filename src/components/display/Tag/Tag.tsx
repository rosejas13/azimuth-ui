'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './Tag.module.css';

type TagVariant =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

/** Curated native surface for the Tag span; anything native not listed goes through `spanProps`. */
export interface TagProps extends CuratedSurface<
  'span',
  ['className', 'style', 'id']
> {
  /** @default 'neutral' */
  variant?: TagVariant;
  /** @default false */
  removable?: boolean;
  /** Callback fired when the remove button is clicked. */
  onRemove?: () => void;
  /** Tag label content. */
  children?: React.ReactNode;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  spanProps?: NativeRest<'span'>;
}

/** A styled tag with optional remove functionality. */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = 'neutral',
      removable = false,
      onRemove,
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
        className={cn(
          styles.tag,
          styles[variant],
          removable && styles.removable,
          className,
        )}
        {...props}
        {...(spanProps as ComponentPropsWithoutRef<'span'>)}
      >
        {children}
        {removable && (
          <button
            type="button"
            className={styles.removeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            aria-label={`Remove ${typeof children === 'string' ? children : ''}`}
          >
            ×
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = 'Tag';
