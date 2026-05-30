'use client';

import {
  type ComponentPropsWithoutRef,
  type MouseEvent as ReactMouseEvent,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './ResizablePanel.module.css';

/** A container that splits space between children with draggable dividers. */
export interface ResizablePanelProps extends ComponentPropsWithoutRef<'div'> {
  /** @default 'horizontal' */
  direction?: 'horizontal' | 'vertical';
  /** Initial percentage sizes for each panel. Must match the number of children. */
  defaultSizes?: number[];
  /** @default 50 */
  minSize?: number;
  /** Panel elements to distribute across the resizable space. */
  children: React.ReactNode;
}

/** A split-panel container with draggable dividers and keyboard-accessible resizing. */
export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      direction = 'horizontal',
      defaultSizes,
      minSize = 50,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeDivider, setActiveDivider] = useState<number | null>(null);
    const [sizes, setSizes] = useState<number[] | null>(
      defaultSizes ?? null,
    );
    const startPosRef = useRef<number>(0);
    const startSizesRef = useRef<number[]>([]);

    const childCount = Array.isArray(children) ? children.length : 1;

    const getSize = useCallback(
      (index: number): string => {
        if (sizes && sizes.length === childCount) {
          return `${sizes[index]}%`;
        }
        return `${100 / childCount}%`;
      },
      [sizes, childCount],
    );

    const resizeBy = useCallback(
      (index: number, deltaPercent: number) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const containerSize =
          direction === 'horizontal' ? rect.width : rect.height;

        const currentSizes = Array.from(
          { length: childCount },
          (_, i) => {
            if (sizes && sizes[i] !== undefined) return sizes[i];
            return 100 / childCount;
          },
        );

        const leftMinPx = (minSize / containerSize) * 100;
        const rightMinPx = (minSize / containerSize) * 100;

        const newSizes = [...currentSizes];
        const leftSize = newSizes[index] + deltaPercent;
        const rightSize = newSizes[index + 1] - deltaPercent;

        if (leftSize >= leftMinPx && rightSize >= rightMinPx) {
          newSizes[index] = leftSize;
          newSizes[index + 1] = rightSize;
          setSizes(newSizes);
        }
      },
      [childCount, direction, minSize, sizes],
    );

    const handleDividerMouseDown = useCallback(
      (index: number, e: ReactMouseEvent) => {
        e.preventDefault();
        setActiveDivider(index);

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        startPosRef.current =
          direction === 'horizontal' ? e.clientX : e.clientY;

        const currentSizes = Array.from(
          { length: childCount },
          (_, i) => {
            if (sizes && sizes[i] !== undefined) return sizes[i];
            return 100 / childCount;
          },
        );
        startSizesRef.current = currentSizes;

        const containerSize =
          direction === 'horizontal' ? rect.width : rect.height;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const currentPos =
            direction === 'horizontal'
              ? moveEvent.clientX
              : moveEvent.clientY;
          const delta = currentPos - startPosRef.current;
          const deltaPercent = (delta / containerSize) * 100;

          const newSizes = [...startSizesRef.current];
          const leftSize = newSizes[index] + deltaPercent;
          const rightSize = newSizes[index + 1] - deltaPercent;

          const leftMinPx =
            (minSize / containerSize) * 100;
          const rightMinPx =
            (minSize / containerSize) * 100;

          if (leftSize >= leftMinPx && rightSize >= rightMinPx) {
            newSizes[index] = leftSize;
            newSizes[index + 1] = rightSize;
            setSizes(newSizes);
          }
        };

        const handleMouseUp = () => {
          setActiveDivider(null);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      },
      [childCount, direction, minSize, sizes],
    );

    const handleDividerKeyDown = useCallback(
      (index: number, e: React.KeyboardEvent) => {
        const step = 5;
        let handled = true;
        if (direction === 'horizontal') {
          if (e.key === 'ArrowLeft') resizeBy(index, -step);
          else if (e.key === 'ArrowRight') resizeBy(index, step);
          else handled = false;
        } else {
          if (e.key === 'ArrowUp') resizeBy(index, -step);
          else if (e.key === 'ArrowDown') resizeBy(index, step);
          else handled = false;
        }
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      [direction, resizeBy],
    );

    const childrenArray = Array.isArray(children)
      ? children
      : [children];

    const panels: React.ReactNode[] = [];
    childrenArray.forEach((child, i) => {
      panels.push(
        <div
          key={`panel-${i}`}
          className={styles.panel}
          style={{
            [direction === 'horizontal' ? 'width' : 'height']: getSize(i),
          }}
        >
          {child}
        </div>,
      );
      if (i < childrenArray.length - 1) {
        panels.push(
          <div role="slider"
            key={`divider-${i}`}
            tabIndex={0}
            aria-label="Resize panel"
            aria-orientation={direction}
            aria-valuenow={sizes ? Math.round(sizes[i]) : Math.round(100 / childCount)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(
              styles.divider,
              activeDivider === i && styles.dividerActive,
            )}
            onMouseDown={(e) => handleDividerMouseDown(i, e)}
            onKeyDown={(e) => handleDividerKeyDown(i, e)}
          />,
        );
      }
    });

    return (
      <div
        ref={(el) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current =
            el;
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        className={cn(
          styles.container,
          direction === 'horizontal' ? styles.horizontal : styles.vertical,
          className,
        )}
        style={style}
        {...props}
      >
        {panels}
        {activeDivider !== null && (
          <div
            className={styles.dragOverlay}
            style={{
              cursor:
                direction === 'horizontal' ? 'col-resize' : 'row-resize',
            }}
          />
        )}
      </div>
    );
  },
);

ResizablePanel.displayName = 'ResizablePanel';
