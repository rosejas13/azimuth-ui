'use client';

import { type ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './Avatar.module.css';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Curated native surface for the Avatar img-role region; anything native not listed goes through `boxProps`. */
export interface AvatarProps extends CuratedSurface<
  'div',
  ['className', 'style', 'id']
> {
  /** Image source URL. */
  src?: string;
  /** @default '' */
  alt?: string;
  /** Text used to generate fallback initials when the image fails to load. */
  fallback?: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** @default false */
  square?: boolean;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  boxProps?: NativeRest<'div'>;
}

/** An avatar component that shows an image or auto-generated initials as fallback. */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = '',
      fallback,
      size = 'md',
      square = false,
      className,
      boxProps,
      ...props
    },
    ref,
  ) => {
    const [error, setError] = useState(false);
    const showImage = src && !error;

    const initials = fallback
      ? fallback
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          styles.avatar,
          styles[size],
          square && styles.square,
          className,
        )}
        role="img"
        aria-label={alt || fallback || undefined}
        {...props}
        {...(boxProps as ComponentPropsWithoutRef<'div'>)}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className={styles.image}
            onError={() => setError(true)}
          />
        ) : (
          <span className={styles.fallback}>{initials}</span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
