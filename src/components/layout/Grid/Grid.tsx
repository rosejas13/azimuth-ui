import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Grid.module.css';

type GridColsValue = 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
type GridBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
type GridCols = GridColsValue | Partial<Record<GridBreakpoint, GridColsValue>>;
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

const BREAKPOINTS: Record<GridBreakpoint, number> = { base: 0, sm: 640, md: 768, lg: 1024, xl: 1280 };

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 'auto', align, variant = 'auto', gap, className, style, children, ...props }, ref) => {
    const buildGridClass = () => {
      if (typeof cols === 'object') {
        const base = cols.base ?? 'auto';
        return typeof base === 'number' ? styles[`cols${base}` as keyof typeof styles] : styles.colsAuto;
      }
      return typeof cols === 'number' ? styles[`cols${cols}` as keyof typeof styles] : styles.colsAuto;
    };

    const buildResponsiveStyle = () => {
      if (typeof cols !== 'object') return {};
      const vars: Record<string, string> = {};
      for (const bp of Object.keys(BREAKPOINTS) as GridBreakpoint[]) {
        const val = cols[bp];
        if (val !== undefined) {
          const repeatVal = typeof val === 'number' ? `repeat(${val}, 1fr)` : 'repeat(auto-fill, minmax(250px, 1fr))';
          vars[`--grid-cols-${bp}`] = repeatVal;
        }
      }
      return vars;
    };

    const isResponsive = typeof cols === 'object';

    return (
      <div
        ref={ref}
        className={cn(
          styles.grid,
          !isResponsive && buildGridClass(),
          isResponsive && styles.responsive,
          align && styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}` as keyof typeof styles],
          variant && variant !== 'auto' && styles[variant as keyof typeof styles],
          className,
        )}
        style={{
          ...(gap ? { gap: `var(--azimuth-space-${gap})` } : {}),
          ...(isResponsive ? buildResponsiveStyle() as React.CSSProperties : {}),
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
