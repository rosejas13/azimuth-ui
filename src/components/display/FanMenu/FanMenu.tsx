'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './FanMenu.module.css';

/** A single option within a fan menu. */
export interface FanMenuOption {
  /** Unique key for the option. */
  key: string;
  /** Display label. */
  label: string;
  /** Optional icon element. */
  icon?: React.ReactNode;
  /** Callback fired when the option is selected. */
  onClick?: () => void;
  /** Whether the option is disabled. */
  disabled?: boolean;
}

/** A fan/spread menu that expands options in a radial-like layout around a trigger button. */
export interface FanMenuProps extends ComponentPropsWithoutRef<'div'> {
  /** Array of menu options to display when expanded. */
  options: FanMenuOption[];
  /** Custom trigger element. Defaults to a "+" button. */
  trigger?: React.ReactNode;
  /** @default 'up' */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** @default 8 */
  gap?: number;
  /** @default false */
  open?: boolean;
  /** Callback when open state changes (for controlled usage). */
  onOpenChange?: (open: boolean) => void;
}

/** A fan/spread menu that fans out options from a central trigger button. */
export const FanMenu = forwardRef<HTMLDivElement, FanMenuProps>(
  (
    {
      options,
      trigger,
      direction = 'up',
      gap = 8,
      className,
      open: controlledOpen,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const toggle = () => {
      const next = !open;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const fanId = useId();

    const handleClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          if (!isControlled) setInternalOpen(false);
          onOpenChange?.(false);
        }
      },
      [isControlled, onOpenChange],
    );

    useEffect(() => {
      if (!open) return;
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, [open, handleClickOutside]);

    const handleOptionClick = (option: FanMenuOption) => {
      if (option.disabled) return;
      option.onClick?.();
      if (!isControlled) setInternalOpen(false);
      onOpenChange?.(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent, option?: FanMenuOption) => {
      if (e.key === 'Escape') {
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (option) {
          handleOptionClick(option);
        } else {
          toggle();
        }
      }
    };

    return (
      <div ref={ref} className={cn(styles.wrapper, className)} {...props}>
        <div ref={containerRef} className={styles.container}>
          <button
            ref={triggerRef}
            type="button"
            className={styles.trigger}
            onClick={toggle}
            onKeyDown={(e) => handleKeyDown(e)}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-controls={fanId}
            aria-label="Open fan menu"
          >
            {trigger ?? <span className={styles.triggerIcon}>+</span>}
          </button>
          {open && (
            <div
              id={fanId}
              className={cn(
                styles.fan,
                styles[
                  `direction${direction.charAt(0).toUpperCase() + direction.slice(1)}`
                ],
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
                  tabIndex={0}
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
