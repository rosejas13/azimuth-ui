import type { ComponentPropsWithoutRef } from 'react';

/**
 * Build a curated native-attribute surface for a component, plus an escape
 * hatch for everything else.
 *
 * Arguments are the intrinsic element name and a readonly tuple of native
 * attribute (or event-handler) keys the component explicitly supports. The
 * result is a props type containing ONLY those attributes plus `style` and
 * `data-testid`, so editor autocomplete stays clean while consumers can still
 * pass any remaining native attribute through the spreadable escape hatch.
 *
 * @example
 * ```ts
 * const InputSurface = curateSurface('input', [
 *   'onFocus', 'onBlur', 'aria-label', 'aria-describedby',
 * ] as const);
 *
 * export interface InputProps {
 *   ...InputSurface;                 // curated native attrs
 *   inputProps?: NativeRest<'input'>; // escape hatch, spread last
 * }
 * ```
 */
export type CuratedSurface<
  E extends keyof React.JSX.IntrinsicElements,
  Allowed extends readonly string[],
> = Pick<
  ComponentPropsWithoutRef<E>,
  // Extract keeps non-native keys (typos, data-* attrs) from breaking the
  // Pick constraint; typos surface as "prop does nothing" at lint time.
  'style' | Extract<Allowed[number], keyof ComponentPropsWithoutRef<E>>
>;

/**
 * The unchecked remainder type for an escape hatch prop: any native
 * attribute of the element not present on the curated surface. Spread it
 * last so consumer overrides win.
 */
export type NativeRest<E extends keyof React.JSX.IntrinsicElements> = Partial<
  ComponentPropsWithoutRef<E>
> &
  Record<string, unknown>;
