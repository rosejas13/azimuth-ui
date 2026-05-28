import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDisclosure } from '../useDisclosure';

describe('useDisclosure', () => {
  it('defaults to closed', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('accepts initialOpen', () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('onOpen sets isOpen to true', () => {
    const { result } = renderHook(() => useDisclosure(false));
    act(() => result.current.onOpen());
    expect(result.current.isOpen).toBe(true);
  });

  it('onClose sets isOpen to false', () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => result.current.onClose());
    expect(result.current.isOpen).toBe(false);
  });

  it('onToggle flips the value', () => {
    const { result } = renderHook(() => useDisclosure(false));
    act(() => result.current.onToggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.onToggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('setIsOpen sets arbitrary value', () => {
    const { result } = renderHook(() => useDisclosure(false));
    act(() => result.current.setIsOpen(true));
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.setIsOpen(false));
    expect(result.current.isOpen).toBe(false);
  });
});
