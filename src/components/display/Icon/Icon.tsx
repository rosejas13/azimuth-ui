import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Icon.module.css';

type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xl2';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** @default 'md' */
  size?: IconSize;
  children: React.ReactNode;
}

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
