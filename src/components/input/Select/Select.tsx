'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Select.module.css';

/** Props for the Select component. */
export interface SelectProps
  extends Omit<ComponentPropsWithoutRef<'select'>, 'size'> {
  label?: {
    text?: string;
    subtitle?: string;
    error?: string;
    /** @default false */
    required?: boolean;
  };
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

/** A native select element wrapper with label, validation, and custom chevron styling. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label: { text: label = '', subtitle, error, required = false } = {},
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
