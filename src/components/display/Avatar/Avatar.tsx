'use client';

import { type ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import { cn } from '@/utils/cn';
import styles from './Avatar.module.css';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends ComponentPropsWithoutRef<'div'> {
  src?: string;
  alt?: string;
  fallback?: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** @default false */
  square?: boolean;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = '',
      fallback,
      size = 'md',
      square = false,
      className,
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
