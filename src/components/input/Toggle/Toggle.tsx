'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from 'react';
import { cn } from '@/utils/cn';
import { useAutoWireProps } from '../auto-wire';
import styles from './Toggle.module.css';

/** Props for the Toggle component. */
export interface ToggleProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  'size' | 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'value'
> {
  label?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Controlled state. Pair with `onChange`. When omitted the toggle is uncontrolled. */
  checked?: boolean;
  /** Initial state for an uncontrolled toggle. Ignored while `checked` is set. */
  defaultChecked?: boolean;
  /** Called with the new toggled state on every change. */
  onChange?: (checked: boolean) => void;

  /** Width applied to the outer wrapper. Accepts any CSS width value. */
  width?: CSSProperties['width'];

  // Curated native attributes. Anything not listed here goes through `toggleProps`.
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  form?: string;
  'data-testid'?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  onFocus?: ComponentPropsWithoutRef<'input'>['onFocus'];
  onBlur?: ComponentPropsWithoutRef<'input'>['onBlur'];
  onKeyDown?: ComponentPropsWithoutRef<'input'>['onKeyDown'];

  /** Escape hatch for any native attribute not listed above. Spread last, wins over other props. */
  toggleProps?: ComponentPropsWithoutRef<'input'>;
}

/** A toggle switch (checkbox role="switch") with label and size variants. */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      size = 'md',
      name,
      onBlur,
      checked,
      defaultChecked,
      onChange,
      disabled,
      className,
      id,
      children,
      toggleProps,
      width,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const generatedId = id || autoId;
    const labelContent = label || children;

    const autoWire = useAutoWireProps({
      name,
      value: checked,
      onChange,
      onBlur,
      kind: 'boolean',
    });
    const effChecked = (autoWire.checked as typeof checked) ?? checked;
    const effOnChange = (autoWire.onChange as typeof onChange) ?? onChange;
    const effOnBlur = autoWire.onBlur as typeof onBlur | undefined;
    const isControlled = effChecked !== undefined;
    const [uncontrolled, setUncontrolled] = useState(defaultChecked ?? false);

    const isChecked = isControlled ? effChecked : uncontrolled;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        if (!isControlled) {
          setUncontrolled(next);
        }
        effOnChange?.(next);
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
        style={width !== undefined ? { width } : undefined}
      >
        <input
          ref={ref}
          type="checkbox"
          id={generatedId}
          name={name}
          className={styles.input}
          disabled={disabled}
          checked={isChecked}
          defaultChecked={isControlled ? undefined : defaultChecked}
          onChange={handleChange}
          role="switch"
          aria-checked={isChecked}
          onBlur={effOnBlur}
          {...props}
          {...toggleProps}
        />
        <div
          className={styles.track}
          data-state={isChecked ? 'checked' : 'unchecked'}
        >
          <div className={styles.thumb} />
        </div>
        {labelContent && <span className={styles.label}>{labelContent}</span>}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
