'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Menu.module.css';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

export interface MenuProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onSelect'> {
  items: MenuItem[];
  trigger?: React.ReactNode;
  onSelect?: (key: string) => void;
  /** @default 'left' */
  side?: 'left' | 'right';
}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      items,
      trigger,
      onSelect,
      side = 'left',
      className,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const activeIndexRef = useRef(0);

    activeIndexRef.current = activeIndex;

    const clickableItems = (items ?? []).filter((item) => !item.separator);

    const close = useCallback(() => {
      setOpen(false);
      setActiveIndex(0);
    }, []);

    const updatePosition = useCallback(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const gap = 4;
      if (side === 'right') {
        setPanelStyle({
          position: 'fixed',
          top: rect.bottom + gap,
          left: rect.right,
          transform: 'translateX(-100%)',
          zIndex: 1200,
        });
      } else {
        setPanelStyle({
          position: 'fixed',
          top: rect.bottom + gap,
          left: rect.left,
          zIndex: 1200,
        });
      }
    }, [side]);

    const handleSelect = useCallback(
      (item: MenuItem) => {
        if (item.disabled || item.separator) return;
        onSelect?.(item.key);
        close();
      },
      [onSelect, close],
    );

    const onItemKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex((prev) => {
              const next = prev < clickableItems.length - 1 ? prev + 1 : 0;
              const nextItem = clickableItems[next];
              if (nextItem) {
                itemRefs.current.get(nextItem.key)?.focus();
              }
              return next;
            });
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveIndex((prev) => {
              const next = prev > 0 ? prev - 1 : clickableItems.length - 1;
              const nextItem = clickableItems[next];
              if (nextItem) {
                itemRefs.current.get(nextItem.key)?.focus();
              }
              return next;
            });
            break;
          case 'Enter':
            e.preventDefault();
            {
              const current = clickableItems[activeIndexRef.current];
              if (current) {
                handleSelect(current);
              }
            }
            break;
          case 'Escape':
            e.preventDefault();
            close();
            break;
          case 'Home':
            e.preventDefault();
            {
              const first = clickableItems[0];
              if (first) {
                setActiveIndex(0);
                itemRefs.current.get(first.key)?.focus();
              }
            }
            break;
          case 'End':
            e.preventDefault();
            {
              const last = clickableItems[clickableItems.length - 1];
              if (last) {
                setActiveIndex(clickableItems.length - 1);
                itemRefs.current.get(last.key)?.focus();
              }
            }
            break;
          default:
            break;
        }
      },
      [clickableItems, handleSelect, close],
    );

    const onItemKeyDownRef = useRef(onItemKeyDown);
    onItemKeyDownRef.current = onItemKeyDown;

    useEffect(() => {
      if (!open) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          close();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      const timer = setTimeout(() => {
        const firstItem = clickableItems[0];
        if (firstItem) {
          setActiveIndex(0);
          itemRefs.current.get(firstItem.key)?.focus();
        }
      }, 0);

      const positionHandler = () => updatePosition();
      window.addEventListener('scroll', positionHandler, true);
      window.addEventListener('resize', positionHandler);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        clearTimeout(timer);
        window.removeEventListener('scroll', positionHandler, true);
        window.removeEventListener('resize', positionHandler);
      };
    }, [open, close, clickableItems, updatePosition]);

    const handleOpen = useCallback(() => {
      updatePosition();
      setOpen(true);
    }, [updatePosition]);

    const handleToggle = useCallback(() => {
      if (!open) {
        updatePosition();
      }
      setOpen((prev) => !prev);
    }, [open, updatePosition]);

    const handleTriggerKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          if (!open) {
            handleOpen();
          }
        }
      },
      [open, handleOpen],
    );

    const handleItemMouseEnter = useCallback(
      (item: MenuItem) => {
        const idx = clickableItems.indexOf(item);
        if (idx >= 0) {
          setActiveIndex(idx);
        }
      },
      [clickableItems],
    );

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    return (
      <div
        ref={setRefs}
        className={cn(styles.container, className)}
        {...props}
      >
        {trigger ? (
          <div
            role="button"
            tabIndex={0}
            className={styles.trigger}
            onClick={handleToggle}
            onKeyDown={handleTriggerKeyDown}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {trigger}
          </div>
        ) : (
          <button
            type="button"
            className={styles.trigger}
            onClick={handleToggle}
            onKeyDown={handleTriggerKeyDown}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Open menu"
          >
            &#x22EE;
          </button>
        )}

        {open && (
          <div style={panelStyle}>
            <div className={styles.panel} role="menu">
            {(items ?? []).map((item) => {
              if (item.separator) {
                return (
                  <div
                    key={item.key}
                    className={styles.separator}
                    role="separator"
                  />
                );
              }

              return (
                <button
                  key={item.key}
                  ref={(el) => {
                    if (el) {
                      itemRefs.current.set(item.key, el);
                    } else {
                      itemRefs.current.delete(item.key);
                    }
                  }}
                  type="button"
                  className={cn(
                    styles.item,
                    item.danger && styles.itemDanger,
                    item.disabled && styles.itemDisabled,
                  )}
                  role="menuitem"
                  aria-disabled={item.disabled || undefined}
                  tabIndex={item.disabled ? -1 : 0}
                  disabled={item.disabled}
                  onClick={() => handleSelect(item)}
                  onKeyDown={(e) => onItemKeyDownRef.current(e)}
                  onMouseEnter={() => handleItemMouseEnter(item)}
                >
                  {item.icon && (
                    <span className={styles.itemIcon}>{item.icon}</span>
                  )}
                  <span className={styles.itemLabel}>{item.label}</span>
                </button>
              );
            })}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Menu.displayName = 'Menu';
