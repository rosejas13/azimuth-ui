'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { capitalize } from '@/utils/capitalize';
import styles from './Row.module.css';
import { useInputConfig } from '../../input/input-config';

type RowSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type RowAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around';

/** Props for the Row layout component. */
export interface RowProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'md' */
  gap?: RowSpacing;
  align?: RowAlign;
  justify?: RowJustify;
  /** @default true */
  wrap?: boolean;
  children?: React.ReactNode;
}

/**
 * A horizontal flexbox row with consistent gap spacing.
 * Inside a `<Form>`, children share width evenly and align to the label baseline
 * unless an explicit `align` is provided.
 */
export const Row = forwardRef<HTMLDivElement, RowProps>(
  (
    { gap = 'md', align, justify, wrap = true, className, children, ...props },
    ref,
  ) => {
    const { inForm } = useInputConfig();

    return (
      <div
        ref={ref}
        className={cn(
          styles.row,
          wrap ? styles.wrap : styles.nowrap,
          inForm && styles.formRow,
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

Row.displayName = 'Row';
