'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import { cn } from '@/utils/cn';
import {
  CheckCircleIcon,
  CircleDotIcon,
  CircleXmarkIcon,
} from '@/icons';
import styles from './Toast.module.css';

type ToastVariant = 'warning' | 'success' | 'error' | 'info';

const ICONS: Record<ToastVariant, ReactNode> = {
  warning: <CircleXmarkIcon width={16} height={16} />,
  success: <CheckCircleIcon width={16} height={16} />,
  error: <CircleXmarkIcon width={16} height={16} />,
  info: <CircleDotIcon width={16} height={16} />,
};

/** A toast notification with variant styling, dismissible option, auto-dismiss timer, and expandable content. */
export interface ToastProps extends Omit<ComponentPropsWithoutRef<'div'>, 'content'> {
  content?: {
    /** @default 'info' */
    variant?: ToastVariant;
    title?: string;
    message?: string;
    /** Override the default variant icon. Pass `null` to hide the icon entirely. @default undefined (renders the variant's built-in icon) */
    icon?: ReactNode;
  };
  dismiss?: {
    /** Whether the toast shows a dismiss (close) button. @default false */
    dismissible?: boolean;
    /** Callback fired when the toast is dismissed. */
    onDismiss?: () => void;
    /** Milliseconds after which the toast automatically dismisses. */
    autoDismiss?: number;
  };
  /** @default false */
  expandable?: boolean;
  /** Additional content revealed when the toast is expanded. */
  children?: React.ReactNode;
}

/** A toast notification message with variant icon, dismiss, auto-dismiss, and expandable content. */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      content: {
        variant = 'info' as ToastVariant,
        title,
        message,
        icon,
      } = {},
      dismiss: {
        dismissible = false,
        onDismiss,
        autoDismiss,
      } = {},
      expandable = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
      if (autoDismiss && onDismiss) {
        const timer = setTimeout(onDismiss, autoDismiss);
        return () => clearTimeout(timer);
      }
    }, [autoDismiss, onDismiss]);

    return (
      <div
        ref={ref}
        className={cn(styles.toast, styles[variant], className)}
        role="status"
        aria-live="polite"
        {...props}
      >
        {icon !== null && (
          <span className={styles.icon} aria-hidden="true">
            {icon ?? ICONS[variant]}
          </span>
        )}
        <div className={styles.content}>
          <strong className={styles.title}>{title}</strong>
          {message && <p className={styles.message}>{message}</p>}
          {expandable && (
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
          {expanded && children && (
            <div className={styles.expanded}>{children}</div>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            className={styles.dismiss}
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = 'Toast';
