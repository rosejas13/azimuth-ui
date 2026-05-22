'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './OTPInput.module.css';

export interface OTPInputProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** @default 4 */
  length?: number;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      length = 4,
      value,
      onChange,
      disabled = false,
      size = 'md',
      error = false,
      className,
      ...props
    },
    ref,
  ) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const getDigits = useCallback(() => {
      const arr: string[] = [];
      for (let i = 0; i < length; i++) {
        arr.push(value[i] ?? '');
      }
      return arr;
    }, [value, length]);

    const focusInput = useCallback((index: number) => {
      const el = inputRefs.current[index];
      if (el) {
        el.focus();
      }
    }, []);

    const selectInput = useCallback((index: number) => {
      const el = inputRefs.current[index];
      if (el) {
        el.select();
      }
    }, []);

    const handleChange = useCallback(
      (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const digit = e.target.value.replace(/\D/g, '').slice(-1);
        const digits = getDigits();
        digits[index] = digit;
        const next = digits.join('');

        onChange?.(next);

        if (digit && index < length - 1) {
          focusInput(index + 1);
        }
      },
      [getDigits, length, onChange, focusInput],
    );

    const handleKeyDown = useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
          if (!value[index] && index > 0) {
            const digits = value.split('');
            digits[index - 1] = '';
            onChange?.(digits.join(''));
            focusInput(index - 1);
          } else {
            const digits = value.split('');
            digits[index] = '';
            onChange?.(digits.join(''));
          }
          return;
        }

        if (e.key === 'ArrowLeft') {
          if (index > 0) {
            focusInput(index - 1);
          }
          return;
        }

        if (e.key === 'ArrowRight') {
          if (index < length - 1) {
            focusInput(index + 1);
          }
          return;
        }
      },
      [value, onChange, focusInput, length],
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData
          .getData('text')
          .replace(/\D/g, '')
          .slice(0, length);

        if (!pasted) return;

        onChange?.(pasted);

        const targetIndex = Math.min(pasted.length, length - 1);
        focusInput(targetIndex);
        selectInput(targetIndex);
      },
      [length, onChange, focusInput, selectInput],
    );

    const setInputRef = useCallback(
      (index: number) => (el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
      },
      [],
    );

    const digits = getDigits();

    return (
      <div
        ref={ref}
        role="group"
        aria-label="One-time code input"
        className={cn(
          styles.container,
          styles[size],
          error && styles.error,
          disabled && styles.disabled,
          className,
        )}
        {...props}
      >
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={setInputRef(i)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete="one-time-code"
            aria-label={`Digit ${i + 1}`}
            className={cn(
              styles.input,
              styles[size],
              digits[i] && styles.filled,
              error && styles.inputError,
            )}
            value={digits[i]}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={disabled}
          />
        ))}
      </div>
    );
  },
);

OTPInput.displayName = 'OTPInput';
