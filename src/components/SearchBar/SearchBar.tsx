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
import styles from './SearchBar.module.css';

export interface SearchBarProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'onSubmit'> {
  onSearch?: (query: string) => void;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  /** @default 300 */
  debounceMs?: number;
  /** @default 'Search...' */
  placeholder?: string;
  /** @default true */
  clearable?: boolean;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      onSearch,
      suggestions,
      onSuggestionSelect,
      debounceMs = 300,
      placeholder = 'Search...',
      clearable = true,
      disabled,
      className,
      value: controlledValue,
      onChange,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = useState(
      (controlledValue as string) ?? '',
    );
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentValue =
      controlledValue !== undefined
        ? String(controlledValue)
        : localValue;

    const filteredSuggestions = suggestions?.filter((s) =>
      s.toLowerCase().includes(currentValue.toLowerCase()),
    ) ?? [];

    useEffect(() => {
      if (controlledValue !== undefined) {
        setLocalValue(controlledValue as string);
      }
    }, [controlledValue]);

    const emitSearch = useCallback(
      (query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onSearch?.(query);
        }, debounceMs);
      },
      [onSearch, debounceMs],
    );

    useEffect(() => {
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }, []);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setShowSuggestions(false);
          setHighlightedIndex(-1);
        }
      }
      if (showSuggestions) {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [showSuggestions]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        if (controlledValue === undefined) {
          setLocalValue(next);
        }
        emitSearch(next);
        if (suggestions && next.length > 0) {
          setShowSuggestions(true);
          setHighlightedIndex(-1);
        }
        onChange?.(e);
      },
      [controlledValue, emitSearch, suggestions, onChange],
    );

    const handleClear = useCallback(() => {
      if (controlledValue === undefined) {
        setLocalValue('');
      }
      onSearch?.('');
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      onChange?.({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>);
    }, [controlledValue, onSearch, onChange]);

    const selectSuggestion = useCallback(
      (suggestion: string) => {
        if (controlledValue === undefined) {
          setLocalValue(suggestion);
        }
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        onSuggestionSelect?.(suggestion);
        onChange?.({
          target: { value: suggestion },
        } as React.ChangeEvent<HTMLInputElement>);
      },
      [controlledValue, onSuggestionSelect, onChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
          if (showSuggestions) {
            e.preventDefault();
            setShowSuggestions(false);
            setHighlightedIndex(-1);
            return;
          }
          onKeyDown?.(e);
          return;
        }

        if (e.key === 'Enter') {
          if (
            showSuggestions &&
            highlightedIndex >= 0 &&
            highlightedIndex < filteredSuggestions.length
          ) {
            e.preventDefault();
            selectSuggestion(filteredSuggestions[highlightedIndex]);
            return;
          }
          onSearch?.(currentValue);
          setShowSuggestions(false);
          onKeyDown?.(e);
          return;
        }

        if (e.key === 'ArrowDown') {
          if (showSuggestions && filteredSuggestions.length > 0) {
            e.preventDefault();
            setHighlightedIndex((prev) => {
              if (prev >= filteredSuggestions.length - 1) return 0;
              return prev + 1;
            });
            return;
          }
        }

        if (e.key === 'ArrowUp') {
          if (showSuggestions && filteredSuggestions.length > 0) {
            e.preventDefault();
            setHighlightedIndex((prev) => {
              if (prev <= 0) return filteredSuggestions.length - 1;
              return prev - 1;
            });
            return;
          }
        }

        onKeyDown?.(e);
      },
      [
        showSuggestions,
        highlightedIndex,
        filteredSuggestions,
        currentValue,
        selectSuggestion,
        onSearch,
        onKeyDown,
      ],
    );

    const hasValue = currentValue.length > 0;

    return (
      <div
        ref={wrapperRef}
        className={cn(styles.wrapper, className)}
        role="search"
      >
        <div className={styles.search}>
          <span className={styles.icon} aria-hidden="true">
            Search
          </span>
          <input
            ref={ref}
            type="text"
            role="searchbox"
            aria-label="Search"
            className={styles.input}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions && currentValue.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className={styles.suggestions} role="listbox">
            {filteredSuggestions.map((suggestion, i) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  styles.suggestion,
                  i === highlightedIndex && styles.suggestionHighlighted,
                )}
                onClick={() => selectSuggestion(suggestion)}
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
  },
);

SearchBar.displayName = 'SearchBar';
