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
import styles from './Dialog.module.css';

/**
 * Props for the Dialog component.
 */
export interface DialogProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'content'> {
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
  children?: React.ReactNode;
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
      actions: { confirm: { label: confirmLabel = 'Confirm', onConfirm, loading = false } = {}, cancel: { label: cancelLabel = 'Cancel', onCancel } = {} } = {},
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const confirmRef = useRef<HTMLButtonElement>(null);
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

    useEffect(() => {
      if (!open) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !loading) {
          handleCancel();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, handleCancel, loading]);

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
        confirmRef.current?.focus();
      }, 0);

      return () => clearTimeout(timer);
    }, [open]);

    if (!open) return null;

    const role = variant === 'warning' || variant === 'danger' ? 'alertdialog' : 'dialog';

    return createPortal(
      <div
        ref={ref}
        className={cn(styles.overlay, className)}
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) {
            handleCancel();
          }
        }}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        {...props}
      >
        <div className={styles.panel}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleCancel}
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

          {children && <div className={styles.body}>{children}</div>}

          <div className={styles.footer}>
            <button
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
