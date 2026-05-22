import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbsProps extends ComponentPropsWithoutRef<'nav'> {
  items: Array<{ label: string; href?: string }>;
  /** @default '/' */
  separator?: string;
  /** Maximum number of items before collapsing. 0 disables collapsing. @default 0 */
  maxItems?: number;
  children?: React.ReactNode;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      items,
      separator = '/',
      maxItems = 0,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const safeItems = items ?? [];
    let visibleItems: Array<{ label: string; href?: string } | null>;

    if (maxItems > 0 && safeItems.length > maxItems) {
      const endCount = maxItems - 2;
      visibleItems = [safeItems[0], null, ...safeItems.slice(safeItems.length - endCount)];
    } else {
      visibleItems = [...safeItems];
    }

    return (
      <nav
        ref={ref}
        className={cn(styles.breadcrumbs, className)}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className={styles.list}>
          {children}
          {visibleItems.map((item, index) => {
            if (item === null) {
              return (
                <li key="ellipsis" className={styles.item}>
                  <span className={styles.ellipsis}>...</span>
                  <span className={styles.separator}>{separator}</span>
                </li>
              );
            }

            const isLast = index === visibleItems.length - 1;

            return (
              <li
                key={item.label}
                className={cn(styles.item, isLast && styles.current)}
              >
                {isLast ? (
                  <span aria-current="page">{item.label}</span>
                ) : item.href ? (
                  <a href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
                {!isLast && (
                  <span className={styles.separator}>{separator}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumbs.displayName = 'Breadcrumbs';
