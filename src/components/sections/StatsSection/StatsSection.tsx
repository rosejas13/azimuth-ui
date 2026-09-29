import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { Container, Grid, Stack } from '@/components/layout';
import styles from './StatsSection.module.css';

export interface StatItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

/** Curated native surface for the StatsSection section; anything native not listed goes through `sectionProps`. */
export interface StatsSectionProps extends CuratedSurface<
  'section',
  ['className', 'style', 'id']
> {
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'accent' | 'dark' | 'muted';
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  sectionProps?: NativeRest<'section'>;
}

export const StatsSection = forwardRef<HTMLElement, StatsSectionProps>(
  (
    {
      title,
      subtitle,
      stats,
      columns = 3,
      variant = 'default',
      className,
      sectionProps,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(styles.section, styles[variant], className)}
        {...props}
        {...(sectionProps as ComponentPropsWithoutRef<'section'>)}
      >
        <Container>
          {(title || subtitle) && (
            <div className={styles.header}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          )}
          <Grid cols={columns} className={styles.grid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <Stack direction="vertical" align="center" spacing="xs">
                  {stat.icon && <div className={styles.icon}>{stat.icon}</div>}
                  <span className={styles.value}>
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span className={styles.label}>{stat.label}</span>
                </Stack>
              </div>
            ))}
          </Grid>
        </Container>
      </section>
    );
  },
);

StatsSection.displayName = 'StatsSection';
