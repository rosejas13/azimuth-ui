import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Grid.module.css';

type GridColsValue = 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
type GridBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
type GridCols = GridColsValue | Partial<Record<GridBreakpoint, GridColsValue>>;
type GridAlign = 'start' | 'center' | 'end' | 'stretch';
type GridVariant = 'auto' | 'highlight' | 'sidebar';
type GridGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Props for the Grid layout component. */
export interface GridProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'auto' */
  cols?: GridCols;
  /** Azimuth space token applied to the grid gap. */
  gap?: GridGap;
  align?: GridAlign;
  /** @default 'auto' */
  variant?: GridVariant;
  /** @default 250 */
  minWidth?: number | string;
  children?: React.ReactNode;
}

const BREAKPOINTS: Record<GridBreakpoint, number> = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/** A responsive CSS grid layout component with configurable columns, alignment, and variant presets. */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols = 'auto',
      align,
      variant = 'auto',
      gap,
      minWidth,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const autoMinWidth =
      minWidth !== undefined
        ? typeof minWidth === 'number'
          ? `${minWidth}px`
          : minWidth
        : '250px';

    const buildGridClass = () => {
      if (typeof cols === 'object') {
        const base = cols.base ?? 'auto';
        return typeof base === 'number'
          ? styles[`cols${base}`]
          : styles.colsAuto;
      }
      if (typeof cols === 'number') return styles[`cols${cols}`];
      if (minWidth !== undefined) return undefined;
      return styles.colsAuto;
    };

    const buildResponsiveStyle = () => {
      if (typeof cols !== 'object') return {};
      const vars: Record<string, string> = {};
      for (const bp of Object.keys(BREAKPOINTS) as GridBreakpoint[]) {
        const val = cols[bp];
        if (val !== undefined) {
          const repeatVal =
            typeof val === 'number'
              ? `repeat(${val}, 1fr)`
              : `repeat(auto-fill, minmax(${autoMinWidth}, 1fr))`;
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
          align &&
            styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`],
          variant &&
            variant !== 'auto' &&
            styles[variant as keyof typeof styles],
          className,
        )}
        style={{
          ...(gap ? { gap: `var(--azimuth-space-${gap})` } : {}),
          ...(isResponsive ? buildResponsiveStyle() : {}),
          ...(!isResponsive && minWidth !== undefined
            ? {
                gridTemplateColumns: `repeat(auto-fill, minmax(${autoMinWidth}, 1fr))`,
              }
            : {}),
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
