'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import styles from './SlideSheet.module.css';

/**
 * Props for the SlideSheet component.
 */
export interface SlideSheetProps extends ComponentPropsWithoutRef<'div'> {
  visible?: {
    open: boolean;
    onClose: () => void;
  };
  config?: {
    /** @default 'bottom' */
    side?: 'top' | 'bottom' | 'left' | 'right';
    title?: string;
    height?: string;
    snapPoints?: string[];
    /** @default false */
    persistent?: boolean;
  };
  children?: React.ReactNode;
}

/**
 * A slide-in panel that enters from any edge (top, bottom, left, right) with
 * configurable snap points.
 *
 * Renders via portal to `document.body`. Closes on Escape or overlay click
 * unless `persistent` is enabled. Bottom-sliding sheets include a drag handle.
 */
export const SlideSheet = forwardRef<HTMLDivElement, SlideSheetProps>(
  (
    {
      visible: { open, onClose } = {},
      config: {
        side = 'bottom',
        title,
        height,
        snapPoints,
        persistent = false,
      } = {},
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const sheetRef = useRef<HTMLDivElement>(null);
    const titleId = useRef(
      `azimuth-sheet-${Math.random().toString(36).slice(2, 9)}`,
    ).current;

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose?.();
        }
      },
      [onClose],
    );

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (!persistent && e.target === e.currentTarget) {
          onClose?.();
        }
      },
      [persistent, onClose],
    );

    useEffect(() => {
      if (!open) return;

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, handleEscape]);

    useEffect(() => {
      if (!open) return;

      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    useFocusTrap(sheetRef, open ?? false);

    const isHorizontal = side === 'left' || side === 'right';

    const sheetStyle: React.CSSProperties = {
      ...style,
    };

    if (snapPoints && snapPoints.length > 0) {
      const initialSnap = snapPoints[0];
      if (isHorizontal) {
        sheetStyle.width = initialSnap;
      } else {
        sheetStyle.height = initialSnap;
      }
    } else if (height) {
      if (isHorizontal) {
        sheetStyle.width = height;
      } else {
        sheetStyle.height = height;
      }
    } else if (!isHorizontal) {
      sheetStyle.height = '50vh';
    } else {
      sheetStyle.width = '400px';
    }

    if (!open) return null;

    return createPortal(
      <div
        ref={ref}
        className={cn(styles.overlay, className)}
        onClick={handleOverlayClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOverlayClick(e as unknown as React.MouseEvent);
          }
        }}
        role="presentation"
        tabIndex={-1}
        style={style}
        {...props}
      >
        <div
          ref={sheetRef}
          className={cn(styles.sheet, styles[side])}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          style={sheetStyle}
        >
          {side === 'bottom' && (
            <div className={styles.handle}>
              <div className={styles.handleBar} />
            </div>
          )}

          {title && (
            <div className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close dialog"
              >
                &#x2715;
              </button>
            </div>
          )}

          <div className={styles.body}>{children}</div>
        </div>
      </div>,
      document.body,
    );
  },
);

SlideSheet.displayName = 'SlideSheet';
