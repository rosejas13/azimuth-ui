'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from 'react';
import { cn } from '@/utils/cn';
import { useInputConfig } from '../input-config';
import styles from './Combobox.module.css';

/** An individual option in the combobox dropdown list. */
export interface ComboboxOption {
  value: string;
  label: string;
}

/** Single-select state contract (default mode). */
export interface ComboboxSingleSelection {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}

/**
 * Multi-select state contract: chips render inside the field, `onSelect`
 * appends a value, `onRemove` fires when a chip is dismissed, and Backspace
 * on an empty input pops the last chip.
 */
export interface ComboboxMultiSelection {
  values: string[];
  onChange: (values: string[]) => void;
  onSelect: (value: string) => void;
  onRemove?: (value: string) => void;
}

/** Props for the Combobox component. */
export interface ComboboxProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'onSelect'
> {
  data: {
    options: ComboboxOption[];
    /** @default 'No results found' */ emptyMessage?: string;
  };
  selection: ComboboxSingleSelection | ComboboxMultiSelection;
  label?: string;
  /** @default 'Type to search...' */
  placeholder?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default false */
  disabled?: boolean;
  error?: string;
  /** Custom filter function. Receives each option and the current query string.
   *  Return `true` to include the option in the filtered list.
   *  @default substring match (case-insensitive includes) */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /**
   * Render removable chips for the selected values inside the field
   * (multi mode only).
   * @default true */
  chipVariant?: boolean;
  /** Accept typed values not present in `data.options` (multi mode only). @default false */
  allowNewValue?: boolean;
  /** Maximum number of selectable values (multi mode only). */
  maxSelected?: number;
}

const isMultiSelection = (
  selection: ComboboxProps['selection'],
): selection is ComboboxMultiSelection =>
  'values' in selection && Array.isArray(selection.values);

function toLabel(value: string, options: ComboboxOption[] | undefined): string {
  const found = (options ?? []).find((o) => o.value === value);
  return found?.label ?? value;
}

