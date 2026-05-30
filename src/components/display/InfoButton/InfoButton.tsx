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

/** An info button that reveals a popover with additional content. */
export interface InfoButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'content' | 'title'> {
  /** Content displayed inside the popover. */
  content: ReactNode;
  /** Optional title shown at the top of the popover. */
  title?: string;
  /** @default 'bottom' */
  placement?: InfoPlacement;
  /** @default false */
  showOnHover?: boolean;
  /** Custom trigger content. Defaults to a circled "i" icon. */
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

/** A button that toggles an informational popover with title, content, and arrow. */
export const InfoButton = forwardRef<HTMLDivElement, InfoButtonProps>(
  (
    {
      content,
      title,
      placement = 'bottom',
      showOnHover = false,
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
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef(false);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const updatePosition = useCallback(() => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverStyle(placementStyle(placement, rect));
      switch (placement) {
        case 'bottom':
          setArrowStyle({ top: -5, left: '50%', marginLeft: -4 });
          break;
        case 'top':
          setArrowStyle({ bottom: -5, left: '50%', marginLeft: -4 });
          break;
        case 'left':
          setArrowStyle({ right: -5, top: '50%', marginTop: -4 });
          break;
        case 'right':
          setArrowStyle({ left: -5, top: '50%', marginTop: -4 });
          break;
      }
    }, [placement]);

    const clearHideTimer = useCallback(() => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }, []);

    const scheduleHide = useCallback(() => {
      clearHideTimer();
      hideTimerRef.current = setTimeout(() => {
        if (!hoverRef.current) setOpen(false);
      }, 300);
    }, [clearHideTimer]);

    const handleHoverEnter = useCallback(() => {
      if (!showOnHover) return;
      hoverRef.current = true;
      clearHideTimer();
      if (!open) {
        updatePosition();
        setOpen(true);
      }
    }, [showOnHover, clearHideTimer, open, updatePosition]);

    const handleHoverLeave = useCallback(() => {
      if (!showOnHover) return;
      hoverRef.current = false;
      scheduleHide();
    }, [showOnHover, scheduleHide]);

    const toggle = useCallback(() => {
      setOpen((prev) => {
        if (!prev) updatePosition();
        return !prev;
      });
    }, [updatePosition]);

    const close = useCallback(() => {
      setOpen(false);
      clearHideTimer();
    }, [clearHideTimer]);

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
          (containerRef).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref).current = node;
        }}
        className={cn(styles.root, className)}
        {...props}
      >
        <button
          ref={buttonRef}
          type="button"
          className={styles.trigger}
          onClick={toggle}
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
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
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <div className={styles.arrow} style={arrowStyle} />
            {title && <div className={styles.title}>{title}</div>}
            <div className={styles.body}>{content}</div>
          </div>
        )}
      </div>
    );
  },
);

InfoButton.displayName = 'InfoButton';
