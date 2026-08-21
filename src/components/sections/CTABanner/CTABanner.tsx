'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Text } from '@/components/display';
import { Button } from '@/components/input';
import styles from './CTABanner.module.css';

/** Call-to-action banner section with title, description, and action buttons */
export interface CTABannerProps extends ComponentPropsWithoutRef<'section'> {
  title: string;
  description?: string;
  primaryAction: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  variant?: 'default' | 'accent' | 'dark' | 'muted';
  id?: string;
  className?: string;
}

function renderAction(
  action: { label: string; href?: string; onClick?: () => void },
  variant: 'primary' | 'secondary',
): ReactNode {
  if (action.href) {
    return (
      <Button key={action.label} variant={variant} asChild>
        <a href={action.href}>{action.label}</a>
      </Button>
    );
  }
  return (
    <Button key={action.label} variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

export const CTABanner = forwardRef<HTMLElement, CTABannerProps>(
  (
    {
      title,
      description,
      primaryAction,
      secondaryAction,
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
          <div className={styles.inner}>
            <h2 className={styles.title}>{title}</h2>
            {description && (
              <Text as="p" size="lg">
                {description}
              </Text>
            )}
            <div className={styles.actions}>
              {renderAction(primaryAction, 'primary')}
              {secondaryAction && renderAction(secondaryAction, 'secondary')}
            </div>
          </div>
        </Container>
      </section>
    );
  },
);

CTABanner.displayName = 'CTABanner';
