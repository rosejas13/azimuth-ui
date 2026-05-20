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

/** Props for the Drawer component. */
export interface DrawerProps extends ComponentPropsWithoutRef<'div'> {
  /** Whether the drawer is visible. */
  open: boolean;
  /** Callback fired when the drawer requests to close. */
  onClose: () => void;
  /** The side of the screen the drawer slides from. @default 'left' */
  side?: 'left' | 'right';
  /** Drawer title text. */
  title?: string;
  /** The width of the drawer. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Whether clicking the overlay closes the drawer. @default false */
  persistent?: boolean;
  /** The content of the drawer body. */
  children?: React.ReactNode;
  /** Footer content. */
  footer?: React.ReactNode;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      side = 'left',
      title,
      size = 'md',
      persistent = false,
      children,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const titleId = useRef(
      `azimuth-drawer-${Math.random().toString(36).slice(2, 9)}`,
    ).current;

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      },
      [onClose],
    );

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (!persistent && e.target === e.currentTarget) {
          onClose();
        }
      },
      [persistent, onClose],
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

    if (!open) return null;

    return createPortal(
      <div
        ref={ref}
        className={cn(styles.overlay, className)}
        onClick={handleOverlayClick}
        role="dialog"
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
