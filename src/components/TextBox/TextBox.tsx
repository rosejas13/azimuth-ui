import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './TextBox.module.css';

type TextBoxVariant = 'plain' | 'code';

/** Props for the TextBox component. */
export interface TextBoxProps extends ComponentPropsWithoutRef<'div'> {
  /** Display variant of the text box. @default 'plain' */
  variant?: TextBoxVariant;
  /** The content of the component. */
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
