'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Navbar.module.css';

export interface NavItem {
  key: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface NavbarProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'children'> {
  logo?: React.ReactNode;
  /** @default '/' */
  logoHref?: string;
  items?: NavItem[];
  activeKey?: string;
  actions?: React.ReactNode;
  /** @default 768 */
  mobileBreakpoint?: number;
  children?: React.ReactNode;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      logo,
      logoHref = '/',
      items = [],
      activeKey,
      actions,
      mobileBreakpoint = 768,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      function check() {
        setIsMobile(window.innerWidth < mobileBreakpoint);
      }
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }, [mobileBreakpoint]);

    useEffect(() => {
      if (mobileOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [mobileOpen]);

    const closeMobile = useCallback(() => setMobileOpen(false), []);

    return (
      <nav ref={ref} className={cn(styles.nav, className)} aria-label="Main navigation" {...props}>
        {logo && (
          <a href={logoHref} className={styles.logo}>
            {logo}
          </a>
        )}

        {!isMobile && items.length > 0 && (
          <ul className={styles.links}>
            {items.map((item) => (
              <li key={item.key}>
                {item.href ? (
                  <a
                    href={item.href}
                    className={cn(
                      styles.link,
                      (activeKey === item.key || item.active) && styles.active,
                    )}
                    onClick={(e) => {
                      item.onClick?.();
                      if (!item.href) e.preventDefault();
                    }}
                    aria-current={
                      activeKey === item.key || item.active ? 'page' : undefined
                    }
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={cn(
                      styles.link,
                      (activeKey === item.key || item.active) && styles.active,
                    )}
                    onClick={item.onClick}
                    aria-current={
                      activeKey === item.key || item.active ? 'page' : undefined
                    }
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {actions && <div className={styles.actions}>{actions}</div>}

        {isMobile && items.length > 0 && (
          <button
            type="button"
            className={cn(styles.hamburger, mobileOpen && styles.open)}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        )}

        {children}

        {isMobile && mobileOpen && (
          <>
            <div className={styles.overlay} onClick={closeMobile} />
            <div className={styles.drawer}>
              <div className={styles.drawerHeader}>
                {logo && <span className={styles.logo}>{logo}</span>}
                <button
                  type="button"
                  className={styles.drawerClose}
                  onClick={closeMobile}
                  aria-label="Close drawer"
                >
                  ✕
                </button>
              </div>
              <ul className={styles.mobileLinks}>
                {items.map((item) => (
                  <li key={item.key}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={cn(
                          styles.mobileLink,
                          (activeKey === item.key || item.active) && styles.active,
                        )}
                        onClick={() => {
                          item.onClick?.();
                          closeMobile();
                        }}
                        aria-current={
                          activeKey === item.key || item.active ? 'page' : undefined
                        }
                      >
                        {item.icon} {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className={cn(
                          styles.mobileLink,
                          (activeKey === item.key || item.active) && styles.active,
                        )}
                        onClick={() => {
                          item.onClick?.();
                          closeMobile();
                        }}
                        aria-current={
                          activeKey === item.key || item.active ? 'page' : undefined
                        }
                      >
                        {item.icon} {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {actions && <div className={styles.mobileAction}>{actions}</div>}
            </div>
          </>
        )}
      </nav>
    );
  },
);

Navbar.displayName = 'Navbar';
