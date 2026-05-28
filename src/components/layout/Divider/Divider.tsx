import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Divider.module.css';

/** Props for the Divider layout component. */
export interface DividerProps extends ComponentPropsWithoutRef<'hr'> {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

/** A visual divider for separating content sections, supporting horizontal and vertical orientations. */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = 'horizontal', className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(
          styles.divider,
          styles[orientation],
          className,
        )}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  },
);

Divider.displayName = 'Divider';
