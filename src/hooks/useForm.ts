'use client';
import { useState, useCallback, useRef, useMemo } from 'react';
import type { z } from 'zod';

export interface UseFormOptions<T extends Record<string, unknown>> {
  schema?: z.ZodType<T>;
  defaultValues: T;
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Set<keyof T>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setTouched: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => void;
  reset: (newValues?: T) => void;
  validateField: (field: keyof T) => string | undefined;
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
