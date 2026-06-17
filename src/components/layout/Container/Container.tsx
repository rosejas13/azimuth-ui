import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Container.module.css';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** Props for the Container layout component. */
export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  /** @default 'lg' */
  size?: ContainerSize;
  /**
   * Override the size-based max-width via inline style.
   * Numbers are treated as px, strings are used as-is.
   * @default undefined
   */
  maxWidth?: number | string;
}

/** A layout container that constrains content width with responsive padding. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', className, children, maxWidth, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.container, styles[size], className)}
        style={{
          ...(maxWidth != null
            ? {
                maxWidth:
                  typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
              }
            : undefined),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = 'Container';
