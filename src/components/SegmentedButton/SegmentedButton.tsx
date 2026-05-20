'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './SegmentedButton.module.css';

/** An option within a SegmentedButton group. */
export interface SegmentedButtonOption {
  /** Unique value identifier for the option. */
  value: string;
  /** Display label for the option. */
  label: string;
  /** Icon displayed alongside the label. */
  icon?: React.ReactNode;
  /** Whether the option is disabled. */
  disabled?: boolean;
}

/** Props for the SegmentedButton component. */
export interface SegmentedButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** Array of options to render. */
  options: SegmentedButtonOption[];
  /** Currently selected value (controlled). */
  value?: string;
  /** Default selected value (uncontrolled). */
  defaultValue?: string;
  /** Callback fired when the selected value changes. */
  onChange?: (value: string) => void;
  /** Size variant of the segmented button. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button group stretches to full width. @default false */
  fullWidth?: boolean;
}

export const SegmentedButton = forwardRef<HTMLDivElement, SegmentedButtonProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      fullWidth = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? options[0]?.value ?? '',
    );
    const selectedValue = isControlled ? valueProp : internalValue;
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const selectValue = useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setInternalValue(nextValue);
        }
        onChange?.(nextValue);
      },
      [isControlled, onChange],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const enabledOptions = options.filter((o) => !o.disabled);
        if (enabledOptions.length === 0) return;

        const currentIndex = enabledOptions.findIndex(
          (o) => o.value === selectedValue,
        );
        let nextIndex = currentIndex;

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % enabledOptions.length;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIndex =
            (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
        } else {
          return;
        }

        const nextOption = enabledOptions[nextIndex];
        if (nextOption) {
          selectValue(nextOption.value);
          buttonRefs.current.get(nextOption.value)?.focus();
        }
      },
      [options, selectedValue, selectValue],
    );

    return (
      <div
        ref={ref}
        className={cn(
          styles.segmentedButton,
          styles[size],
          fullWidth && styles.fullWidth,
          className,
        )}
        role="radiogroup"
        onKeyDown={handleKeyDown}
        {...props}
      >
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          return (
            <button
              key={option.value}
              ref={(el) => {
                if (el) {
                  buttonRefs.current.set(option.value, el);
                } else {
                  buttonRefs.current.delete(option.value);
                }
              }}
              type="button"
              className={cn(
                styles.option,
                isSelected && styles.optionSelected,
                isFirst && styles.optionFirst,
                isLast && styles.optionLast,
                option.disabled && styles.optionDisabled,
              )}
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              disabled={option.disabled}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => {
                if (!option.disabled) {
                  selectValue(option.value);
                }
              }}
            >
              {option.icon && <span className={styles.icon}>{option.icon}</span>}
              <span className={styles.label}>{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);

SegmentedButton.displayName = 'SegmentedButton';
