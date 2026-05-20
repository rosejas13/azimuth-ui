'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
} from 'react';
import { cn } from '@/utils/cn';
import { Calendar } from '@/components/Calendar';
import styles from './DateRangePicker.module.css';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  label?: string;
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  includeTime?: boolean;
  placeholder?: string;
}

function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

function formatDate(date: Date | null, includeTime: boolean): string {
  if (!date) return '';
  const day = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  if (includeTime) {
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${day} ${time}`;
  }
  return day;
}

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      label,
      value: controlledValue,
      onChange,
      minDate,
      maxDate,
      includeTime = false,
      placeholder = 'Select date',
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<DateRange>({
      start: null,
      end: null,
    });

    const rangeValue = isControlled ? controlledValue : internalValue;

    const [openPicker, setOpenPicker] = useState<'start' | 'end' | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const startHourId = useId();
    const startMinuteId = useId();
    const endHourId = useId();
    const endMinuteId = useId();

    const setRangeValue = useCallback(
      (range: DateRange) => {
        if (!isControlled) {
          setInternalValue(range);
        }
        onChange?.(range);
      },
      [isControlled, onChange],
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as Node)
        ) {
          setOpenPicker(null);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = useCallback(
      (which: 'start' | 'end') =>
        (date: Date) => {
          const newRange = { ...rangeValue };
          newRange[which] = date;

          if (
            which === 'start' &&
            rangeValue.end &&
            date > rangeValue.end
          ) {
            newRange.end = null;
          }

          setRangeValue(newRange);
        },
      [rangeValue, setRangeValue],
    );

    const handleTimeChange = useCallback(
      (which: 'start' | 'end') =>
        (field: 'hours' | 'minutes', value: number) => {
          const current = rangeValue[which];
          if (!current) return;

          const newDate = new Date(current);
          if (field === 'hours') {
            newDate.setHours(value);
          } else {
            newDate.setMinutes(value);
          }

          const newRange = { ...rangeValue, [which]: newDate };
          setRangeValue(newRange);
        },
      [rangeValue, setRangeValue],
    );

    const hours = useMemo(() => range(0, 23), []);
    const minutes = useMemo(() => range(0, 59), []);

    const isEndInvalid =
      rangeValue.start != null &&
      rangeValue.end != null &&
      rangeValue.end <= rangeValue.start;

    const renderTimeSelectors = (which: 'start' | 'end') => {
      const date = rangeValue[which];
      if (!date) return null;

      const hourId = which === 'start' ? startHourId : endHourId;
      const minuteId = which === 'start' ? startMinuteId : endMinuteId;

      return (
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
                value={date.getHours()}
                onChange={(e) =>
                  handleTimeChange(which)('hours', Number(e.target.value))
                }
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
                value={date.getMinutes()}
                onChange={(e) =>
                  handleTimeChange(which)('minutes', Number(e.target.value))
                }
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, className)}
        {...props}
      >
        {label && <span className={styles.label}>{label}</span>}
        <div className={styles.inputRow} ref={wrapperRef}>
          <div className={styles.field}>
            <input
              type="text"
              className={cn(
                styles.input,
                openPicker === 'start' && styles.inputFocused,
              )}
              value={formatDate(rangeValue.start, includeTime)}
              placeholder={placeholder}
              onFocus={() => setOpenPicker('start')}
              readOnly
            />
            {openPicker === 'start' && (
              <div className={styles.popup}>
                <Calendar
                  value={rangeValue.start ?? undefined}
                  onChange={handleDateSelect('start')}
                  minDate={minDate}
                  maxDate={rangeValue.end ?? maxDate}
                />
                {includeTime &&
                  rangeValue.start != null &&
                  renderTimeSelectors('start')}
              </div>
            )}
          </div>
          <span className={styles.separator}>&rarr;</span>
          <div className={styles.field}>
            <input
              type="text"
              className={cn(
                styles.input,
                openPicker === 'end' && styles.inputFocused,
                isEndInvalid && styles.inputError,
              )}
              value={formatDate(rangeValue.end, includeTime)}
              placeholder={placeholder}
              onFocus={() => setOpenPicker('end')}
              readOnly
            />
            {openPicker === 'end' && (
              <div className={styles.popup}>
                <Calendar
                  value={rangeValue.end ?? undefined}
                  onChange={handleDateSelect('end')}
                  minDate={rangeValue.start ?? minDate}
                  maxDate={maxDate}
                />
                {includeTime &&
                  rangeValue.end != null &&
                  renderTimeSelectors('end')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';
