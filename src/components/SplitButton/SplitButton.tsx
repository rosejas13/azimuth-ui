'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './SplitButton.module.css';

export interface SplitButtonOption {
  key: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface SplitButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  label: string;
  onClick: () => void;
  options: SplitButtonOption[];
  /** @default 'primary' */
  variant?: 'primary' | 'secondary';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** @default 'bottom' */
  direction?: 'bottom' | 'top';
}

export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      label,
      onClick,
      options,
      variant = 'primary',
      size = 'md',
      disabled = false,
      direction = 'bottom',
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => {
      setOpen(false);
    }, []);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          close();
        }
      }
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [open, close]);

    useEffect(() => {
      function handleEscape(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          close();
        }
      }
      if (open) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [open, close]);

    const handleOptionClick = useCallback(
      (option: SplitButtonOption) => {
        if (option.disabled) return;
        option.onClick?.();
        close();
      },
      [close],
    );

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    return (
      <div
        ref={setRefs}
        className={cn(
          styles.wrapper,
          disabled && styles.wrapperDisabled,
          className,
        )}
        {...props}
      >
        <div className={styles.group}>
          <button
            type="button"
            className={cn(
              styles.mainButton,
              styles[variant],
              styles[size],
            )}
            onClick={onClick}
            disabled={disabled}
          >
            {label}
          </button>
          <button
            type="button"
            className={cn(
              styles.toggle,
              styles[variant],
              styles[size],
              open && styles.toggleOpen,
            )}
            onClick={() => !disabled && setOpen((prev) => !prev)}
            disabled={disabled}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Show options"
          >
            <span className={styles.arrow} aria-hidden="true">
              &#9662;
            </span>
          </button>
        </div>

        {open && (
          <div
            className={cn(
              styles.menu,
              direction === 'top' && styles.menuTop,
            )}
            role="menu"
          >
            {options.map((option) => (
              <button
                key={option.key}
                type="button"
                role="menuitem"
                className={cn(
                  styles.menuItem,
                  option.danger && styles.menuItemDanger,
                  option.disabled && styles.menuItemDisabled,
                )}
                disabled={option.disabled}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

SplitButton.displayName = 'SplitButton';
