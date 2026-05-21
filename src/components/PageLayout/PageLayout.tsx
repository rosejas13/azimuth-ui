import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './PageLayout.module.css';

export interface PageLayoutProps extends ComponentPropsWithoutRef<'div'> {
  sidebar?: React.ReactNode;
  /** @default '260px' */
  sidebarWidth?: string;
  /** @default 'left' */
  sidebarPosition?: 'left' | 'right';
  topNav?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  (
    {
      sidebar,
      sidebarWidth = '260px',
      sidebarPosition = 'left',
      topNav,
      footer,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.pageLayout,
          !!sidebar && styles.hasSidebar,
          !!sidebar && sidebarPosition === 'right' && styles.sidebarRight,
          className,
        )}
        style={{
          ...style,
          '--azimuth-sidebar-width': sidebar ? sidebarWidth : undefined,
        } as React.CSSProperties}
        {...props}
      >
        {topNav && <header className={styles.topNav}>{topNav}</header>}

        <div className={styles.body}>
          {sidebar && sidebarPosition === 'left' && (
            <aside className={styles.sidebar}>{sidebar}</aside>
          )}
          <main className={styles.content}>{children}</main>
          {sidebar && sidebarPosition === 'right' && (
            <aside className={styles.sidebar}>{sidebar}</aside>
          )}
        </div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    );
  },
);

PageLayout.displayName = 'PageLayout';
