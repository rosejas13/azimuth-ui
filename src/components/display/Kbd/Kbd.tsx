import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './Kbd.module.css';

/** Curated native surface for the Kbd element; anything native not listed goes through `kbdProps`. */
export interface KbdProps extends CuratedSurface<
  'kbd',
  ['className', 'style', 'id']
> {
  /** Keyboard key label. */
  children: React.ReactNode;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  kbdProps?: NativeRest<'kbd'>;
}

/** A styled keyboard key indicator. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, children, kbdProps, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(styles.kbd, className)}
        {...props}
        {...(kbdProps as ComponentPropsWithoutRef<'kbd'>)}
      >
        {children}
      </kbd>
    );
  },
);

Kbd.displayName = 'Kbd';
