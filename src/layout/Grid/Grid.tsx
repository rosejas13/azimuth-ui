import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Grid.module.css';

type GridCols = 1 | 2 | 3 | 4 | 'auto';
type GridAlign = 'start' | 'center' | 'end' | 'stretch';
type GridVariant = 'auto' | 'highlight' | 'sidebar';

export interface GridProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'auto' */
  cols?: GridCols;
  gap?: string;
  align?: GridAlign;
  /** @default 'auto' */
  variant?: GridVariant;
  children?: React.ReactNode;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 'auto', align, variant = 'auto', gap, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.grid,
          typeof cols === 'number' ? styles[`cols${cols}` as keyof typeof styles] : styles.colsAuto,
          align && styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}` as keyof typeof styles],
          variant && variant !== 'auto' && styles[variant as keyof typeof styles],
          className,
        )}
        style={{
          ...(gap ? { gap: `var(--azimuth-space-${gap})` } : {}),
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Grid.displayName = 'Grid';
