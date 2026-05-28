import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './TextBox.module.css';

type TextBoxVariant = 'plain' | 'code';

/** Props for the TextBox component. */
export interface TextBoxProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'plain' */
  variant?: TextBoxVariant;
  /** The content to display inside the text box. */
  children: React.ReactNode;
}

/** A styled container for displaying read-only text content with optional code variant. */
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
