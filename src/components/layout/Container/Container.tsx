import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Container.module.css';

/** Props for the Container layout component. */
export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
}

/** A layout container that constrains content width with responsive padding. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        {children}
      </div>
    );
  },
);

Container.displayName = 'Container';
