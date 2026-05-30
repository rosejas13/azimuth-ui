'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import styles from './Drawer.module.css';

/**
 * Props for the Drawer component.
 */
export interface DrawerProps extends ComponentPropsWithoutRef<'div'> {
  visible: { open: boolean; onClose: () => void };
  config?: {
    /** @default 'left' */
    side?: 'left' | 'right';
    title?: string;
    /** @default 'md' */
    size?: 'sm' | 'md' | 'lg';
    /** @default false */
    persistent?: boolean;
  };
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * A slide-in panel that opens from the left or right edge of the viewport.
 *
 * Renders via portal to `document.body`. Supports title, footer, and optional
 * persistent mode that prevents overlay-click dismissal.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      visible: { open, onClose },
      config: { side = 'left', title, size = 'md', persistent = false } = {},
      children,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);
    const titleId = useRef(
      `azimuth-drawer-${Math.random().toString(36).slice(2, 9)}`,
    ).current;

    const setOverlayRef = useCallback(
      (node: HTMLDivElement | null) => {
        overlayRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref).current = node;
        }
      },
      [ref],
    );

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      },
      [onClose],
    );

    useEffect(() => {
      if (!open) return;

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, handleEscape]);

    useEffect(() => {
      if (!open) return;

      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    useEffect(() => {
      if (!open) return;

      const timer = setTimeout(() => {
        const firstFocusable = drawerRef.current?.querySelector<
          HTMLElement
        >(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        firstFocusable?.focus();
      }, 50);

      return () => clearTimeout(timer);
    }, [open]);

    useEffect(() => {
      const el = overlayRef.current;
      if (!el || !open) return;

      const handleOverlayClick = (e: MouseEvent) => {
        if (!persistent && e.target === e.currentTarget) {
          onClose();
        }
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      };

      el.addEventListener('click', handleOverlayClick);
      el.addEventListener('keydown', handleKeyDown);
      return () => {
        el.removeEventListener('click', handleOverlayClick);
        el.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, persistent, onClose]);

    if (!open) return null;

    return createPortal(
      <div
        ref={setOverlayRef}
        className={cn(styles.overlay, className)}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        {...props}
      >
        <div
          ref={drawerRef}
          className={cn(styles.drawer, styles[side], styles[size])}
        >
          {title && (
            <div className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close dialog"
              >
                &#x2715;
              </button>
            </div>
          )}

          <div className={styles.body}>{children}</div>

          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>,
      document.body,
    );
  },
);

Drawer.displayName = 'Drawer';
