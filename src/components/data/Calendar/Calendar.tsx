'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Calendar.module.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface CalendarProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  /** @default false */
  showWeekNumbers?: boolean;
  locale?: string;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      showWeekNumbers = false,
      locale,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? new Date(),
    );

    const selectedDate = isControlled ? controlledValue : internalValue;

    const [viewDate, setViewDate] = useState(
      startOfMonth(selectedDate),
    );

    const dayNames = useMemo(() => {
      if (locale) {
        try {
          const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });
          const names: string[] = [];
          for (let i = 0; i < 7; i++) {
            const day = new Date(2024, 0, 1 + i);
            names.push(format.format(day));
          }
          return names;
        } catch {
        }
      }
      return DAY_NAMES_SUN;
    }, [locale]);

    const weeks = useMemo(() => {
      const monthStart = startOfMonth(viewDate);
      const monthEnd = endOfMonth(viewDate);

      const startDay = monthStart.getDay();
      const daysInMonth = monthEnd.getDate();

      const cells: Array<{
        date: Date;
        isCurrentMonth: boolean;
      }> = [];

      for (let i = 0; i < startDay; i++) {
        const d = new Date(monthStart);
        d.setDate(d.getDate() - (startDay - i));
        cells.push({ date: d, isCurrentMonth: false });
      }

      for (let d = 1; d <= daysInMonth; d++) {
        cells.push({
          date: new Date(viewDate.getFullYear(), viewDate.getMonth(), d),
          isCurrentMonth: true,
        });
      }

      const remaining = 7 - (cells.length % 7);
      if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
          const d = new Date(monthEnd);
          d.setDate(d.getDate() + i);
          cells.push({ date: d, isCurrentMonth: false });
        }
      }

      const weeks: Array<typeof cells> = [];
      for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
      }
      return weeks;
    }, [viewDate]);

    const isDisabled = useCallback(
      (date: Date): boolean => {
        if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
        if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
        return false;
      },
      [minDate, maxDate],
    );

    const handleSelectDate = useCallback(
      (date: Date) => {
        if (isDisabled(date)) return;
        const newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        );
        if (!isControlled) {
          setInternalValue(newDate);
        }
        onChange?.(newDate);
      },
      [isControlled, onChange, isDisabled],
    );

    const goToPrevMonth = useCallback(() => {
      setViewDate((d) => addMonths(d, -1));
    }, []);

    const goToNextMonth = useCallback(() => {
      setViewDate((d) => addMonths(d, 1));
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, date: Date) => {
        const keyMap: Record<string, [number, number]> = {
          ArrowLeft: [0, -1],
          ArrowRight: [0, 1],
          ArrowUp: [0, -7],
          ArrowDown: [0, 7],
        };

        const delta = keyMap[e.key];
        if (!delta) return;

        e.preventDefault();
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + delta[1]);
        if (!isDisabled(newDate)) {
          handleSelectDate(newDate);
        }
      },
      [handleSelectDate, isDisabled],
    );

    const monthLabel = `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

    return (
      <div
        ref={ref}
        className={cn(styles.calendar, className)}
        role="grid"
        aria-label="Calendar"
        {...props}
      >
        <div className={styles.header}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={goToPrevMonth}
            aria-label="Previous month"
          >
            <span aria-hidden="true">&#8249;</span>
          </button>
          <span className={styles.monthLabel}>{monthLabel}</span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <span aria-hidden="true">&#8250;</span>
          </button>
        </div>

        <div className={styles.grid} role="row">
          {showWeekNumbers && (
            <span className={cn(styles.dayHeader, styles.weekNumberHeader)} />
          )}
          {dayNames.map((name) => (
            <span
              key={name}
              className={styles.dayHeader}
              role="columnheader"
              aria-label={name}
            >
              {name}
            </span>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className={styles.weekRow} role="row">
            {showWeekNumbers && (
              <span className={styles.weekNumber}>
                {weekIndex + 1}
              </span>
            )}
            {week.map((cell) => {
              const sel = selectedDate;
              const selected =
                sel != null && isSameDay(cell.date, sel);
              const today = isToday(cell.date);
              const disabled = isDisabled(cell.date);
              const isOutsideMonth = !cell.isCurrentMonth;

              return (
                <span
                  key={cell.date.toISOString()}
                  role="gridcell"
                  aria-selected={selected || undefined}
                >
                  <button
                    type="button"
                    className={cn(
                      styles.day,
                      selected && styles.daySelected,
                      today && !selected && styles.dayToday,
                      isOutsideMonth && styles.dayOutside,
                      disabled && styles.dayDisabled,
                    )}
                    aria-disabled={disabled || undefined}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => handleSelectDate(cell.date)}
                    onKeyDown={(e) => handleKeyDown(e, cell.date)}
                    disabled={disabled}
                  >
                    {cell.date.getDate()}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
);

Calendar.displayName = 'Calendar';
