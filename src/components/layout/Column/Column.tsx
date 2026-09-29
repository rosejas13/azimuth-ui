import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { capitalize } from '@/utils/capitalize';
import styles from './Column.module.css';

type ColumnSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ColumnAlign = 'start' | 'center' | 'end' | 'stretch';
type ColumnJustify = 'start' | 'center' | 'end' | 'between' | 'around';

/** Curated native surface for the Column container; anything native not listed goes through `columnProps`. */
export interface ColumnProps extends CuratedSurface<
  'div',
  ['className', 'style', 'id']
> {
  /** @default 'md' */
  gap?: ColumnSpacing;
  align?: ColumnAlign;
  justify?: ColumnJustify;
  children?: React.ReactNode;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  columnProps?: NativeRest<'div'>;
}

/** A vertical flexbox column with consistent gap spacing. */
export const Column = forwardRef<HTMLDivElement, ColumnProps>(
  (
    { gap = 'md', align, justify, className, children, columnProps, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.column,
          align && styles[`align${capitalize(align)}`],
          justify && styles[`justify${capitalize(justify)}`],
          styles[`gap${capitalize(gap)}`],
          className,
        )}
        {...props}
        {...(columnProps as ComponentPropsWithoutRef<'div'>)}
      >
        {children}
      </div>
    );
  },
);

Column.displayName = 'Column';
