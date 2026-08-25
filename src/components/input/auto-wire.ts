'use client';

import { createContext, useContext } from 'react';

/**
 * Source of truth a `<Form form={form}>` exposes so named controls can wire
 * themselves. Provided by FormRoot; consumed by input components.
 */
export interface AutoWireSource {
  values: Record<string, unknown>;
  setValue: (field: string, value: unknown) => void;
  setTouched: (field: string) => void;
}

export const AutoWireContext = createContext<AutoWireSource | null>(null);

export interface AutoWireOptions {
  /** Field key inside the form values object. Absent or undefined disables wiring. */
  name: string | undefined;
  /** The control's own `value` prop. If set, wiring is skipped (explicit control wins). */
  value: unknown;
  /** The control's own `onChange` prop. If set, wiring is skipped (explicit control wins). */
  onChange: unknown;
  /** The control's own blur handler; wrapped with touched-marking when wired. */
  /** The control's own blur handler; wrapped with touched-marking when wired. */
  onBlur?: unknown;
  /**
   * Which prop receives the wired state:
   * - `'string'` (default): `value`, with unset fields falling back to `blank`
   * - `'boolean'`: `checked`
   * - `'raw'`: `value` passed through untouched (dates, arrays, objects)
   */
  kind?: 'string' | 'boolean' | 'raw';
  /** Fallback for `'string'` kind when the field is unset. @default '' */
  blank?: unknown;
}

/**
 * Resolves the props a named control needs to participate in a
 * `<Form form={form}>` without manual wiring. Returns an empty object
 * outside such a form, when the field is unnamed, or when the caller
 * passes its own `value`/`onChange`.
 *
 * Spread the result into the native element AFTER internal handlers but
 * BEFORE escape-hatch props.
 */
export function useAutoWireProps(
  options: AutoWireOptions,
): Record<string, unknown> {
  const ctx = useContext(AutoWireContext);
  if (
    !ctx ||
    !options.name ||
    options.value !== undefined ||
    options.onChange !== undefined
  ) {
    return {};
  }
  const fieldName = options.name;
  const wired = ctx.values[fieldName];
  const props: Record<string, unknown> = {
    onChange: (v: unknown) => ctx.setValue(fieldName, v),
    onBlur: (...args: unknown[]) => {
      ctx.setTouched(fieldName);
      const userBlur = options.onBlur as
        | ((...args: unknown[]) => void)
        | undefined;
      userBlur?.(...args);
    },
  };
  if (options.kind === 'boolean') {
    props.checked = Boolean(wired);
  } else if (options.kind === 'raw') {
    props.value = wired;
  } else {
    props.value = wired ?? options.blank ?? '';
  }
  return props;
}
