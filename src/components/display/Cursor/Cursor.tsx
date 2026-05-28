'use client';

import { type ComponentPropsWithoutRef, forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Cursor.module.css';

type CursorValue =
  | 'pointer' | 'default' | 'not-allowed' | 'text' | 'move' | 'wait'
  | 'grab' | 'grabbing' | 'crosshair' | 'help' | 'none' | 'col-resize' | 'row-resize';

/** A wrapper that applies a CSS cursor style to its children. */
export interface CursorProps extends ComponentPropsWithoutRef<'span'> {
  /** @default 'default' */
  cursor?: CursorValue;
  children?: React.ReactNode;
}

/** Wraps content and applies a CSS cursor style. */
export const Cursor = forwardRef<HTMLSpanElement, CursorProps>(
  ({ cursor = 'default', children, className, style, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(styles.cursor, className)}
        style={{ cursor, ...style }}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Cursor.displayName = 'Cursor';

/** Sets the body cursor to the given value while the component is mounted. Restores the previous cursor on unmount. */
export function useCursor(cursor: CursorValue): void {
  const prevRef = useRef<string>('');

  useEffect(() => {
    prevRef.current = document.body.style.cursor;
    document.body.style.cursor = cursor;

    return () => {
      document.body.style.cursor = prevRef.current;
    };
  }, [cursor]);
}
