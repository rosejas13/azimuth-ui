'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Select.module.css';

/** A select dropdown component with label, validation, and custom options. */
export interface SelectProps
  extends Omit<ComponentPropsWithoutRef<'select'>, 'size'> {
  /** The label text for the select. */
  label?: string;
  /** Helper text displayed below the label. */
  subtitle?: string;
  /** Error message displayed below the select. */
  error?: string;
  /** Whether the select is required. @default false */
  required?: boolean;
  /** The size of the select. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Placeholder option text displayed when no value is selected. */
  placeholder?: string;
  /** The list of options to display in the dropdown. */
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      subtitle,
      error,
      required = false,
      size = 'md',
      placeholder,
      options,
      className,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId =
      id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn(styles.wrapper, styles[size])}>
        <div className={styles.headerArea}>
          {label && (
            <label
              htmlFor={generatedId}
              className={cn(styles.label, required && styles.required)}
            >
              {label}
            </label>
          )}
          {subtitle && <span id={`${generatedId}-subtitle`} className={styles.subtitle}>{subtitle}</span>}
        </div>
        <div className={styles.selectContainer}>
          <select
            ref={ref}
            id={generatedId}
            className={cn(
              styles.select,
              error && styles.hasError,
              className,
            )}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error
                ? `${generatedId}-error`
                : subtitle
                  ? `${generatedId}-subtitle`
                  : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
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
            <span id={`${generatedId}-error`} className={styles.errorMessage} role="alert">
              {error}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
