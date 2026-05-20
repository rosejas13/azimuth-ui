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

/** Props for the Modal component. */
export interface ModalProps extends ComponentPropsWithoutRef<'div'> {
  /** Whether the modal is visible. */
  open: boolean;
  /** Callback fired when the modal requests to close. */
  onClose: () => void;
  /** Modal title text. */
  title?: string;
  /** Optional subtitle text. */
  subtitle?: string;
  /** Whether clicking the overlay closes the modal. @default false */
  persistent?: boolean;
  /** Backdrop blur intensity. @default 'none' */
  blur?: 'none' | 'sm' | 'md' | 'lg';
  /** The size of the modal. @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** The content of the modal body. */
  children?: React.ReactNode;
  /** Footer content. */
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
