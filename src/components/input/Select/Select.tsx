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

/** Shared surface for both Select modes. */
interface SelectBaseProps {
  /** The options to render inside the native `<select>`. */
  options: SelectOption[];
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

  /** Disabled placeholder option rendered first, e.g. "Choose...". Single-select only. */
  placeholder?: string;

  // Curated native attributes. Anything not listed here goes through `selectProps`.
  id?: string;
  name?: string;
  autoFocus?: boolean;
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

/** Single-select mode: `value` and `onChange` carry one string. */
export interface SelectSingleProps extends SelectBaseProps {
  multiple?: false;
  /**
   * Controlled selected value. Pair with `onChange`. When omitted the select is uncontrolled.
   * Pass `null`, `''`, or leave unset to show no selection.
   */
  value?: string | null;
  /** Initial value for an uncontrolled select. Ignored while `value` is set. `null` shows no selection. */
  defaultValue?: string | null;
  /** Called with the selected value on change. */
  onChange?: (value: string) => void;
}

/** Multi-select mode (`multiple`): `value` and `onChange` carry arrays of selected values, in selection order. */
export interface SelectMultipleProps extends SelectBaseProps {
  multiple: true;
  /** Controlled array of selected values. Pair with `onChange`. When omitted the select is uncontrolled. */
  value?: string[];
  /** Initial array of selected values for an uncontrolled select. Ignored while `value` is set. */
  defaultValue?: string[];
  /** Called with the full array of selected values on change. */
  onChange?: (value: string[]) => void;
}

/** A native select element with label, validation, and custom chevron styling. */
export type SelectProps = SelectSingleProps | SelectMultipleProps;

type SelectImplProps = SelectBaseProps & {
  multiple?: boolean;
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: never) => void;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(props, ref) {
    const {
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
      ...rest
    } = props as SelectImplProps;
    const { multiple } = rest;
    const { size: configSize } = useInputConfig();
    const resolvedSize = size ?? configSize ?? 'md';
    const generatedId = useId();
    const fieldId = id || generatedId;
    const hasHeader = Boolean(label) || Boolean(subtitle);
    const hasFooter = Boolean(error);
    const controlled = value !== undefined;
    const blankValue =
      !multiple &&
      (controlled
        ? value === null || value === ''
        : defaultValue === null || defaultValue === '');

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (multiple) {
          onChange?.(
            Array.from(e.target.selectedOptions, (opt) => opt.value) as never,
          );
        } else {
          onChange?.(e.target.value as never);
        }
      },
      [onChange, multiple],
    );

    return (
      <div className={cn(styles.wrapper, styles[resolvedSize])}>
        {hasHeader && (
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
        )}
        <div className={styles.selectContainer}>
          <select
            ref={ref}
            id={fieldId}
            className={cn(styles.select, error && styles.hasError, className)}
            value={controlled ? (value ?? '') : undefined}
            defaultValue={!controlled ? (defaultValue ?? '') : undefined}
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
            {...rest}
            multiple={multiple}
            {...selectProps}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : blankValue ? (
              <option value="" hidden />
            ) : null}
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
        {hasFooter && (
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
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
