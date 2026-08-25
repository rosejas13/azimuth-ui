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
  /** Present only when the `form` prop is set; enables Form.Field auto-wiring. */
  values?: Record<string, unknown>;
  setValue?: (field: string, value: unknown) => void;
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
  /** useForm return object for auto-wiring validation and errors.
   *
   * @remarks
   * Accepts any `UseFormReturn<T>` regardless of your concrete field type:
   * `<Form>` only reads `handleSubmit`, `errors`, and `setTouched`, which are
   * keyed by strings at this boundary. Your schema type stays intact on the
   * hook itself for `values`/`setValue`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic boundary; see remarks
  form?: UseFormReturn<any>;
  /** @default 'md' */
  spacing?: 'sm' | 'md' | 'lg';
  /** Default `size` inherited by every child input, unless overridden. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
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

    const ctx = useMemo(
      () =>
        form
          ? {
              errors: form.errors,
              setTouched: (field: string) => form.setTouched(field),
              values: form.values as Record<string, unknown>,
              setValue: (field: string, value: unknown) =>
                form.setValue(field, value),
            }
          : null,
      [form],
    );

    const config = useMemo(
      () => ({ size, labelPosition, inForm: true as const }),
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
  /**
   * Label text rendered above the field.
   *
   * @remarks
   * When used inside `<Form form={form}>`, this label doubles as the field
   * key unless {@link FormFieldProps.name} is set: it drives both value
   * auto-wiring and error lookup (case-insensitive against schema names).
   */
  label?: string;
  /**
   * Field key for `<Form form={form}>` auto-wiring and error lookup.
   * Falls back to the lowercased `label` when omitted.
   */
  name?: string;
  /** @default false */
  required?: boolean;
  /** Validation error message displayed below the field. */
  error?: string;
  /** Help text displayed below the field when there is no error. */
  helpText?: string;
  children?: React.ReactNode;
}

/** Controls whose flat state prop is `checked` (boolean) rather than `value`. */
const BOOLEAN_CONTROLS = new Set(['Toggle', 'Checkbox']);

/**
 * A labeled form field with validation error and help text support.
 *
 * @remarks
 * Inside `<Form form={form}>`, the single child control is **auto-wired**:
 * its value, change handler, and blur-touched marking are injected from the
 * form hook, keyed by `name` (or the lowercased label). Pass your own
 * `value`/`onChange` on the child to opt out per-field.
 *
 * @example
 * ```tsx
 * const form = useForm({ schema, defaultValues: { email: '' } });
 * <Form form={form}>
 *   <Form.Field label="Email"><Input /></Form.Field>
 * </Form>
 * ```
 */
const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      name,
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
    const fieldName = name ?? (label ? label.toLowerCase() : undefined);
    const ctxError = fieldName && ctx ? ctx.errors[fieldName] : undefined;
    const error = explicitError ?? ctxError;

    const child = Children.only(children);
    const childProps = ((child as React.ReactElement).props ?? {}) as Record<
      string,
      unknown
    >;

    // Auto-wiring: inject controlled value/change/touched from the form hook.
    const injected: Record<string, unknown> = {};
    if (
      ctx?.values &&
      ctx.setValue &&
      fieldName &&
      childProps.value === undefined &&
      childProps.checked === undefined &&
      childProps.onChange === undefined
    ) {
      const wired = ctx.values[fieldName] ?? '';
      injected.onChange = (v: unknown) => ctx.setValue!(fieldName, v);
      const childType = (child as React.ReactElement).type as
        | { displayName?: string }
        | string;
      const displayName =
        typeof childType === 'string' ? undefined : childType.displayName;
      if (BOOLEAN_CONTROLS.has(displayName ?? '')) {
        injected.checked = Boolean(wired);
      } else {
        injected.value = wired;
      }
    }
    if (ctx?.setTouched && fieldName) {
      const userOnBlur = childProps.onBlur as
        | ((...args: unknown[]) => void)
        | undefined;
      injected.onBlur = (...args: unknown[]) => {
        ctx.setTouched(fieldName);
        userOnBlur?.(...args);
      };
    }

    const childWithId = cloneElement(
      child as React.ReactElement<{
        id?: string;
        'aria-invalid'?: string;
        'aria-describedby'?: string;
        [key: string]: unknown;
      }>,
      {
        id: fieldId,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? errorId : helpText ? helpId : undefined,
        ...injected,
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
