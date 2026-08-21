'use client';

import {
  forwardRef,
  useCallback,
  useId,
  type CSSProperties,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type SelectHTMLAttributes,
} from 'react';
import { cn } from '@/utils/cn';
import { useInputConfig } from '../input-config';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** A native select element with label, validation, and custom chevron styling. */
export interface SelectProps {
  /** The options to render inside the native `<select>`. */
  options: SelectOption[];
  /** Controlled value. Pair with `onChange`. When omitted the select is uncontrolled. */
  value?: string;
  /** Initial value for an uncontrolled select. Ignored while `value` is set. */
  defaultValue?: string;
  /** Called with the selected value on change. */
  onChange?: (value: string) => void;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;

  /** Label text above the select. */
  label?: string;
  /** Helper text rendered below the label. */
  subtitle?: string;
  /** Validation error rendered below the select. Sets `aria-invalid`. */
  error?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Disabled placeholder option rendered first, e.g. "Choose...". */
  placeholder?: string;

  // Curated native attributes. Anything not listed here goes through `selectProps`.
  id?: string;
  name?: string;
  autoFocus?: boolean;
  multiple?: boolean;
  tabIndex?: number;
  style?: CSSProperties;
  'data-testid'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-labelledby'?: string;
  onFocus?: FocusEventHandler<HTMLSelectElement>;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
  onKeyDown?: KeyboardEventHandler<HTMLSelectElement>;

  /** Escape hatch for any native attribute not listed above. Spread last, wins over other props. */
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>;
  /** Styling for the underlying `<select>` element. */
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      disabled = false,
      required = false,
      label,
      subtitle,
      error,
      size,
      placeholder,
      className,
      id,
      selectProps,
      ...props
    },
    ref,
  ) => {
    const { size: configSize } = useInputConfig();
    const resolvedSize = size ?? configSize ?? 'md';
    const generatedId = useId();
    const fieldId = id || generatedId;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
      },
      [onChange],
    );

    return (
      <div className={cn(styles.wrapper, styles[resolvedSize])}>
        <div className={styles.headerArea}>
          {label && (
            <label
              htmlFor={fieldId}
              className={cn(styles.label, required && styles.required)}
            >
              {label}
            </label>
          )}
          {subtitle && (
            <span id={`${fieldId}-subtitle`} className={styles.subtitle}>
              {subtitle}
            </span>
          )}
        </div>
        <div className={styles.selectContainer}>
          <select
            ref={ref}
            id={fieldId}
            className={cn(styles.select, error && styles.hasError, className)}
            value={value}
            defaultValue={value !== undefined ? undefined : defaultValue}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error
                ? `${fieldId}-error`
                : subtitle
                  ? `${fieldId}-subtitle`
                  : undefined
            }
            {...props}
            {...selectProps}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className={styles.chevron} aria-hidden="true">
            ▾
          </span>
        </div>
        <div className={styles.footerArea}>
          {error && (
            <span
              id={`${fieldId}-error`}
              className={styles.errorMessage}
              role="alert"
            >
              {error}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
