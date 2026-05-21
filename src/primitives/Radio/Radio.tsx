'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Radio.module.css';

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type'> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, disabled, id, children, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const labelContent = label || children;

    return (
      <label
        htmlFor={generatedId}
        className={cn(
          styles.wrapper,
          disabled && styles.wrapperDisabled,
          className,
        )}
      >
        <input
          ref={ref}
          type="radio"
          id={generatedId}
          className={styles.radio}
          disabled={disabled}
          {...props}
        />
        {labelContent && <span className={styles.label}>{labelContent}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
