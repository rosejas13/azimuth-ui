import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout';
import { Divider } from '@/components/layout';
import styles from './Footer.module.css';

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface SocialLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface FooterProps extends ComponentPropsWithoutRef<'footer'> {
  brand?: { name: string; description?: string; logo?: React.ReactNode };
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  copyright?: string;
  newsletterText?: string;
  variant?: 'default' | 'dark' | 'muted';
}

export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      brand,
      columns,
      socialLinks,
      copyright,
      newsletterText,
      variant = 'default',
      id,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <footer
        ref={ref}
        id={id}
        className={cn(styles.footer, styles[variant], className)}
        {...props}
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
                  <span className={styles.newsletterButton}>Subscribe</span>
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
