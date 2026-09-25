import {
  type ElementType,
  type CSSProperties,
  type FocusEventHandler,
  type MouseEventHandler,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type { AriaRole } from 'react';
import { cn } from '@/utils/cn';
import styles from './Text.module.css';

/**
 * Conflict-free content-model spot checks for dev builds: tags rendered by
 * `Text as=` that are only valid inside specific parents. Covers the common
 * mistake of dropping list/table syntax into paragraph markup; anything not
 * listed produces no warning.
 */
const NESTING_RULES: Record<string, string[]> = {
  li: ['ul', 'ol', 'menu'],
  option: ['select', 'datalist', 'optgroup'],
  tr: ['table', 'tbody', 'thead', 'tfoot'],
  td: ['tr', 'table'],
  th: ['tr', 'table'],
  dt: ['dl', 'div'],
  dd: ['dl', 'div'],
};

export type TextSize =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'lg'
  | 'base'
  | 'sm'
  | 'xs';

export type TextWeight = 'bold' | 'semibold' | 'medium' | 'normal' | 'light';

export type TextColor = 'primary' | 'secondary' | 'muted' | 'accent';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextVariant = 'display' | 'heading' | 'body' | 'mono';

const AS_MAP: Record<string, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
};

/** A typography component for rendering text with size, weight, color, variant, and utility classes. */
export interface TextProps {
  /** HTML element to render. Auto-detected from size if not provided. */
  as?: ElementType;
  /** @default 'base' */
  size?: TextSize;
  /** @default 'body' */
  variant?: TextVariant;
  /** Font weight override. */
  weight?: TextWeight;
  /** Text color preset. */
  color?: TextColor;
  /** Text alignment. */
  align?: TextAlign;
  /** @default false */
  uppercase?: boolean;
  /** @default false */
  truncate?: boolean;
  /** @default false */
  nowrap?: boolean;
  /** Text content. */
  children?: React.ReactNode;

  // Curated native attributes.
  id?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  lang?: string;
  dir?: string;
  tabIndex?: number;
  role?: AriaRole;
  'data-testid'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-live'?: 'off' | 'polite' | 'assertive';
  onClick?: MouseEventHandler<HTMLElement>;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onMouseLeave?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
}

/** A typography component with predefined sizes, weights, colors, and text variants. */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as,
      size = 'base',
      variant = 'body',
      weight,
      color,
      align,
      uppercase = false,
      truncate = false,
      nowrap = false,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const element = as ?? AS_MAP[size] ?? 'p';

    const internalRef = useRef<HTMLElement | null>(null);
    const setNodeRef = useCallback(
      (node: HTMLElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    useEffect(() => {
      if (process.env.NODE_ENV === 'production') return;
      const tag = typeof element === 'string' ? element : null;
      const allowed = tag ? NESTING_RULES[tag] : null;
      if (!tag || !allowed) return;
      const node = internalRef.current;
      if (!node) return;
      const parentTag = node.parentElement?.tagName.toLowerCase();
      if (parentTag && !allowed.includes(parentTag)) {
        console.warn(
          `azimuth-ui: <Text as=${tag}> renders inside <${parentTag}>, which is invalid HTML nesting. Move the text or change the "as" prop.`,
        );
      }
    });

    return createElement(
      element,
      {
        ref: setNodeRef,
        className: cn(
          styles.text,
          styles[variant],
          styles[size],
          weight && styles[weight],
          color && styles[color],
          align && styles[align],
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
