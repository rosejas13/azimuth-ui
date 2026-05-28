'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Clock.module.css';

type ClockMode = 'clock' | 'countdown' | 'stopwatch';
type ClockFormat = '12h' | '24h';
type ClockSize = 'sm' | 'md' | 'lg';

export interface ClockProps extends ComponentPropsWithoutRef<'div'> {
  mode?: ClockMode;
  format?: ClockFormat;
  targetDate?: Date;
  autoStart?: boolean;
  size?: ClockSize;
}

function formatUnit(value: number): string {
  return String(value).padStart(2, '0');
}

function getSegments(value: number): [string, string] {
  const str = String(value).padStart(2, '0');
  return [str[0], str[1]];
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export const Clock = forwardRef<HTMLDivElement, ClockProps>(
  (
    {
      mode = 'clock',
      format = '24h',
      targetDate,
      autoStart = true,
      size = 'md',
      className,
      ...props
    },
    ref,
  ) => {
    const [now, setNow] = useState(() => new Date());
    const [stopwatchElapsed, setStopwatchElapsed] = useState(0);
    const [stopwatchRunning, setStopwatchRunning] = useState(autoStart && mode === 'stopwatch');
    const [countdownFinished, setCountdownFinished] = useState(false);

    const updateNow = useCallback(() => setNow(new Date()), []);

    useInterval(
      updateNow,
      mode === 'clock' ? 1000 : null,
    );

    useInterval(
      () => {
        if (stopwatchRunning) {
          setStopwatchElapsed((prev) => prev + 100);
        }
      },
      stopwatchRunning ? 100 : null,
    );

    useEffect(() => {
      if (mode !== 'countdown' || !targetDate) return;

      const tick = () => {
        const diff = targetDate.getTime() - Date.now();
        if (diff <= 0) {
          setNow(new Date(targetDate.getTime()));
          setCountdownFinished(true);
          return;
        }
        setNow(new Date());
        setCountdownFinished(false);
      };

      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, [mode, targetDate]);

    useEffect(() => {
      setStopwatchElapsed(0);
      setStopwatchRunning(autoStart && mode === 'stopwatch');
    }, [mode, autoStart]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (mode !== 'stopwatch') return;
        if (e.key === ' ') {
          e.preventDefault();
          setStopwatchRunning((r) => !r);
        }
        if (e.key === 'r' || e.key === 'R') {
          setStopwatchElapsed(0);
          setStopwatchRunning(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode]);

    const getCountdownParts = (): { days: number; hours: number; minutes: number; seconds: number } | null => {
      if (!targetDate) return null;
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      const total = Math.floor(diff / 1000);
      return {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      };
    };

    const getStopwatchDisplay = (): string => {
      const totalMs = stopwatchElapsed;
      const hours = Math.floor(totalMs / 3600000);
      const minutes = Math.floor((totalMs % 3600000) / 60000);
      const seconds = Math.floor((totalMs % 60000) / 1000);
      const centiseconds = Math.floor((totalMs % 1000) / 10);
      return `${formatUnit(hours)}:${formatUnit(minutes)}:${formatUnit(seconds)}.${formatUnit(centiseconds)}`;
    };

    const getTimeDisplay = (): string => {
      const h = now.getHours();
      const m = now.getMinutes();
      if (format === '12h') {
        const h12 = h % 12 || 12;
        const ampm = h < 12 ? 'AM' : 'PM';
        return `${formatUnit(h12)}:${formatUnit(m)} ${ampm}`;
      }
      return `${formatUnit(h)}:${formatUnit(m)}`;
    };

    if (mode === 'countdown') {
      const parts = getCountdownParts();
      const showUnit = (value: number, label: string) => {
        const [a, b] = getSegments(value);
        return (
          <div className={styles.countdownUnit}>
            <div className={styles.segmentPair}>
              <span className={styles.segment}>{a}</span>
              <span className={styles.segment}>{b}</span>
            </div>
            <span className={styles.countdownLabel}>{label}</span>
          </div>
        );
      };

      return (
        <div
          ref={ref}
          className={cn(styles.root, styles[size], className)}
          role="timer"
          aria-live="polite"
          {...props}
        >
          {parts && (
            <div className={styles.countdownDisplay}>
              {parts.days > 0 && showUnit(parts.days, 'days')}
              {showUnit(parts.hours, 'hrs')}
              {showUnit(parts.minutes, 'min')}
              {showUnit(parts.seconds, 'sec')}
            </div>
          )}
          {countdownFinished && (
            <div className={styles.countdownFinished}>Time&rsquo;s up!</div>
          )}
        </div>
      );
    }

    if (mode === 'stopwatch') {
      const display = getStopwatchDisplay();
      const parts = display.split(/[:.]/);
      return (
        <div
          ref={ref}
          className={cn(styles.root, styles[size], className)}
          role="timer"
          aria-live="polite"
          tabIndex={0}
          aria-label={`Stopwatch: ${display}`}
          {...props}
        >
          <div className={styles.segmentedDisplay}>
            {parts[0] && (
              <>
                {getSegments(Number(parts[0])).map((d, i) => (
                  <span key={`h${i}`} className={styles.segment}>{d}</span>
                ))}
              </>
            )}
            <span className={cn(styles.colon, styles.colonStatic)}>:</span>
            {parts[1] && (
              <>
                {getSegments(Number(parts[1])).map((d, i) => (
                  <span key={`m${i}`} className={styles.segment}>{d}</span>
                ))}
              </>
            )}
            <span className={cn(styles.colon, styles.colonStatic)}>:</span>
            {parts[2] && (
              <>
                {getSegments(Number(parts[2])).map((d, i) => (
                  <span key={`s${i}`} className={styles.segment}>{d}</span>
                ))}
              </>
            )}
            <span className={cn(styles.colon, styles.colonStatic)}>.</span>
            {parts[3] && (
              <>
                {getSegments(Number(parts[3])).map((d, i) => (
                  <span key={`c${i}`} className={cn(styles.segment, styles.segmentSmall)}>{d}</span>
                ))}
              </>
            )}
          </div>
          <div className={styles.stopwatchHint}>
            Space to {stopwatchRunning ? 'stop' : 'start'} &middot; R to reset
          </div>
        </div>
      );
    }

    const timeStr = getTimeDisplay();
    const [timePart, ampm] = format === '12h'
      ? [timeStr.slice(0, -3), timeStr.slice(-2)]
      : [timeStr, ''];
    const [hoursStr, minutesStr = ''] = timePart.split(':');
    const paddedHours = hoursStr.padStart(2, '0');
    const paddedMinutes = minutesStr.padStart(2, '0');
    const h1 = paddedHours[0];
    const h2 = paddedHours[1];
    const m1 = paddedMinutes[0];
    const m2 = paddedMinutes[1];

    return (
      <div
        ref={ref}
        className={cn(styles.root, styles[size], className)}
        role="timer"
        aria-live="polite"
        aria-label={timeStr}
        {...props}
      >
        <div className={styles.segmentedDisplay}>
          <span className={styles.segment}>{h1}</span>
          <span className={styles.segment}>{h2}</span>
          <span className={styles.colon} aria-hidden="true">:</span>
          <span className={styles.segment}>{m1}</span>
          <span className={styles.segment}>{m2}</span>
        </div>
        {ampm && <span className={styles.ampm}>{ampm}</span>}
      </div>
    );
  },
);

Clock.displayName = 'Clock';
