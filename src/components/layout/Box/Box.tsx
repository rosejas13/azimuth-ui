import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type JSX,
  createElement,
  forwardRef,
} from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { capitalize } from '@/utils/capitalize';
import styles from './Box.module.css';

type BoxSpacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type BoxRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type BoxBackground = 'surface' | 'subtle';
type BoxShadow = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Curated native surface for the Box element. Requirement of the polymorphic
 * `as` prop: only universal attributes (`className`, `style`, `id`) are
 * curated; anything else goes through `boxProps`.
 */
export interface BoxProps extends CuratedSurface<
  'div',
  ['className', 'style', 'id']
> {
  /** HTML element to render. @default 'div' */
  as?: keyof JSX.IntrinsicElements;
  /** Padding on all sides. */
  padding?: BoxSpacing;
  /** Horizontal padding; overrides the horizontal sides of `padding`. */
  paddingX?: BoxSpacing;
  /** Vertical padding; overrides the vertical sides of `padding`. */
  paddingY?: BoxSpacing;
  /** @default false */
  border?: boolean;
  radius?: BoxRadius;
  background?: BoxBackground;
  shadow?: BoxShadow;
  children?: React.ReactNode;
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  boxProps?: NativeRest<'div'>;
}

/** A raw layout primitive that renders an unstyled element with optional visual props layered on top. */
export const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      as = 'div',
      padding,
      paddingX,
      paddingY,
      border = false,
      radius,
      background,
      shadow,
      className,
      style,
      id,
      children,
      boxProps,
    },
    ref,
  ) => {
    return createElement(
      as as ElementType,
      {
        ref,
        className: cn(
          padding && styles[`padding${capitalize(padding)}`],
          paddingX && styles[`paddingX${capitalize(paddingX)}`],
          paddingY && styles[`paddingY${capitalize(paddingY)}`],
          border && styles.border,
          radius && styles[`radius${capitalize(radius)}`],
          background &&
            styles[background === 'subtle' ? 'bgSubtle' : 'bgSurface'],
          shadow && styles[`shadow${capitalize(shadow)}`],
          className,
        ),
        style,
        id,
        ...(boxProps as ComponentPropsWithoutRef<'div'>),
      },
      children,
    );
  },
);

Box.displayName = 'Box';
