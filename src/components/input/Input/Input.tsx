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
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
  type KeyboardEventHandler,
} from 'react';
import { cn } from '@/utils/cn';
import { useInputConfig } from '../input-config';
import { useAutoWireProps } from '../auto-wire';
import styles from './Input.module.css';

const NO_SUGGESTIONS: string[] = [];

/** Structured label customization. Pass a plain string to `label` when defaults suffice. */
export interface LabelConfig {
  /** Label text. */
  text: string;
  /** Helper text rendered below the label. */
  subtitle?: string;
  /** @default 'top' */
  position?: 'top' | 'left' | 'inner';
  /** @default false */
  required?: boolean;
}

/** A text input component with label, validation, autocomplete, and stepper support. */
export interface InputProps {
  /** Controlled value. Pair with `onChange`. When omitted the input is uncontrolled. */
  value?: string | number;
  /** Initial value for an uncontrolled input. Ignored while `value` is set. */
  defaultValue?: string | number;
  /** Called with the input's current string value on every change. */
  onChange?: (value: string) => void;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
  /** @default false */
  readOnly?: boolean;

  /**
   * Label text above the input (or beside/inside it per `labelPosition`).
   * Pass a `LabelConfig` object to also set subtitle, position, or required inline.
   */
  label?: string | LabelConfig;
  /** Helper text rendered below the label. */
  subtitle?: string;
  /** Validation error rendered below the input. Sets `aria-invalid`. */
  error?: string;
  /** @default 'top' */
  labelPosition?: 'top' | 'left' | 'inner';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Show increment/decrement buttons for `type="number"`. @default false */
  stepper?: boolean;
  /** Live `n/maxLength` character counter. Requires `maxLength`. @default false */
  showCharCount?: boolean;

  /**
   * Suggestion list shown while typing. `onSelect` receives the chosen string.
   * Set `filter: false` when the options come from your own ranked lookup
   * (e.g. a geocoder) so results are shown as returned instead of substring-filtered.
   */
  suggestions?: {
    options: string[];
    onSelect?: (value: string) => void;
    /** Filter options locally against the typed text. @default true */
    filter?: boolean;
  };

  // Curated native attributes. Anything not listed here goes through `inputProps`.
  id?: string;
  name?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  pattern?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  tabIndex?: number;
  style?: CSSProperties;
  'data-testid'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-labelledby'?: string;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
  onPaste?: ClipboardEventHandler<HTMLInputElement>;
  onInput?: FormEventHandler<HTMLInputElement>;

