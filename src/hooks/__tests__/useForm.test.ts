import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { useForm } from '../useForm';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.coerce.number().min(18, 'Must be 18+'),
});

type FormValues = z.infer<typeof schema>;

const defaults: FormValues = { name: '', email: '', age: 0 };

describe('useForm', () => {
  it('returns initial values', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    expect(result.current.values).toEqual(defaults);
  });

  it('setValue updates a field', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    act(() => result.current.setValue('name', 'Alice'));
    expect(result.current.values.name).toBe('Alice');
  });

  it('tracks isDirty when values change', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    expect(result.current.isDirty).toBe(false);
    act(() => result.current.setValue('name', 'Alice'));
    expect(result.current.isDirty).toBe(true);
  });

  it('isDirty is false with fresh defaults', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    expect(result.current.isDirty).toBe(false);
  });

  it('shows no errors initially', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    expect(Object.keys(result.current.errors)).toHaveLength(0);
  });

  it('shows error for touched invalid field', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    act(() => result.current.setTouched('name'));
    expect(result.current.errors.name).toBe('Name is required');
  });

  it('does not show error for untouched invalid field', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    expect(result.current.errors.name).toBeUndefined();
  });

  it('validates single field', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    const error = result.current.validateField('name');
    expect(error).toBe('Name is required');
  });

  it('validateAll returns false when invalid', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    expect(result.current.validateAll()).toBe(false);
  });

  it('validateAll returns true when valid', () => {
    const valid: FormValues = {
      name: 'Alice',
      email: 'alice@test.com',
      age: 30,
    };
    const { result } = renderHook(() =>
      useForm({ defaultValues: valid, schema }),
    );
    expect(result.current.validateAll()).toBe(true);
  });

  it('handleSubmit prevents submission when invalid', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema, onSubmit }),
    );
    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
    act(() => {
      result.current.handleSubmit(fakeEvent);
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('handleSubmit calls onSubmit when valid', () => {
    const onSubmit = vi.fn();
    const valid: FormValues = {
      name: 'Alice',
      email: 'alice@test.com',
      age: 30,
    };
    const { result } = renderHook(() =>
      useForm({ defaultValues: valid, schema, onSubmit }),
    );
    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
    act(() => {
      result.current.handleSubmit(fakeEvent);
    });
    expect(onSubmit).toHaveBeenCalledWith(valid);
  });

  it('handleSubmit marks all fields touched', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
    act(() => {
      result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.touched.has('name')).toBe(true);
    expect(result.current.touched.has('email')).toBe(true);
    expect(result.current.touched.has('age')).toBe(true);
  });

  it('reset restores defaults', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    act(() => {
      result.current.setValue('name', 'Alice');
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.values.name).toBe('');
    expect(result.current.isDirty).toBe(false);
  });

  it('reset with new values', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: defaults, schema }),
    );
    const newVals: FormValues = { name: 'Bob', email: 'bob@test.com', age: 25 };
    act(() => {
      result.current.reset(newVals);
    });
    expect(result.current.values.name).toBe('Bob');
    expect(result.current.isDirty).toBe(false);
  });

  it('works without schema (basic form state)', () => {
    const { result } = renderHook(() =>
      useForm({ defaultValues: { name: '' } }),
    );
    expect(result.current.isValid).toBe(true);
    act(() => result.current.setValue('name', 'Alice'));
    expect(result.current.values.name).toBe('Alice');
  });

  it('calls onSubmit when valid', () => {
    const onSubmit = vi.fn();
    const valid: FormValues = { name: 'Alice', email: 'a@b.com', age: 25 };
    const { result } = renderHook(() =>
      useForm({ defaultValues: valid, schema, onSubmit }),
    );
    const fakeEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
    act(() => {
      result.current.handleSubmit(fakeEvent);
    });
    expect(onSubmit).toHaveBeenCalled();
  });
});
