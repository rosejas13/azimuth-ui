'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Input.module.css';

type InputBaseProps = ComponentPropsWithoutRef<'input'>;

/** A text input component with label, validation, autocomplete, and stepper support. */
export interface InputProps extends Omit<InputBaseProps, 'size'> {
  label?: string;
  /** Helper text displayed below the label. */
  subtitle?: string;
  /** Error message displayed below the input. */
  error?: string;
  /** @default false */
  required?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default 'top' */
  labelPosition?: 'top' | 'left' | 'inner';
  /** @default false */
  showSteppers?: boolean;
  min?: number;
  max?: number;
  step?: number;
  autocompleteOptions?: string[];
  onAutocompleteSelect?: (value: string) => void;
  maxLength?: number;
  /** @default false */
  showCharCount?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      subtitle,
      error,
      required = false,
      size = 'md',
      labelPosition = 'top',
      showSteppers = false,
      type = 'text',
      min,
      max,
      step,
      autocompleteOptions,
      onAutocompleteSelect,
      maxLength,
      showCharCount = false,
      value,
      onChange,
      className,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const isNumber = type === 'number';
    const internalRefV = useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRefV;
    const [localValue, setLocalValue] = useState(value ?? '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const currentValue = value !== undefined ? String(value) : localValue;
    const hasSteppers = isNumber && showSteppers;
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const filteredSuggestions = autocompleteOptions?.filter((opt) =>
      opt.toLowerCase().includes(String(currentValue).toLowerCase()),
    ) ?? [];

    useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value);
      }
    }, [value]);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (
          suggestionsRef.current &&
          !suggestionsRef.current.contains(e.target as Node) &&
          inputRef &&
          'current' in inputRef &&
          inputRef.current &&
          !inputRef.current.contains(e.target as Node)
        ) {
          setShowSuggestions(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [inputRef]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (value === undefined) {
          setLocalValue(newValue);
        }
        if (autocompleteOptions) {
          setShowSuggestions(newValue.length > 0);
          setHighlightedIndex(-1);
        }
        onChange?.(e);
      },
      [value, onChange, autocompleteOptions],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!showSuggestions || filteredSuggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
          );
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
          e.preventDefault();
          const selected = filteredSuggestions[highlightedIndex];
          setLocalValue(selected);
          setShowSuggestions(false);
          onAutocompleteSelect?.(selected);
        } else if (e.key === 'Escape') {
          setShowSuggestions(false);
        }
      },
      [showSuggestions, filteredSuggestions, highlightedIndex, onAutocompleteSelect],
    );

    const stepUp = () => {
      const input = (inputRef as React.RefObject<HTMLInputElement>).current;
      input?.stepUp();
      input?.dispatchEvent(new Event('input', { bubbles: true }));
      if (input) {
        setLocalValue(input.value);
      }
    };

    const stepDown = () => {
      const input = (inputRef as React.RefObject<HTMLInputElement>).current;
      input?.stepDown();
      input?.dispatchEvent(new Event('input', { bubbles: true }));
      if (input) {
        setLocalValue(input.value);
      }
    };

    const isAtMax = isNumber && max !== undefined && Number(currentValue) >= max;
    const isAtMin = isNumber && min !== undefined && Number(currentValue) <= min;

    const inputElement = (
      <div className={styles.inputContainer}>
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          id={generatedId}
          type={type}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (autocompleteOptions && String(currentValue).length > 0) {
              setShowSuggestions(true);
            }
          }}
          className={cn(
            styles.input,
            hasSteppers && styles.hasSteppers,
            error && styles.hasError,
            className,
          )}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${generatedId}-error`
              : subtitle
                ? `${generatedId}-subtitle`
                : undefined
          }
          {...props}
        />

        {hasSteppers && (
          <div className={styles.steppers}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={stepUp}
              disabled={disabled || isAtMax}
              aria-label="Increment"
              tabIndex={-1}
            >
              ▴
            </button>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={stepDown}
              disabled={disabled || isAtMin}
              aria-label="Decrement"
              tabIndex={-1}
            >
              ▾
            </button>
          </div>
        )}

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div ref={suggestionsRef} className={styles.suggestions} role="listbox">
            {filteredSuggestions.map((suggestion, i) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  styles.suggestion,
                  i === highlightedIndex && styles.suggestionHighlighted,
                )}
                onClick={() => {
                  setLocalValue(suggestion);
                  setShowSuggestions(false);
                  onAutocompleteSelect?.(suggestion);
                }}
                role="option"
                aria-selected={i === highlightedIndex}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );

    const hasHeader = label || subtitle;
    const hasFooter = error;

    return (
      <div
        className={cn(
          styles.wrapper,
          size && styles[size],
          labelPosition === 'left' && styles.wrapperHorizontal,
          labelPosition === 'inner' && styles.wrapperInnerLabel,
        )}
      >
        {hasHeader && (
          <div className={styles.headerArea}>
            {label && labelPosition !== 'inner' && (
              <div className={styles.labelRow}>
                <label
                  htmlFor={generatedId}
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
            {label && labelPosition === 'inner' && (
              <label
                htmlFor={generatedId}
                className={cn(styles.label, required && styles.required)}
              >
                {label}
              </label>
            )}
            {subtitle && (
              <span id={`${generatedId}-subtitle`} className={styles.subtitle}>
                {subtitle}
              </span>
            )}
          </div>
        )}
        {inputElement}
        {hasFooter && (
          <div className={styles.footerArea}>
            {error && (
              <span id={`${generatedId}-error`} className={styles.errorMessage} role="alert">
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
