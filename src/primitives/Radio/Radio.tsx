'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Radio.module.css';

/** A radio button input component with label support. */
export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type'> {
  /** The label text displayed next to the radio button. */
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
