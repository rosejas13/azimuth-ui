import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import styles from './Spacer.module.css';

/** Curated native surface for the Spacer element; anything native not listed goes through `spacerProps`. */
export interface SpacerProps extends CuratedSurface<
  'div',
  ['className', 'style', 'id']
> {
  /** Flex grow factor used to push siblings apart. */
  /** @default 1 */
  flex?: number;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  spacerProps?: NativeRest<'div'>;
}

/** An invisible flexible spacer that absorbs free space between its siblings in a flex container. */
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ flex = 1, className, style, spacerProps, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(styles.spacer, className)}
        style={{ flexGrow: flex, flexBasis: 0, ...style }}
        {...props}
        {...(spacerProps as ComponentPropsWithoutRef<'div'>)}
      />
    );
  },
);

Spacer.displayName = 'Spacer';
