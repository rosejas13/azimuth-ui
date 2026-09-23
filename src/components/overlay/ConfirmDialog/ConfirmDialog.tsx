'use client';

import { Dialog } from '../Dialog/Dialog';

/** How severe the action being confirmed is; drives styling and semantics. */
export type ConfirmSeverity = 'warn' | 'danger';

/** Props for the ConfirmDialog component. */
export interface ConfirmDialogProps {
  visible: { open: boolean; onClose: () => void };
  /** Question heading, e.g. "Delete partner?" */
  title: string;
  /** Body copy explaining what the confirmation applies to. */
  message: string;
  /** @default 'Confirm' */
  confirmLabel?: string;
  /** @default 'Cancel' */
  cancelLabel?: string;
  /**
   * Severity of the destructive action: `danger` maps to a danger confirm
   * button and `alertdialog` semantics, `warn` to its warning counterpart.
   * @default 'danger'
   */
  severity?: ConfirmSeverity;
  /** Called when the confirm button is pressed. */
  onConfirm?: () => void;
  /** Called when the cancel action runs (button, X, Escape, overlay); the dialog stays open unless it also closes via `onClose`. */
  onCancel?: () => void;
  /** @default false */
  loading?: boolean;
  /** Extra content rendered between the message and the action row. */
  children?: React.ReactNode;
}

/**
 * A themed confirmation preset over {@link Dialog} for destructive-action
 * confirmations ("Delete this row?" etc.). Focus lands on the cancel action
 * by default so a destructive choice is never made by accident, and the
 * dialog renders as an `alertdialog` for screen readers.
 *
 * For full control — custom body content, `initialFocus`, extra actions —
 * use {@link Dialog} directly.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   visible={{ open, onClose }}
 *   title="Delete partner?"
 *   message="Deletes take effect when you press Save all."
 *   confirmLabel="Delete"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  severity = 'danger',
  onConfirm,
  onCancel,
  loading = false,
  children,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      visible={visible}
      content={{
        title,
        description: message,
        variant: severity === 'warn' ? 'warning' : 'danger',
      }}
      actions={{
        confirm: { label: confirmLabel, onConfirm, loading },
        cancel: { label: cancelLabel, onCancel },
      }}
    >
      {children}
    </Dialog>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';
