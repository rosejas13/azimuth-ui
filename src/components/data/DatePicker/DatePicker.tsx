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
import { Calendar } from '@/components/data/Calendar';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { formatDate } from './formatDate';
import styles from './DatePicker.module.css';

/** Props for the DatePicker component. */
export interface DatePickerProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue'
> {
  /** Current date value. */
  value?: Date;
  /** Default date value (uncontrolled). */
  defaultValue?: Date;
  /** Called when the selected date changes. */
  onChange?: (date: Date | undefined) => void;
  /** Label displayed above the input. */
  label?: string;
  /** Placeholder text shown when no date is selected. @default 'Select date' */
  placeholder?: string;
  /** Minimum selectable date. */
  minDate?: Date;
  /** Maximum selectable date. */
  maxDate?: Date;
  /** Display format token. @default 'PPP' */
  format?: string;
  /** Error message displayed below the input. */
  error?: string;
  /** Help text displayed below the input. */
  helpText?: string;
  /** Whether the input is disabled. */
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * A single-date picker with a read-only text input that opens a Calendar popup.
 *
 * Supports controlled/uncontrolled value, min/max date constraints,
 * custom display formats, and error/help text.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      label,
      placeholder = 'Select date',
      minDate,
      maxDate,
      format: formatStr = 'PPP',
      error,
      helpText,
      disabled = false,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<Date | undefined>(
      defaultValue,
    );

    const [isOpen, setIsOpen] = useState(false);
    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
    const wrapperRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const selectedDate = isControlled ? controlledValue : internalValue;

    useClickOutside(wrapperRef, () => setIsOpen(false), isOpen);
    useFocusTrap(popupRef, isOpen);

    const setValue = useCallback(
      (date: Date | undefined) => {
        if (!isControlled) {
          setInternalValue(date);
        }
        onChange?.(date);
      },
      [isControlled, onChange],
    );

    const updatePosition = useCallback(() => {
      const input = wrapperRef.current?.querySelector('input');
      if (!input) return;
      const rect = input.getBoundingClientRect();
      setPopupStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
        zIndex: 500,
      });
    }, []);

    const openPopup = useCallback(() => {
      if (disabled) return;
      updatePosition();
      setIsOpen(true);
    }, [disabled, updatePosition]);

    useEffect(() => {
      if (!isOpen) return;
      const handler = () => updatePosition();
      window.addEventListener('scroll', handler, true);
      window.addEventListener('resize', handler);
      return () => {
        window.removeEventListener('scroll', handler, true);
        window.removeEventListener('resize', handler);
      };
    }, [isOpen, updatePosition]);

    const handleDateSelect = useCallback(
      (date: Date) => {
        setValue(date);
        setIsOpen(false);
      },
      [setValue],
    );

    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPopup();
        }
      },
      [openPopup],
    );

    const inputValue = selectedDate ? formatDate(selectedDate, formatStr) : '';

    return (
      <div ref={ref} className={cn(styles.wrapper, className)} {...props}>
        {label && (
          <label className={styles.label} htmlFor={id}>
            {label}
          </label>
        )}
        <div ref={wrapperRef} className={styles.control}>
          <input
            id={id}
            type="text"
            className={cn(styles.input, error && styles.inputHasError)}
            value={inputValue}
            placeholder={placeholder}
            onClick={openPopup}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            readOnly
            aria-invalid={error ? 'true' : undefined}
            aria-haspopup="dialog"
          />
          {isOpen && (
            <div style={popupStyle} ref={popupRef}>
              <div className={styles.popup}>
                <Calendar
                  value={selectedDate}
                  onChange={handleDateSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>
            </div>
          )}
        </div>
        {helpText && !error && (
          <span className={styles.helpText}>{helpText}</span>
        )}
        {error && (
          <span className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
