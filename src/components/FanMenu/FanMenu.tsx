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
import styles from './FanMenu.module.css';

export interface FanMenuOption {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface FanMenuProps extends ComponentPropsWithoutRef<'div'> {
  options: FanMenuOption[];
  trigger?: React.ReactNode;
  /** @default 'up' */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** @default 8 */
  gap?: number;
}

export const FanMenu = forwardRef<HTMLDivElement, FanMenuProps>(
  (
    {
      options,
      trigger,
      direction = 'up',
      gap = 8,
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      },
      [],
    );

    useEffect(() => {
      if (!open) return;
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, handleClickOutside]);

    const handleOptionClick = (option: FanMenuOption) => {
      if (option.disabled) return;
      option.onClick?.();
      setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent, option?: FanMenuOption) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (option) {
          handleOptionClick(option);
        } else {
          setOpen((prev) => !prev);
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, className)}
        {...props}
      >
        <div ref={containerRef} className={styles.container}>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={(e) => handleKeyDown(e)}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="Open fan menu"
          >
            {trigger ?? <span className={styles.triggerIcon}>+</span>}
          </button>
          {open && (
            <div
              className={cn(
                styles.fan,
                styles[`direction${direction.charAt(0).toUpperCase() + direction.slice(1)}`],
              )}
              role="menu"
            >
              {(options ?? []).map((option, index) => (
                <button
                  key={option.key}
                  type="button"
                  className={cn(
                    styles.option,
                    option.disabled && styles.optionDisabled,
                  )}
                  role="menuitem"
                  disabled={option.disabled}
                  onClick={() => handleOptionClick(option)}
                  onKeyDown={(e) => handleKeyDown(e, option)}
                  aria-disabled={option.disabled ?? undefined}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    [direction === 'up' || direction === 'down'
                      ? 'marginTop'
                      : 'marginLeft']: index === 0 ? 0 : `${gap}px`,
                  }}
                  tabIndex={-1}
                >
                  {option.icon && (
                    <span className={styles.optionIcon}>{option.icon}</span>
                  )}
                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

FanMenu.displayName = 'FanMenu';
