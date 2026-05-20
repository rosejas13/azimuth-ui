import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './PageLayout.module.css';

/** Props for the PageLayout component. */
export interface PageLayoutProps extends ComponentPropsWithoutRef<'div'> {
  /** Sidebar content to render beside the main content. */
  sidebar?: React.ReactNode;
  /** Width of the sidebar as a CSS value. @default '260px' */
  sidebarWidth?: string;
  /** Position of the sidebar relative to the content. @default 'left' */
  sidebarPosition?: 'left' | 'right';
  /** Top navigation bar content. */
  topNav?: React.ReactNode;
  /** Footer content rendered at the bottom of the layout. */
  footer?: React.ReactNode;
  /** The content of the component. */
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
