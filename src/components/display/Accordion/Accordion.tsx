'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useState,
  useCallback,
  useId,
  useRef,
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
  multiple?: boolean;
  onToggle?: (itemId: string) => void;
  variant?: 'default' | 'bordered';
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      defaultOpen,
      multiple = false,
      onToggle,
      variant = 'default',
      className,
      ...props
    },
    ref,
  ) => {
    const [openIds, setOpenIds] = useState<Set<string>>(
      () => new Set<string>(defaultOpen ? [defaultOpen] : []),
    );
    const baseId = useId();
    const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const handleTriggerKeyDown = useCallback(
      (e: React.KeyboardEvent, itemId: string) => {
        const enabledItems = items.filter(i => !i.disabled);
        const currentIndex = enabledItems.findIndex(i => i.id === itemId);
        let nextIndex = -1;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            nextIndex = currentIndex >= enabledItems.length - 1 ? 0 : currentIndex + 1;
            break;
          case 'ArrowUp':
            e.preventDefault();
            nextIndex = currentIndex <= 0 ? enabledItems.length - 1 : currentIndex - 1;
            break;
          case 'Home':
            e.preventDefault();
            nextIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            nextIndex = enabledItems.length - 1;
            break;
          default:
            return;
        }

        if (nextIndex >= 0) {
          const nextItem = enabledItems[nextIndex];
          triggerRefs.current.get(nextItem.id)?.focus();
        }
      },
      [items],
    );

    const handleToggle = useCallback(
      (id: string) => {
        if (multiple) {
          setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
              next.delete(id);
            } else {
              next.add(id);
            }
            return next;
          });
        } else {
          setOpenIds((prev) => {
            if (prev.has(id)) return new Set();
            return new Set([id]);
          });
        }
        onToggle?.(id);
      },
      [multiple, onToggle],
    );

    return (
      <div
        ref={ref}
        className={cn(styles.root, styles[variant], className)}
        {...props}
      >
        {(items ?? []).map((item) => {
          const isOpen = openIds.has(item.id);
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
                  ref={(el) => {
                    if (el) triggerRefs.current.set(item.id, el);
                    else triggerRefs.current.delete(item.id);
                  }}
                  onKeyDown={(e) => handleTriggerKeyDown(e, item.id)}
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
