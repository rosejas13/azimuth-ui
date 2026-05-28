'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Tag.module.css';

type TagVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

/** A tag/label with variant styling and optional remove button. */
export interface TagProps extends ComponentPropsWithoutRef<'span'> {
  /** @default 'neutral' */
  variant?: TagVariant;
  /** @default false */
  removable?: boolean;
  /** Callback fired when the remove button is clicked. */
  onRemove?: () => void;
  /** Tag label content. */
  children?: React.ReactNode;
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
