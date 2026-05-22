'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useCallback,
  useId,
} from 'react';
import { cn } from '@/utils/cn';
import { Calendar } from '@/components/Calendar';
import styles from './DateTimePicker.module.css';

export interface DateTimePickerProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  /** @default true */
  showTime?: boolean;
  /** @default false */
  showSeconds?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** @default 1 */
  hourStep?: number;
  /** @default 1 */
  minuteStep?: number;
}

function stepWithWrap(
  current: number,
  delta: 1 | -1,
  min: number,
  max: number,
  step: number,
): number {
  const next = current + delta * step;
  if (next > max) return min;
  if (next < min) {
    const lastValid = min + Math.floor((max - min) / step) * step;
    return lastValid;
  }
  return next;
}

export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      showTime = true,
      showSeconds = false,
      minDate,
      maxDate,
      hourStep = 1,
      minuteStep = 1,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? new Date(),
    );

    const currentValue = isControlled ? controlledValue : internalValue;
    const hourId = useId();
    const minuteId = useId();
    const secondId = useId();

    const setValue = useCallback(
      (date: Date) => {
        if (!isControlled) {
          setInternalValue(date);
        }
        onChange?.(date);
      },
      [isControlled, onChange],
    );

    const handleDateChange = useCallback(
      (date: Date) => {
        const newDate = new Date(currentValue);
        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setValue(newDate);
      },
      [currentValue, setValue],
    );

    const handleHourChange = useCallback(
      (delta: 1 | -1) => {
        const newDate = new Date(currentValue);
        newDate.setHours(
          stepWithWrap(currentValue.getHours(), delta, 0, 23, hourStep),
        );
        setValue(newDate);
      },
      [currentValue, setValue, hourStep],
    );

    const handleMinuteChange = useCallback(
      (delta: 1 | -1) => {
        const newDate = new Date(currentValue);
        newDate.setMinutes(
          stepWithWrap(currentValue.getMinutes(), delta, 0, 59, minuteStep),
        );
        setValue(newDate);
      },
      [currentValue, setValue, minuteStep],
    );

    const handleSecondChange = useCallback(
      (delta: 1 | -1) => {
        const newDate = new Date(currentValue);
        newDate.setSeconds(stepWithWrap(currentValue.getSeconds(), delta, 0, 59, 1));
        setValue(newDate);
      },
      [currentValue, setValue],
    );

    const hour = currentValue.getHours();
    const minute = currentValue.getMinutes();
    const second = currentValue.getSeconds();

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, className)}
        {...props}
      >
        {showTime && (
          <div className={styles.timeHeader}>
            <div className={styles.timeField} role="group" aria-label="Hour">
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={() => handleHourChange(1)}
                aria-label="Increment hour"
                tabIndex={-1}
              >
                ▲
              </button>
              <span className={styles.stepperValue} id={hourId}>
                {String(hour).padStart(2, '0')}
              </span>
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={() => handleHourChange(-1)}
                aria-label="Decrement hour"
                tabIndex={-1}
              >
                ▼
              </button>
            </div>
            <span className={styles.timeSeparator}>:</span>
            <div className={styles.timeField} role="group" aria-label="Minute">
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={() => handleMinuteChange(1)}
                aria-label="Increment minute"
                tabIndex={-1}
              >
                ▲
              </button>
              <span className={styles.stepperValue} id={minuteId}>
                {String(minute).padStart(2, '0')}
              </span>
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={() => handleMinuteChange(-1)}
                aria-label="Decrement minute"
                tabIndex={-1}
              >
                ▼
              </button>
            </div>
            {showSeconds && (
              <>
                <span className={styles.timeSeparator}>:</span>
                <div className={styles.timeField} role="group" aria-label="Second">
                  <button
                    type="button"
                    className={styles.stepperBtn}
                    onClick={() => handleSecondChange(1)}
                    aria-label="Increment second"
                    tabIndex={-1}
                  >
                    ▲
                  </button>
                  <span className={styles.stepperValue} id={secondId}>
                    {String(second).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className={styles.stepperBtn}
                    onClick={() => handleSecondChange(-1)}
                    aria-label="Decrement second"
                    tabIndex={-1}
                  >
                    ▼
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <Calendar
          value={currentValue}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          className={styles.calendar}
        />
      </div>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';
