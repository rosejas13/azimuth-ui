import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './Container.module.css';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** Curated native surface for the Container element; anything native not listed goes through `containerProps`. */
export interface ContainerProps extends CuratedSurface<
  'div',
  ['className', 'style', 'id']
> {
  children?: React.ReactNode;
  /** @default 'lg' */
  size?: ContainerSize;
  /**
   * Override the size-based max-width via inline style.
   * Numbers are treated as px, strings are used as-is.
   * @default undefined
   */
  maxWidth?: number | string;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  containerProps?: NativeRest<'div'>;
}

/** A layout container that constrains content width with responsive padding. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'lg',
      className,
      children,
      maxWidth,
      style,
      containerProps,
      ...props
    },
    ref,
  ) => {
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
        {...(containerProps as ComponentPropsWithoutRef<'div'>)}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = 'Container';
