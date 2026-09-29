'use client';

import { type ComponentPropsWithoutRef, forwardRef, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { useInputConfig, InputConfigProvider } from '../input-config';
import styles from './InputGroup.module.css';

/** Props for the InputGroup component. */
export interface InputGroupProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'size'
> {
  /** The input elements to group together. */
  children?: React.ReactNode;
  /** Default `size` for child inputs in this group, unless each overrides it. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Default `labelPosition` for child inputs in this group, unless each overrides it. */
  labelPosition?: 'top' | 'left' | 'inner';
  /**
   * How children are distributed in the row.
   *
   * - `'fill'` (default) — every child stretches horizontally to fill the row.
   * - `'start'` — children keep their natural width and pack left.
   * - `'end'` — children keep their natural width and pack right, with the
   *   flexible child (any child with `flex: 1`, e.g. an `<Input>`) filling the
   *   remaining space. Use this for a "search field + submit button" row:
   *   `<Input className="flex-1" />` followed by a fixed-width `<Button>`.
   */
  align?: 'start' | 'fill' | 'end';
  /**
   * Stack children vertically on narrow screens (≤ 480px): the row becomes a
   * column, every child takes full width, and the shared-edge seams (the
   * collapsed border radius) are undone so each child is fully rounded.
   * @default false
   */
  responsive?: boolean;
}

/** A layout component that visually groups related input elements together. Inherited `size` and `labelPosition` defaults apply to child inputs. */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  (
    {
      className,
      children,
      size,
      labelPosition,
      align = 'fill',
      responsive = false,
      ...props
    },
    ref,
  ) => {
    const parent = useInputConfig();
    const config = useMemo(
      () => ({
        size: size ?? parent.size,
        labelPosition: labelPosition ?? parent.labelPosition,
        inForm: parent.inForm,
      }),
      [size, labelPosition, parent.size, parent.labelPosition, parent.inForm],
    );

    return (
      <InputConfigProvider value={config}>
        <div
          ref={ref}
          className={cn(
            styles.inputGroup,
            styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
            responsive && styles.responsive,
            className,
          )}
          role="group"
          {...props}
        >
          {children}
        </div>
      </InputConfigProvider>
    );
  },
);

InputGroup.displayName = 'InputGroup';
