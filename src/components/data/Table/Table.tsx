'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Table.module.css';

/** Props for the Table root component. Supports striped, bordered, hoverable, and size variants. */
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

/** Renders a `<table>` element with optional striped, bordered, hoverable, and size styles. */
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

/** Props for the Table header section. */
interface TableHeadProps extends ComponentPropsWithoutRef<'thead'> {
  children?: React.ReactNode;
}

/** Renders a `<thead>` element styled as a table header. */
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

/** Props for the Table body section. */
interface TableBodyProps extends ComponentPropsWithoutRef<'tbody'> {
  children?: React.ReactNode;
}

/** Renders a `<tbody>` element. */
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

/** Props for a Table row. */
interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  children?: React.ReactNode;
}

/** Renders a `<tr>` element. */
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

/** Props for a standard table cell (`<td>`). */
interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  children?: React.ReactNode;
}

/** Renders a `<td>` element. */
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

/** Props for a table header cell (`<th>`). */
type TableHeadCellProps = ComponentPropsWithoutRef<'th'>;

/** Renders a `<th>` element. */
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
