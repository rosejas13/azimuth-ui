import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './EmptyState.module.css';

/** Props for the EmptyState component. */
export interface EmptyStateProps extends ComponentPropsWithoutRef<'div'> {
  /** Optional icon rendered above the title. */
  icon?: React.ReactNode;
  /** The title text. */
  title: string;
  /** An optional description below the title. */
  description?: string;
  /** Action element rendered at the bottom. */
  action?: React.ReactNode;
}

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
