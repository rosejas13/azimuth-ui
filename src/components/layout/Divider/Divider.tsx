import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Divider.module.css';

/** Props for the Divider layout component. */
export interface DividerProps extends ComponentPropsWithoutRef<'hr'> {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Azimuth space token for margin. @default undefined */
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/** A visual divider for separating content sections, supporting horizontal and vertical orientations. */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = 'horizontal', margin, className, style, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(styles.divider, styles[orientation], className)}
        style={{
          ...(margin
            ? { margin: `var(--azimuth-space-${margin})` }
            : undefined),
          ...style,
        }}
        aria-orientation={orientation}
        {...props}
      />
    );
  },
);

Divider.displayName = 'Divider';
