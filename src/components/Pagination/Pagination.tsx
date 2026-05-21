'use client';

import { type ComponentPropsWithoutRef, forwardRef, useCallback } from 'react';
import { cn } from '@/utils/cn';
import styles from './Pagination.module.css';

export interface PaginationProps extends ComponentPropsWithoutRef<'nav'> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** @default 1 */
  siblingCount?: number;
  /** @default false */
  showFirstLast?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
}

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

function getPageRange(
  current: number,
  total: number,
  siblings: number,
): PageItem[] {
  if (total <= 0) return [];

  const totalVisible = siblings * 2 + 5;

  if (total <= totalVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const rightEnd = 3 + 2 * siblings;
    return [
      ...Array.from({ length: rightEnd }, (_, i) => i + 1),
      'ellipsis-end',
      total,
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const leftStart = total - (2 + 2 * siblings);
    return [
      1,
      'ellipsis-start',
      ...Array.from({ length: total - leftStart + 1 }, (_, i) => leftStart + i),
    ];
  }

  return [
    1,
    'ellipsis-start',
    ...Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i),
    'ellipsis-end',
    total,
  ];
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = false,
      size = 'md',
      className,
      ...props
    },
    ref,
  ) => {
    const handleClick = useCallback(
      (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
          onPageChange(page);
        }
      },
      [currentPage, totalPages, onPageChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent, page: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(page);
        }
      },
      [handleClick],
    );

    const range = getPageRange(currentPage, totalPages, siblingCount);

    const isFirstDisabled = currentPage <= 1;
    const isLastDisabled = currentPage >= totalPages;

    return (
      <nav
        ref={ref}
        className={cn(styles.pagination, styles[size], className)}
        aria-label="Pagination"
        {...props}
      >
        <ul className={styles.list}>
          {showFirstLast && (
            <li>
              <button
                type="button"
                className={cn(styles.item, isFirstDisabled && styles.disabled)}
                disabled={isFirstDisabled}
                onClick={() => handleClick(1)}
                onKeyDown={(e) => handleKeyDown(e, 1)}
                aria-label="First page"
              >
                «
              </button>
            </li>
          )}
          <li>
            <button
              type="button"
              className={cn(styles.item, isFirstDisabled && styles.disabled)}
              disabled={isFirstDisabled}
              onClick={() => handleClick(currentPage - 1)}
              onKeyDown={(e) => handleKeyDown(e, currentPage - 1)}
              aria-label="Previous page"
            >
              ‹
            </button>
          </li>
          {range.map((item) => {
            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
              return (
                <li key={item}>
                  <span className={cn(styles.item, styles.ellipsis)}>...</span>
                </li>
              );
            }

            const page = item as number;
            const isActive = page === currentPage;

            return (
              <li key={page}>
                <button
                  type="button"
                  className={cn(
                    styles.item,
                    isActive && styles.active,
                  )}
                  onClick={() => handleClick(page)}
                  onKeyDown={(e) => handleKeyDown(e, page)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              className={cn(styles.item, isLastDisabled && styles.disabled)}
              disabled={isLastDisabled}
              onClick={() => handleClick(currentPage + 1)}
              onKeyDown={(e) => handleKeyDown(e, currentPage + 1)}
              aria-label="Next page"
            >
              ›
            </button>
          </li>
          {showFirstLast && (
            <li>
              <button
                type="button"
                className={cn(styles.item, isLastDisabled && styles.disabled)}
                disabled={isLastDisabled}
                onClick={() => handleClick(totalPages)}
                onKeyDown={(e) => handleKeyDown(e, totalPages)}
                aria-label="Last page"
              >
                »
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';
