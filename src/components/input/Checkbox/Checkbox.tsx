'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';
import { cn } from '@/utils/cn';
import { useAutoWireProps } from '../auto-wire';
import styles from './Checkbox.module.css';

/** Props for the Checkbox component. */
export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  | 'size'
  | 'type'
  | 'checked'
  | 'defaultChecked'
  | 'onChange'
  | 'indeterminate'
  | 'value'
> {
  /** Text label displayed next to the checkbox. */
  label?: string;
  /** Controlled state. Pair with `onChange`. When omitted the checkbox is uncontrolled. */
  checked?: boolean;
  /** Initial state for an uncontrolled checkbox. Ignored while `checked` is set. */
  defaultChecked?: boolean;
  /** Called with the new checked state on every change. */
  onChange?: (checked: boolean) => void;
  /** Visual mixed state (e.g. a parent checkbox over partially-selected children). @default false */
  indeterminate?: boolean;

  // Curated native attributes. Anything not listed here goes through `checkboxProps`.
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

  /** Escape hatch for any native attribute not listed above. Spread last, wins over other props. */
  checkboxProps?: ComponentPropsWithoutRef<'input'>;
}

/** A checkbox input with an optional label and indeterminate state support. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      name,
      onBlur,
      checked,
      defaultChecked,
      onChange,
      disabled,
      indeterminate = false,
      className,
      id,
      children,
      checkboxProps,
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
          disabled && styles.wrapperDisabled,
          className,
        )}
      >
        <input
          type="checkbox"
          id={generatedId}
          name={name}
          className={styles.checkbox}
          disabled={disabled}
          checked={isChecked}
          defaultChecked={isControlled ? undefined : defaultChecked}
          onChange={handleChange}
          onBlur={effOnBlur}
          {...props}
          {...checkboxProps}
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
