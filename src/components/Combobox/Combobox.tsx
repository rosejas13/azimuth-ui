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
import styles from './Combobox.module.css';

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'onSelect'> {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  onSelect: (value: string) => void;
  label?: string;
  /** @default 'Type to search...' */
  placeholder?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default false */
  disabled?: boolean;
  error?: string;
  /** @default 'No results found' */
  emptyMessage?: string;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      value,
      onChange,
      options,
      onSelect,
      label,
      placeholder = 'Type to search...',
      size = 'md',
      disabled = false,
      error,
      emptyMessage = 'No results found',
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [listboxStyle, setListboxStyle] = useState<React.CSSProperties>({});
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const id = useId();
    const listboxId = `combobox-listbox-${id}`;

    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(value.toLowerCase()),
    );

    const close = useCallback(() => {
      setOpen(false);
      setHighlightedIndex(-1);
    }, []);

    const updatePosition = useCallback(() => {
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      setListboxStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 50,
      });
    }, []);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
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
        const options = listboxRef.current.querySelectorAll('[role="option"]');
        const el = options[highlightedIndex] as HTMLElement | undefined;
        el?.scrollIntoView({ block: 'nearest' });
      }
    }, [highlightedIndex, open]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        updatePosition();
        setOpen(true);
        setHighlightedIndex(0);
      },
      [onChange, updatePosition],
    );

    const handleSelect = useCallback(
      (optionValue: string) => {
        onSelect(optionValue);
        close();
      },
      [onSelect, close],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
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
            if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
              handleSelect(filteredOptions[highlightedIndex].value);
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev >= filteredOptions.length - 1 ? 0 : prev + 1,
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev <= 0 ? filteredOptions.length - 1 : prev - 1,
            );
            break;
        }
      },
      [open, highlightedIndex, filteredOptions, handleSelect, close],
    );

    const activeDescendantId =
      open && highlightedIndex >= 0
        ? `combobox-option-${id}-${filteredOptions[highlightedIndex].value}`
        : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          styles.wrapper,
          styles[size],
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
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (value.length > 0) {
                updatePosition();
                setOpen(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
          />
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
                    aria-selected={i === highlightedIndex}
                    className={cn(
                      styles.option,
                      i === highlightedIndex && styles.optionHighlighted,
                    )}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(i)}
                  >
                    {opt.label}
                  </li>
                ))
              ) : (
                <li className={styles.emptyMessage} role="status">
                  {emptyMessage}
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
