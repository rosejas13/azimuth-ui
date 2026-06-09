'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './SkipLink.module.css';

/** Props for the SkipLink component. */
export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target element ID to skip to. @default 'main-content' */
  href?: string;
  /** Visible label. @default 'Skip to content' */
  children?: React.ReactNode;
}

/**
 * Skip-to-content link for keyboard users.
 * Visually hidden until focused, then appears at the top of the page.
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  (
    {
      href = '#main-content',
      children = 'Skip to content',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(styles.root, className)}
        {...props}
      >
        {children}
      </a>
    );
  },
);

SkipLink.displayName = 'SkipLink';
