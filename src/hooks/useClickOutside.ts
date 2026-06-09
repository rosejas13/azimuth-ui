'use client';
import { useEffect, type RefObject } from 'react';

/** Fires a handler when a click or touch event occurs outside the referenced element. */
export function useClickOutside<T extends HTMLElement>(
  /** Ref to the element to watch. */
  ref: RefObject<T | null>,
  /** Callback fired on outside click/touch. */
  handler: () => void,
  /** @default true */
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
