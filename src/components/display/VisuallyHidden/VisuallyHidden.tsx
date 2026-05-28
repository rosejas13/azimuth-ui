import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './VisuallyHidden.module.css';

/** Content that is visually hidden but accessible to screen readers. */
export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<'span'> {
  /** Content to hide visually. */
  children: React.ReactNode;
}

/** Renders content hidden from sight but available to assistive technology. */
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
