import { type ComponentPropsWithoutRef, type ElementType, createElement, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Text.module.css';

type TextSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'lg' | 'base' | 'sm' | 'xs';

type TextWeight = 'bold' | 'semibold' | 'medium' | 'normal' | 'light';

type TextColor = 'primary' | 'secondary' | 'muted' | 'accent';

type TextVariant = 'display' | 'heading' | 'body' | 'mono';

const AS_MAP: Record<string, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
};

export interface TextProps extends ComponentPropsWithoutRef<'p'> {
  element?: {
    as?: ElementType;
    /** @default 'base' */
    size?: TextSize;
    /** @default 'body' */
    variant?: TextVariant;
  };
  weight?: TextWeight;
  color?: TextColor;
  /** @default false */
  uppercase?: boolean;
  /** @default false */
  truncate?: boolean;
  /** @default false */
  nowrap?: boolean;
  children?: React.ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      element: {
        as,
        size = 'base',
        variant = 'body',
      } = {},
      weight,
      color,
      uppercase = false,
      truncate = false,
      nowrap = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const element = as ?? AS_MAP[size] ?? 'p';

    return createElement(
      element,
      {
        ref,
        className: cn(
          styles.text,
          styles[variant],
          styles[size],
          weight && styles[weight],
          color && styles[color],
          uppercase && styles.uppercase,
          truncate && styles.truncate,
          nowrap && styles.nowrap,
          className,
        ),
        ...props,
      },
      children,
    );
  },
);

Text.displayName = 'Text';
