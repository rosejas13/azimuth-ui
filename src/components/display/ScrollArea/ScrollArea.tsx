'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import { Slot } from '@/utils/Slot';
import styles from './ScrollArea.module.css';

/** Props for the ScrollArea component. */
export interface ScrollAreaProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  /** Orientation of scrollable content.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Hide scrollbar when not scrolling.
   * @default false
   */
  hideScrollbar?: boolean;
  /** Enable smooth scrolling.
   * @default true
   */
  smoothScroll?: boolean;
  /** Render as a different root element via Slot.
   * @default false
   */
  asChild?: boolean;
}

/** A container with custom-styled scrollbars that work consistently across browsers and OS. */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      orientation = 'vertical',
      hideScrollbar = false,
      smoothScroll = true,
      asChild,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      styles.scrollArea,
      orientation === 'vertical' && styles.vertical,
      orientation === 'horizontal' && styles.horizontal,
      orientation === 'both' && styles.both,
      smoothScroll && styles.smoothScroll,
      hideScrollbar && styles.hideScrollbar,
      className,
    );

    if (asChild) {
      const child = children as ReactElement | undefined;
      if (!child) return null;
      return (
        <Slot className={classes} ref={ref} {...props}>
          {child}
        </Slot>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

ScrollArea.displayName = 'ScrollArea';
