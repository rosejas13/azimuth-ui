'use client';

import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './ActivityFeed.module.css';

/** A single event in the activity feed timeline. */
export interface ActivityEvent {
  /** Unique identifier */
  id: string;
  /** Event title */
  title: string;
  /** Supporting description */
  description?: string;
  /** Timestamp shown on the right */
  timestamp: string | Date;
  /** Custom icon or avatar replacing the default dot */
  icon?: React.ReactNode;
  /** Color-coded dot style */
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** Optional linked action */
  link?: { label: string; href: string };
}

/** Props for the ActivityFeed component. */
export interface ActivityFeedProps extends ComponentPropsWithoutRef<'div'> {
  /** Events to display */
  events: ActivityEvent[];
  /** @default 5 */
  maxVisible?: number;
  /** @default 'No recent activity' */
  emptyMessage?: string;
  /** Called when "Show more" is clicked */
  onShowMore?: () => void;
  /** Whether more events exist beyond those provided */
  hasMore?: boolean;
}

/**
 * A vertical timeline of activity events.
 * Each event renders with an icon dot, title, description,
 * timestamp, and an optional link. Used in dashboards.
 */
export const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(
  (
    {
      events,
      maxVisible = 5,
      emptyMessage = 'No recent activity',
      onShowMore,
      hasMore = false,
      className,
      ...props
    },
    ref,
  ) => {
    const visibleEvents = events.slice(0, maxVisible);
    const showMoreButton = events.length > maxVisible || hasMore;

    const formatTimestamp = (ts: string | Date): string => {
      if (ts instanceof Date) {
        return ts.toLocaleString();
      }
      return ts;
    };

    if (events.length === 0) {
      return (
        <div
          ref={ref}
          role="feed"
          className={cn(styles.root, styles.empty, className)}
          {...props}
        >
          <p className={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="feed"
        className={cn(styles.root, className)}
        {...props}
      >
        <ul className={styles.list}>
          {visibleEvents.map((event) => (
            <li key={event.id} className={styles.item}>
              <span className={styles.marker}>
                {event.icon ? (
                  <span className={styles.iconWrapper}>{event.icon}</span>
                ) : (
                  <span
                    className={cn(styles.dot, styles[event.type ?? 'default'])}
                    aria-label={event.type}
                  />
                )}
              </span>
              <div className={styles.body}>
                <div className={styles.header}>
                  <span className={styles.title}>{event.title}</span>
                  <time className={styles.timestamp}>
                    {formatTimestamp(event.timestamp)}
                  </time>
                </div>
                {event.description && (
                  <p className={styles.description}>{event.description}</p>
                )}
                {event.link && (
                  <a href={event.link.href} className={styles.link}>
                    {event.link.label}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        {showMoreButton && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.showMore}
              onClick={onShowMore}
            >
              Show more
            </button>
          </div>
        )}
      </div>
    );
  },
);

ActivityFeed.displayName = 'ActivityFeed';
