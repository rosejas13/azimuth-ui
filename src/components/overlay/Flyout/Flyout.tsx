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

export interface FlyoutProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'content'> {
  trigger: React.ReactNode;
  content: React.ReactNode;
  /** @default 'bottom' */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** @default 200 */
  openDelay?: number;
  /** @default 150 */
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
    const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
    const openTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const updatePosition = useCallback(() => {
      if (!wrapperRef.current) return;
      const triggerRect = wrapperRef.current.getBoundingClientRect();
      const gap = 6;
      switch (side) {
        case 'bottom':
          setPanelStyle({ position: 'fixed', top: triggerRect.bottom + gap, left: triggerRect.left + triggerRect.width / 2, transform: 'translateX(-50%)', zIndex: 500 });
          break;
        case 'top':
          setPanelStyle({ position: 'fixed', bottom: window.innerHeight - triggerRect.top + gap, left: triggerRect.left + triggerRect.width / 2, transform: 'translateX(-50%)', zIndex: 500 });
          break;
        case 'left':
          setPanelStyle({ position: 'fixed', top: triggerRect.top + triggerRect.height / 2, right: window.innerWidth - triggerRect.left + gap, transform: 'translateY(-50%)', zIndex: 500 });
          break;
        case 'right':
          setPanelStyle({ position: 'fixed', top: triggerRect.top + triggerRect.height / 2, left: triggerRect.right + gap, transform: 'translateY(-50%)', zIndex: 500 });
          break;
      }
    }, [side]);

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
      openTimerRef.current = setTimeout(() => { updatePosition(); setOpen(true); }, openDelay);
    }, [clearTimers, openDelay, updatePosition]);

    const handleMouseLeave = useCallback(() => {
      clearTimers();
      closeTimerRef.current = setTimeout(() => setOpen(false), closeDelay);
    }, [clearTimers, closeDelay]);

    useEffect(() => {
      if (!open) return;
      function handler() { updatePosition(); }
      window.addEventListener('scroll', handler, true);
      window.addEventListener('resize', handler);
      return () => {
        window.removeEventListener('scroll', handler, true);
        window.removeEventListener('resize', handler);
      };
    }, [open, updatePosition]);

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
              updatePosition();
              setOpen(true);
            }
            if (e.key === 'Escape') setOpen(false);
          }}
          onFocus={() => { clearTimers(); updatePosition(); setOpen(true); }}
          onBlur={() => { clearTimers(); openTimerRef.current = setTimeout(() => setOpen(false), closeDelay); }}
        >
          {trigger}
        </span>
        {open && (
          <div
            ref={panelRef}
            className={cn(styles.panel)}
            role="tooltip"
            style={panelStyle}
          >
            {content}
          </div>
        )}
      </div>
    );
  },
);

Flyout.displayName = 'Flyout';
