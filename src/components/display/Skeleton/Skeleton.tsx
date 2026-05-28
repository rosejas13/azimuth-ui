import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Skeleton.module.css';

type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'text' */
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  /** @default 1 */
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
