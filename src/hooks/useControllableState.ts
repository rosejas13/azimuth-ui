'use client';
import { useState, useCallback } from 'react';

export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internal;

  const setValue = useCallback(
    (next: T) => {
      if (controlledValue === undefined) setInternal(next);
      onChange?.(next);
    },
    [controlledValue, onChange]
  );

  return [value, setValue];
}
