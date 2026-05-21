import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Container.module.css';

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
}

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
