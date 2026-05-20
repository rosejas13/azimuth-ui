'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './List.module.css';

/** Props for the List.Item subcomponent. */
export interface ListItemProps extends ComponentPropsWithoutRef<'li'> {
  /** The content of the component. */
  children?: React.ReactNode;
}

/** Props for the List component. */
export interface ListProps extends Omit<ComponentPropsWithoutRef<'ul'>, 'type'> {
  /** Whether to render an ordered list (ol). @default false */
  ordered?: boolean;
  /** Spacing between list items. @default 'md' */
  spacing?: 'sm' | 'md' | 'lg';
  /** Whether to show bullet markers. @default false */
  bulleted?: boolean;
  /** The content of the component. */
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
