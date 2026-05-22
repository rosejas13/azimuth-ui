'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import styles from './ImageViewer.module.css';

export interface ImageViewerImage {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ImageViewerProps extends ComponentPropsWithoutRef<'div'> {
  images: ImageViewerImage[];
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
  showCaption?: boolean;
  showThumbnails?: boolean;
}

export const ImageViewer = forwardRef<HTMLDivElement, ImageViewerProps>(
  (
    {
      images,
      open,
      onClose,
      initialIndex = 0,
      showCaption = true,
      showThumbnails = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [index, setIndex] = useState(initialIndex);
    const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');

    useEffect(() => {
      setIndex(initialIndex);
    }, [initialIndex, open]);

    useEffect(() => {
      if (!open) return;
      setLoadState('loading');
    }, [open, index]);

    const goNext = useCallback(() => {
      setIndex((i) => (i + 1) % ((images ?? []).length || 1));
    }, [images.length]);

    const goPrev = useCallback(() => {
      setIndex((i) => (i - 1 + ((images ?? []).length || 1)) % ((images ?? []).length || 1));
    }, [images.length]);

    const goTo = useCallback((i: number) => {
      setIndex(i);
    }, []);

    useEffect(() => {
      if (!open) return;

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'ArrowLeft') {
          goPrev();
        } else if (e.key === 'ArrowRight') {
          goNext();
        }
      };

      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose, goPrev, goNext]);

    useEffect(() => {
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [open]);

    if (!open || (images ?? []).length === 0) return null;

    const current = (images ?? [])[index];

    const handleImageLoad = () => setLoadState('loaded');
    const handleImageError = () => setLoadState('error');

    const content = (
      <div
        ref={ref}
        className={cn(styles.overlay, className)}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        {...props}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close viewer"
        >
          ✕
        </button>

        <span className={styles.counter}>
          {index + 1} / {images.length}
        </span>

        {(images ?? []).length > 1 && (
          <button
            type="button"
            className={cn(styles.navButton, styles.navPrev)}
            onClick={goPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        <div className={styles.container}>
          <div className={styles.imageWrapper}>
            {loadState === 'loading' && (
              <div className={styles.skeleton}>
                <div className={styles.spinner} />
              </div>
            )}
            {loadState === 'error' && (
              <div className={styles.errorState}>
                <span className={styles.errorIcon}>⚠</span>
                <span>Failed to load image</span>
              </div>
            )}
            <img
              src={current.src}
              alt={current.alt ?? ''}
              className={cn(
                styles.image,
                loadState === 'loading' && styles.imageHidden,
                loadState === 'error' && styles.imageHidden,
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {showCaption && current.caption && (
              <div className={styles.caption}>{current.caption}</div>
            )}
          </div>
        </div>

        {(images ?? []).length > 1 && (
          <button
            type="button"
            className={cn(styles.navButton, styles.navNext)}
            onClick={goNext}
            aria-label="Next image"
          >
            ›
          </button>
        )}

        {showThumbnails && (images ?? []).length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                className={cn(styles.thumbnail, i === index && styles.thumbnailActive)}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
              >
                <img src={img.src} alt={img.alt ?? ''} className={styles.thumbnailImage} />
              </button>
            ))}
          </div>
        )}
      </div>
    );

    return createPortal(content, document.body);
  },
);

ImageViewer.displayName = 'ImageViewer';
