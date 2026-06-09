'use client';
import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within a container while active. Cycles Tab and Shift+Tab
 * through focusable children. Focuses the first child on activation. Restores
 * focus to the previously-active element on deactivation.
 *
 * Handles edge cases: no focusable children (focuses the container itself),
 * dynamic DOM changes (re-queries focusable elements on each Tab press).
 */
export function useFocusTrap(
  /** Ref to the container element whose focusable children will be cycled. */
  ref: RefObject<HTMLElement | null>,
  /** Whether the focus trap is active. */
  active: boolean,
) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      previousActiveElement.current = null;
      return;
    }

    previousActiveElement.current = document.activeElement as HTMLElement;

    const rafId = requestAnimationFrame(() => {
      const container = ref.current;
      if (!container) return;

      const focusable =
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        container.focus();
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const container = ref.current;
      if (!container) return;

      const focusable =
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleKeyDown);

      if (
        previousActiveElement.current &&
        document.contains(previousActiveElement.current)
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [ref, active]);
}
