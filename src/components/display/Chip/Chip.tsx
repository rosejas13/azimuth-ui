'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Chip.module.css';

type ChipVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

/** A compact chip/tag element with optional delete, selection, click, and avatar. */
export interface ChipProps extends ComponentPropsWithoutRef<'span'> {
  /** @default 'neutral' */
  variant?: ChipVariant;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** @default false */
  deletable?: boolean;
  /** Callback fired when the delete button is clicked. */
  onDelete?: () => void;
  /** @default false */
  selected?: boolean;
  /** Callback fired when the chip is clicked. When set, the chip becomes keyboard-focusable with a button role. */
  onClick?: () => void;
  /** Optional avatar element rendered before the label. */
  avatar?: React.ReactNode;
  /** Chip label content. */
  children?: React.ReactNode;
}

/** A compact chip with optional delete, selection state, click handling, and avatar. */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      deletable = false,
      onDelete,
      selected = false,
      onClick,
      avatar,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isClickable = onClick != null;
    const label = typeof children === 'string' ? children : '';

    return (
      <span
        ref={ref}
        className={cn(
          styles.chip,
          styles[variant],
          styles[size],
          selected && styles.selected,
          isClickable && styles.clickable,
          className,
        )}
        onClick={onClick}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.();
                }
              }
            : undefined
        }
        {...props}
      >
        {avatar && <span className={styles.avatar}>{avatar}</span>}
        {children}
        {deletable && (
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            aria-label={`Remove ${label}`}
          >
            ×
          </button>
        )}
      </span>
    );
  },
);

Chip.displayName = 'Chip';
