import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Stack.module.css';

type StackDirection = 'horizontal' | 'vertical';
type StackAlign = 'start' | 'center' | 'end' | 'stretch';
type StackJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around';
type StackSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Props for the Stack layout component. */
export interface StackProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'vertical' */
  direction?: StackDirection;
  align?: StackAlign;
  justify?: StackJustify;
  /** @default 'md' */
  spacing?: StackSpacing;
  /** @default false */
  wrap?: boolean;
  children?: React.ReactNode;
}

/** A flexbox stack layout for arranging children vertically or horizontally with consistent spacing. */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'vertical',
      align,
      justify,
      spacing = 'md',
      wrap = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.stack,
          styles[direction],
          align && styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}` as keyof typeof styles],
          justify && styles[`justify${justify.charAt(0).toUpperCase() + justify.slice(1)}` as keyof typeof styles],
          styles[`gap${spacing.charAt(0).toUpperCase() + spacing.slice(1)}` as keyof typeof styles],
          wrap && styles.wrap,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Stack.displayName = 'Stack';
