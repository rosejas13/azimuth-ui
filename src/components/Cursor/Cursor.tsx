'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
} from 'react';

type CursorValue =
  | 'pointer'
  | 'default'
  | 'not-allowed'
  | 'text'
  | 'move'
  | 'wait'
  | 'grab'
  | 'grabbing'
  | 'crosshair'
  | 'help'
  | 'none'
  | 'col-resize'
  | 'row-resize';

/** Props for the Cursor component. */
export interface CursorProps extends ComponentPropsWithoutRef<'span'> {
  /** The CSS cursor value to apply. @default 'default' */
  cursor?: CursorValue;
  /** The content of the component. */
  children?: React.ReactNode;
}

export const Cursor = forwardRef<HTMLSpanElement, CursorProps>(
  ({ cursor = 'default', children, style, ...props }, ref) => {
    return (
      <span
        ref={ref}
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
