'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import styles from './PageLayout.module.css';

/** A page layout shell with optional sidebar, top navigation, and footer. */
export interface PageLayoutProps extends ComponentPropsWithoutRef<'div'> {
  /** Sidebar content rendered in an aside element. */
  sidebar?: React.ReactNode;
  /** @default '260px' */
  sidebarWidth?: string;
  /** @default 'left' */
  sidebarPosition?: 'left' | 'right';
  /** Viewport width breakpoint below which the sidebar becomes an overlay panel. @default '768px' */
  breakpoint?: string;
  /** Top navigation bar content. */
  topNav?: React.ReactNode;
  /** Footer content. */
  footer?: React.ReactNode;
  /** Main page content. */
  children?: React.ReactNode;
}

/** A page layout shell providing sidebar, top nav, and footer regions. */
export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  (
    {
      sidebar,
      sidebarWidth = '260px',
      sidebarPosition = 'left',
      breakpoint = '768px',
      topNav,
      footer,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const isMobile = useMediaQuery(`(max-width: ${breakpoint})`);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const sidebarId = useId();
    const liveRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = useCallback(() => {
      setSidebarOpen((prev) => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
      setSidebarOpen(false);
      hamburgerRef.current?.focus();
    }, []);

    useEffect(() => {
      if (!isMobile || !sidebarOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeSidebar();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isMobile, sidebarOpen, closeSidebar]);

    useEffect(() => {
      if (!isMobile || !sidebarOpen) return;

      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      const focusable = sidebar.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      first?.focus();

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      sidebar.addEventListener('keydown', handleTab);
      return () => sidebar.removeEventListener('keydown', handleTab);
    }, [isMobile, sidebarOpen]);

    useEffect(() => {
      if (!isMobile || !sidebarOpen) return;

      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [isMobile, sidebarOpen]);

    useEffect(() => {
      if (!isMobile) {
        setSidebarOpen(false);
      }
    }, [isMobile]);

    const hasSidebarDesktop = !!sidebar && !isMobile;
    const hasSidebarMobile = !!sidebar && isMobile;

    return (
      <div
        ref={ref}
        className={cn(
          styles.pageLayout,
          hasSidebarDesktop && styles.hasSidebar,
          hasSidebarDesktop && sidebarPosition === 'right' && styles.sidebarRight,
          isMobile && sidebarOpen && styles.mobileOverlayOpen,
          className,
        )}
        style={{
          ...style,
          '--azimuth-sidebar-width': sidebar ? sidebarWidth : undefined,
        } as React.CSSProperties}
        {...props}
      >
        {(topNav || hasSidebarMobile) && (
          <header
            className={cn(
              styles.topNav,
              hasSidebarMobile && sidebarOpen && styles.topNavOverlay,
            )}
          >
            {hasSidebarMobile && (
              <button
                ref={hamburgerRef}
                type="button"
                className={styles.hamburger}
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={sidebarOpen}
                aria-controls={sidebarId}
              >
                <span className={cn(styles.hamburgerLine, sidebarOpen && styles.hamburgerLineTop)} />
                <span className={cn(styles.hamburgerLine, sidebarOpen && styles.hamburgerLineMid)} />
                <span className={cn(styles.hamburgerLine, sidebarOpen && styles.hamburgerLineBottom)} />
              </button>
            )}
            {topNav}
          </header>
        )}

        {hasSidebarMobile && (
          <>
            <div
              className={cn(styles.backdrop, sidebarOpen && styles.backdropVisible)}
              onClick={closeSidebar}
              aria-hidden="true"
            />
            <aside
              ref={sidebarRef}
              id={sidebarId}
              className={cn(
                styles.sidebarOverlay,
                sidebarPosition === 'right'
                  ? styles.sidebarOverlayRight
                  : styles.sidebarOverlayLeft,
                sidebarOpen && styles.sidebarOverlayOpen,
              )}
            >
              {sidebar}
            </aside>
          </>
        )}

        <div
          className={styles.body}
          aria-hidden={isMobile && sidebarOpen ? true : undefined}
        >
          {hasSidebarDesktop && sidebarPosition === 'left' && (
            <aside className={styles.sidebar}>{sidebar}</aside>
          )}
          <main className={styles.content}>{children}</main>
          {hasSidebarDesktop && sidebarPosition === 'right' && (
            <aside className={styles.sidebar}>{sidebar}</aside>
          )}
        </div>

        <div
          ref={liveRef}
          role="status"
          aria-live="polite"
          className={styles.srOnly}
        >
          {isMobile ? (sidebarOpen ? 'Sidebar opened' : 'Sidebar closed') : ''}
        </div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    );
  },
);

PageLayout.displayName = 'PageLayout';
