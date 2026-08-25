import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { capitalize } from '@/utils/capitalize';
import styles from './Column.module.css';

type ColumnSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ColumnAlign = 'start' | 'center' | 'end' | 'stretch';
type ColumnJustify = 'start' | 'center' | 'end' | 'between' | 'around';

/** Props for the Column layout component. */
export interface ColumnProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'md' */
  gap?: ColumnSpacing;
  align?: ColumnAlign;
  justify?: ColumnJustify;
  children?: React.ReactNode;
}

/** A vertical flexbox column with consistent gap spacing. */
export const Column = forwardRef<HTMLDivElement, ColumnProps>(
  ({ gap = 'md', align, justify, className, children, ...props }, ref) => {
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
      >
        {children}
      </div>
    );
  },
);

Column.displayName = 'Column';
