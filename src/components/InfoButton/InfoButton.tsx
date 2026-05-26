'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import { useClickOutside } from '@/hooks/useClickOutside';
import styles from './InfoButton.module.css';

type InfoPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface InfoButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'content' | 'title'> {
  content: ReactNode;
  title?: string;
  /** @default 'bottom' */
  placement?: InfoPlacement;
  children?: ReactNode;
}

function placementStyle(
  placement: InfoPlacement,
  buttonRect: DOMRect,
): React.CSSProperties {
  const gap = 6;
  const zIndex = 1300;
  switch (placement) {
    case 'bottom':
      return {
        position: 'fixed',
        top: buttonRect.bottom + gap,
        left: buttonRect.left + buttonRect.width / 2,
        transform: 'translateX(-50%)',
        zIndex,
      };
    case 'top':
      return {
        position: 'fixed',
        bottom: window.innerHeight - buttonRect.top + gap,
        left: buttonRect.left + buttonRect.width / 2,
        transform: 'translateX(-50%)',
        zIndex,
      };
    case 'left':
      return {
        position: 'fixed',
        top: buttonRect.top + buttonRect.height / 2,
        right: window.innerWidth - buttonRect.left + gap,
        transform: 'translateY(-50%)',
        zIndex,
      };
    case 'right':
      return {
        position: 'fixed',
        top: buttonRect.top + buttonRect.height / 2,
        left: buttonRect.right + gap,
        transform: 'translateY(-50%)',
        zIndex,
      };
  }
}

export const InfoButton = forwardRef<HTMLDivElement, InfoButtonProps>(
  (
    {
      content,
      title,
      placement = 'bottom',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const popoverId = `info-popover-${generatedId}`;
    const [open, setOpen] = useState(false);
    const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updatePosition = useCallback(() => {
      if (!buttonRef.current) return;
      setPopoverStyle(placementStyle(placement, buttonRef.current.getBoundingClientRect()));
    }, [placement]);

    const toggle = useCallback(() => {
      setOpen((prev) => {
        if (!prev) updatePosition();
        return !prev;
      });
    }, [updatePosition]);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
      if (!open) return;
      const handler = () => updatePosition();
      window.addEventListener('scroll', handler, true);
      window.addEventListener('resize', handler);
      return () => {
        window.removeEventListener('scroll', handler, true);
        window.removeEventListener('resize', handler);
      };
    }, [open, updatePosition]);

    useEffect(() => {
      if (!open) return;
      function onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') close();
      }
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, close]);

    useClickOutside(containerRef, close);

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(styles.root, className)}
        {...props}
      >
        <button
          ref={buttonRef}
          type="button"
          className={styles.trigger}
          onClick={toggle}
          aria-expanded={open}
          aria-controls={popoverId}
          aria-label="More information"
        >
          {children ?? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <text x="8" y="12" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor">
                i
              </text>
            </svg>
          )}
        </button>
        {open && (
          <div
            id={popoverId}
            role="dialog"
            aria-modal="false"
            aria-label={title ?? 'More information'}
            className={styles.popover}
            style={popoverStyle}
          >
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.body}>{content}</div>
          </div>
        )}
      </div>
    );
  },
);

InfoButton.displayName = 'InfoButton';
