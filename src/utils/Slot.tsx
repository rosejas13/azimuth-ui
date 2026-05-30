import {
  type ReactElement,
  type ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';

export interface SlotProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && typeof ref === 'object' && 'current' in ref) {
        (ref).current = value;
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
