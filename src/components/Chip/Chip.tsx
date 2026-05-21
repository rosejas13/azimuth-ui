'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Chip.module.css';

type ChipVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface ChipProps extends ComponentPropsWithoutRef<'span'> {
  /** @default 'neutral' */
  variant?: ChipVariant;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** @default false */
  deletable?: boolean;
  onDelete?: () => void;
  /** @default false */
  selected?: boolean;
  onClick?: () => void;
  avatar?: React.ReactNode;
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
