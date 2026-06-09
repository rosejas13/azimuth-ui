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
import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './Modal.module.css';

/**
 * Props for the Modal component.
 */
export interface ModalProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'content'
> {
  visible?: {
    open: boolean;
    onClose: () => void;
  };
  content?: {
    title?: string;
    subtitle?: string;
    /** @default false */
    persistent?: boolean;
    /** @default 'none' */
    blur?: 'none' | 'sm' | 'md' | 'lg';
    /** @default 'md' */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  };
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * A centered modal dialog with optional backdrop blur, title/subtitle, footer,
 * and size variants.
 *
 * Renders via portal to `document.body`. Closes on Escape key or overlay click
 * unless `persistent` is enabled.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      visible: { open, onClose } = {},
      content: {
        title,
        subtitle,
        persistent = false,
        blur = 'none',
        size = 'md',
      } = {},
      children,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleId = useRef(
      `azimuth-modal-${Math.random().toString(36).slice(2, 9)}`,
    ).current;

    const setOverlayRef = useCallback(
      (node: HTMLDivElement | null) => {
        overlayRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose?.();
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

    useFocusTrap(contentRef, open ?? false);

    useEffect(() => {
      const el = overlayRef.current;
      if (!el || !open) return;

      const handleOverlayClick = (e: MouseEvent) => {
        if (!persistent && e.target === e.currentTarget) {
          onClose?.();
        }
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose?.();
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
        className={cn(
          styles.overlay,
          blur !== 'none' &&
            styles[
              `overlayBlur${blur.charAt(0).toUpperCase() + blur.slice(1)}`
            ],
          className,
        )}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        {...props}
      >
        <div ref={contentRef} className={cn(styles.content, styles[size])}>
          {(title || subtitle) && (
            <div className={styles.header}>
              <div className={styles.headerContent}>
                {title && (
                  <h2 id={titleId} className={styles.title}>
                    {title}
                  </h2>
                )}
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
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
