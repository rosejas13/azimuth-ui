import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import styles from './BreadcrumbPageHeader.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbPageHeaderProps
  extends ComponentPropsWithoutRef<'header'> {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const BreadcrumbPageHeader = forwardRef<
  HTMLElement,
  BreadcrumbPageHeaderProps
>(
  (
    {
      title,
      description,
      breadcrumbs,
      actions,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <header
        ref={ref}
        className={cn(styles.header, className)}
        {...props}
      >
        <Breadcrumbs items={breadcrumbs} className={styles.breadcrumbs} />

        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>

        {description && (
          <p className={styles.description}>{description}</p>
        )}

        {children && <div className={styles.content}>{children}</div>}
      </header>
    );
  },
);

BreadcrumbPageHeader.displayName = 'BreadcrumbPageHeader';
