'use client';

import { type ComponentPropsWithoutRef, forwardRef, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { useInputConfig, InputConfigProvider } from '../input-config';
import styles from './InputGroup.module.css';

/** Props for the InputGroup component. */
export interface InputGroupProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'size'
> {
  /** The input elements to group together. */
  children?: React.ReactNode;
  /** Default `size` for child inputs in this group, unless each overrides it. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Default `labelPosition` for child inputs in this group, unless each overrides it. */
  labelPosition?: 'top' | 'left' | 'inner';
}

/** A layout component that visually groups related input elements together. Inherited `size` and `labelPosition` defaults apply to child inputs. */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, size, labelPosition, ...props }, ref) => {
    const parent = useInputConfig();
    const config = useMemo(
      () => ({
        size: size ?? parent.size,
        labelPosition: labelPosition ?? parent.labelPosition,
      }),
      [size, labelPosition, parent.size, parent.labelPosition],
    );

    return (
      <InputConfigProvider value={config}>
        <div
          ref={ref}
          className={cn(styles.inputGroup, className)}
          role="group"
          {...props}
        >
          {children}
        </div>
      </InputConfigProvider>
    );
  },
);

InputGroup.displayName = 'InputGroup';
