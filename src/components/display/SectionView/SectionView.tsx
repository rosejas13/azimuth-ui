'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './SectionView.module.css';

/** A collapsible section with a toggle trigger and animated content reveal. Supports controlled and uncontrolled modes. */
export interface SectionViewProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onToggle'> {
  /** Section title displayed in the toggle trigger. */
  title: string;
  /** @default false */
  defaultExpanded?: boolean;
  /** Controlled expanded state. When provided, the component becomes controlled. */
  expanded?: boolean;
  /** Callback fired when the section is toggled. */
  onToggle?: (expanded: boolean) => void;
  /** Content revealed when expanded. */
  children?: React.ReactNode;
}

/** A collapsible section view with a toggle button and animated content. */
export const SectionView = forwardRef<HTMLDivElement, SectionViewProps>(
  (
    {
      title,
      defaultExpanded = false,
      expanded: expandedProp,
      onToggle,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const contentId = useRef(`azimuth-section-${autoId}`).current;
    const [expandedState, setExpandedState] = useState(defaultExpanded);

    const isControlled = expandedProp !== undefined;
    const isExpanded = isControlled ? expandedProp : expandedState;

    const handleToggle = useCallback(() => {
      const next = !isExpanded;
      if (!isControlled) {
        setExpandedState(next);
      }
      onToggle?.(next);
    }, [isExpanded, isControlled, onToggle]);

    return (
      <div
        ref={ref}
        className={cn(styles.sectionView, className)}
        {...props}
      >
        <button
          id={`${contentId}-trigger`}
          type="button"
          className={styles.trigger}
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <span className={styles.title}>{title}</span>
          <span
            className={cn(styles.chevron, isExpanded && styles.chevronExpanded)}
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        <div
          id={contentId}
          className={cn(styles.contentWrapper, isExpanded && styles.open)}
          role="region"
          aria-labelledby={`${contentId}-trigger`}
        >
          <div className={styles.contentInner}>{children}</div>
        </div>
      </div>
    );
  },
);

SectionView.displayName = 'SectionView';
