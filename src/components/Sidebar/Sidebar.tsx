'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Sidebar.module.css';

export interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
}

export interface SidebarProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onSelect'> {
  items: SidebarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      activeKey,
      onSelect,
      collapsed,
      onToggle,
      header,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [hovered, setHovered] = useState(false);

    const isExpanded = !collapsed || hovered;

    const toggleSection = useCallback((key: string) => {
      setExpandedSections((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    }, []);

    const renderItem = (item: SidebarItem, depth: number = 0) => {
      const hasChildren = item.children && item.children.length > 0;
      const isActive = activeKey === item.key;
      const isSectionExpanded = expandedSections.has(item.key);

      return (
        <div key={item.key} className={styles.itemGroup}>
          <button
            type="button"
            className={cn(
              styles.item,
              isActive && styles.itemActive,
              depth > 0 && styles.itemNested,
            )}
            style={{
              paddingLeft: `calc(var(--azimuth-space-sm) + ${depth} * var(--azimuth-space-lg))`,
            }}
            onClick={() => {
              if (hasChildren) {
                toggleSection(item.key);
              }
              onSelect(item.key);
            }}
            title={!isExpanded ? item.label : undefined}
          >
            {item.icon && (
              <span className={styles.itemIcon}>{item.icon}</span>
            )}
            <span className={cn(styles.itemLabel, !isExpanded && styles.labelHidden)}>
              {item.label}
            </span>
            {item.badge !== undefined && isExpanded && (
              <span className={styles.badge}>{item.badge}</span>
            )}
            {hasChildren && isExpanded && (
              <span
                className={cn(styles.chevron, isSectionExpanded && styles.chevronOpen)}
                aria-hidden="true"
              >
                ▸
              </span>
            )}
          </button>
          {hasChildren && isSectionExpanded && isExpanded && (
            <div className={styles.subItems}>
              {item.children!.map((child) => renderItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <nav
        ref={ref}
        className={cn(
          styles.sidebar,
          isExpanded ? styles.expanded : styles.collapsed,
          className,
        )}
        onMouseEnter={() => { if (collapsed) setHovered(true); }}
        onMouseLeave={() => setHovered(false)}
        {...props}
      >
        {header && (
          <div className={styles.header}>
            {header}
          </div>
        )}
        <div className={styles.nav}>
          {items.map((item) => renderItem(item))}
        </div>
        <div className={styles.footer}>
          {footer}
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span
              className={cn(styles.toggleIcon, collapsed && styles.toggleIconCollapsed)}
              aria-hidden="true"
            >
              ◀
            </span>
          </button>
        </div>
      </nav>
    );
  },
);

Sidebar.displayName = 'Sidebar';
