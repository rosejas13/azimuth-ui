'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useId,
  useMemo,
  createContext,
  useContext,
  cloneElement,
  Children,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Form.module.css';
import type { UseFormReturn } from '@/hooks/useForm';
import { InputConfigProvider } from '../input-config';

interface FormContextValue {
  errors: Record<string, string | undefined>;
  setTouched: (field: string) => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue | null {
  return useContext(FormContext);
}

/** Props for the Form root component. */
export interface FormProps extends Omit<
  ComponentPropsWithoutRef<'form'>,
  'onSubmit'
> {
  onSubmit?: (
    data: Record<string, FormDataEntryValue | FormDataEntryValue[]>,
  ) => void;
  /** useForm return object for auto-wiring validation and errors */
  form?: UseFormReturn<Record<string, unknown>>;
  /** @default 'md' */
  spacing?: 'sm' | 'md' | 'lg';
  /** Default `size` inherited by every child input, unless overridden. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Default `labelPosition` inherited by every child input, unless overridden. @default 'top' */
  labelPosition?: 'top' | 'left' | 'inner';
  children?: React.ReactNode;
}

/** A form wrapper that serializes submissions into a key-value record and prevents default browser validation. */
const FormRoot = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      onSubmit,
      form,
      spacing = 'md',
      size,
      labelPosition,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const handleFormSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        if (form) {
          form.handleSubmit(e);
          return;
        }
        e.preventDefault();
        if (!onSubmit) return;
        const formData = new FormData(e.currentTarget);
        const data: Record<string, FormDataEntryValue | FormDataEntryValue[]> =
          {};
        formData.forEach((value, key) => {
          if (key in data) {
            const existing = data[key];
            if (Array.isArray(existing)) {
              existing.push(value);
            } else {
              data[key] = [existing, value];
            }
          } else {
            data[key] = value;
          }
        });
        onSubmit(data);
      },
      [onSubmit, form],
    );

    const ctx = form
      ? {
          errors: form.errors as Record<string, string | undefined>,
          setTouched: (field: string) => form.setTouched(field),
        }
      : null;

    const config = useMemo(
      () => ({ size, labelPosition }),
      [size, labelPosition],
    );

    return (
      <InputConfigProvider value={config}>
        <FormContext.Provider value={ctx}>
          <form
            ref={ref}
            noValidate
            onSubmit={handleFormSubmit}
            className={cn(
              styles.form,
              spacing === 'sm' && styles.spacingSm,
              spacing === 'md' && styles.spacingMd,
              spacing === 'lg' && styles.spacingLg,
              className,
            )}
            aria-errormessage={undefined}
            {...props}
          >
            {children}
          </form>
        </FormContext.Provider>
      </InputConfigProvider>
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
      error: explicitError,
      helpText,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const fieldId = `${id}-input`;
    const errorId = `${id}-error`;
    const helpId = `${id}-help`;
    const ctx = useFormContext();
    const ctxError = label && ctx ? ctx.errors[label.toLowerCase()] : undefined;
    const error = explicitError ?? ctxError;

    const child = Children.only(children);
    const childWithId = cloneElement(
      child as React.ReactElement<{
        id?: string;
        'aria-invalid'?: string;
        'aria-describedby'?: string;
      }>,
      {
        id: fieldId,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? errorId : helpText ? helpId : undefined,
      },
    );

    return (
      <div ref={ref} className={cn(styles.field, className)} {...props}>
        {label && (
          <label className={styles.label} htmlFor={fieldId}>
            {label}
            {required && (
              <span className={styles.required} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div
          className={cn(styles.fieldControl, error && styles.fieldControlError)}
        >
          {childWithId}
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
