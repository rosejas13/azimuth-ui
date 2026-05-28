import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './TextBox.module.css';

type TextBoxVariant = 'plain' | 'code';

export interface TextBoxProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'plain' */
  variant?: TextBoxVariant;
  children: React.ReactNode;
}

export const TextBox = forwardRef<HTMLDivElement, TextBoxProps>(
  ({ variant = 'plain', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.root, styles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TextBox.displayName = 'TextBox';
