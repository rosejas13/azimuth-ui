'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './Rating.module.css';

/**
 * Curated native surface for the rating group (div-rooted radiogroup).
 * Anything native not listed goes through `groupProps`.
 */
export interface RatingProps extends CuratedSurface<
  'div',
  [
    'className',
    'id',
    'title',
    'tabIndex',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-hidden',
    'onKeyDown',
    'onMouseLeave',
    'onMouseEnter',
  ]
> {
  /** @default 0 */
  value?: number;
  /** @default 5 */
  max?: number;
  onChange?: (value: number) => void;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default false */
  disabled?: boolean;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  groupProps?: NativeRest<'div'>;
}

/** A star-based rating input with keyboard navigation and hover preview. */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      max = 5,
      onChange,
      size = 'md',
      disabled = false,
      className,
      groupProps,
      ...props
    },
    ref,
  ) => {
    const [hovered, setHovered] = useState(0);
    const [focusedIdx, setFocusedIdx] = useState(-1);

    const displayValue = hovered > 0 ? hovered : value;

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        let current = focusedIdx >= 0 ? focusedIdx + 1 : value;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          current = Math.min(max, current + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          current = Math.max(0, current - 1);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (focusedIdx >= 0) {
            const newValue = focusedIdx + 1;
            onChange?.(newValue === value ? 0 : newValue);
          }
          return;
        } else {
          return;
        }
        setFocusedIdx(current - 1);
        onChange?.(current);
      },
      [focusedIdx, value, max, onChange],
    );

    return (
      <div
        ref={ref}
        role="radiogroup"
        tabIndex={-1}
        className={cn(
          styles.rating,
          styles[size],
          disabled && styles.disabled,
          className,
        )}
        aria-disabled={disabled}
        onMouseLeave={() => setHovered(0)}
        onKeyDown={handleKeyDown}
        {...props}
        {...(groupProps as ComponentPropsWithoutRef<'div'>)}
      >
        {Array.from({ length: max }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= displayValue;

          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={starValue <= value}
              aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
              tabIndex={
                i === (focusedIdx >= 0 ? focusedIdx : value - 1) ? 0 : -1
              }
              disabled={disabled}
              className={cn(styles.star, filled && styles.filled)}
              onClick={() => {
                if (disabled) return;
                onChange?.(starValue === value ? 0 : starValue);
              }}
              onMouseEnter={() => {
                if (!disabled) setHovered(starValue);
              }}
              onFocus={() => setFocusedIdx(i)}
              onBlur={() => setFocusedIdx(-1)}
            >
              {filled ? '\u2605' : '\u2606'}
            </button>
          );
        })}
      </div>
    );
  },
);

Rating.displayName = 'Rating';
