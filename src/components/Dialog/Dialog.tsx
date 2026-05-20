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

/** Props for the Dialog component. */
export interface DialogProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Callback fired when the dialog requests to close. */
  onClose: () => void;
  /** Dialog title text. */
  title?: string;
  /** Dialog description text. */
  description?: string;
  /** The visual variant of the dialog. @default 'info' */
  variant?: 'info' | 'warning' | 'danger';
  /** Label for the confirm button. @default 'Confirm' */
  confirmLabel?: string;
  /** Label for the cancel button. @default 'Cancel' */
  cancelLabel?: string;
  /** Callback fired when the confirm button is clicked. */
  onConfirm?: () => void;
  /** Callback fired when the cancel button is clicked. */
  onCancel?: () => void;
  /** Whether the dialog is in a loading state. @default false */
  loading?: boolean;
  /** The content of the dialog body. */
  children?: React.ReactNode;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      variant = 'info',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onConfirm,
      onCancel,
      loading = false,
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
