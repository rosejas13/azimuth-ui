'use client';

import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Timeline.module.css';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: ReactNode;
  color?: string;
}

/** Props for the Timeline component. */
export interface TimelineProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  items: TimelineItem[];
  /** @default 'default' */
  variant?: 'default' | 'alternating';
  children?: ReactNode;
}

/** Renders a vertical timeline of items with optional alternating layout. */
export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="list"
        className={cn(
          styles.timeline,
          variant === 'alternating' && styles.alternating,
          className,
        )}
        {...props}
      >
        {(items ?? []).map((item) => (
          <div
            key={item.id}
            className={cn(
              styles.item,
              variant === 'alternating' && item.id === items[0]?.id
                ? styles.left
                : variant === 'alternating'
                  ? styles.right
                  : undefined,
            )}
          >
            <div
              className={styles.dot}
              style={item.color ? { backgroundColor: item.color } : undefined}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <span className={styles.title}>{item.title}</span>
                {item.date && <span className={styles.date}>{item.date}</span>}
              </div>
              {item.description && (
                <p className={styles.description}>{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  },
);

Timeline.displayName = 'Timeline';
