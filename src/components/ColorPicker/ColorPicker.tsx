'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './ColorPicker.module.css';

export interface ColorPickerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value: string;
  onChange: (color: string) => void;
  presets: string[];
  /** @default true */
  showInput?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
}

function isValidCSSColor(color: string): boolean {
  if (typeof document === 'undefined') return false;
  const el = document.createElement('div');
  el.style.color = color;
  return el.style.color !== '';
}

export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value,
      onChange,
      presets,
      showInput = true,
      size = 'md',
      className,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setInputValue(next);
        if (isValidCSSColor(next)) {
          onChange(next);
        }
      },
      [onChange],
    );

    const handleInputBlur = useCallback(() => {
      setInputValue(value);
    }, [value]);

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, styles[size], className)}
        {...props}
      >
        <div
          className={styles.swatchGrid}
          role="radiogroup"
          aria-label="Color presets"
        >
          {presets.map((color) => {
            const isSelected = value.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={color}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={color}
                className={cn(
                  styles.swatch,
                  isSelected && styles.swatchSelected,
                )}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              >
                {isSelected && (
                  <span className={styles.checkmark} aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {showInput && (
          <div className={styles.inputRow}>
            <span
              className={styles.preview}
              style={{ backgroundColor: value }}
              aria-hidden="true"
            />
            <input
              type="text"
              className={styles.input}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="#hex or oklch(...)"
              aria-label="Custom color value"
            />
          </div>
        )}
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';
