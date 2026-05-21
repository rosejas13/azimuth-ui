'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Toast.module.css';

type ToastVariant = 'warning' | 'success' | 'error' | 'info';

export interface ToastProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'info' */
  variant?: ToastVariant;
  title: string;
  message?: string;
  /** @default false */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** @default false */
  expandable?: boolean;
  /** Milliseconds after which the toast automatically dismisses. */
  autoDismiss?: number;
  children?: React.ReactNode;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      variant = 'info',
      title,
      message,
      dismissible = false,
      onDismiss,
      autoDismiss,
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
