import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Spacer.module.css';

/** Props for the Spacer layout component. */
export interface SpacerProps extends ComponentPropsWithoutRef<'div'> {
  /** Flex grow factor used to push siblings apart. */
  /** @default 1 */
  flex?: number;
}

/** An invisible flexible spacer that absorbs free space between its siblings in a flex container. */
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ flex = 1, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(styles.spacer, className)}
        style={{ flexGrow: flex, flexBasis: 0, ...style }}
        {...props}
      />
    );
  },
);

Spacer.displayName = 'Spacer';
