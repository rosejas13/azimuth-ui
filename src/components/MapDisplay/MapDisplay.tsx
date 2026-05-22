'use client';

import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './MapDisplay.module.css';

export interface MapMarker {
  position: { lat: number; lng: number };
  label?: string;
  color?: string;
}

export interface MapDisplayProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  src?: string;
  /** @default 'Map' */
  title?: string;
  /** @default '300px' */
  height?: string;
  /** @default '100%' */
  width?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
  markers?: MapMarker[];
  /** @default true */
  interactive?: boolean;
  placeholder?: ReactNode;
}

const generateGridLabels = (
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
) => {
  const latLabels: { value: number; pct: number }[] = [];
  const lngLabels: { value: number; pct: number }[] = [];
  const latStep = Math.max(1, Math.round((maxLat - minLat) / 4));
  const lngStep = Math.max(1, Math.round((maxLng - minLng) / 4));

  for (
    let lat = Math.ceil(minLat / latStep) * latStep;
    lat <= maxLat;
    lat += latStep
  ) {
    latLabels.push({
      value: lat,
      pct: ((maxLat - lat) / (maxLat - minLat)) * 100,
    });
  }
  for (
    let lng = Math.ceil(minLng / lngStep) * lngStep;
    lng <= maxLng;
    lng += lngStep
  ) {
    lngLabels.push({
      value: lng,
      pct: ((lng - minLng) / (maxLng - minLng)) * 100,
    });
  }
  return { latLabels, lngLabels };
};

function formatCoord(val: number): string {
  const abs = Math.abs(val);
  const deg = Math.floor(abs);
  const min = Math.round((abs - deg) * 60);
  const dir =
    val >= 0 ? (val === 0 ? '' : 'N') : 'S';
  return `${deg}\u00B0${min}'${dir}`;
}

function formatLng(val: number): string {
  const abs = Math.abs(val);
  const deg = Math.floor(abs);
  const min = Math.round((abs - deg) * 60);
  const dir = val >= 0 ? 'E' : 'W';
  return `${deg}\u00B0${min}'${dir}`;
}

export const MapDisplay = forwardRef<HTMLDivElement, MapDisplayProps>(
  (
    {
      src,
      title = 'Map',
      height = '300px',
      width = '100%',
      zoom,
      center,
      markers,
      interactive = true,
      placeholder,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const defaultCenter = center ?? { lat: 40.7128, lng: -74.006 };
    const defaultZoom = zoom ?? 10;
    const viewLat = defaultCenter.lat;
    const viewLng = defaultCenter.lng;
    const spanLat = Math.max(0.5, 360 / Math.pow(2, defaultZoom));
    const spanLng = Math.max(0.5, 360 / Math.pow(2, defaultZoom));
    const minLat = viewLat - spanLat / 2;
    const maxLat = viewLat + spanLat / 2;
    const minLng = viewLng - spanLng / 2;
    const maxLng = viewLng + spanLng / 2;

    const { latLabels, lngLabels } = generateGridLabels(
      minLat,
      maxLat,
      minLng,
      maxLng,
    );

    if (src && interactive) {
      return (
        <div
          ref={ref}
          className={cn(styles.container, className)}
          style={{ height, width, ...style }}
          {...props}
        >
          <iframe
            src={src}
            title={title}
            className={styles.iframe}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      );
    }

    if (src && !interactive) {
      return (
        <div
          ref={ref}
          className={cn(styles.container, styles.static, className)}
          style={{ height, width, ...style }}
          {...props}
        >
          <img
            src={src}
            alt={title}
            className={styles.staticImage}
          />
        </div>
      );
    }

    const pinMarkers = (markers ?? []).map((m) => {
      const latPct = ((maxLat - m.position.lat) / (maxLat - minLat)) * 100;
      const lngPct =
        ((m.position.lng - minLng) / (maxLng - minLng)) * 100;
      return {
        ...m,
        latPct: Math.max(0, Math.min(100, latPct)),
        lngPct: Math.max(0, Math.min(100, lngPct)),
      };
    });

    return (
      <div
        ref={ref}
        className={cn(styles.container, className)}
        style={{ height, width, ...style }}
        role="img"
        aria-label={title}
        {...props}
      >
        {placeholder}

        <div className={styles.placeholderGrid}>
          <div className={styles.compassRose}>
            <span className={styles.compassN}>N</span>
            <span className={styles.compassS}>S</span>
            <span className={styles.compassE}>E</span>
            <span className={styles.compassW}>W</span>
            <div className={styles.compassLines} />
          </div>

          {latLabels.map((ll, i) => (
            <span
              key={`lat-${i}`}
              className={styles.coordLabelLat}
              style={{ top: `${ll.pct}%` }}
            >
              {formatCoord(ll.value)}
            </span>
          ))}

          {lngLabels.map((ll, i) => (
            <span
              key={`lng-${i}`}
              className={styles.coordLabelLng}
              style={{ left: `${ll.pct}%` }}
            >
              {formatLng(ll.value)}
            </span>
          ))}

          {pinMarkers.map((m, i) => (
            <div
              key={i}
              className={styles.pin}
              style={{
                top: `${m.latPct}%`,
                left: `${m.lngPct}%`,
                '--pin-color': m.color ?? 'var(--azimuth-color-primary)',
              } as React.CSSProperties}
              role="img"
              aria-label={m.label ?? `Marker ${i + 1}`}
            >
              {m.label && (
                <span className={styles.pinLabel}>{m.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);

MapDisplay.displayName = 'MapDisplay';
