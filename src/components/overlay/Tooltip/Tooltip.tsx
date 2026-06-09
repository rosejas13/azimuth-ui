'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Tooltip.module.css';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the Tooltip component.
 */
export interface TooltipProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'content'
> {
  content: React.ReactNode;
  /** @default 'top' */
  position?: TooltipPosition;
  /** @default 300 */
  delay?: number;
  children: React.ReactNode;
}

/**
 * A hover/focus-triggered tooltip that displays contextual content near its
 * child element.
 *
 * Supports four positions (top, bottom, left, right) with a configurable
 * appearance delay. Repositions on scroll and resize while visible.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    { content, position = 'top', delay = 300, className, children, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const tooltipId = `tooltip-${generatedId}`;
    const [visible, setVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<ReturnType<
      typeof setTimeout
    > | null>(null);
    const [contentStyle, setContentStyle] = useState<React.CSSProperties>({});
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
    const wrapperRef = useRef<HTMLDivElement>(null);

    const updatePosition = useCallback(() => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const gap = 6;
      const zIndex = 1200;
      switch (position) {
        case 'bottom':
          setContentStyle({
            position: 'fixed',
            top: rect.bottom + gap,
            left: rect.left + rect.width / 2,
            transform: 'translateX(-50%)',
            zIndex,
          });
          setArrowStyle({ top: -3, left: '50%', marginLeft: -3 });
          break;
        case 'top':
          setContentStyle({
            position: 'fixed',
            bottom: window.innerHeight - rect.top + gap,
            left: rect.left + rect.width / 2,
            transform: 'translateX(-50%)',
            zIndex,
          });
          setArrowStyle({ bottom: -3, left: '50%', marginLeft: -3 });
          break;
        case 'left':
          setContentStyle({
            position: 'fixed',
            top: rect.top + rect.height / 2,
            right: window.innerWidth - rect.left + gap,
            transform: 'translateY(-50%)',
            zIndex,
          });
          setArrowStyle({ right: -3, top: '50%', marginTop: -3 });
          break;
        case 'right':
          setContentStyle({
            position: 'fixed',
            top: rect.top + rect.height / 2,
            left: rect.right + gap,
            transform: 'translateY(-50%)',
            zIndex,
          });
          setArrowStyle({ left: -3, top: '50%', marginTop: -3 });
          break;
      }
    }, [position]);

    const show = () => {
      const id = setTimeout(() => {
        updatePosition();
        setVisible(true);
      }, delay);
      setTimeoutId(id);
    };

    const hide = () => {
      if (timeoutId) clearTimeout(timeoutId);
      setVisible(false);
      setTimeoutId(null);
    };

    useEffect(() => {
      if (!visible) return;
      const handler = () => updatePosition();
      window.addEventListener('scroll', handler, true);
      window.addEventListener('resize', handler);
      return () => {
        window.removeEventListener('scroll', handler, true);
        window.removeEventListener('resize', handler);
      };
    }, [visible, updatePosition]);

    const setWrapperRef = useCallback(
      (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <div
        ref={setWrapperRef}
        className={cn(styles.tooltip, className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...props}
      >
        <button
          type="button"
          className={styles.trigger}
          aria-describedby={visible ? tooltipId : undefined}
        >
          {children}
        </button>
        {visible && (
          <div
            id={tooltipId}
            className={styles.content}
            role="tooltip"
            style={contentStyle}
          >
            {content}
            <div className={styles.arrow} style={arrowStyle} />
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
