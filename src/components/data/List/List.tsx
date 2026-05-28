'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './List.module.css';

/** Props for a single list item. */
export interface ListItemProps extends ComponentPropsWithoutRef<'li'> {
  children?: React.ReactNode;
}

/** Props for the List container component. Supports ordered/unordered, spacing, and bulleted variants. */
export interface ListProps extends Omit<ComponentPropsWithoutRef<'ul'>, 'type'> {
  /** @default false */
  ordered?: boolean;
  /** @default 'md' */
  spacing?: 'sm' | 'md' | 'lg';
  /** @default false */
  bulleted?: boolean;
  children?: React.ReactNode;
}

/** Renders a single `<li>` item within a List. */
const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li ref={ref} className={cn(styles.item, className)} {...props}>
        {children}
      </li>
    );
  },
);

ListItem.displayName = 'List.Item';

/** Renders an ordered (`<ol>`) or unordered (`<ul>`) list with configurable spacing and bullet style. */
const ListRoot = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  (
    {
      ordered = false,
      spacing = 'md',
      bulleted = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Tag = ordered ? 'ol' : 'ul';

    return (
      <Tag
        ref={ref as never}
        className={cn(styles.list, bulleted && styles.bulleted, styles[spacing], className)}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

ListRoot.displayName = 'List';

export const List = Object.assign(ListRoot, {
  Item: ListItem,
});
