'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Alert.module.css';

type AlertVariant =
  | 'warning'
  | 'caution'
  | 'alert'
  | 'success'
  | 'info'
  | 'notification';

const ICONS: Record<AlertVariant, string> = {
  warning: '⚠',
  caution: '⚡',
  alert: '✕',
  success: '✓',
  info: 'ℹ',
  notification: '🔔',
};

const VARIANT_CLASS: Record<AlertVariant, string> = {
  warning: styles.warning,
  caution: styles.caution,
  alert: styles.alertVariant,
  success: styles.success,
  info: styles.info,
  notification: styles.notification,
};

/** Props for the Alert component. */
export interface AlertProps extends ComponentPropsWithoutRef<'div'> {
  /** The visual variant of the alert. @default 'info' */
  variant?: AlertVariant;
  /** Optional title text for the alert. */
  title?: string;
  /** Whether the alert can be dismissed. @default false */
  dismissible?: boolean;
  /** Callback fired when the alert is dismissed. */
  onDismiss?: () => void;
  /** Time in milliseconds before auto-dismissal. */
  autoDismiss?: number;
  /** Whether to show the variant icon. @default true */
  icon?: boolean;
  /** The content of the component. */
  children?: React.ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      dismissible = false,
      onDismiss,
      autoDismiss,
      icon = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
      if (autoDismiss && onDismiss) {
        timerRef.current = setTimeout(onDismiss, autoDismiss);
        return () => {
          if (timerRef.current !== undefined) {
            clearTimeout(timerRef.current);
          }
        };
      }
    }, [autoDismiss, onDismiss]);

    const role =
      variant === 'info' || variant === 'notification' ? 'status' : 'alert';
    const ariaLive =
      variant === 'info' || variant === 'notification' ? 'polite' : 'assertive';

    return (
      <div
        ref={ref}
        className={cn(styles.root, VARIANT_CLASS[variant], className)}
        role={role}
        aria-live={ariaLive}
        {...props}
      >
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {ICONS[variant]}
          </span>
        )}
        <div className={styles.content}>
          {title && <strong className={styles.title}>{title}</strong>}
          {children && <div className={styles.body}>{children}</div>}
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

Alert.displayName = 'Alert';
