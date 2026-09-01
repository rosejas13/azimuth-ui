'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './DropdownList.module.css';

/** Props for the DropdownList component. */
export interface DropdownListProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  data: {
    options: Array<{
      value: string;
      label: string;
      disabled?: boolean;
      separator?: boolean;
    }>;
    /** @default 'Select...' */
    placeholder?: string;
    search?: {
      /** @default false */
      enabled?: boolean;
    };
  };
  selection?: {
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    /** @default false */
    multiple?: boolean;
  };
  label?: string;
  /** @default false */
  disabled?: boolean;
  error?: string;
}

const dataDefault: DropdownListProps['data'] = { options: [] };
const selectionDefault: DropdownListProps['selection'] = {};

/** A dropdown select component with search, single/multiple selection, and keyboard navigation. */
export const DropdownList = forwardRef<HTMLDivElement, DropdownListProps>(
  (
    {
      data: {
        options,
        placeholder = 'Select...',
        search: { enabled: searchable = false } = {},
      } = dataDefault,
      selection: { value, onChange, multiple = false } = selectionDefault,
      disabled = false,
      error,
      label,
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

    const selectableOptions = (options ?? []).filter((o) => !o.separator);
    const filteredOptions = searchable
      ? (options ?? []).filter((o) => {
          if (o.separator) return false;
          return (o.label ?? '')
            .toLowerCase()
            .includes((search ?? '').toLowerCase());
        })
      : selectableOptions;

    const selectedLabels = selectableOptions
      .filter((o) => selectedValues.includes(o.value))
      .map((o) => o.label);

    const displayText =
      selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;
    const isPlaceholder = selectedLabels.length === 0;

    const close = useCallback(() => {
      setOpen(false);
      setSearch('');
      setHighlightedIndex(-1);
    }, []);

    const updatePosition = useCallback(() => {
      const trigger = wrapperRef.current?.querySelector('button');
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setPanelStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
        zIndex: 100,
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
      if (open && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [open, searchable]);

    const selectOption = useCallback(
      (optionValue: string) => {
        if (multiple) {
          const next = selectedValues.includes(optionValue)
            ? selectedValues.filter((v) => v !== optionValue)
            : [...selectedValues, optionValue];
          onChange?.(next);
          setHighlightedIndex(
            filteredOptions.findIndex((o) => o.value === optionValue),
          );
        } else {
          onChange?.(optionValue);
          close();
        }
      },
      [multiple, selectedValues, onChange, close, filteredOptions],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!open) return;

        if (e.key === 'Escape') {
          e.preventDefault();
          close();
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            selectOption(filteredOptions[highlightedIndex].value);
          }
          return;
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (filteredOptions.length === 0) return;
          setHighlightedIndex((prev) => {
            if (prev >= filteredOptions.length - 1) return 0;
            return prev + 1;
          });
          return;
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (filteredOptions.length === 0) return;
          setHighlightedIndex((prev) => {
            if (prev <= 0) return filteredOptions.length - 1;
            return prev - 1;
          });
          return;
        }
      },
      [open, highlightedIndex, filteredOptions, selectOption, close],
    );

    useEffect(() => {
      if (open && highlightedIndex >= 0 && listboxRef.current) {
        const options = listboxRef.current.querySelectorAll('[role="option"]');
        const optionEl = options[highlightedIndex] as HTMLElement | undefined;
        optionEl?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, open]);

    const toggleOpen = () => {
      if (disabled) return;
      setOpen((prev) => {
        if (!prev) {
          setHighlightedIndex(-1);
          setSearch('');
          updatePosition();
        }
        return !prev;
      });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSearch = e.target.value;
      setSearch(newSearch);
      const newFiltered = (options ?? []).filter(
        (o) =>
          !o.separator &&
          (o.label ?? '').toLowerCase().includes(newSearch.toLowerCase()),
      );
      setHighlightedIndex(newFiltered.length > 0 ? 0 : -1);
    };

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, error && styles.hasError, className)}
        {...props}
      >
        <div ref={wrapperRef}>
          {label && (
            <label
              className={styles.label}
              id={label.toLowerCase().replace(/\s+/g, '-')}
            >
              {label}
            </label>
          )}
          <div
            className={styles.control}
            aria-invalid={error ? 'true' : undefined}
          >
            <button
              type="button"
              className={styles.trigger}
              onClick={toggleOpen}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              <span
                className={cn(
                  styles.triggerText,
                  isPlaceholder && styles.placeholder,
                )}
              >
                {displayText}
              </span>
              <span
                className={cn(styles.chevron, open && styles.chevronOpen)}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {open && (
              <div style={panelStyle}>
                <div
                  className={styles.panel}
                  role="listbox"
                  aria-multiselectable={multiple}
                >
                  {searchable && (
                    <input
                      ref={searchInputRef}
                      type="text"
                      className={styles.searchInput}
                      value={search}
                      onChange={handleSearchChange}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'ArrowDown' ||
                          e.key === 'ArrowUp' ||
                          e.key === 'Escape'
                        ) {
                          e.stopPropagation();
                          handleKeyDown(e);
                        }
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                          handleKeyDown(e);
                        }
                      }}
                      placeholder="Search..."
                      aria-label="Search options"
                    />
                  )}
                  <ul
                    ref={listboxRef}
                    className={styles.listbox}
                    role="presentation"
                  >
                    {searchable && search.length > 0
                      ? filteredOptions.map((opt, i) => (
                          <li
                            key={opt.value}
                            role="option"
                            aria-selected={selectedValues.includes(opt.value)}
                          >
                            <button
                              type="button"
                              className={cn(
                                styles.option,
                                i === highlightedIndex &&
                                  styles.optionHighlighted,
                                opt.disabled && styles.optionDisabled,
                                selectedValues.includes(opt.value) &&
                                  styles.optionSelected,
                              )}
                              onClick={() =>
                                !opt.disabled && selectOption(opt.value)
                              }
                              disabled={opt.disabled}
                              tabIndex={-1}
                            >
                              {multiple && (
                                <input
                                  type="checkbox"
                                  className={styles.checkbox}
                                  checked={selectedValues.includes(opt.value)}
                                  readOnly
                                  tabIndex={-1}
                                />
                              )}
                              <span className={styles.optionLabel}>
                                {opt.label}
                              </span>
                            </button>
                          </li>
                        ))
                      : (options ?? []).map((opt, i) => {
                          if (opt.separator) {
                            return (
                              <li
                                key={`sep-${i}`}
                                className={styles.separator}
                                role="separator"
                                aria-orientation="horizontal"
                              />
                            );
                          }
                          const optIndex = filteredOptions.findIndex(
                            (f) => f.value === opt.value,
                          );
                          return (
                            <li
                              key={opt.value}
                              role="option"
                              aria-selected={selectedValues.includes(opt.value)}
                            >
                              <button
                                type="button"
                                className={cn(
                                  styles.option,
                                  opt.disabled && styles.optionDisabled,
                                  selectedValues.includes(opt.value) &&
                                    styles.optionSelected,
                                  optIndex === highlightedIndex &&
                                    styles.optionHighlighted,
                                )}
                                onClick={() =>
                                  !opt.disabled && selectOption(opt.value)
                                }
                                disabled={opt.disabled}
                                tabIndex={-1}
                              >
                                {multiple && (
                                  <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={selectedValues.includes(opt.value)}
                                    readOnly
                                    tabIndex={-1}
                                  />
                                )}
                                <span className={styles.optionLabel}>
                                  {opt.label}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                    {searchable &&
                      search.length > 0 &&
                      filteredOptions.length === 0 && (
                        <li className={styles.emptyMessage}>
                          No results found
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            )}
          </div>
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

DropdownList.displayName = 'DropdownList';
