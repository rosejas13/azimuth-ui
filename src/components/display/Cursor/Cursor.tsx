'use client';

import { type ComponentPropsWithoutRef, forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Cursor.module.css';

type CursorValue =
  | 'pointer' | 'default' | 'not-allowed' | 'text' | 'move' | 'wait'
  | 'grab' | 'grabbing' | 'crosshair' | 'help' | 'none' | 'col-resize' | 'row-resize';

export interface CursorProps extends ComponentPropsWithoutRef<'span'> {
  /** @default 'default' */
  cursor?: CursorValue;
  children?: React.ReactNode;
}

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
