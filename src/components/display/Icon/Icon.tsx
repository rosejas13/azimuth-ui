import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Icon.module.css';

type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xl2';

/** A container for rendering icons with predefined sizes. */
export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** @default 'md' */
  size?: IconSize;
  /** Icon content (typically an SVG or icon component). */
  children: React.ReactNode;
}

/** A wrapped icon element with consistent sizing. */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(styles.icon, styles[size], className)}
        aria-hidden="true"
        {...props}
      >
        {children}
      </span>
    );
  },
);

Icon.displayName = 'Icon';
