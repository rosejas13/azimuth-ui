'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useId,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Form.module.css';

/** Props for the Form root component. */
export interface FormProps extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  onSubmit?: (data: Record<string, FormDataEntryValue>) => void;
  /** @default 'md' */
  spacing?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

/** A form wrapper that serializes submissions into a key-value record and prevents default browser validation. */
const FormRoot = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      onSubmit,
      spacing = 'md',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!onSubmit) return;
        const formData = new FormData(e.currentTarget);
        const data: Record<string, FormDataEntryValue> = {};
        formData.forEach((value, key) => {
          if (key in data) {
            const existing = data[key];
            if (Array.isArray(existing)) {
              existing.push(value);
            } else {
              data[key] = [existing, value] as unknown as FormDataEntryValue;
            }
          } else {
            data[key] = value;
          }
        });
        onSubmit(data);
      },
      [onSubmit],
    );

    return (
      <form
        ref={ref}
        className={cn(
          styles.form,
          spacing === 'sm' && styles.spacingSm,
          spacing === 'md' && styles.spacingMd,
          spacing === 'lg' && styles.spacingLg,
          className,
        )}
        onSubmit={handleSubmit}
        noValidate
        {...props}
      >
        {children}
      </form>
    );
  },
);

FormRoot.displayName = 'Form';

/** Props for the Form.Field sub-component. */
export interface FormFieldProps extends ComponentPropsWithoutRef<'div'> {
  /** Label text rendered above the field. */
  label?: string;
  /** @default false */
  required?: boolean;
  /** Validation error message displayed below the field. */
  error?: string;
  /** Help text displayed below the field when there is no error. */
  helpText?: string;
  children?: React.ReactNode;
}

/** A labeled form field with validation error and help text support. */
const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      required = false,
      error,
      helpText,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const errorId = `${id}-error`;
    const helpId = `${id}-help`;

    return (
      <div ref={ref} className={cn(styles.field, className)} {...props}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div
          className={cn(
            styles.fieldControl,
            error && styles.fieldControlError,
          )}
        >
          {children}
        </div>
        {helpText && !error && (
          <span id={helpId} className={styles.helpText}>
            {helpText}
          </span>
        )}
        {error && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

FormField.displayName = 'Form.Field';

export const Form = Object.assign(FormRoot, {
  Field: FormField,
});
