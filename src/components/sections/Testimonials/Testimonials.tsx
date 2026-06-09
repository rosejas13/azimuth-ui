'use client';

import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Text } from '@/components/display';
import styles from './Testimonials.module.css';

/** A single testimonial entry. */
export interface TestimonialItem {
  /** Quote text from the testimonial. */
  quote: string;
  /** Author name. */
  author: string;
  /** Author role or title. */
  role?: string;
  /** Author avatar image URL. */
  avatar?: string;
  /** Company or organization name. */
  company?: string;
}

/** Props for the Testimonials section component. */
export interface TestimonialsProps extends ComponentPropsWithoutRef<'section'> {
  /** Main heading above the testimonials grid. */
  title?: string;
  /** Smaller label displayed above the title. */
  subtitle?: string;
  /** Array of testimonials to display. */
  testimonials: TestimonialItem[];
  /** Section color variant. @default 'default' */
  variant?: 'default' | 'accent' | 'dark' | 'muted';
  /** Number of grid columns. @default 2 */
  columns?: 1 | 2 | 3;
  /** Custom class name applied to the section element. */
  className?: string;
  /** Section id for anchor linking. */
  id?: string;
  /** Number of rating stars to display per card. @default 0 */
  rating?: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={cn(styles.star, !filled && styles.starEmpty)}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function renderStars(rating: number) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}

/** A responsive testimonials section featuring quote cards with avatars, author info, and optional star ratings. */
export const Testimonials = forwardRef<HTMLElement, TestimonialsProps>(
  (
    {
      title,
      subtitle,
      testimonials,
      variant = 'default',
      columns = 2,
      rating = 0,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(styles.section, styles[variant], className)}
        {...props}
      >
        <Container size="lg">
          {(title || subtitle) && (
            <header className={styles.header}>
              {subtitle && (
                <Text
                  element={{ as: 'p', size: 'sm', variant: 'heading' }}
                  color="accent"
                  className={styles.subtitle}
                >
                  {subtitle}
                </Text>
              )}
              {title && <h2 className={styles.title}>{title}</h2>}
            </header>
          )}
          <div className={cn(styles.grid, styles[`cols-${columns}`])}>
            {testimonials.map((item, index) => (
              <div key={index} className={styles.card}>
                {rating > 0 && renderStars(rating)}
                <p className={styles.quote}>{item.quote}</p>
                <div className={styles.author}>
                  {item.avatar ? (
                    <img
                      className={styles.avatar}
                      src={item.avatar}
                      alt={item.author}
                    />
                  ) : (
                    <span className={styles.avatarFallback} aria-hidden="true">
                      {getInitials(item.author)}
                    </span>
                  )}
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>
                      {item.author}
                      {item.company && `, ${item.company}`}
                    </span>
                    {item.role && (
                      <span className={styles.authorRole}>{item.role}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  },
);

Testimonials.displayName = 'Testimonials';
