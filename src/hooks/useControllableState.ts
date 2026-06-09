'use client';
import { useState, useCallback } from 'react';

/** Manages a value that can be either controlled (external) or uncontrolled (internal). */
export function useControllableState<T>(
  /** External controlled value. Pass `undefined` to use internal state. */
  controlledValue: T | undefined,
  /** @default undefined */
  defaultValue: T,
  /** Callback fired when the value changes. */
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internal;

  const setValue = useCallback(
    (next: T) => {
      if (controlledValue === undefined) setInternal(next);
      onChange?.(next);
    },
    [controlledValue, onChange],
  );

  return [value, setValue];
}
