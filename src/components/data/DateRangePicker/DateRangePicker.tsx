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
  /** @default false */
  includeTime?: boolean;
  placeholder?: string;
}

function stepWithWrap(
  current: number,
  delta: 1 | -1,
  min: number,
  max: number,
): number {
  const next = current + delta;
  if (next > max) return min;
  if (next < min) return max;
  return next;
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
    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
    const wrapperRef = useRef<HTMLDivElement>(null);
    const startRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLInputElement>(null);

    const updatePopupPosition = useCallback((which: 'start' | 'end') => {
      const inputRef = which === 'start' ? startRef : endRef;
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      setPopupStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        zIndex: 500,
      });
    }, []);

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
      if (!openPicker) return;
      const which = openPicker;
      function handler() { updatePopupPosition(which); }
      window.addEventListener('scroll', handler, true);
      window.addEventListener('resize', handler);
      return () => {
        window.removeEventListener('scroll', handler, true);
        window.removeEventListener('resize', handler);
      };
    }, [openPicker, updatePopupPosition]);

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

    const handleTimeStep = useCallback(
      (which: 'start' | 'end') =>
        (field: 'hours' | 'minutes', delta: 1 | -1) => {
          const current = rangeValue[which];
          if (!current) return;

          const newDate = new Date(current);
          if (field === 'hours') {
            newDate.setHours(
              stepWithWrap(current.getHours(), delta, 0, 23),
            );
          } else {
            newDate.setMinutes(
              stepWithWrap(current.getMinutes(), delta, 0, 59),
            );
          }

          const newRange = { ...rangeValue, [which]: newDate };
          setRangeValue(newRange);
        },
      [rangeValue, setRangeValue],
    );

    const isEndInvalid =
      rangeValue.start != null &&
      rangeValue.end != null &&
      rangeValue.end <= rangeValue.start;

    const renderTimeSteppers = (
      which: 'start' | 'end',
    ) => {
      const date = rangeValue[which];
      if (!date) return null;

      const hour = date.getHours();
      const minute = date.getMinutes();
      const prefix = which === 'start' ? 'Start' : 'End';

      return (
        <div className={styles.timeSteppers}>
          <div className={styles.timeField} role="group" aria-label={`${prefix} hour`}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleTimeStep(which)('hours', 1);
              }}
              aria-label={`Increment ${prefix.toLowerCase()} hour`}
              tabIndex={-1}
            >
              ▲
            </button>
            <span className={styles.stepperValue}>
              {String(hour).padStart(2, '0')}
            </span>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleTimeStep(which)('hours', -1);
              }}
              aria-label={`Decrement ${prefix.toLowerCase()} hour`}
              tabIndex={-1}
            >
              ▼
            </button>
          </div>
          <span className={styles.timeSeparator}>:</span>
          <div className={styles.timeField} role="group" aria-label={`${prefix} minute`}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleTimeStep(which)('minutes', 1);
              }}
              aria-label={`Increment ${prefix.toLowerCase()} minute`}
              tabIndex={-1}
            >
              ▲
            </button>
            <span className={styles.stepperValue}>
              {String(minute).padStart(2, '0')}
            </span>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleTimeStep(which)('minutes', -1);
              }}
              aria-label={`Decrement ${prefix.toLowerCase()} minute`}
              tabIndex={-1}
            >
              ▼
            </button>
          </div>
        </div>
      );
    };

    const renderDateField = (which: 'start' | 'end') => {
      const value = rangeValue[which];

      return (
        <div className={styles.field}>
          <input
            ref={which === 'start' ? startRef : endRef}
            type="text"
            className={cn(
              styles.input,
              openPicker === which && styles.inputFocused,
              which === 'end' && isEndInvalid && styles.inputError,
            )}
            value={formatDate(value, includeTime)}
            placeholder={placeholder}
            onFocus={() => { updatePopupPosition(which); setOpenPicker(which); }}
            readOnly
          />
          {openPicker === which && (
            <div className={cn(styles.popup, styles.popupCalendar)} style={popupStyle}>
              <Calendar
                value={value ?? undefined}
                onChange={handleDateSelect(which)}
                minDate={which === 'start' ? minDate : (rangeValue.start ?? minDate)}
                maxDate={which === 'end' ? maxDate : (rangeValue.end ?? maxDate)}
                className={styles.popupCalendar}
              />
              {includeTime && value != null && renderTimeSteppers(which)}
            </div>
          )}
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
        {includeTime ? (
          <div
            ref={wrapperRef}
            className={styles.inputRowStacked}
          >
            <div className={styles.dateTimeRow}>
              <span className={styles.rowLabel}>Start</span>
              {renderDateField('start')}
              {rangeValue.start != null && renderTimeSteppers('start')}
            </div>
            <div className={styles.dateTimeRow}>
              <span className={styles.rowLabel}>End</span>
              {renderDateField('end')}
              {rangeValue.end != null && renderTimeSteppers('end')}
            </div>
          </div>
        ) : (
          <div className={styles.inputRow} ref={wrapperRef}>
            {renderDateField('start')}
            <span className={styles.separator}>&rarr;</span>
            {renderDateField('end')}
          </div>
        )}
      </div>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';
