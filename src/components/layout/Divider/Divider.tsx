import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './Divider.module.css';

/** Curated native surface for the Divider hr; anything native not listed goes through `dividerProps`. */
export interface DividerProps extends CuratedSurface<
  'hr',
  ['className', 'style', 'id']
> {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Azimuth space token for margin. @default undefined */
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  dividerProps?: NativeRest<'hr'>;
}

/** A visual divider for separating content sections, supporting horizontal and vertical orientations. */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      margin,
      className,
      style,
      dividerProps,
      ...props
    },
    ref,
  ) => {
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
        {...(dividerProps as ComponentPropsWithoutRef<'hr'>)}
      />
    );
  },
);

Divider.displayName = 'Divider';