/** An autocomplete combobox with filtering, keyboard navigation, ARIA support,
 * and an optional multi-select chip mode. */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      data: { options, emptyMessage = 'No results found' },
      selection,
      label,
      placeholder = 'Type to search...',
      size,
      disabled = false,
      error,
      filter: customFilter,
      chipVariant = true,
      allowNewValue = false,
      maxSelected,
      className,
      ...props
    },
    ref,
  ) => {
    const multi = isMultiSelection(selection);
    const { size: configSize } = useInputConfig();
    const resolvedSize =
      size ?? (configSize === 'xl' ? 'lg' : configSize) ?? 'md';
    const values: string[] = multi ? selection.values : [];
    const isAtCapacity =
      maxSelected !== undefined && values.length >= maxSelected;

    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [listboxStyle, setListboxStyle] = useState<React.CSSProperties>({});
    // Multi mode keeps the typed query internal — `selection.onChange` there
    // carries the selected values, not the input text.
    const [query, setQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const id = useId();
    const listboxId = `combobox-listbox-${id}`;

    const filterFn =
      customFilter ??
      ((opt: ComboboxOption, q: string) => {
        return (opt.label ?? '').toLowerCase().includes(q.toLowerCase());
      });

    const displayValue = multi ? query : (selection.value ?? '');
    const filteredOptions = (options ?? []).filter((opt) =>
      filterFn(opt, displayValue ?? ''),
    );

    const close = useCallback(() => {
      setOpen(false);
      setHighlightedIndex(-1);
    }, []);

    const updatePosition = useCallback(() => {
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      // Measured once the listbox is mounted; before that, estimate with the
      // CSS max-height (240px) so the first open can still flip correctly.
      const listboxHeight =
        listboxRef.current?.getBoundingClientRect().height || 240;
      let top = rect.bottom + 4;
      if (spaceBelow < listboxHeight + 4 && rect.top > spaceBelow) {
        // Not enough room below and more space above: flip, clamped to the
        // viewport so a very tall listbox never escapes off-screen.
        top = Math.max(4, rect.top - listboxHeight - 4);
      }
      setListboxStyle({
        position: 'fixed',
        top,
        left: rect.left,
        width: rect.width,
        zIndex: 50,
      });
    }, []);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          close();
        }
      }
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        const positionHandler = () => updatePosition();
        window.addEventListener('scroll', positionHandler, true);
        window.addEventListener('resize', positionHandler);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          window.removeEventListener('scroll', positionHandler, true);
          window.removeEventListener('resize', positionHandler);
        };
      }
    }, [open, close, updatePosition]);

    useEffect(() => {
      if (open && highlightedIndex >= 0 && listboxRef.current) {
        const optionEls =
          listboxRef.current.querySelectorAll('[role="option"]');
        const el = optionEls[highlightedIndex] as HTMLElement | undefined;
        el?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, open]);

    // Re-measure after the listbox renders or its height changes (filtering
    // adds/removes items) so a flipped listbox stays anchored to the input.
    useEffect(() => {
      if (!open) return;
      updatePosition();
    }, [open, filteredOptions.length, updatePosition]);

    const removeValue = useCallback(
      (value: string) => {
        if (!multi) return;
        selection.onChange(values.filter((v) => v !== value));
        selection.onRemove?.(value);
      },
      [multi, selection, values],
    );

    const addValue = useCallback(
      (value: string) => {
        if (!multi) return;
        if (values.includes(value)) return;
        if (isAtCapacity) return;
        selection.onChange([...values, value]);
        selection.onSelect(value);
      },
      [multi, selection, values, isAtCapacity],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        if (multi) {
          setQuery(next);
        } else {
          selection.onChange(next);
        }
        updatePosition();
        setOpen(true);
        // Reset highlight to 0 only if there are options to highlight
        const nextFiltered = (options ?? []).filter((opt) =>
          filterFn(opt, next),
        );
        setHighlightedIndex(nextFiltered.length > 0 ? 0 : -1);
      },
      [multi, selection, updatePosition, options, filterFn],
    );

    const handleSelect = useCallback(
      (optionValue: string) => {
        if (multi) {
          if (values.includes(optionValue)) return; // toggle no-op; removing is chip/Backspace only
          addValue(optionValue);
          setQuery('');
        } else {
          selection.onSelect(optionValue);
        }
        close();
      },
      [multi, selection, values, addValue, close],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        // Backspace on an empty input pops the last chip (multi mode).
        if (
          multi &&
          e.key === 'Backspace' &&
          (e.currentTarget as HTMLInputElement).value === '' &&
          values.length > 0
        ) {
          e.preventDefault();
          removeValue(values[values.length - 1]);
          return;
        }

        if (!open) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            updatePosition();
            setOpen(true);
            setHighlightedIndex(0);
          }
          return;
        }

        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            close();
            break;
          case 'Enter':
            e.preventDefault();
            if (
              highlightedIndex >= 0 &&
              highlightedIndex < filteredOptions.length
            ) {
              handleSelect(filteredOptions[highlightedIndex].value);
            } else if (multi && allowNewValue && query.trim() !== '') {
              addValue(query.trim());
              setQuery('');
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (filteredOptions.length > 0) {
              setHighlightedIndex((prev) =>
                prev >= filteredOptions.length - 1 ? 0 : prev + 1,
              );
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (filteredOptions.length > 0) {
              setHighlightedIndex((prev) =>
                prev <= 0 ? filteredOptions.length - 1 : prev - 1,
              );
            }
            break;
        }
      },
      [
        multi,
        values,
        removeValue,
        open,
        highlightedIndex,
        filteredOptions,
        handleSelect,
        close,
        allowNewValue,
        query,
        addValue,
      ],
    );

    const activeDescendantId =
      open && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length
        ? `combobox-option-${id}-${filteredOptions[highlightedIndex].value}`
        : undefined;

    const valueToLabel = (value: string) => toLabel(value, options);

    return (
      <div
        ref={ref}
        className={cn(
          styles.wrapper,
          styles[resolvedSize],
          error && styles.hasError,
          disabled && styles.disabled,
          className,
        )}
        {...props}
      >
        {label && (
          <label className={styles.label} htmlFor={`combobox-input-${id}`}>
            {label}
          </label>
        )}
        <div ref={wrapperRef} className={styles.control}>
          <div
            className={cn(
              styles.inputRow,
              multi && chipVariant && values.length > 0 && styles.hasChips,
            )}
          >
            {multi &&
              chipVariant &&
              values.map((v) => (
                <span
                  key={v}
                  className={cn(styles.chip, error && styles.chipError)}
                >
                  {valueToLabel(v)}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(v);
                    }}
                    aria-label={`Remove ${valueToLabel(v)}`}
                    disabled={disabled}
                    tabIndex={-1}
                  >
                    ×
                  </button>
                </span>
              ))}
            <input
              ref={inputRef}
              id={`combobox-input-${id}`}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-activedescendant={activeDescendantId}
              aria-invalid={error ? 'true' : undefined}
              className={styles.input}
              value={displayValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if ((displayValue ?? '').length > 0) {
                  updatePosition();
                  setOpen(true);
                }
              }}
              placeholder={multi && values.length > 0 ? undefined : placeholder}
              disabled={disabled}
              aria-label={
                multi && values.length > 0
                  ? label
                    ? `${label} — search to add more`
                    : 'Search to add more'
                  : undefined
              }
            />
          </div>
          {open && (
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              className={styles.listbox}
              style={listboxStyle}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, i) => (
                  <li
                    key={opt.value}
                    id={`combobox-option-${id}-${opt.value}`}
                    role="option"
                    aria-selected={
                      multi
                        ? values.includes(opt.value)
                        : i === highlightedIndex
                    }
                    className={cn(
                      styles.option,
                      i === highlightedIndex && styles.optionHighlighted,
                    )}
                    onClick={() => handleSelect(opt.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(opt.value);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(i)}
                  >
                    {opt.label}
                  </li>
                ))
              ) : (
                <li className={styles.emptyMessage} role="status">
                  {multi &&
                  allowNewValue &&
                  query.trim() !== '' &&
                  !isAtCapacity
                    ? `Add "${query.trim()}"`
                    : emptyMessage}
                </li>
              )}
            </ul>
          )}
        </div>
        {error && (
          <span className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';
