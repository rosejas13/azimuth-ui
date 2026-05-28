'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './List.module.css';

export interface ListItemProps extends ComponentPropsWithoutRef<'li'> {
  children?: React.ReactNode;
}

export interface ListProps extends Omit<ComponentPropsWithoutRef<'ul'>, 'type'> {
  /** @default false */
  ordered?: boolean;
  /** @default 'md' */
  spacing?: 'sm' | 'md' | 'lg';
  /** @default false */
  bulleted?: boolean;
  children?: React.ReactNode;
}

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
