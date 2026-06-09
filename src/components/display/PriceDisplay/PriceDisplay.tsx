'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './PriceDisplay.module.css';

/** Props for the PriceDisplay component. */
export interface PriceDisplayProps {
  /** Current price */
  price: number;
  /** Original price (before sale/discount) */
  originalPrice?: number;
  /** Currency symbol (default '$') */
  currency?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show per-unit suffix (e.g. '/mo', '/ea') */
  suffix?: string;
  className?: string;
}

/** Formatted price display with currency, sale pricing, strikethrough original price. */
export const PriceDisplay = forwardRef<HTMLSpanElement, PriceDisplayProps>(
  (
    { price, originalPrice, currency = '$', size = 'md', suffix, className },
    ref,
  ) => {
    return (
      <span ref={ref} className={cn(styles.container, styles[size], className)}>
        <span className={styles.price}>{formatPrice(price, currency)}</span>
        {originalPrice != null && (
          <span className={styles.originalPrice}>
            {formatPrice(originalPrice, currency)}
          </span>
        )}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>
    );
  },
);

PriceDisplay.displayName = 'PriceDisplay';

function formatPrice(value: number, currency: string): string {
  if (value % 1 === 0) {
    return `${currency}${value}`;
  }
  return `${currency}${value.toFixed(2)}`;
}
