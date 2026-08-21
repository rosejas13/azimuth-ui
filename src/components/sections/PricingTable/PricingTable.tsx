'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Text } from '@/components/display';
import { Button, type ButtonVariant } from '@/components/input';
import { Badge } from '@/components/display';
import styles from './PricingTable.module.css';

/** A single pricing tier within the table. */
export interface PricingTier {
  /** Tier name (e.g. "Starter", "Pro"). */
  name: string;
  /** Price string (e.g. "$29/mo"). */
  price: string;
  /** Short description of the tier. */
  description?: string;
  /** List of feature descriptions. */
  features: string[];
  /** When true, the tier is visually promoted. */
  highlighted?: boolean;
  /** Optional badge label (e.g. "Popular"). */
  badge?: string;
  /** Call-to-action button config. */
  cta: { label: string; href?: string; onClick?: () => void };
}

/** Props for the PricingTable section component. */
export interface PricingTableProps extends ComponentPropsWithoutRef<'section'> {
  /** Main heading above the pricing grid. */
  title?: string;
  /** Smaller label displayed above the title. */
  subtitle?: string;
  /** Longer description below the title. */
  description?: string;
  /** Array of pricing tiers. */
  tiers: PricingTier[];
  /** Section color variant. @default 'default' */
  variant?: 'default' | 'accent' | 'dark' | 'muted';
  /** Custom class name applied to the section element. */
  className?: string;
  /** Section id for anchor linking. */
  id?: string;
}

function renderCTA(cta: PricingTier['cta'], highlighted: boolean): ReactNode {
  const variant: ButtonVariant = highlighted ? 'primary' : 'secondary';
  if (cta.href) {
    return (
      <Button key={cta.label} variant={variant} asChild>
        <a href={cta.href}>{cta.label}</a>
      </Button>
    );
  }
  return (
    <Button key={cta.label} variant={variant} onClick={cta.onClick}>
      {cta.label}
    </Button>
  );
}

/** A responsive pricing table section with multiple tiers, feature lists, and highlighted plans. */
export const PricingTable = forwardRef<HTMLElement, PricingTableProps>(
  (
    {
      title,
      subtitle,
      description,
      tiers,
      variant = 'default',
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
          <div className={styles.grid}>
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={cn(
                  styles.tier,
                  tier.highlighted && styles.highlighted,
                )}
              >
                {tier.badge && (
                  <div className={styles.badge}>
                    <Badge variant="accent">{tier.badge}</Badge>
                  </div>
                )}
                <h3 className={styles.tierName}>{tier.name}</h3>
                {tier.description && (
                  <p className={styles.tierDescription}>{tier.description}</p>
                )}
                <div className={styles.price}>{tier.price}</div>
                <p className={styles.note}>Billed monthly or annually</p>
                <ul className={styles.features}>
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className={styles.featureItem}>
                      <svg
                        className={styles.checkIcon}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.cta}>
                  {renderCTA(tier.cta, !!tier.highlighted)}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  },
);

PricingTable.displayName = 'PricingTable';
