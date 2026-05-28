'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Toggle.module.css';

/** Props for the Toggle component. */
export interface ToggleProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type'> {
  label?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/** A toggle switch (checkbox role="switch") with label and size variants. */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      size = 'md',
      className,
      disabled,
      checked,
      defaultChecked,
      onChange,
      id,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId =
      id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const labelContent = label || children;

    const isControlled = checked !== undefined;
    const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);

    const isChecked = isControlled ? checked : uncontrolled;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setUncontrolled(e.target.checked);
        }
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    return (
      <label
        htmlFor={generatedId}
        className={cn(
          styles.wrapper,
          styles[size],
          disabled && styles.wrapperDisabled,
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={generatedId}
          className={styles.input}
          disabled={disabled}
          checked={isChecked}
          onChange={handleChange}
          role="switch"
          {...props}
        />
        <div className={styles.track} data-state={isChecked ? 'checked' : 'unchecked'}>
          <div className={styles.thumb} />
        </div>
        {labelContent && <span className={styles.label}>{labelContent}</span>}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
