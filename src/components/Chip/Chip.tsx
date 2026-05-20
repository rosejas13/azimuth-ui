'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Chip.module.css';

type ChipVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

/** Props for the Chip component. */
export interface ChipProps extends ComponentPropsWithoutRef<'span'> {
  /** The visual variant of the chip. @default 'neutral' */
  variant?: ChipVariant;
  /** The size of the chip. @default 'md' */
  size?: 'sm' | 'md';
  /** Whether the chip can be removed. @default false */
  deletable?: boolean;
  /** Callback fired when the chip is deleted. */
  onDelete?: () => void;
  /** Whether the chip is selected. @default false */
  selected?: boolean;
  /** Callback fired when the chip is clicked. */
  onClick?: () => void;
  /** Leading avatar or icon element. */
  avatar?: React.ReactNode;
  /** The content of the component. */
  children?: React.ReactNode;
}

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
