import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Loader.module.css';

type LoaderVariant = 'circle' | 'bar';
type LoaderSize = 'sm' | 'md' | 'lg';

/** A loading indicator in either circle or bar variant. */
export interface LoaderProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'circle' */
  variant?: LoaderVariant;
  /** @default 'md' */
  size?: LoaderSize;
  /** Accessible label for the loading indicator. */
  label?: string;
}

const BORDER_COLORS = {
  borderColor: 'var(--azimuth-color-border)',
  borderTopColor: 'var(--azimuth-color-primary)',
} as const;

/** A loading spinner (circle) or animated bar. */
export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ variant = 'circle', size = 'md', label, className, ...props }, ref) => {
    if (variant === 'bar') {
      return (
        <div
          ref={ref}
          className={cn(styles.loader, label && styles.withLabel, className)}
          role="status"
          aria-label={label || 'Loading'}
          {...props}
        >
          <div className={styles.barWrapper}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(styles.bar, styles[`bar${size.charAt(0).toUpperCase() + size.slice(1)}`])}
              />
            ))}
          </div>
          {label && <span className={styles.label}>{label}</span>}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(styles.loader, label && styles.withLabel, className)}
        role="status"
        aria-label={label || 'Loading'}
        {...props}
      >
        <div
          className={cn(styles.circle, styles[size])}
          style={BORDER_COLORS}
        />
        {label && <span className={styles.label}>{label}</span>}
      </div>
    );
  },
);

Loader.displayName = 'Loader';
