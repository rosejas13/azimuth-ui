import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Container.module.css';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** Props for the Container layout component. */
export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  /** @default 'lg' */
  size?: ContainerSize;
}

/** A layout container that constrains content width with responsive padding. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'lg', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.container, styles[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Container.displayName = 'Container';
