import { forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './TextBox.module.css';

type TextBoxVariant = 'plain' | 'code';

/**
 * Curated native surface for the TextBox region container. Anything native
 * not listed goes through `boxProps`.
 */
export interface TextBoxProps extends CuratedSurface<
  'div',
  [
    'className',
    'id',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-hidden',
    'title',
    'tabIndex',
    'onClick',
    'onMouseEnter',
    'onMouseLeave',
  ]
> {
  /** @default 'plain' */
  variant?: TextBoxVariant;
  /** The content to display inside the text box. */
  children: React.ReactNode;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  boxProps?: NativeRest<'div'>;
}

/** A styled container for displaying read-only text content with optional code variant. */
export const TextBox = forwardRef<HTMLDivElement, TextBoxProps>(
  ({ variant = 'plain', className, children, boxProps, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        aria-label="Text"
        className={cn(styles.root, styles[variant], className)}
        {...props}
        {...(boxProps as React.ComponentPropsWithoutRef<'div'>)}
      >
        {children}
      </div>
    );
  },
);

TextBox.displayName = 'TextBox';
