import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Skeleton.module.css';

type SkeletonVariant = 'text' | 'circle' | 'rect';

/** Props for the Skeleton component. */
export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  /** Shape variant of the skeleton placeholder. @default 'text' */
  variant?: SkeletonVariant;
  /** Width of the skeleton as a CSS value. */
  width?: string;
  /** Height of the skeleton as a CSS value. */
  height?: string;
  /** Number of skeleton items to render. @default 1 */
  count?: number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      count = 1,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const variantHeight =
      height ?? (variant === 'text' ? '1em' : variant === 'circle' ? '48px' : '200px');
    const variantWidth =
      width ?? (variant === 'circle' ? '48px' : '100%');

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
        {...props}
      />
    ));

    return <>{items}</>;
  },
);

Skeleton.displayName = 'Skeleton';
