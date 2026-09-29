import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './EmptyState.module.css';

/** Curated native surface for the EmptyState region; anything native not listed goes through `boxProps`. */
export interface EmptyStateProps extends CuratedSurface<
  'div',
  ['className', 'style', 'id']
> {
  /** Optional icon displayed above the title. */
  icon?: React.ReactNode;
  /** Primary heading text. */
  title: string;
  /** Supporting description text. */
  description?: string;
  /** Call-to-action element (typically a Button). */
  action?: React.ReactNode;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  boxProps?: NativeRest<'div'>;
}

/** An empty state placeholder for when no data is available. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon, title, description, action, className, boxProps, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn(styles.root, className)}
        {...props}
        {...(boxProps as ComponentPropsWithoutRef<'div'>)}
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
