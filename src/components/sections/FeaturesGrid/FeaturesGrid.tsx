import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Card, Text } from '@/components/display';
import styles from './FeaturesGrid.module.css';

/** A single feature entry within the grid. */
export interface FeatureItem {
  /** Optional icon displayed above the title. */
  icon?: ReactNode;
  /** Feature heading. */
  title: string;
  /** Feature description text. */
  description: string;
}

/** Curated native surface for the FeaturesGrid section; anything native not listed goes through `sectionProps`. */
export interface FeaturesGridProps extends CuratedSurface<
  'section',
  ['className', 'style', 'id']
> {
  /** Main heading above the grid. */
  title?: string;
  /** Smaller label displayed above the title. */
  subtitle?: string;
  /** Longer description paragraph below the title. */
  description?: string;
  /** Array of features to render in the grid. */
  features: FeatureItem[];
  /** Number of grid columns. @default 3 */
  columns?: 2 | 3 | 4;
  /** Section color variant. @default 'default' */
  variant?: 'default' | 'accent' | 'dark' | 'muted';
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  sectionProps?: NativeRest<'section'>;
}

/** A responsive grid of feature cards with optional header section and multiple column presets. */
export const FeaturesGrid = forwardRef<HTMLElement, FeaturesGridProps>(
  (
    {
      title,
      subtitle,
      description,
      features,
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
        <Container size="lg">
          {(title || subtitle || description) && (
            <header className={styles.header}>
              {subtitle && (
                <Text
                  as="p"
                  size="sm"
                  variant="heading"
                  color="accent"
                  className={styles.subtitle}
                >
                  {subtitle}
                </Text>
              )}
              {title && <h2 className={styles.title}>{title}</h2>}
              {description && (
                <Text as="p" size="base">
                  {description}
                </Text>
              )}
            </header>
          )}
          <div className={cn(styles.grid, styles[`cols-${columns}`])}>
            {features.map((feature, index) => (
              <Card key={index} className={styles.feature}>
                {feature.icon && (
                  <div className={styles.icon} aria-hidden="true">
                    {feature.icon}
                  </div>
                )}
                <Card.Title>{feature.title}</Card.Title>
                <Card.Description>{feature.description}</Card.Description>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    );
  },
);

FeaturesGrid.displayName = 'FeaturesGrid';
