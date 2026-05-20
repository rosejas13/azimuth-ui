import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Divider.module.css';

/** A horizontal or vertical separator line. */
export interface DividerProps extends ComponentPropsWithoutRef<'hr'> {
  /** The orientation of the divider. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
}

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
