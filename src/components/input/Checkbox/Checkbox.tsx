'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type'> {
  label?: string;
  /** @default false */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      indeterminate = false,
      className,
      disabled,
      id,
      children,
      ...props
    },
    ref,
  ) => {
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
        type="checkbox"
        id={generatedId}
        className={styles.checkbox}
        disabled={disabled}
        {...props}
        ref={(el) => {
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
          if (el) el.indeterminate = indeterminate;
          // indeterminate is not settable via HTML attribute; must be set imperatively on the DOM element
        }}
      />
        {labelContent && <span className={styles.label}>{labelContent}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
