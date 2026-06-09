import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';

/**
 * Props for the Slot component.
 */
export interface SlotProps {
  /** Child element to clone props onto. */
  children: ReactNode;
  /** Class name merged with the child's existing class names. */
  className?: string;
  [key: string]: unknown;
}

/**
 * Merges multiple refs into a single ref callback.
 * Supports both function and object refs.
 */
function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && typeof ref === 'object' && 'current' in ref) {
        ref.current = value;
      }
    }
  };
}

type EventMap = Record<string, string>;
const EVENT_MAP: EventMap = {
  onClick: 'onClick',
  onKeyDown: 'onKeyDown',
  onKeyUp: 'onKeyUp',
  onMouseEnter: 'onMouseEnter',
  onMouseLeave: 'onMouseLeave',
  onFocus: 'onFocus',
  onBlur: 'onBlur',
  onPointerDown: 'onPointerDown',
  onPointerUp: 'onPointerUp',
};

/**
 * Radix-inspired Slot component that merges its props onto a single child element.
 * Inherited props (className, event handlers, ref) are composed with the child's
 * existing props rather than overwritten. Renders nothing when the child is not a
 * valid React element.
 *
 * @param props - SlotProps including children and any additional props to forward.
 * @param ref - Forwarded ref, merged with the child's existing ref.
 * @returns A cloned child element with merged props, or null if children is not a valid element.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!isValidElement(children)) {
      return null;
    }

    const child = children as ReactElement & { ref?: React.Ref<unknown> };

    const childProps: Record<string, unknown> = {};

    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        childProps[key] = props[key];
      }
    }

    const childPropEntries = child.props as Record<string, unknown>;
    for (const key in childPropEntries) {
      if (Object.prototype.hasOwnProperty.call(childPropEntries, key)) {
        childProps[key] = childPropEntries[key];
      }
    }

    const mergedClassName = [props.className, childPropEntries.className]
      .filter(Boolean)
      .join(' ');
    if (mergedClassName) {
      childProps.className = mergedClassName;
    }

    childProps.ref = mergeRefs(ref, child.ref);

    for (const [, eventName] of Object.entries(EVENT_MAP)) {
      const parentHandler = props[eventName] as
        | ((...args: unknown[]) => void)
        | undefined;
      const childHandler = childPropEntries[eventName] as
        | ((...args: unknown[]) => void)
        | undefined;
      if (parentHandler && childHandler) {
        const p = parentHandler;
        const c = childHandler;
        childProps[eventName] = (...args: unknown[]) => {
          c(...args);
          p(...args);
        };
      }
    }

    return cloneElement(child, childProps);
  },
);

Slot.displayName = 'Slot';
