'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { useInputConfig } from '../input-config';
import styles from './SuggestionsField.module.css';

/** Interaction mode for the field. */
export type SuggestionsFieldMode = 'free' | 'suggestions' | 'fixed';

/** Suggestion source and cap configuration for `suggestions` / `fixed` modes. */
export interface SuggestionsFieldSuggestions {
  /** Candidate strings. Required in `fixed` mode (each becomes a toggle chip). */
  options: string[];
  /** Reject further additions beyond this count, with a visible hint. */
  max?: number;
  /**
   * Disable local substring filtering of `options` against the typed text,
   * e.g. when the options already come from your own ranked lookup.
   * @default true
   */
  filter?: boolean;
}

/**
 * Curated wrapper surface (div-rooted). Anything native not listed goes
 * through `containerProps`.
 */
export interface SuggestionsFieldProps extends CuratedSurface<
  'div',
  [
    'className',
    'id',
    'title',
    'tabIndex',
    'aria-label',
    'aria-labelledby',
    'aria-describedby',
    'aria-hidden',
    'onClick',
    'onMouseEnter',
    'onMouseLeave',
  ]
> {
  /** Committed values; the component never mutates them locally. Pair with `onChange`. */
  values: string[];
  /** Called with the next values array after every add or removal. */
  onChange: (values: string[]) => void;
  /** Called with the committed value when it is added. */
  onSelect?: (value: string) => void;
  /** Called with the removed value when it is removed. */
  onRemove?: (value: string) => void;
  /**
   * How the input behaves:
   * - `free`: typed text commits on Enter or comma; backspace pops.
   * - `suggestions`: only options in `suggestions.options` commit.
   * - `fixed`: no input; every option is a click-to-toggle chip.
   * @default 'suggestions'
   */
  mode?: SuggestionsFieldMode;
  /** Candidates and cap. `suggestions` and `fixed` modes read `options` from here. */
  suggestions?: SuggestionsFieldSuggestions;
  /** Label rendered above the field. */
  label?: string;
  /** Helper text rendered below the label. */
  subtitle?: string;
  /** Validation error rendered below the field. Sets `aria-invalid`. */
  error?: string;
  /** Input placeholder (free / suggestions modes). */
  placeholder?: string;
  /** @default false */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  containerProps?: NativeRest<'div'>;
}

const MUST_PICK_HINT = 'Must be selected from the list.';
const NO_OPTIONS: string[] = [];

/** Whether `candidate` is already committed. */
const isOwned = (values: string[], candidate: string) =>
  values.includes(candidate);

/** Whether `values` has reached the allowed count. */
const atCapacity = (max: number | undefined, values: string[]) =>
  max !== undefined && values.length >= max;

/** A chips + input field for `string[]` state with three modes: free, suggestions, and fixed. */
export const SuggestionsField = forwardRef<
  HTMLDivElement,
  SuggestionsFieldProps
