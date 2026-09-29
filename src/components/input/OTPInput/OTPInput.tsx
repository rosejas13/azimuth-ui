'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { useInputConfig } from '../input-config';
import styles from './OTPInput.module.css';

/**
 * Curated native surface for the OTP group container (div-rooted). Anything
 * native not listed goes through `groupProps`.
 */
export interface OTPInputProps extends CuratedSurface<
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
  /** @default 4 */
  length?: number;
  /** The current OTP value string. */
  value: string;
  /** Callback fired when the OTP value changes. */
  onChange?: (value: string) => void;
  /** @default false */
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default false */
  error?: boolean;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  groupProps?: NativeRest<'div'>;
}

/** A one-time password input with individual digit fields, keyboard navigation, and paste support. */
export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      length = 4,
      value,
      onChange,
      disabled = false,
      size,
      error = false,
      className,
      groupProps,
      ...props
    },
    ref,
  ) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { size: configSize } = useInputConfig();
    const resolvedSize =
      size ?? (configSize === 'xl' ? 'lg' : configSize) ?? 'md';

    const getDigits = useCallback(() => {
      const arr: string[] = [];
      const v = value ?? '';
      for (let i = 0; i < length; i++) {
        arr.push(v[i] ?? '');
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
          if (!(value ?? '')[index] && index > 0) {
            const digits = (value ?? '').split('');
            digits[index - 1] = '';
            onChange?.(digits.join(''));
            focusInput(index - 1);
          } else {
            const digits = (value ?? '').split('');
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
          styles[resolvedSize],
          error && styles.error,
          disabled && styles.disabled,
          className,
        )}
        {...props}
        {...(groupProps as ComponentPropsWithoutRef<'div'>)}
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
              styles[resolvedSize],
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
