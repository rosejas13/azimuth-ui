'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Sidebar.module.css';

/**
 * A single item in the sidebar navigation.
 */
export interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
}

/**
 * Props for the Sidebar component.
 */
export interface SidebarProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onSelect'> {
  items: SidebarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  header?: ReactNode;
  footer?: ReactNode;
}

/**
 * A collapsible sidebar navigation with nested item support, expandable sections,
 * and a toggle button.
 *
 * When collapsed, items show only icons; hovering temporarily expands the sidebar.
 */
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
    const navRef = useRef<HTMLElement>(null);

    const setNavRef = useCallback(
      (node: HTMLElement | null) => {
        navRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref).current = node;
        }
      },
      [ref],
    );

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

    useEffect(() => {
      const el = navRef.current;
      if (!el) return;

      const handleMouseEnter = () => {
        if (collapsed) setHovered(true);
      };
      const handleMouseLeave = () => setHovered(false);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const focusable = el.querySelectorAll('button');
          const currentIndex = Array.from(focusable).findIndex((f) => f === document.activeElement);
          let nextIndex: number;
          if (e.key === 'ArrowDown') {
            nextIndex = currentIndex < focusable.length - 1 ? currentIndex + 1 : 0;
          } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
          }
          (focusable[nextIndex] as HTMLElement).focus();
        }
      };

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('keydown', handleKeyDown);
      return () => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('keydown', handleKeyDown);
      };
    }, [collapsed]);

    return (
      <nav
        ref={setNavRef}
        className={cn(
          styles.sidebar,
          isExpanded ? styles.expanded : styles.collapsed,
          className,
        )}
        tabIndex={-1}
        {...props}
      >
        {header && (
          <div className={styles.header}>
            {header}
          </div>
        )}
        <div className={styles.nav}>
          {(items ?? []).map((item) => renderItem(item))}
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
