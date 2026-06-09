'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './ProductCard.module.css';

/** Props for the ProductCard component. */
export interface ProductCardProps {
  /** Product image URL */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Product title */
  title: string;
  /** Product description */
  description?: string;
  /** Price display */
  price: string;
  /** Original price (for sale display with strikethrough) */
  originalPrice?: string;
  /** Rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Call-to-action label (default 'Add to Cart') */
  ctaLabel?: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** Whether product is out of stock */
  outOfStock?: boolean;
  /** Badge text (e.g. "Sale", "New") */
  badge?: string;
  className?: string;
}

/** A product display card for storefronts. */
export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      image,
      imageAlt = '',
      title,
      description,
      price,
      originalPrice,
      rating,
      reviewCount,
      ctaLabel = 'Add to Cart',
      onCtaClick,
      outOfStock = false,
      badge,
      className,
    },
    ref,
  ) => {
    const stars = rating != null ? renderStars(rating) : null;

    return (
      <div ref={ref} className={cn(styles.card, className)}>
        {image && (
          <div className={styles.imageWrapper}>
            <img src={image} alt={imageAlt} className={styles.image} />
          </div>
        )}
        <div className={styles.body}>
          {badge && <span className={styles.badge}>{badge}</span>}
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
          <div className={styles.priceRow}>
            <span className={styles.price}>{price}</span>
            {originalPrice && (
              <span className={styles.originalPrice}>{originalPrice}</span>
            )}
          </div>
          {(stars || reviewCount != null) && (
            <div className={styles.ratingRow}>
              {stars}
              {reviewCount != null && (
                <span className={styles.reviewCount}>({reviewCount})</span>
              )}
            </div>
          )}
          <div className={styles.actions}>
            {outOfStock ? (
              <span className={styles.outOfStockLabel}>Out of Stock</span>
            ) : (
              <button type="button" className={styles.cta} onClick={onCtaClick}>
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

ProductCard.displayName = 'ProductCard';

function renderStars(rating: number) {
  const clamped = Math.max(0, Math.min(5, rating));
  const full = Math.round(clamped);
  const empty = 5 - full;
  return (
    <span
      className={styles.stars}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {'★'.repeat(full)}
      {'☆'.repeat(empty)}
    </span>
  );
}
