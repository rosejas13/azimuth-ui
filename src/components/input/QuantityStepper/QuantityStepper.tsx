'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { Button } from '@/components/input/Button';
import { cn } from '@/utils/cn';
import styles from './QuantityStepper.module.css';

/** Props for the QuantityStepper component. */
export interface QuantityStepperProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  /** Current value (controlled) */
  value?: number;
  /** Default value */
  defaultValue?: number;
  /** Change handler */
  onChange?: (value: number) => void;
  /** Minimum value (default 1) */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment (default 1) */
  step?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Accessible label */
  label?: string;
  className?: string;
}

/** A standalone +/- quantity selector. */
export const QuantityStepper = forwardRef<HTMLDivElement, QuantityStepperProps>(
  (
    {
      value: controlledValue,
      defaultValue = 1,
      onChange,
      min = 1,
      max,
      step = 1,
      size = 'md',
      disabled = false,
      label,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue =
      controlledValue !== undefined ? controlledValue : internalValue;

    const decrement = useCallback(() => {
      if (disabled) return;
      const next = currentValue - step;
      if (next < min) return;
      if (controlledValue === undefined) setInternalValue(next);
      onChange?.(next);
    }, [disabled, currentValue, step, min, controlledValue, onChange]);

    const increment = useCallback(() => {
      if (disabled) return;
      const next = currentValue + step;
      if (max !== undefined && next > max) return;
      if (controlledValue === undefined) setInternalValue(next);
      onChange?.(next);
    }, [disabled, currentValue, step, max, controlledValue, onChange]);

    const atMin = currentValue <= min;
    const atMax = max !== undefined && currentValue >= max;

    return (
      <div
        ref={ref}
        className={cn(styles.stepper, styles[size], className)}
        {...props}
      >
        {label && <span className={styles.label}>{label}</span>}
        <Button
          size={size}
          variant="secondary"
          onClick={decrement}
          disabled={disabled || atMin}
          aria-label="Decrease quantity"
        >
          −
        </Button>
        <span className={styles.value} aria-live="polite" role="status">
          {currentValue}
        </span>
        <Button
          size={size}
          variant="secondary"
          onClick={increment}
          disabled={disabled || atMax}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>
    );
  },
);

QuantityStepper.displayName = 'QuantityStepper';
