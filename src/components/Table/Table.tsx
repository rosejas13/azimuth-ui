'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Table.module.css';

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  /** @default false */
  striped?: boolean;
  /** @default false */
  bordered?: boolean;
  /** @default false */
  hoverable?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      striped = false,
      bordered = false,
      hoverable = false,
      size = 'md',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <table
        ref={ref}
        className={cn(
          styles.table,
          striped && styles.striped,
          bordered && styles.bordered,
          hoverable && styles.hoverable,
          styles[size],
          className,
        )}
        {...props}
      >
        {children}
      </table>
    );
  },
);

TableRoot.displayName = 'Table';

interface TableHeadProps extends ComponentPropsWithoutRef<'thead'> {
  children?: React.ReactNode;
}

const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead ref={ref} className={cn(styles.head, className)} {...props}>
        {children}
      </thead>
    );
  },
);

TableHead.displayName = 'Table.Head';

interface TableBodyProps extends ComponentPropsWithoutRef<'tbody'> {
  children?: React.ReactNode;
}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody ref={ref} className={cn(styles.body, className)} {...props}>
        {children}
      </tbody>
    );
  },
);

TableBody.displayName = 'Table.Body';

interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  children?: React.ReactNode;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr ref={ref} className={cn(styles.row, className)} {...props}>
        {children}
      </tr>
    );
  },
);

TableRow.displayName = 'Table.Row';

interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  children?: React.ReactNode;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <td ref={ref} className={cn(styles.cell, className)} {...props}>
        {children}
      </td>
    );
  },
);

TableCell.displayName = 'Table.Cell';

type TableHeadCellProps = ComponentPropsWithoutRef<'th'>;

const TableHeadCell = forwardRef<HTMLTableCellElement, TableHeadCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <th ref={ref} className={cn(styles.headCell, className)} {...props}>
        {children}
      </th>
    );
  },
);

TableHeadCell.displayName = 'Table.HeadCell';

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  HeadCell: TableHeadCell,
});
