import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  it('returns default value when uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState<string>(undefined, 'default'),
    );
    expect(result.current[0]).toBe('default');
  });

  it('returns controlled value when provided', () => {
    const { result } = renderHook(() =>
      useControllableState<string>('controlled', 'default'),
    );
    expect(result.current[0]).toBe('controlled');
  });

  it('updates internal state when uncontrolled', () => {
    const { result } = renderHook(() =>
      useControllableState<string>(undefined, 'default'),
    );
    act(() => result.current[1]('new value'));
    expect(result.current[0]).toBe('new value');
  });

  it('does not update internal state when controlled', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string | undefined }) =>
        useControllableState<string>(val, 'default'),
      { initialProps: { val: 'controlled' } },
    );

    act(() => result.current[1]('should not change'));
    expect(result.current[0]).toBe('controlled');

    rerender({ val: 'new controlled' });
    expect(result.current[0]).toBe('new controlled');
  });

  it('calls onChange with the new value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<string>(undefined, 'default', onChange),
    );
    act(() => result.current[1]('updated'));
    expect(onChange).toHaveBeenCalledWith('updated');
  });

  it('calls onChange even when controlled', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<string>('controlled', 'default', onChange),
    );
    act(() => result.current[1]('should fire onChange'));
    expect(onChange).toHaveBeenCalledWith('should fire onChange');
    expect(result.current[0]).toBe('controlled');
  });

  it('works with numeric values', () => {
    const { result } = renderHook(() =>
      useControllableState(undefined, 0),
    );
    expect(result.current[0]).toBe(0);
    act(() => result.current[1](42));
    expect(result.current[0]).toBe(42);
  });
});
