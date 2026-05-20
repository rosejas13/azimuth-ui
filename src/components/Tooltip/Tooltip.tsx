'use client';

import { type ComponentPropsWithoutRef, forwardRef, useId, useState } from 'react';
import { cn } from '@/utils/cn';
import styles from './Tooltip.module.css';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/** Props for the Tooltip component. */
export interface TooltipProps extends Omit<ComponentPropsWithoutRef<'div'>, 'content'> {
  /** Content displayed inside the tooltip. */
  content: React.ReactNode;
  /** Position of the tooltip relative to the trigger. @default 'top' */
  position?: TooltipPosition;
  /** Delay in milliseconds before the tooltip appears. @default 300 */
  delay?: number;
  /** The content of the component. */
  children: React.ReactNode;
}

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

    const show = () => {
      const id = setTimeout(() => setVisible(true), delay);
      setTimeoutId(id);
    };

    const hide = () => {
      if (timeoutId) clearTimeout(timeoutId);
      setVisible(false);
      setTimeoutId(null);
    };

    return (
      <div
        ref={ref}
        className={cn(styles.tooltip, className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...props}
      >
        <span
          className={styles.trigger}
          tabIndex={0}
          aria-describedby={visible ? tooltipId : undefined}
        >
          {children}
        </span>
        {visible && (
          <div
            id={tooltipId}
            className={cn(styles.content, styles[position])}
            role="tooltip"
          >
            {content}
            <div className={styles.arrow} />
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
