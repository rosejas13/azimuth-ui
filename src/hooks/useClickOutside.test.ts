import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('calls handler when clicking outside', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useClickOutside(ref, handler));

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();

    document.body.removeChild(ref.current);
    document.body.removeChild(outside);
  });

  it('does not call handler when clicking inside ref', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useClickOutside(ref, handler));

    ref.current.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(ref.current);
  });

  it('does not call handler when ref is null', () => {
    const handler = vi.fn();
    const ref = { current: null };

    renderHook(() => useClickOutside(ref, handler));

    document.dispatchEvent(new MouseEvent('mousedown'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call handler when disabled', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useClickOutside(ref, handler, false));

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(ref.current);
    document.body.removeChild(outside);
  });

  it('removes listeners on unmount', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useClickOutside(ref, handler));
    unmount();

    const mousedownAdded = addSpy.mock.calls.filter(
      ([event]) => event === 'mousedown',
    ).length;
    const mousedownRemoved = removeSpy.mock.calls.filter(
      ([event]) => event === 'mousedown',
    ).length;

    expect(mousedownRemoved).toBeGreaterThanOrEqual(mousedownAdded);

    addSpy.mockRestore();
    removeSpy.mockRestore();
    document.body.removeChild(ref.current);
  });
});
