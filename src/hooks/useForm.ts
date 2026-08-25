'use client';
import { useState, useCallback, useRef, useMemo } from 'react';
import type { z } from 'zod';

/**
 * Options for {@link useForm}.
 *
 * @typeParam T - Record mapping field names to value types, e.g. `{ email: string }`.
 */
export interface UseFormOptions<T extends Record<string, unknown>> {
  /**
   * Zod schema validated against `values` on every change. Errors surface
   * per-field once a field is touched (see {@link UseFormReturn.errors}).
   * Omit for forms that don't need client-side validation.
   */
  schema?: z.ZodType<T>;
  /** Initial values. Also the target of {@link UseFormReturn.reset} when called without arguments. */
  defaultValues: T;
  /**
   * Called with the parsed values after a successful submit
   * ({@link UseFormReturn.handleSubmit} skips it when validation fails).
   */
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Everything {@link useForm} hands back for wiring controlled inputs.
 *
 * Pair with `<Form form={form}>` so `<Form.Field>` picks up `errors`
 * automatically, or drive plain `<form onSubmit={form.handleSubmit}>` yourself.
 */
export interface UseFormReturn<T> {
  /** Current field values. Source of truth for controlled inputs. */
  values: T;
  /**
   * Validation messages keyed by field name, **gated on touch**: a field's
   * error appears only after it has been touched via
   * {@link UseFormReturn.setTouched} — or after a failed submit, which marks
   * every field touched at once. This keeps pristine forms quiet.
   *
   * `<Form.Field>` resolves its error by matching its `label` prop against
   * these keys (case-insensitive), so schema keys should match labels.
   */
  errors: Partial<Record<keyof T, string>>;
  /** Fields marked touched so far. */
  touched: Set<keyof T>;
  /** `true` when the whole `values` object passes `schema`. Always `true` without a schema. */
  isValid: boolean;
  /** `true` when any value differs from `defaultValues`. */
  isDirty: boolean;
  /** `true` while the promise returned from `onSubmit` is in flight. */
  isSubmitting: boolean;
  /**
   * Update one field's value. Does **not** mark it touched — wire it to your
   * input's flat `onChange` and let blur/submit handle touch:
   *
   * ```tsx
   * <Input value={form.values.email} onChange={(v) => form.setValue('email', v)} />
   * ```
   */
  setValue: (field: keyof T, value: T[keyof T]) => void;
  /** Mark a field touched (typically on blur) to reveal its validation message. */
  setTouched: (field: keyof T) => void;
  /**
   * Submit handler: prevents default, marks **all** fields touched, validates,
   * and calls `onSubmit(values)` only when valid. Pass it straight to
   * `<Form form={form}>` (which invokes it) or `<form onSubmit={form.handleSubmit}>`.
   */
  handleSubmit: (e: React.FormEvent) => void;
  /**
   * Back to initial values and clear touched/submitting state. Passing
   * `newValues` also makes those the new reset target.
   */
  reset: (newValues?: T) => void;
  /** Validate one field against the schema right now; returns its first message or `undefined`. */
  validateField: (field: keyof T) => string | undefined;
  /** Validate everything now; `true` when valid (or schema-less). Does not touch `errors` gating. */
  validateAll: () => boolean;
}

function getFieldErrors<T>(
  schema: z.ZodType<T> | undefined,
  values: T,
): Partial<Record<keyof T, string>> {
  if (!schema) return {};
  const result = schema.safeParse(values);
  if (result.success) return {};
  const parsed: Partial<Record<keyof T, string>> = {};
  for (const issue of (result.error as z.ZodError).issues) {
    if (issue.path.length === 1) {
      const key = issue.path[0] as keyof T;
      if (!parsed[key]) parsed[key] = issue.message;
    }
  }
  return parsed;
}

/**
 * Controlled-form state: values, touch-gated zod validation, and submit handling.
 *
 * Inside `<Form form={form}>`, fields wire **themselves**: give `Form.Field`
 * a `name` (or a label) and value/onChange/onBlur are injected automatically.
 * Manual wiring stays available for custom behavior.
 *
 * @example Automatic wiring — zero per-field ceremony
 * ```tsx
 * const signupSchema = z.object({
 *   email: z.string().email('Enter a valid email'),
 * });
 *
 * function Signup() {
 *   const form = useForm({
 *     schema: signupSchema,
 *     defaultValues: { email: '' },
 *     onSubmit: async (values) => api.signup(values),
 *   });
 *
 *   return (
 *     <Form form={form}>
 *       // Field key comes from name (or lowercased label); error + value
 *       // wiring are injected; blur marks the field touched
 *       <Form.Field name="email">
 *         <Input />
 *       </Form.Field>
 *       <Button type="submit" disabled={form.isSubmitting}>
 *         {form.isSubmitting ? 'Signing up…' : 'Sign up'}
 *       </Button>
 *     </Form>
 *   );
 * }
 * ```
 *
 * @example Manual wiring when you need it
 * ```tsx
 * <Input
 *   value={form.values.email}
 *   onChange={(v) => form.setValue('email', v)}
 *   onBlur={() => form.setTouched('email')}
 * />
 * ```
 *
 * @remarks
 * Validation is **lazy by design**: errors exist only for touched fields, and a
 * failed submit touches everything so the full picture appears at once. If you
 * need eager messages, render `form.validateField('email')` directly.
 *
 * @param options - {@link UseFormOptions}
 * @typeParam T - Record mapping field names to value types.
 */
export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
): UseFormReturn<T> {
  const { schema, defaultValues, onSubmit } = options;
  const [values, setValues] = useState<T>({ ...defaultValues });
  const [touched, setTouchedState] = useState<Set<keyof T>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultsRef = useRef(defaultValues);

  const allErrors = useMemo(
    () => getFieldErrors(schema, values),
    [schema, values],
  );
  const errors = useMemo(() => {
    if (touched.size === 0) return {};
    const filtered: Partial<Record<keyof T, string>> = {};
    for (const key of touched) {
      if (allErrors[key]) filtered[key] = allErrors[key];
    }
    return filtered;
  }, [allErrors, touched]);

  const isValid = useMemo(() => {
    if (!schema) return true;
    return schema.safeParse(values).success;
  }, [schema, values]);

  const isDirty = useMemo(
    () =>
      Object.keys(values).some(
        (key) => values[key as keyof T] !== defaultsRef.current[key as keyof T],
      ),
    [values],
  );

  const validateField = useCallback(
    (field: keyof T): string | undefined => {
      if (!schema) return undefined;
      const fieldErrors = getFieldErrors(schema, values);
      return fieldErrors[field];
    },
    [schema, values],
  );

  const validateAll = useCallback((): boolean => {
    if (!schema) return true;
    return schema.safeParse(values).success;
  }, [schema, values]);

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setTouched = useCallback((field: keyof T) => {
    setTouchedState((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const allKeys = Object.keys(values) as Array<keyof T>;
      setTouchedState(new Set(allKeys));
      if (!schema) {
        if (onSubmit) {
          setIsSubmitting(true);
          void onSubmit(values)?.finally?.(() => setIsSubmitting(false));
        }
        return;
      }
      const result = schema.safeParse(values);
      if (!result.success) return;
      if (onSubmit) {
        setIsSubmitting(true);
        void onSubmit(values)?.finally?.(() => setIsSubmitting(false));
      }
    },
    [onSubmit, schema, values],
  );

  const reset = useCallback((newValues?: T) => {
    const v = newValues ?? { ...defaultsRef.current };
    setValues(v);
    if (newValues) defaultsRef.current = { ...newValues };
    setTouchedState(new Set());
    setIsSubmitting(false);
  }, []);

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    setValue,
    setTouched,
    handleSubmit,
    reset,
    validateField,
    validateAll,
  };
}
