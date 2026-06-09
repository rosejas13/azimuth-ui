'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './AspectRatio.module.css';

/** Props for the AspectRatio component. */
export interface AspectRatioProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  /** Width/height ratio, e.g. 16/9, 4/3, 1, 21/9 (default 16/9). */
  ratio?: number;
  /** Max width constraint (CSS value). */
  maxWidth?: string;
}

/**
 * Maintains a consistent width-to-height ratio for its children.
 * Uses CSS `aspect-ratio` with a padding-bottom fallback for older browsers.
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, maxWidth, className, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.root, className)}
        style={
          {
            maxWidth,
            '--aspect-ratio': ratio,
            '--aspect-ratio-padding': `${(1 / ratio) * 100}%`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className={styles.inner}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    );
  },
);

AspectRatio.displayName = 'AspectRatio';
