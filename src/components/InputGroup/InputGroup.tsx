import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './InputGroup.module.css';

/** Props for the InputGroup component. */
export interface InputGroupProps extends ComponentPropsWithoutRef<'div'> {
  /** The content of the component. */
  children?: React.ReactNode;
}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.inputGroup, className)}
        role="group"
        {...props}
      >
        {children}
      </div>
    );
  },
);

InputGroup.displayName = 'InputGroup';
