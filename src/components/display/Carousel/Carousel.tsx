'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  Children,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Carousel.module.css';

export interface CarouselProps extends ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  /** @default false */
  autoPlay?: boolean;
  /** @default 5000 */
  interval?: number;
  /** Milliseconds between automatic rotations. Enables auto-advance with this interval. */
  autoRotate?: number;
  /** @default true */
  showDots?: boolean;
  /** @default true */
  showArrows?: boolean;
  /** @default true */
  loop?: boolean;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      autoPlay = false,
      interval = 5000,
      autoRotate,
      showDots = true,
      showArrows = true,
      loop = true,
      className,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const slides = Children.toArray(children);
    const totalSlides = slides.length;

    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const shouldAutoPlay = autoPlay || autoRotate !== undefined;
    const rotationInterval = autoRotate ?? interval;
    const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    const goTo = useCallback(
      (index: number) => {
        if (!loop) {
          setActiveIndex(Math.max(0, Math.min(index, totalSlides - 1)));
        } else {
          setActiveIndex(((index % totalSlides) + totalSlides) % totalSlides);
        }
      },
      [loop, totalSlides],
    );

    const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
    const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

    useEffect(() => {
      if (!shouldAutoPlay || isPaused || totalSlides <= 1 || prefersReducedMotion) return;

      timerRef.current = setInterval(goNext, rotationInterval);
      return () => {
        if (timerRef.current !== undefined) {
          clearInterval(timerRef.current);
        }
      };
    }, [shouldAutoPlay, isPaused, rotationInterval, goNext, totalSlides]);

    if (totalSlides === 0) return null;

    return (
      <div
        ref={ref}
        className={cn(styles.wrapper, className)}
        onMouseEnter={(e) => {
          setIsPaused(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsPaused(false);
          onMouseLeave?.(e);
        }}
        {...props}
      >
        <div className={styles.viewport}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            aria-live="polite"
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={styles.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${totalSlides}`}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {showArrows && totalSlides > 1 && (
          <>
            <button
              type="button"
              className={cn(styles.arrow, styles.arrowPrev)}
              onClick={goPrev}
              aria-label="Previous slide"
              disabled={!loop && activeIndex === 0}
            >
              <span className={styles.arrowIcon} aria-hidden="true">
                &#8249;
              </span>
            </button>
            <button
              type="button"
              className={cn(styles.arrow, styles.arrowNext)}
              onClick={goNext}
              aria-label="Next slide"
              disabled={!loop && activeIndex === totalSlides - 1}
            >
              <span className={styles.arrowIcon} aria-hidden="true">
                &#8250;
              </span>
            </button>
          </>
        )}

        {showDots && totalSlides > 1 && (
          <div className={styles.dots} role="tablist" aria-label="Slide navigation">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  styles.dot,
                  index === activeIndex && styles.dotActive,
                )}
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

Carousel.displayName = 'Carousel';
