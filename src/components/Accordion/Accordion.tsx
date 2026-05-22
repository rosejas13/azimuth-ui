'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useState,
  useCallback,
  useId,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface AccordionProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onToggle'> {
  items: AccordionItem[];
  defaultOpen?: string;
  onToggle?: (itemId: string) => void;
  variant?: 'default' | 'bordered';
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      defaultOpen,
      onToggle,
      variant = 'default',
      className,
      ...props
    },
    ref,
  ) => {
    const [openId, setOpenId] = useState<string | undefined>(defaultOpen);
    const baseId = useId();

    const handleToggle = useCallback(
      (id: string) => {
        setOpenId((prev) => (prev === id ? undefined : id));
        onToggle?.(id);
      },
      [onToggle],
    );

    return (
      <div
        ref={ref}
        className={cn(styles.root, styles[variant], className)}
        {...props}
      >
        {items.map((item) => {
          const isOpen = openId === item.id;
          const headerId = `${baseId}-header-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <div
              key={item.id}
              className={cn(styles.item, isOpen && styles.itemOpen, item.disabled && styles.itemDisabled)}
            >
              <h3 className={styles.header}>
                <button
                  type="button"
                  id={headerId}
                  className={styles.trigger}
                  role="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  disabled={item.disabled}
                  onClick={() => handleToggle(item.id)}
                >
                  {item.icon && (
                    <span className={styles.icon} aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className={styles.title}>{item.title}</span>
                  <span
                    className={cn(styles.chevron, isOpen && styles.chevronOpen)}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={cn(styles.contentWrapper, isOpen && styles.contentOpen)}
              >
                <div className={styles.contentInner}>
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';
