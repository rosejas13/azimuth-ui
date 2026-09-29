import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './Skeleton.module.css';

type SkeletonVariant = 'text' | 'circle' | 'rect';

/** Curated native surface for the Skeleton placeholder; anything native not listed goes through `boxProps`. */
export interface SkeletonProps extends CuratedSurface<
  'div',
  ['className', 'style', 'id']
> {
  /** @default 'text' */
  variant?: SkeletonVariant;
  /** CSS width of the skeleton. */
  width?: string;
  /** CSS height of the skeleton. */
  height?: string;
  /** @default 1 */
  count?: number;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  boxProps?: NativeRest<'div'>;
}

/** A loading placeholder skeleton in text, circle, or rect variants. */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      count = 1,
      className,
      style,
      boxProps,
      ...props
    },
    ref,
  ) => {
    const variantHeight =
      height ??
      (variant === 'text' ? '1em' : variant === 'circle' ? '48px' : '200px');
    const variantWidth = width ?? (variant === 'circle' ? '48px' : '100%');

    const items = Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        ref={i === 0 ? ref : undefined}
        className={cn(styles.skeleton, styles[variant], className)}
        style={{
          width: variantWidth,
          height: variantHeight,
          ...style,
        }}
        role="status"
        aria-label="Loading"
        {...(props as ComponentPropsWithoutRef<'div'>)}
        {...(boxProps as ComponentPropsWithoutRef<'div'>)}
      />
    ));

    return <>{items}</>;
  },
);

Skeleton.displayName = 'Skeleton';
