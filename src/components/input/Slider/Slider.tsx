'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Slider.module.css';

/** Props for the Slider component. */
export interface SliderProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  | 'type'
  | 'onChange'
  | 'size'
  | 'value'
  | 'defaultValue'
  | 'min'
  | 'max'
  | 'step'
  | 'disabled'
  | 'aria-orientation'
> {
  /** Controlled value. Pair with `onChange`. When omitted the slider is uncontrolled. */
  value?: number;
  /** Initial value for an uncontrolled slider. Ignored while `value` is set. */
  defaultValue?: number;
  /** Called with the snapped value on every change. */
  onChange?: (value: number) => void;
  /** @default false */
  disabled?: boolean;
  /** Min/max/step bounds for the range. */
  range?: {
    /** @default 0 */
    min?: number;
    /** @default 100 */
    max?: number;
    /** @default 1 */
    step?: number;
  };
  /** Visual configuration. */
  display?: {
    /** @default 'horizontal' */
    orientation?: 'horizontal' | 'vertical';
    /** @default false */
    showValue?: boolean;
    /** @default 'md' */
    size?: 'sm' | 'md' | 'lg';
  };
}

/** A range slider with pointer drag, keyboard input, and customizable min/max/step/orientation. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      range: { min = 0, max = 100, step = 1 } = {},
      value,
      defaultValue,
      onChange,
      disabled = false,
      display: {
        orientation = 'horizontal',
        showValue = false,
        size = 'md',
      } = {},
      className,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const isVertical = orientation === 'vertical';

    const [internalValue, setInternalValue] = useState(defaultValue ?? min);

    const currentValue = isControlled ? value : internalValue;
    const clampedValue = Math.min(max, Math.max(min, currentValue));

    const pct = ((clampedValue - min) / (max - min)) * 100;

    const trackRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    const setValue = useCallback(
      (val: number) => {
        const clamped = Math.min(
          max,
          Math.max(min, Math.round(val / step) * step),
        );
        if (!isControlled) {
          setInternalValue(clamped);
        }
        onChange?.(clamped);
      },
      [min, max, step, isControlled, onChange],
    );

    const getValueFromPosition = useCallback(
      (clientX: number, clientY: number) => {
        const track = trackRef.current;
        if (!track) return currentValue;
        const rect = track.getBoundingClientRect();
        if (isVertical) {
          const offset = rect.bottom - clientY;
          const ratio = Math.max(0, Math.min(1, offset / rect.height));
          return min + ratio * (max - min);
        }
        const offset = clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, offset / rect.width));
        return min + ratio * (max - min);
      },
      [min, max, currentValue, isVertical],
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        const val = getValueFromPosition(e.clientX, e.clientY);
        setValue(val);
      },
      [disabled, getValueFromPosition, setValue],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!dragging.current) return;
        const val = getValueFromPosition(e.clientX, e.clientY);
        setValue(val);
      },
      [getValueFromPosition, setValue],
    );

    const handlePointerUp = useCallback(() => {
      dragging.current = false;
    }, []);

    useEffect(() => {
      if (isControlled && value !== undefined) {
        setInternalValue(value);
      }
    }, [isControlled, value]);

    const handleKeyDownLocal = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        let newVal = currentValue;
        const directionKey = isVertical
          ? { up: 'ArrowUp', down: 'ArrowDown' }
          : { up: 'ArrowRight', down: 'ArrowLeft' };

        if (e.key === directionKey.up || e.key === directionKey.down) {
          e.preventDefault();
          newVal =
            e.key === directionKey.up
              ? currentValue + step
              : currentValue - step;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newVal = min;
        } else if (e.key === 'End') {
          e.preventDefault();
          newVal = max;
        }

        if (newVal !== currentValue) {
          setValue(newVal);
        }

        onKeyDown?.(e);
      },
      [currentValue, step, min, max, setValue, onKeyDown, isVertical],
    );

    const thumbOffset = isVertical
      ? { bottom: `${pct}%` }
      : { left: `${pct}%` };

    const fillStyle = isVertical ? { height: `${pct}%` } : { width: `${pct}%` };

    return (
      <div
        className={cn(
          styles.wrapper,
          isVertical && styles.wrapperVertical,
          disabled && styles.disabled,
          className,
        )}
      >
        <div
          ref={trackRef}
          className={cn(
            styles.container,
            isVertical && styles.containerVertical,
          )}
        >
          <input
            ref={ref}
            type="range"
            className={styles.hiddenInput}
            {...props}
            min={min}
            max={max}
            step={step}
            value={clampedValue}
            disabled={disabled}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={clampedValue}
            aria-orientation={orientation as 'horizontal' | 'vertical'}
            onKeyDown={handleKeyDownLocal}
            onChange={(e) => {
              setValue(Number(e.target.value));
            }}
            tabIndex={disabled ? -1 : 0}
          />
          <div
            className={cn(
              styles.track,
              isVertical && styles.trackVertical,
              size !== 'md' &&
                styles[`track${size.charAt(0).toUpperCase() + size.slice(1)}`],
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div
              className={cn(styles.fill, isVertical && styles.fillVertical)}
              style={fillStyle}
            />
            <div
              className={cn(
                styles.thumb,
                isVertical && styles.thumbVertical,
                size !== 'md' &&
                  styles[
                    `thumb${size.charAt(0).toUpperCase() + size.slice(1)}`
                  ],
              )}
              style={thumbOffset}
              onPointerDown={handlePointerDown}
            />
          </div>
        </div>
        {showValue && (
          <span className={styles.valueLabel}>{Math.round(clampedValue)}</span>
        )}
      </div>
    );
  },
);

Slider.displayName = 'Slider';
