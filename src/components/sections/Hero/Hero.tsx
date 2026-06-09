import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Text } from '@/components/display';
import { Button, type ButtonVariant } from '@/components/input';
import styles from './Hero.module.css';

/** Props for the Hero section component. */
export interface HeroProps extends ComponentPropsWithoutRef<'section'> {
  /** Main heading text. */
  title: string;
  /** Subtitle line displayed below the title. */
  subtitle?: string;
  /** Longer description paragraph. */
  description?: string;
  /** Primary call-to-action button. */
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  /** Secondary call-to-action button. */
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  /** @default 'default' */
  variant?: 'default' | 'accent' | 'dark' | 'muted';
  /** @default 'center' */
  layout?: 'center' | 'split';
  /** Optional background image URL (cover). */
  backgroundImage?: string;
  /** Optional media element displayed in split layout. */
  media?: { src: string; alt: string };
}

function renderAction(
  action: { label: string; href?: string; onClick?: () => void },
  variant: ButtonVariant,
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

/** A full-width hero section with title, CTAs, optional media, and background image support. */
export const Hero = forwardRef<HTMLElement, HeroProps>(
  (
    {
      title,
      subtitle,
      description,
      primaryAction,
      secondaryAction,
      variant = 'default',
      layout = 'center',
      backgroundImage,
      media,
      className,
      id,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          styles.hero,
          styles[variant],
          backgroundImage && styles.withBackground,
          className,
        )}
        style={{
          ...(backgroundImage
            ? { backgroundImage: `url(${backgroundImage})` }
            : {}),
          ...style,
        }}
        {...props}
      >
        {backgroundImage && (
          <div className={styles.overlay} aria-hidden="true" />
        )}
        <Container size="lg">
          <div
            className={cn(
              styles.inner,
              layout === 'split' && styles.splitLayout,
            )}
          >
            <div className={cn(styles.content, styles[layout])}>
              <h1 className={styles.title}>{title}</h1>
              {subtitle && (
                <Text element={{ as: 'p', size: 'lg', variant: 'heading' }}>
                  {subtitle}
                </Text>
              )}
              {description && (
                <Text element={{ as: 'p', size: 'base' }}>{description}</Text>
              )}
              {(primaryAction || secondaryAction) && (
                <div className={styles.actions}>
                  {primaryAction && renderAction(primaryAction, 'primary')}
                  {secondaryAction &&
                    renderAction(secondaryAction, 'secondary')}
                </div>
              )}
            </div>
            {media && layout === 'split' && (
              <div className={styles.media}>
                <img src={media.src} alt={media.alt} />
              </div>
            )}
          </div>
        </Container>
      </section>
    );
  },
);

Hero.displayName = 'Hero';
