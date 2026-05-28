'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useState,
  useRef,
  useEffect,
  useId,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './TextArea.module.css';

type TextAreaBaseProps = ComponentPropsWithoutRef<'textarea'>;

export interface TextAreaProps extends Omit<TextAreaBaseProps, 'size' | 'value' | 'onChange' | 'disabled' | 'maxLength'> {
  label?: {
    text?: string;
    subtitle?: string;
    error?: string;
    /** @default false */
    required?: boolean;
  };
  value?: {
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    /** @default false */
    disabled?: boolean;
  };
  charCount?: {
    maxLength?: number;
    /** @default false */
    showCharCount?: boolean;
  };
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label: {
        text: label,
        subtitle,
        error,
        required = false,
      } = {},
      value: {
        value,
        onChange,
        disabled = false,
      } = {},
      charCount: {
        maxLength,
        showCharCount = false,
      } = {},
      size = 'md',
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || internalRef;
    const [localValue, setLocalValue] = useState(value ?? '');
    const generatedId = useId();
    const fieldId = id || generatedId;

    useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value);
      }
    }, [value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (value === undefined) {
          setLocalValue(newValue);
        }
        onChange?.(e);
      },
      [value, onChange],
    );

    const currentValue = value !== undefined ? String(value) : localValue;

    return (
      <div className={cn(styles.wrapper, size && styles[size], className)}>
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
          ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
          id={fieldId}
          value={currentValue}
          onChange={handleChange}
          className={cn(styles.textarea, error && styles.hasError)}
          disabled={disabled}
          required={required}
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
        />
        {error && (
          <span id={`${fieldId}-error`} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
