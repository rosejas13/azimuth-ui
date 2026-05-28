'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import {
  BellIcon,
  CheckCircleIcon,
  CircleDotIcon,
  CircleQuestionIcon,
  CircleXmarkIcon,
} from '@/icons';

const EXIT_ANIMATION_DURATION = 200;
import styles from './Alert.module.css';

type AlertVariant =
  | 'warning'
  | 'caution'
  | 'alert'
  | 'success'
  | 'info'
  | 'notification';

const ICONS: Record<AlertVariant, ReactNode> = {
  warning: <CircleXmarkIcon width={16} height={16} />,
  caution: <CircleQuestionIcon width={16} height={16} />,
  alert: <CircleXmarkIcon width={16} height={16} />,
  success: <CheckCircleIcon width={16} height={16} />,
  info: <CircleDotIcon width={16} height={16} />,
  notification: <BellIcon width={16} height={16} />,
};

const VARIANT_CLASS: Record<AlertVariant, string> = {
  warning: styles.warning,
  caution: styles.caution,
  alert: styles.alertVariant,
  success: styles.success,
  info: styles.info,
  notification: styles.notification,
};

/** A contextual alert banner with variant styling, optional dismiss, and auto-dismiss. */
export interface AlertProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'info' */
  variant?: AlertVariant;
  /** Optional title displayed prominently at the top. */
  title?: string;
  /** @default false */
  dismissible?: boolean;
  /** Callback fired when the alert is dismissed. */
  onDismiss?: () => void;
  /** Time in milliseconds before auto-dismissal. */
  autoDismiss?: number;
  /** Override the default variant icon. Pass `null` to hide the icon entirely. @default undefined (renders the variant's built-in icon) */
  icon?: ReactNode;
  /** Body content of the alert. */
  children?: React.ReactNode;
}

/** A contextual alert banner for notifications, warnings, errors, and success messages. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      dismissible = false,
      onDismiss,
      autoDismiss,
      icon,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [dismissing, setDismissing] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const exitTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
      if (autoDismiss && onDismiss) {
        timerRef.current = setTimeout(() => {
          setDismissing(true);
          exitTimerRef.current = setTimeout(() => { onDismiss?.(); }, EXIT_ANIMATION_DURATION);
        }, autoDismiss);
        return () => {
          if (timerRef.current !== undefined) {
            clearTimeout(timerRef.current);
          }
          if (exitTimerRef.current !== undefined) {
            clearTimeout(exitTimerRef.current);
          }
        };
      }
    }, [autoDismiss, onDismiss]);

    const handleDismiss = () => {
      setDismissing(true);
      if (onDismiss) {
        setTimeout(onDismiss, EXIT_ANIMATION_DURATION);
      }
    };

    const role =
      variant === 'info' || variant === 'notification' ? 'status' : 'alert';
    const ariaLive =
      variant === 'info' || variant === 'notification' ? 'polite' : 'assertive';

    return (
      <div
        ref={ref}
        className={cn(styles.root, VARIANT_CLASS[variant], dismissing && styles.dismissing, className)}
        role={role}
        aria-live={ariaLive}
        {...props}
      >
        {icon !== null && (
          <span className={styles.icon} aria-hidden="true">
            {icon ?? ICONS[variant]}
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
            onClick={handleDismiss}
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
