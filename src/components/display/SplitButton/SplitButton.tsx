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

/** A single option within a split button dropdown menu. */
export interface SplitButtonOption {
  /** Unique key for the option. */
  key: string;
  /** Display label. */
  label: string;
  /** Callback fired when the option is selected. */
  onClick?: () => void;
  /** Whether the option is disabled. */
  disabled?: boolean;
  /** Whether the option should render in a danger style. */
  danger?: boolean;
}

/** A split button with a primary action and a dropdown of additional options. */
export interface SplitButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  /** Primary action label displayed on the main button. */
  label: string;
  /** Callback fired when the primary action button is clicked. */
  onClick: () => void;
  /** Dropdown menu options. */
  options: SplitButtonOption[];
  /** @default 'primary' */
  variant?: 'primary' | 'secondary';
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default false */
  disabled?: boolean;
  /** @default 'bottom' */
  direction?: 'bottom' | 'top';
}

/** A split button with a primary action and a dropdown menu of secondary options. */
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
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => {
      setOpen(false);
    }, []);

    const updatePosition = useCallback(() => {
      if (!containerRef.current) return;
      const toggle = containerRef.current.querySelector('[aria-haspopup="menu"]');
      if (!toggle) return;
      const rect = toggle.getBoundingClientRect();
      const gap = 4;
      if (direction === 'top') {
        setMenuStyle({
          position: 'fixed',
          bottom: window.innerHeight - rect.top + gap,
          left: rect.left,
          zIndex: 50,
        });
      } else {
        setMenuStyle({
          position: 'fixed',
          top: rect.bottom + gap,
          left: rect.left,
          zIndex: 50,
        });
      }
    }, [direction]);

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
        const positionHandler = () => updatePosition();
        window.addEventListener('scroll', positionHandler, true);
        window.addEventListener('resize', positionHandler);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          window.removeEventListener('scroll', positionHandler, true);
          window.removeEventListener('resize', positionHandler);
        };
      }
    }, [open, close, updatePosition]);

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
        (containerRef).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref).current = node;
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
            onClick={() => {
              if (disabled) return;
              if (!open) updatePosition();
              setOpen((prev) => !prev);
            }}
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
          <div style={menuStyle}>
          <div
            className={styles.menu}
            role="menu"
          >
            {(options ?? []).map((option) => (
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
          </div>
        )}
      </div>
    );
  },
);

SplitButton.displayName = 'SplitButton';
