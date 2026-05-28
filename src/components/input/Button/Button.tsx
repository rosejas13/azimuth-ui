'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import { Slot } from '@/utils/Slot';
import { useTheme } from '@/theme/useTheme';
import styles from './Button.module.css';

/** Visual style variants for the Button component. */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'link'
  | 'danger';

type ButtonSize = 'sm' | 'md' | 'lg';

/** Props for the Button component. */
export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  icon?: React.ReactNode;
  /** @default 'left' */
  iconPosition?: 'left' | 'right';
  /** @default false */
  fullWidth?: boolean;
  /** @default 'default' */
  shape?: 'default' | 'circle';
  /** When true, renders the child element with Button's styling instead of a `<button>`. */
  asChild?: boolean;
  children?: React.ReactNode;
}

function buttonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  flat: boolean,
  isIconOnly: boolean,
  shape: 'default' | 'circle',
  fullWidth: boolean,
  className?: string,
) {
  return cn(
    styles.button,
    styles[variant],
    styles[size],
    flat && styles.flat,
    isIconOnly && styles.iconOnly,
    shape === 'circle' && styles.circle,
    fullWidth && styles.fullWidth,
    className,
  );
}

/** A button component with support for multiple variants, sizes, icons, and as-child rendering. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      shape = 'default',
      asChild,
      className,
      disabled,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const { flat } = useTheme();
    const isIconOnly = !children && !!icon;
    const classes = buttonClassName(variant, size, flat, isIconOnly, shape, fullWidth, className);

    if (asChild) {
      const child = children as ReactElement | undefined;
      if (!child) return null;
      return (
        <Slot
          className={classes}
          ref={ref}
          aria-label={isIconOnly ? (ariaLabel || 'Button') : ariaLabel}
          {...props}
        >
          {child}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-label={isIconOnly ? (ariaLabel || 'Button') : ariaLabel}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className={styles.icon}>{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className={styles.icon}>{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
