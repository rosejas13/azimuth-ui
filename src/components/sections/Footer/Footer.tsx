import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import type { CuratedSurface, NativeRest } from '@/utils/curate';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Divider } from '@/components/layout';
import styles from './Footer.module.css';

/** A single column of footer navigation links. */
export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

/** A social media link with an optional icon. */
export interface SocialLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

/** Curated native surface for the Footer element; anything native not listed goes through `footerProps`. */
export interface FooterProps extends CuratedSurface<
  'footer',
  ['className', 'style', 'id']
> {
  brand?: { name: string; description?: string; logo?: React.ReactNode };
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  copyright?: string;
  newsletterText?: string;
  /** @default 'default' */
  variant?: 'default' | 'dark' | 'muted';
  /** Escape hatch for native attributes absent from the curated surface. Spread last, wins. */
  footerProps?: NativeRest<'footer'>;
}

/** A multi-column site footer with brand, navigation links, social media, newsletter signup, and copyright. */
export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      brand,
      columns,
      socialLinks,
      copyright,
      newsletterText,
      className,
      variant = 'default',
      footerProps,
      ...props
    },
    ref,
  ) => {
    return (
      <footer
        ref={ref}
        className={cn(styles.footer, styles[variant], className)}
        {...props}
        {...(footerProps as ComponentPropsWithoutRef<'footer'>)}
      >
        <Container size="lg">
          {(brand || newsletterText) && (
            <div className={styles.top}>
              {brand && (
                <div className={styles.brand}>
                  {brand.logo && (
                    <div className={styles.brandLogo}>{brand.logo}</div>
                  )}
                  <h3 className={styles.brandName}>{brand.name}</h3>
                  {brand.description && (
                    <p className={styles.brandDescription}>
                      {brand.description}
                    </p>
                  )}
                </div>
              )}
              {newsletterText && (
                <div className={styles.newsletter}>
                  <p className={styles.newsletterText}>{newsletterText}</p>
                  <button type="button" className={styles.newsletterButton}>
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          )}
          {columns && columns.length > 0 && (
            <div className={styles.columns}>
              {columns.map((column, index) => (
                <div key={index} className={styles.column}>
                  <h4 className={styles.columnTitle}>{column.title}</h4>
                  <ul className={styles.linkList}>
                    {column.links.map((link, i) => (
                      <li key={i} className={styles.link}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {(copyright || (socialLinks && socialLinks.length > 0)) && (
            <>
              <Divider />
              <div className={styles.bottom}>
                {copyright && <p className={styles.copyright}>{copyright}</p>}
                {socialLinks && socialLinks.length > 0 && (
                  <div className={styles.socialLinks}>
                    {socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        className={styles.socialLink}
                        aria-label={link.label}
                      >
                        {link.icon || link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </Container>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
