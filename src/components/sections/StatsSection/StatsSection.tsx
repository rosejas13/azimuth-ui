import { type ComponentPropsWithoutRef, forwardRef } from 'react';
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

export interface StatsSectionProps extends ComponentPropsWithoutRef<'section'> {
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'accent' | 'dark' | 'muted';
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
      id,
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
