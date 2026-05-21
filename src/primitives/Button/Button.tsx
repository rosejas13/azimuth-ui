'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
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

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  icon?: React.ReactNode;
  /** @default 'left' */
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  /** @default 'default' */
  shape?: 'default' | 'circle';
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      shape = 'default',
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

    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          flat && styles.flat,
          isIconOnly && styles.iconOnly,
          shape === 'circle' && styles.circle,
          fullWidth && styles.fullWidth,
          className,
        )}
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
