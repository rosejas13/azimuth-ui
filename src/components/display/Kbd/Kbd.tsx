import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Kbd.module.css';

export interface KbdProps extends ComponentPropsWithoutRef<'kbd'> {
  children: React.ReactNode;
}

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
