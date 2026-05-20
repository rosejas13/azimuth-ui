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

/** A flexbox layout component for stacking elements with configurable direction and spacing. */
export interface StackProps extends ComponentPropsWithoutRef<'div'> {
  /** The direction to stack elements. @default 'vertical' */
  direction?: StackDirection;
  /** Cross-axis alignment of stack items. */
  align?: StackAlign;
  /** Main-axis distribution of stack items. */
  justify?: StackJustify;
  /** The spacing between stack items. @default 'md' */
  spacing?: StackSpacing;
  /** Whether stack items should wrap to the next line. @default false */
  wrap?: boolean;
  /** The content of the component. */
  children?: React.ReactNode;
}

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
