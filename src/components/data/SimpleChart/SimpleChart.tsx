'use client';

import { type ComponentPropsWithoutRef, forwardRef, useMemo } from 'react';
import { cn } from '@/utils/cn';
import styles from './SimpleChart.module.css';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface SimpleChartProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  chart?: {
    /** @default 'bar' */
    type?: 'bar' | 'line' | 'pie';
    data: ChartDataPoint[];
    colors?: string[];
    horizontal?: boolean;
  };
  dimensions?: {
    /** @default 400 */
    width?: number;
    /** @default 250 */
    height?: number;
  };
  display?: {
    xLabel?: string;
    yLabel?: string;
    /** @default true */
    showLegend?: boolean;
    /** @default true */
    showGrid?: boolean;
  };
}

const DEFAULT_COLORS = [
  'var(--azimuth-color-primary)',
  'var(--azimuth-color-accent)',
  'var(--azimuth-color-success-text)',
  'var(--azimuth-color-warning-text)',
  'var(--azimuth-color-error-text)',
  'var(--azimuth-color-border)',
];

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };
const LEGEND_HEIGHT = 30;

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    'M',
    cx,
    cy,
    'L',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArc,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
}

export const SimpleChart = forwardRef<HTMLDivElement, SimpleChartProps>(
  (
    {
      chart: {
        type = 'bar',
        data,
        colors,
        horizontal = false,
      } = {},
      dimensions: {
        width = 400,
        height = 250,
      } = {},
      display: {
        xLabel,
        yLabel,
        showLegend = true,
        showGrid = true,
      } = {},
      className,
      ...props
    },
    ref,
  ) => {
    const palette = colors ?? DEFAULT_COLORS;

    const chartData = useMemo(() => {
      if (!data || data.length === 0) return [];
      return data.map((d, i) => ({
        ...d,
        color: d.color ?? palette[i % palette.length],
      }));
    }, [data, palette]);

    const isEmpty = chartData.length === 0;
    const maxVal = useMemo(
      () => Math.max(...chartData.map((d) => d.value), 1),
      [chartData],
    );
    const total = useMemo(
      () => chartData.reduce((s, d) => s + d.value, 0),
      [chartData],
    );

    const legendHeight = showLegend ? LEGEND_HEIGHT : 0;
    const svgWidth = width;
    const svgHeight = height;

    if (type === 'pie') {
      const cx = svgWidth / 2;
      const cy = (svgHeight - legendHeight) / 2;
      const r = Math.min(cx, cy) - 10;
      let currentAngle = 0;
      const slices = chartData.map((d) => {
        const angle = total > 0 ? (d.value / total) * 360 : 0;
        const path = describeArc(cx, cy, r, currentAngle, currentAngle + angle);
        const midAngle = currentAngle + angle / 2;
        const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle);
        const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
        currentAngle += angle;
        return { ...d, path, labelX: labelPos.x, labelY: labelPos.y, pct };
      });

      return (
        <div
          ref={ref}
          className={cn(styles.container, className)}
          {...props}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className={styles.svg}
            role="img"
            aria-label="Pie chart"
          >
            {slices.map((d, i) => (
              <g key={i}>
                <path d={d.path} fill={d.color} className={styles.slice} />
                {d.pct > 5 && (
                  <text
                    x={d.labelX}
                    y={d.labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={styles.sliceLabel}
                    fill="var(--azimuth-color-text-inverse, #fff)"
                    fontSize="11"
                  >
                    {d.pct}%
                  </text>
                )}
              </g>
            ))}
          </svg>
          {showLegend && (
            <div className={styles.legend}>
              {slices.map((d, i) => (
                <span key={i} className={styles.legendItem}>
                  <span
                    className={styles.legendSwatch}
                    style={{ background: d.color }}
                  />
                  {d.label}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    const plotWidth = svgWidth - PADDING.left - PADDING.right;
    const plotHeight = svgHeight - PADDING.top - PADDING.bottom - legendHeight;

    const gridLines = useMemo(() => {
      const lines: { y: number; label: string }[] = [];
      const steps = 5;
      for (let i = 0; i <= steps; i++) {
        const val = (maxVal / steps) * i;
        const y = PADDING.top + plotHeight - (val / maxVal) * plotHeight;
        lines.push({ y, label: Math.round(val).toString() });
      }
      return lines;
    }, [maxVal, plotHeight]);

    const barChart = useMemo(() => {
      if (type !== 'bar') return null;
      if (horizontal) {
        const barH = Math.max(
          4,
          (plotHeight - (chartData.length - 1) * 4) / chartData.length,
        );
        return chartData.map((d, i) => {
          const barW = (d.value / maxVal) * plotWidth;
          const y = PADDING.top + i * (barH + 4);
          return (
            <g key={i}>
              <rect
                x={PADDING.left}
                y={y}
                width={Math.max(barW, 1)}
                height={barH}
                fill={d.color}
                rx={2}
                className={styles.bar}
              />
              <text
                x={PADDING.left - 4}
                y={y + barH / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontSize="10"
                className={styles.axisLabel}
              >
                {d.label}
              </text>
            </g>
          );
        });
      }
      const barW = Math.max(
        4,
        (plotWidth - (chartData.length - 1) * 4) / chartData.length,
      );
      return chartData.map((d, i) => {
        const barH = (d.value / maxVal) * plotHeight;
        const x = PADDING.left + i * (barW + 4);
        const y = PADDING.top + plotHeight - barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(barH, 1)}
              fill={d.color}
              rx={2}
              className={styles.bar}
            />
            <text
              x={x + barW / 2}
              y={PADDING.top + plotHeight + 14}
              textAnchor="middle"
              fontSize="10"
              className={styles.axisLabel}
            >
              {d.label}
            </text>
          </g>
        );
      });
    }, [type, horizontal, chartData, maxVal, plotWidth, plotHeight]);

    const lineChart = useMemo(() => {
      if (type !== 'line') return null;
      const points = chartData.map((d, i) => ({
        x:
          PADDING.left +
          (plotWidth / (Math.max(chartData.length - 1, 1))) * i,
        y:
          PADDING.top +
          plotHeight -
          (d.value / maxVal) * plotHeight,
        label: d.label,
        value: d.value,
        color: d.color,
      }));
      const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');
      const areaPath = `${linePath} L ${points[points.length - 1].x} ${PADDING.top + plotHeight} L ${points[0].x} ${PADDING.top + plotHeight} Z`;
      return { points, linePath, areaPath };
    }, [chartData, maxVal, plotWidth, plotHeight]);

    return (
      <div
        ref={ref}
        className={cn(styles.container, className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.svg}
          role="img"
          aria-label={
            type === 'bar'
              ? `${horizontal ? 'Horizontal ' : ''}Bar chart`
              : 'Line chart'
          }
        >
          {showGrid &&
            gridLines.map((gl, i) => (
              <g key={i}>
                <line
                  x1={PADDING.left}
                  y1={gl.y}
                  x2={PADDING.left + plotWidth}
                  y2={gl.y}
                  stroke="var(--azimuth-color-border)"
                  strokeWidth={1}
                  className={styles.gridLine}
                />
                <text
                  x={PADDING.left - 6}
                  y={gl.y}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize="10"
                  className={styles.axisLabel}
                >
                  {gl.label}
                </text>
              </g>
            ))}

          {yLabel && (
            <text
              x={12}
              y={PADDING.top + plotHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90, 12, ${PADDING.top + plotHeight / 2})`}
              fontSize="11"
              className={styles.axisLabel}
            >
              {yLabel}
            </text>
          )}

          {xLabel && type === 'bar' && !horizontal && (
            <text
              x={PADDING.left + plotWidth / 2}
              y={svgHeight - 4}
              textAnchor="middle"
              fontSize="11"
              className={styles.axisLabel}
            >
              {xLabel}
            </text>
          )}

          {(type === 'bar') && barChart}

          {(type === 'line') && lineChart && (
            <>
              <path
                d={lineChart.areaPath}
                fill={palette[0]}
                opacity={0.1}
                className={styles.area}
              />
              <path
                d={lineChart.linePath}
                fill="none"
                stroke={palette[0]}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                className={styles.line}
              />
              {lineChart.points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill={p.color}
                  className={styles.point}
                >
                  <title>{`${p.label}: ${p.value}`}</title>
                </circle>
              ))}
            </>
          )}
        </svg>

        {isEmpty && (
          <div className={styles.emptyOverlay}>
            <span className={styles.emptyText}>No data</span>
          </div>
        )}

          {showLegend && chartData.length > 0 && (
          <div className={styles.legend}>
            {chartData.map((d, i) => (
              <span key={i} className={styles.legendItem}>
                <span
                  className={styles.legendSwatch}
                  style={{ background: d.color }}
                />
                {d.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  },
);

SimpleChart.displayName = 'SimpleChart';
