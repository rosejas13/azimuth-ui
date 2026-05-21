'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useCallback,
  useId,
  useMemo,
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

function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
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
      (hour: number) => {
        const newDate = new Date(currentValue);
        newDate.setHours(hour);
        setValue(newDate);
      },
      [currentValue, setValue],
    );

    const handleMinuteChange = useCallback(
      (minute: number) => {
        const newDate = new Date(currentValue);
        newDate.setMinutes(minute);
        setValue(newDate);
      },
      [currentValue, setValue],
    );

    const handleSecondChange = useCallback(
      (second: number) => {
        const newDate = new Date(currentValue);
        newDate.setSeconds(second);
        setValue(newDate);
      },
      [currentValue, setValue],
    );

    const hours = useMemo(() => range(0, 23, hourStep), [hourStep]);
    const minutes = useMemo(() => range(0, 59, minuteStep), [minuteStep]);
    const seconds = useMemo(() => range(0, 59, 1), []);

    const hour = currentValue.getHours();
    const minute = currentValue.getMinutes();
    const second = currentValue.getSeconds();

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, className)}
        {...props}
      >
        <Calendar
          value={currentValue}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
        />

        {showTime && (
          <div className={styles.timeSection}>
            <div className={styles.divider} />
            <div className={styles.timeInputs}>
              <div className={styles.timeField}>
                <label className={styles.timeLabel} htmlFor={hourId}>
                  Hour
                </label>
                <select
                  id={hourId}
                  className={styles.select}
                  value={hour}
                  onChange={(e) => handleHourChange(Number(e.target.value))}
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <span className={styles.timeSeparator}>:</span>
              <div className={styles.timeField}>
                <label className={styles.timeLabel} htmlFor={minuteId}>
                  Minute
                </label>
                <select
                  id={minuteId}
                  className={styles.select}
                  value={minute}
                  onChange={(e) => handleMinuteChange(Number(e.target.value))}
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              {showSeconds && (
                <>
                  <span className={styles.timeSeparator}>:</span>
                  <div className={styles.timeField}>
                    <label className={styles.timeLabel} htmlFor={secondId}>
                      Second
                    </label>
                    <select
                      id={secondId}
                      className={styles.select}
                      value={second}
                      onChange={(e) => handleSecondChange(Number(e.target.value))}
                    >
                      {seconds.map((s) => (
                        <option key={s} value={s}>
                          {String(s).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';
