'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  forwardRef,
} from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { Slot } from '@/utils/Slot';
import styles from './ScrollArea.module.css';

/** Curated native surface for the ScrollArea region; anything native not listed goes through `boxProps`. */
export interface ScrollAreaProps extends CuratedSurface<
  'div',
  ['className', 'style', 'id', 'tabIndex']
> {
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
  /**
   * Automatically add `tabIndex={0}` so keyboard users can scroll the region.
   * Satisfies `scrollable-region-focusable`. Disable only when a focusable
   * descendant is guaranteed to be present, or when composing focusable
   * ScrollAreas inside another focusable element.
   *
   * @default true
   */
  keyboardScrollable?: boolean;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  boxProps?: NativeRest<'div'>;
}

/** A container with custom-styled scrollbars that work consistently across browsers and OS. */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      orientation = 'vertical',
      hideScrollbar = false,
      smoothScroll = true,
      keyboardScrollable = true,
      asChild,
      className,
      tabIndex,
      boxProps,
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
    const focusProps = {
      tabIndex: tabIndex ?? (keyboardScrollable ? 0 : undefined),
    };

    if (asChild) {
      const child = children as ReactElement | undefined;
      if (!child) return null;
      return (
        <Slot
          className={classes}
          ref={ref}
          {...focusProps}
          {...props}
          {...(boxProps as ComponentPropsWithoutRef<'div'>)}
        >
          {child}
        </Slot>
      );
    }

    return (
      <div
        ref={ref}
        className={classes}
        {...focusProps}
        {...props}
        {...(boxProps as ComponentPropsWithoutRef<'div'>)}
      >
        {children}
      </div>
    );
  },
);

ScrollArea.displayName = 'ScrollArea';
