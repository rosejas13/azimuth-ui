import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './VisuallyHidden.module.css';

/** Props for the VisuallyHidden component. */
export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<'span'> {
  /** The content of the component. */
  children: React.ReactNode;
}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(styles.root, className)} {...props}>
        {children}
      </span>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
