'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Rating.module.css';

export interface RatingProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      max = 5,
      onChange,
      size = 'md',
      disabled = false,
      className,
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
              tabIndex={i === (focusedIdx >= 0 ? focusedIdx : value - 1) ? 0 : -1}
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
