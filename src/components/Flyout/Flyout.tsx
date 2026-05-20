'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Flyout.module.css';

/** Props for the Flyout component. */
export interface FlyoutProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'content'> {
  /** The element that triggers the flyout. */
  trigger: React.ReactNode;
  /** The content rendered inside the flyout. */
  content: React.ReactNode;
  /** Placement of the flyout relative to the trigger. @default 'bottom' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before opening in milliseconds. @default 200 */
  openDelay?: number;
  /** Delay before closing in milliseconds. @default 150 */
  closeDelay?: number;
}

export const Flyout = forwardRef<HTMLDivElement, FlyoutProps>(
  (
    {
      trigger,
      content,
      side = 'bottom',
      openDelay = 200,
      closeDelay = 150,
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const openTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const clearTimers = useCallback(() => {
      if (openTimerRef.current !== undefined) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = undefined;
      }
      if (closeTimerRef.current !== undefined) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = undefined;
      }
    }, []);

    const handleMouseEnter = useCallback(() => {
      clearTimers();
      openTimerRef.current = setTimeout(() => setOpen(true), openDelay);
    }, [clearTimers, openDelay]);

    const handleMouseLeave = useCallback(() => {
      clearTimers();
      closeTimerRef.current = setTimeout(() => setOpen(false), closeDelay);
    }, [clearTimers, closeDelay]);

    useEffect(() => {
      return () => clearTimers();
    }, [clearTimers]);

    return (
      <div
        ref={mergedRef}
        className={cn(styles.flyout, className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span
          className={styles.trigger}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
            if (e.key === 'Escape') setOpen(false);
          }}
          onFocus={() => { clearTimers(); setOpen(true); }}
          onBlur={() => { clearTimers(); openTimerRef.current = setTimeout(() => setOpen(false), closeDelay); }}
        >
          {trigger}
        </span>
        {open && (
          <div
            className={cn(styles.panel, styles[side])}
            role="tooltip"
          >
            {content}
          </div>
        )}
      </div>
    );
  },
);

Flyout.displayName = 'Flyout';
