'use client';

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactElement,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';
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
  /**
   * Whether children stretch to share the row's width evenly and align to
   * the label baseline. Defaults to `true` inside a `<Form>`, `false`
   * elsewhere. Set `false` inside a `<Form>` to keep children at their
   * natural widths (e.g. a button beside a single field).
   */
  stretch?: boolean;
  /**
   * Width applied to each child. A single string applies the same width to
   * all children. An array applies widths left-to-right, cycling the last
   * value for any remaining children.
   */
  childWidths?: string | string[];
  children?: React.ReactNode;
}

/**
 * A horizontal flexbox row with consistent gap spacing.
 * Children stretch (equal widths, label-baseline alignment) only when
 * `stretch` is enabled, which happens by default inside a `<Form>`.
 */
export const Row = forwardRef<HTMLDivElement, RowProps>(
  (
    {
      gap = 'md',
      align,
      justify,
      wrap = true,
      stretch,
      childWidths,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { inForm } = useInputConfig();

    const resolvedChildren =
      childWidths !== undefined
        ? Children.map(children, (child, index) => {
            if (!isValidElement(child)) return child;
            const el = child as ReactElement<{ style?: CSSProperties }>;
            const width = Array.isArray(childWidths)
              ? childWidths[Math.min(index, childWidths.length - 1)]
              : childWidths;
            const existingStyle = el.props.style ?? {};
            return cloneElement(el, {
              style: { ...existingStyle, width },
            });
          })
        : children;

    return (
      <div
        ref={ref}
        className={cn(
          styles.row,
          wrap ? styles.wrap : styles.nowrap,
          (stretch ?? inForm) && styles.formRow,
          align && styles[`align${capitalize(align)}`],
          justify && styles[`justify${capitalize(justify)}`],
          styles[`gap${capitalize(gap)}`],
          className,
        )}
        {...props}
      >
        {resolvedChildren}
      </div>
    );
  },
);

Row.displayName = 'Row';
