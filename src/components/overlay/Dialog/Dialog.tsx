'use client';

import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './Dialog.module.css';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Curated native surface for the dialog overlay wrapper. The dialog's own
 * attributes (`role`, `aria-modal`, focus behavior) are managed internally;
 * anything native not listed goes through `overlayProps`.
 */
export interface DialogProps extends CuratedSurface<
  'div',
  [
    'className',
    'id',
    'style',
    'tabIndex',
    'aria-hidden',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'onClick',
    'onKeyDown',
  ]
> {
  visible: { open: boolean; onClose: () => void };
  content?: {
    title?: string;
    description?: string;
    /** @default 'info' */
    variant?: 'info' | 'warning' | 'danger';
  };
  actions?: {
    confirm?: {
      /** @default 'Confirm' */
      label?: string;
      onConfirm?: () => void;
      /** @default false */
      loading?: boolean;
    };
    cancel?: {
      /** @default 'Cancel' */
      label?: string;
      onCancel?: () => void;
    };
  };
  /**
   * Which button receives focus when the dialog opens. Destructive
   * confirmations are safest when focus lands on the cancel action, so
   * `warning`/`danger` dialogs default to `'cancel'`. `info` dialogs
   * default to the panel: the first focusable element inside the content
   * body, or the body/panel itself when there is none — so a stray Enter
   * or Space neither dismisses the dialog nor triggers the close button.
   * Pass `'close'` explicitly to restore X-first behavior.
   * @default undefined (resolved by {@link DialogProps.content.variant})
   */
  initialFocus?: 'cancel' | 'confirm' | 'close';
  /**
   * Optional veto gate for dismissal requests. Called before the dialog
   * closes via the X button, Escape, or an overlay click/keypress; return
   * `false` to cancel the dismissal (e.g. when there are unsaved changes).
   * The Cancel action button is explicit user intent and is not intercepted.
   * For an async flow, return `false` here and render a ConfirmDialog whose
   * confirm action calls the real close.
   */
  interceptClose?: () => boolean;
  children?: React.ReactNode;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  overlayProps?: NativeRest<'div'>;
}

/**
 * A modal dialog with a confirm/cancel interface, overlay, and Escape key handling.
 *
 * Renders via portal to `document.body`. Supports info, warning, and danger variants.
 * Closable via the X button, Cancel button, Escape key, or overlay click.
 *
 * **Note:** Escape key does NOT close the dialog when `loading` is true
 * (the Confirm button is in a loading/disabled state).
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      visible: { open, onClose },
      content: { title, description, variant = 'info' } = {},
      actions: {
        confirm: {
          label: confirmLabel = 'Confirm',
          onConfirm,
          loading = false,
        } = {},
        cancel: { label: cancelLabel = 'Cancel', onCancel } = {},
      } = {},
      initialFocus: initialFocusProp,
      interceptClose,
      className,
      children,
      overlayProps,
      ...props
    },
    ref,
  ) => {
    const confirmRef = useRef<HTMLButtonElement>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const titleId = useRef(
      `azimuth-dialog-${Math.random().toString(36).slice(2, 9)}`,
    ).current;
    const descriptionId = useRef(
      `azimuth-dialog-desc-${Math.random().toString(36).slice(2, 9)}`,
    ).current;

    const handleCancel = useCallback(() => {
      if (onCancel) {
        onCancel();
      } else {
        onClose();
      }
    }, [onCancel, onClose]);

    const requestClose = useCallback(() => {
      if (interceptClose && !interceptClose()) return;
      handleCancel();
    }, [interceptClose, handleCancel]);

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

    useFocusTrap(overlayRef, open);

    const initialFocus: 'cancel' | 'confirm' | 'close' | 'panel' =
      initialFocusProp ?? (variant === 'info' ? 'panel' : 'cancel');
    useEffect(() => {
      if (!open) return;
      // Double rAF: the focus trap (same frame) focuses the first tab-stop —
      // a nested frame guarantees this override runs after it.
      let raf2 = 0;
      const rafId = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          let target: HTMLElement | null = null;
          if (initialFocus === 'confirm') {
            target = confirmRef.current;
          } else if (initialFocus === 'cancel') {
            target = cancelRef.current;
          } else if (initialFocus === 'close') {
            target = overlayRef.current?.querySelector('button') ?? null;
          }
          if (!target) {
            const bodyFocusable =
              bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
              null;
            target = bodyFocusable ?? bodyRef.current ?? panelRef.current;
          }
          target?.focus();
        });
      });
      return () => {
        cancelAnimationFrame(rafId);
        cancelAnimationFrame(raf2);
      };
    }, [open, initialFocus]);

    useEffect(() => {
      if (!open) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !loading) {
          requestClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, requestClose, loading]);

    useEffect(() => {
      if (!open) return;

      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    if (!open) return null;

    const role =
      variant === 'warning' || variant === 'danger' ? 'alertdialog' : 'dialog';

    return createPortal(
      <div
        ref={setOverlayRef}
        className={cn(styles.overlay, className)}
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) {
            requestClose();
          }
        }}
        onKeyDown={(e) => {
          if (
            (e.key === 'Enter' || e.key === ' ') &&
            e.target === e.currentTarget
          ) {
            e.preventDefault();
            if (!loading) requestClose();
          }
        }}
        role={role}
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        {...props}
        {...(overlayProps as React.ComponentPropsWithoutRef<'div'>)}
      >
        <div ref={panelRef} tabIndex={-1} className={styles.panel}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={requestClose}
            aria-label="Close dialog"
          >
            X
          </button>

          {(title || description) && (
            <div className={styles.header}>
              {title && (
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className={styles.description}>
                  {description}
                </p>
              )}
            </div>
          )}

          {children && (
            <div ref={bodyRef} tabIndex={-1} className={styles.body}>
              {children}
            </div>
          )}

          <div className={styles.footer}>
            <button
              ref={cancelRef}
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              type="button"
              className={cn(
                styles.confirmButton,
                variant === 'info' && styles.confirmInfo,
                variant === 'warning' && styles.confirmWarning,
                variant === 'danger' && styles.confirmDanger,
              )}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <span className={styles.spinner} />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

Dialog.displayName = 'Dialog';