>(
  (
    {
      mode = 'suggestions',
      values,
      onChange,
      onSelect,
      onRemove,
      suggestions,
      label,
      subtitle,
      error,
      disabled = false,
      required = false,
      placeholder,
      size,
      className,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      containerProps,
      ...props
    },
    ref,
  ) => {
    const { size: configSize } = useInputConfig();
    const resolvedSize =
      size ?? (configSize === 'xl' ? 'lg' : configSize) ?? 'md';
    const autoId = useId();
    const fieldId = id || autoId;
    const labelId = `${fieldId}-label`;
    const subtitleId = `${fieldId}-subtitle`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const listboxId = `${fieldId}-suggestions`;

    const options = suggestions?.options ?? NO_OPTIONS;
    const max = suggestions?.max;
    const filterDisabled = suggestions?.filter === false;
    const isFixed = mode === 'fixed';
    const hasInput = mode !== 'fixed';
    const hasSuggestions = mode === 'suggestions' && options.length > 0;

    const [query, setQuery] = useState('');
    const [showList, setShowList] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [hint, setHint] = useState<string | null>(null);

    const listRef = useRef<HTMLDivElement>(null);
    const zoneRef = useRef<HTMLDivElement>(null);

    const closeList = useCallback(() => {
      setShowList(false);
      setHighlightIndex(-1);
    }, []);

    const commitValue = useCallback(
      (candidate: string) => {
        if (isOwned(values, candidate)) {
          setQuery('');
          closeList();
          return;
        }
        if (atCapacity(max, values)) {
          setHint(`Maximum ${max} selected.`);
          return;
        }
        onChange([...values, candidate]);
        onSelect?.(candidate);
        setQuery('');
        closeList();
        setHint(null);
      },
      [values, max, onChange, onSelect, closeList],
    );

    const removeValue = useCallback(
      (value: string) => {
        onChange(values.filter((v) => v !== value));
        onRemove?.(value);
      },
      [values, onChange, onRemove],
    );

    const removeLast = useCallback(() => {
      const last = values[values.length - 1];
      if (last === undefined) return;
      onChange(values.slice(0, -1));
      onRemove?.(last);
    }, [values, onChange, onRemove]);

    const availableOptions = hasSuggestions
      ? options.filter((opt) => !isOwned(values, opt))
      : NO_OPTIONS;

    const filteredOptions = filterDisabled
      ? availableOptions
      : availableOptions.filter((opt) =>
          opt.toLowerCase().includes(query.toLowerCase()),
        );

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (zoneRef.current && !zoneRef.current.contains(e.target as Node)) {
          closeList();
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [closeList]);

    useEffect(() => {
      if (showList && highlightIndex >= 0 && listRef.current) {
        const optionEls = listRef.current.querySelectorAll('[role="option"]');
        const el = optionEls[highlightIndex] as HTMLElement | undefined;
        el?.scrollIntoView({ block: 'nearest' });
      }
    }, [showList, highlightIndex]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setHint(null);
        setHighlightIndex(
          availableOptions.some((opt) =>
            opt.toLowerCase().includes(value.toLowerCase()),
          )
            ? 0
            : -1,
        );
      },
      [availableOptions],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isFixed) return;

        if (e.key === 'Backspace') {
          if (query === '' && values.length > 0) {
            e.preventDefault();
            removeLast();
          }
          return;
        }

        if (mode === 'free') {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const candidate = query.trim();
            if (candidate !== '') commitValue(candidate);
          }
          return;
        }

        // mode === 'suggestions': combobox keyboard flow.
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (filteredOptions.length > 0) {
            setShowList(true);
            setHighlightIndex((prev) =>
              prev >= filteredOptions.length - 1 ? 0 : prev + 1,
            );
          }
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (filteredOptions.length > 0) {
            setShowList(true);
            setHighlightIndex((prev) =>
              prev <= 0 ? filteredOptions.length - 1 : prev - 1,
            );
          }
          return;
        }
        if (e.key === 'Escape') {
          if (showList) {
            e.preventDefault();
            closeList();
            setQuery('');
          }
          return;
        }
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          if (query === '') {
            closeList();
            return;
          }
          if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
            commitValue(filteredOptions[highlightIndex]);
          } else {
            setHint(MUST_PICK_HINT);
          }
        }
      },
      [
        isFixed,
        mode,
        query,
        values,
        showList,
        highlightIndex,
        filteredOptions,
        suggestions,
        commitValue,
        removeLast,
        closeList,
      ],
    );

    const handleFocus = useCallback(() => {
      if (hasSuggestions && availableOptions.length > 0) {
        setShowList(true);
        setHighlightIndex(0);
      }
    }, [hasSuggestions, availableOptions]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      // Keep the list open when focus moves into it (suggestion click
      // keystrokes); otherwise dismiss for touch/AT parity.
      const next = e.relatedTarget as Node | null;
      if (next && listRef.current?.contains(next)) return;
      setShowList(false);
      setHighlightIndex(-1);
    }, []);

    const fixedChips = Array.from(
      new Set([...(suggestions?.options ?? []), ...values]),
    );

    const describedParts = [
      ariaDescribedby,
      error ? errorId : subtitle ? subtitleId : undefined,
      hint ? hintId : undefined,
    ].filter(Boolean) as string[];
    const compositedDescribedby = describedParts.length
      ? describedParts.join(' ')
      : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          styles.wrapper,
          styles[resolvedSize],
          disabled && styles.wrapperDisabled,
          className,
        )}
        aria-labelledby={ariaLabelledby}
        {...props}
        {...(containerProps as ComponentPropsWithoutRef<'div'>)}
      >
        {label &&
          (hasInput ? (
            <label
              htmlFor={fieldId}
              className={cn(styles.label, required && styles.required)}
            >
              {label}
            </label>
          ) : (
            <span
              id={labelId}
              className={cn(styles.label, required && styles.required)}
            >
              {label}
            </span>
          ))}
        {subtitle && (
          <span id={subtitleId} className={styles.subtitle}>
            {subtitle}
          </span>
        )}
        <div
          ref={zoneRef}
          className={cn(styles.fieldBox, error && styles.hasError)}
        >
          {values.length > 0 || isFixed ? (
            <ul
              className={styles.chips}
              aria-label={
                isFixed ? (ariaLabel ?? label ?? 'Options') : undefined
              }
            >
              {(isFixed && suggestions ? fixedChips : values).map((v, i) => {
                const included = isFixed && values.includes(v);
                return (
                  <li
                    key={isFixed ? v : `${v}-${i}`}
                    className={cn(styles.chip, included && styles.chipSelected)}
                  >
                    {isFixed ? (
                      <button
                        type="button"
                        className={styles.chipToggle}
                        aria-pressed={included}
                        disabled={disabled}
                        onClick={() => {
                          if (included) {
                            removeValue(v);
                          } else {
                            commitValue(v);
                          }
                        }}
                      >
                        {v}
                      </button>
                    ) : (
                      <>
                        {v}
                        <button
                          type="button"
                          className={styles.chipRemove}
                          aria-label={`Remove ${v}`}
                          disabled={disabled}
                          onClick={() => removeValue(v)}
                        >
                          ×
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}
          {hasInput && (
            <input
              id={fieldId}
              type="text"
              className={styles.fieldInput}
              value={query}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete={mode === 'suggestions' ? 'off' : undefined}
              role={hasSuggestions ? 'combobox' : undefined}
              aria-autocomplete={hasSuggestions ? 'list' : undefined}
              aria-expanded={hasSuggestions ? showList : undefined}
              aria-controls={hasSuggestions && showList ? listboxId : undefined}
              aria-activedescendant={
                hasSuggestions &&
                showList &&
                highlightIndex >= 0 &&
                highlightIndex < filteredOptions.length
                  ? `${listboxId}-${highlightIndex}`
                  : undefined
              }
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={compositedDescribedby}
              aria-label={ariaLabel ?? (label ? undefined : placeholder)}
            />
          )}
          {hasSuggestions && showList && filteredOptions.length > 0 && (
            <div
              ref={listRef}
              id={listboxId}
              className={styles.listbox}
              role="listbox"
            >
              {filteredOptions.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  id={`${listboxId}-${i}`}
                  tabIndex={-1}
                  role="option"
                  aria-selected={i === highlightIndex}
                  className={cn(
                    styles.option,
                    i === highlightIndex && styles.optionHighlighted,
                  )}
                  onMouseDown={(e) => {
                    // Keep focus in the input so blur dismissal doesn't
                    // race the option click.
                    e.preventDefault();
                  }}
                  onClick={() => commitValue(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.footerArea}>
          {error && (
            <span id={errorId} className={styles.errorMessage} role="alert">
              {error}
            </span>
          )}
          {!error && hint && (
            <span id={hintId} className={styles.hint} role="status">
              {hint}
            </span>
          )}
        </div>
      </div>
    );
  },
);

SuggestionsField.displayName = 'SuggestionsField';
