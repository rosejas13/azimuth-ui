'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './ErrorPage.module.css';

type ErrorPageSize = 'sm' | 'md' | 'lg';

/** A full-page error display with status code, title, description, and optional action. */
export interface ErrorPageProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 404 */
  status?: number;
  /** @default 'Page not found' */
  title?: string;
  /** Additional explanation of the error. */
  description?: string;
  /** Call-to-action element (typically a Button). */
  action?: ReactNode;
  /** Optional icon displayed above the status. */
  icon?: ReactNode;
  /** @default 'md' */
  size?: ErrorPageSize;
}

/** A full-page error display including status code, title, description, and action. */
export const ErrorPage = forwardRef<HTMLDivElement, ErrorPageProps>(
  (
    {
      status = 404,
      title = 'Page not found',
      description,
      action,
      icon,
      size = 'md',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(styles.root, styles[size], className)}
        role="alert"
        {...props}
      >
        <div className={styles.status}>{status}</div>
        {icon && <div className={styles.icon}>{icon}</div>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    );
  },
);

ErrorPage.displayName = 'ErrorPage';
