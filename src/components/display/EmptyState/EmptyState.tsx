import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './EmptyState.module.css';

/** An empty state placeholder with an icon, title, description, and optional action. */
export interface EmptyStateProps extends ComponentPropsWithoutRef<'div'> {
  /** Optional icon displayed above the title. */
  icon?: React.ReactNode;
  /** Primary heading text. */
  title: string;
  /** Supporting description text. */
  description?: string;
  /** Call-to-action element (typically a Button). */
  action?: React.ReactNode;
}

/** An empty state placeholder for when no data is available. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(styles.root, className)}
        {...props}
      >
        {icon && <div className={styles.icon}>{icon}</div>}
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';
