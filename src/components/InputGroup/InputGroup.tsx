import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './InputGroup.module.css';

export interface InputGroupProps extends ComponentPropsWithoutRef<'div'> {
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
