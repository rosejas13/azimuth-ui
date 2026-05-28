import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Kbd.module.css';

/** A keyboard key indicator styled as a <kbd> element. */
export interface KbdProps extends ComponentPropsWithoutRef<'kbd'> {
  /** Keyboard key label. */
  children: React.ReactNode;
}

/** A styled keyboard key indicator. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <kbd ref={ref} className={cn(styles.kbd, className)} {...props}>
        {children}
      </kbd>
    );
  },
);

Kbd.displayName = 'Kbd';
