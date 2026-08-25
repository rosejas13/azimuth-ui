'use client';

import {
  forwardRef,
  useCallback,
  useState,
  useRef,
  useEffect,
  useId,
  type ClipboardEventHandler,
  type CSSProperties,
  type FocusEventHandler,
  type FormEventHandler,
  type KeyboardEventHandler,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/utils/cn';
import { useInputConfig } from '../input-config';
import { useAutoWireProps } from '../auto-wire';
import styles from './TextArea.module.css';

/** A multi-line text input with label, character count, and error state support. */
export interface TextAreaProps {
  /** Controlled value. Pair with `onChange`. When omitted the textarea is uncontrolled. */
  value?: string;
  /** Initial value for an uncontrolled textarea. Ignored while `value` is set. */
  defaultValue?: string;
  /** Called with the textarea's current string value on every change. */
  onChange?: (value: string) => void;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
  /** @default false */
  readOnly?: boolean;

  /** Label text above the textarea. */
  label?: string;
  /** Helper text rendered below the label. */
  subtitle?: string;
  /** Validation error rendered below the textarea. Sets `aria-invalid`. */
  error?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Maximum character length. Enforced on the native textarea element. */
  maxLength?: number;
  /** Live `n/maxLength` character counter. Requires `maxLength`. @default false */
  showCharCount?: boolean;

  // Curated native attributes. Anything not listed here goes through `textareaProps`.
  id?: string;
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
  rows?: number;
  cols?: number;
  wrap?: string;
  tabIndex?: number;
  style?: CSSProperties;
  'data-testid'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-labelledby'?: string;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement>;
  onPaste?: ClipboardEventHandler<HTMLTextAreaElement>;
  onInput?: FormEventHandler<HTMLTextAreaElement>;

  /** Escape hatch for any native attribute not listed above. Spread last, wins over other props. */
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  /** Styling for the underlying `<textarea>` element. */
  className?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      subtitle,
      error,
      required = false,
      value,
      defaultValue,
      onChange,
      disabled = false,
      readOnly = false,
      size,
      maxLength,
      showCharCount = false,
      className,
      id,
      name,
      onBlur,
      textareaProps,
      ...props
    },
    ref,
  ) => {
    const { size: configSize } = useInputConfig();
    const autoWire = useAutoWireProps({ name, value, onChange, onBlur });
    const effOnBlur = autoWire.onBlur as typeof onBlur | undefined;
    const effValue = (autoWire.value as typeof value) ?? value;
    const effOnChange = (autoWire.onChange as typeof onChange) ?? onChange;
    const resolvedSize = size ?? configSize ?? 'md';
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || internalRef;
    const isControlled = effValue !== undefined;
    const [localValue, setLocalValue] = useState<string>(() =>
      isControlled ? effValue : (defaultValue ?? ''),
    );
    const generatedId = useId();
    const fieldId = id || generatedId;

    useEffect(() => {
      if (effValue !== undefined) {
        setLocalValue(effValue);
      }
    }, [effValue, isControlled]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (effValue === undefined) {
          setLocalValue(newValue);
        }
        effOnChange?.(newValue);
      },
      [effValue, effOnChange],
    );

    const currentValue = isControlled ? value : localValue;

    return (
      <div
        className={cn(
          styles.wrapper,
          resolvedSize && styles[resolvedSize],
          className,
        )}
      >
        {label && (
          <div className={styles.labelRow}>
            <label
              htmlFor={fieldId}
              className={cn(styles.label, required && styles.required)}
            >
              {label}
            </label>
            {showCharCount && maxLength !== undefined && (
              <span className={styles.charCount}>
                {String(currentValue).length}/{maxLength}
              </span>
            )}
          </div>
        )}
        {subtitle && (
          <span id={`${fieldId}-subtitle`} className={styles.subtitle}>
            {subtitle}
          </span>
        )}
        <textarea
          ref={textareaRef}
          id={fieldId}
          name={name}
          value={isControlled ? currentValue : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          onBlur={effOnBlur}
          className={cn(styles.textarea, error && styles.hasError)}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${fieldId}-error`
              : subtitle
                ? `${fieldId}-subtitle`
                : undefined
          }
          {...props}
          {...textareaProps}
        />
        {error && (
          <span
            id={`${fieldId}-error`}
            className={styles.errorMessage}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
