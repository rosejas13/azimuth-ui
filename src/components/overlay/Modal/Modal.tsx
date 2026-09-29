'use client';

import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './Modal.module.css';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Curated native surface for the modal overlay wrapper. The modal's own
 * attributes (`role`, `aria-modal`, focus behavior) are managed internally;
 * anything native not listed goes through `overlayProps`.
 */
export interface ModalProps extends CuratedSurface<
  'div',
  [
    'className',
    'id',
    'style',
    'tabIndex',
    'aria-hidden',
    'aria-label',
    'aria-labelledby',
  ]
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
  /**
   * Which element receives focus when the modal opens. By default focus
   * lands on the panel content: the first focusable element in the body
   * (then the footer, then the body itself) — never the header close
   * button, so a stray Enter or Space cannot dismiss the modal.
   * `'close'` focuses the X button (only rendered with a header);
   * `'cancel'` focuses the first footer button and `'confirm'` the last,
   * falling back to the panel default when no footer is given.
   */
  initialFocus?: 'cancel' | 'confirm' | 'close';
  /**
   * Optional veto gate for dismissal requests. Called before the modal
   * closes via the X button, Escape, or an overlay click/keypress; return
   * `false` to cancel the dismissal (e.g. when there are unsaved changes).
   * For an async flow, return `false` here and render a ConfirmDialog whose
   * confirm action calls the real close.
   */
  interceptClose?: () => boolean;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  overlayProps?: NativeRest<'div'>;
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
      initialFocus,
      interceptClose,
      className,
      overlayProps,
      ...props
    },
    ref,
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
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

    const requestClose = useCallback(() => {
      if (interceptClose && !interceptClose()) return;
      onClose?.();
    }, [interceptClose, onClose]);

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          requestClose();
        }
      },
      [requestClose],
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
      if (!open) return;
      const rafId = requestAnimationFrame(() => {
        let target: HTMLElement | null = null;

        if (initialFocus === 'close') {
          target = closeButtonRef.current;
        } else if (initialFocus === 'cancel' || initialFocus === 'confirm') {
          const buttons = footerRef.current
            ? Array.from(
                footerRef.current.querySelectorAll<HTMLButtonElement>(
                  'button:not([disabled])',
                ),
              )
            : [];
          if (buttons.length > 0) {
            target =
              initialFocus === 'cancel'
                ? buttons[0]
                : buttons[buttons.length - 1];
          }
        }

        if (!target) {
          const bodyFocusable =
            bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
            null;
          const footerFocusable =
            footerRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
            null;
          target = bodyFocusable ?? footerFocusable ?? bodyRef.current;
        }

        target?.focus();
      });
      return () => cancelAnimationFrame(rafId);
    }, [open, initialFocus]);

    useEffect(() => {
      const el = overlayRef.current;
      if (!el || !open) return;

      const handleOverlayClick = (e: MouseEvent) => {
        if (!persistent && e.target === e.currentTarget) {
          requestClose();
        }
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          e.target === e.currentTarget
        ) {
          e.preventDefault();
          requestClose();
        }
      };

      el.addEventListener('click', handleOverlayClick);
      el.addEventListener('keydown', handleKeyDown);
      return () => {
        el.removeEventListener('click', handleOverlayClick);
        el.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, persistent, requestClose]);

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
        {...(overlayProps as React.ComponentPropsWithoutRef<'div'>)}
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
                ref={closeButtonRef}
                className={styles.closeButton}
                onClick={requestClose}
                aria-label="Close dialog"
              >
                &#x2715;
              </button>
            </div>
          )}

          <div ref={bodyRef} tabIndex={-1} className={styles.body}>
            {children}
          </div>

          {footer && (
            <div ref={footerRef} className={styles.footer}>
              {footer}
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  },
);

Modal.displayName = 'Modal';