  /** Escape hatch for any native attribute not listed above. Spread last, wins over other props. */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  /** Styling for the underlying `<input>` element. */
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      subtitle,
      error,
      required = false,
      labelPosition,
      value,
      defaultValue,
      onChange,
      disabled,
      stepper: showSteppers = false,
      min,
      max,
      step,
      maxLength,
      showCharCount = false,
      suggestions,
      size,
      type = 'text',
      name,
      className,
      id,
      inputProps,
      ...props
    },
    ref,
  ) => {
    const { size: configSize, labelPosition: configLabelPosition } =
      useInputConfig();
    const autoWire = useAutoWireProps({
      name,
      value,
      onChange,
      kind: 'string',
    });
    const effValue = (autoWire.value as typeof value) ?? value;
    const effOnChange = (autoWire.onChange as typeof onChange) ?? onChange;
    const effOnBlur = autoWire.onBlur as
      | React.FocusEventHandler<HTMLInputElement>
      | undefined;
    const labelConfig =
      typeof label === 'object' && label !== null ? label : undefined;
    const labelText = typeof label === 'string' ? label : labelConfig?.text;
    const resolvedSubtitle = subtitle ?? labelConfig?.subtitle;
    const resolvedLabelPosition =
      labelPosition ?? labelConfig?.position ?? configLabelPosition ?? 'top';
    const isRequired = required || (labelConfig?.required ?? false);
    const resolvedSize = size ?? configSize ?? 'md';
    const isNumber = type === 'number';
    const internalRefV = useRef<HTMLInputElement>(null);
    const inputRef = ref || internalRefV;
    const isControlled = effValue !== undefined;
    const [localValue, setLocalValue] = useState<string>(() =>
      isControlled
        ? String(effValue)
        : defaultValue !== undefined
          ? String(defaultValue)
          : '',
    );
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const currentValue = isControlled ? String(effValue) : localValue;
    const hasSteppers = isNumber && showSteppers;
    const autoId = useId();
    const generatedId = id || autoId;

    const suggestionOptions = suggestions?.options ?? NO_SUGGESTIONS;
    const hasSuggestions = suggestionOptions.length > 0;
    const filteredSuggestions =
      suggestions?.filter === false
        ? suggestionOptions
        : suggestionOptions.filter((opt) =>
            opt.toLowerCase().includes(currentValue.toLowerCase()),
          );

    useEffect(() => {
      if (value !== undefined) {
        setLocalValue(String(effValue));
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
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [inputRef]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (effValue === undefined) {
          setLocalValue(newValue);
        }
        if (suggestionOptions.length > 0) {
          setShowSuggestions(
            newValue.length > 0 || suggestions?.filter === false,
          );
          setHighlightedIndex(-1);
        }
        effOnChange?.(newValue);
      },
      [effValue, effOnChange, suggestionOptions],
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
          suggestions?.onSelect?.(selected);
        } else if (e.key === 'Escape') {
          setShowSuggestions(false);
        }
      },
      [showSuggestions, filteredSuggestions, highlightedIndex, suggestions],
    );

    const stepUp = () => {
      const input = (inputRef as React.RefObject<HTMLInputElement>).current;
      input?.stepUp();
      input?.dispatchEvent(new Event('input', { bubbles: true }));
      if (input) {
        setLocalValue(input.value);
        effOnChange?.(input.value);
      }
    };

    const stepDown = () => {
      const input = (inputRef as React.RefObject<HTMLInputElement>).current;
      input?.stepDown();
      input?.dispatchEvent(new Event('input', { bubbles: true }));
      if (input) {
        setLocalValue(input.value);
        effOnChange?.(input.value);
      }
    };

    const isAtMax =
      isNumber && max !== undefined && Number(currentValue) >= max;
    const isAtMin =
      isNumber && min !== undefined && Number(currentValue) <= min;

    const inputElement = (
      <div className={styles.inputContainer}>
        {labelText && resolvedLabelPosition === 'inner' && (
          <label
            htmlFor={generatedId}
            className={cn(styles.innerLabel, isRequired && styles.required)}
          >
            {labelText}
          </label>
        )}
        {showCharCount &&
          maxLength !== undefined &&
          resolvedLabelPosition === 'inner' && (
            <span className={cn(styles.charCount, styles.charCountInner)}>
              {currentValue.length}/{maxLength}
            </span>
          )}
        <input
          ref={inputRef}
          id={generatedId}
          name={name}
          type={type}
          value={isControlled || hasSuggestions ? currentValue : undefined}
          defaultValue={
            isControlled || hasSuggestions ? undefined : defaultValue
          }
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (
              hasSuggestions &&
              (currentValue.length > 0 || suggestions?.filter === false)
            ) {
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
          required={isRequired}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error
              ? `${generatedId}-error`
              : resolvedSubtitle
                ? `${generatedId}-subtitle`
                : undefined
          }
          aria-autocomplete={hasSuggestions ? 'list' : undefined}
          aria-expanded={hasSuggestions ? showSuggestions : undefined}
          aria-controls={
            hasSuggestions && showSuggestions
              ? `${generatedId}-suggestions`
              : undefined
          }
          aria-activedescendant={
            hasSuggestions && showSuggestions && highlightedIndex >= 0
              ? `${generatedId}-suggestions-${highlightedIndex}`
              : undefined
          }
          role={hasSuggestions ? 'combobox' : undefined}
          autoComplete={hasSuggestions ? 'off' : undefined}
          onBlur={effOnBlur}
          {...props}
          {...inputProps}
        />

        {hasSteppers && (
          <div className={styles.steppers}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={stepUp}
              disabled={disabled || isAtMax}
              aria-label="Increment"
            >
              ▴
            </button>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={stepDown}
              disabled={disabled || isAtMin}
              aria-label="Decrement"
            >
              ▾
            </button>
          </div>
        )}

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className={styles.suggestions}
            role="listbox"
            id={`${generatedId}-suggestions`}
          >
            {filteredSuggestions.map((suggestion, i) => (
              <button
                key={suggestion}
                type="button"
                id={`${generatedId}-suggestions-${i}`}
                tabIndex={-1}
                className={cn(
                  styles.suggestion,
                  i === highlightedIndex && styles.suggestionHighlighted,
                )}
                onClick={() => {
                  setLocalValue(suggestion);
                  setShowSuggestions(false);
                  suggestions?.onSelect?.(suggestion);
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

    const hasHeader =
      Boolean(labelText && resolvedLabelPosition !== 'inner') ||
      Boolean(resolvedSubtitle);
    const hasFooter = error;

    return (
      <div
        className={cn(
          styles.wrapper,
          styles[resolvedSize],
          resolvedLabelPosition === 'left' && styles.wrapperHorizontal,
          resolvedLabelPosition === 'inner' && styles.wrapperInnerLabel,
        )}
      >
        {hasHeader && (
          <div className={styles.headerArea}>
            {labelText && resolvedLabelPosition !== 'inner' && (
              <div className={styles.labelRow}>
                <label
                  htmlFor={generatedId}
                  className={cn(styles.label, isRequired && styles.required)}
                >
                  {labelText}
                </label>
                {showCharCount && maxLength !== undefined && (
                  <span className={styles.charCount}>
                    {currentValue.length}/{maxLength}
                  </span>
                )}
              </div>
            )}
            {resolvedSubtitle && (
              <span id={`${generatedId}-subtitle`} className={styles.subtitle}>
                {resolvedSubtitle}
              </span>
            )}
          </div>
        )}
        {inputElement}
        {hasFooter && (
          <div className={styles.footerArea}>
            {error && (
              <span
                id={`${generatedId}-error`}
                className={styles.errorMessage}
                role="alert"
              >
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
