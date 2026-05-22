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
import styles from './Modal.module.css';

export interface ModalProps extends ComponentPropsWithoutRef<'div'> {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  /** @default false */
  persistent?: boolean;
  /** @default 'none' */
  blur?: 'none' | 'sm' | 'md' | 'lg';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      subtitle,
      persistent = false,
      blur = 'none',
      size = 'md',
      children,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const titleId = useRef(
      `azimuth-modal-${Math.random().toString(36).slice(2, 9)}`,
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
        const firstFocusable = contentRef.current?.querySelector<
          HTMLElement
        >(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        firstFocusable?.focus();
      }, 50);
      // Timeout waits for portal content to render in DOM before focusing

      return () => clearTimeout(timer);
    }, [open]);

    if (!open) return null;

    return createPortal(
      <div
        ref={ref}
        className={cn(
          styles.overlay,
          blur !== 'none' && styles[`overlayBlur${blur.charAt(0).toUpperCase() + blur.slice(1)}`],
          className,
        )}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        {...props}
      >
        <div
          ref={contentRef}
          className={cn(styles.content, styles[size])}
        >
          {(title || subtitle) && (
            <div className={styles.header}>
              <div className={styles.headerContent}>
                {title && (
                  <h2 id={titleId} className={styles.title}>
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className={styles.subtitle}>{subtitle}</p>
                )}
              </div>
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

Modal.displayName = 'Modal';
