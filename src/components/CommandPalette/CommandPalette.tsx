'use client';

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import styles from './CommandPalette.module.css';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  keywords?: string[];
}

export interface CommandGroup {
  id: string;
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onSelect'> {
  open: boolean;
  onClose: () => void;
  groups: CommandGroup[];
  onSelect: (item: CommandItem) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onClose,
      groups,
      onSelect,
      placeholder = 'Search commands...',
      emptyMessage = 'No results found',
      className,
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = useMemo(() => {
      if (!query.trim()) return groups;
      const q = query.toLowerCase();
      return groups
        .map((g) => ({
          ...g,
          items: g.items.filter((item) => {
            if (item.label.toLowerCase().includes(q)) return true;
            if (item.keywords) {
              return item.keywords.some((k) =>
                k.toLowerCase().includes(q),
              );
            }
            return false;
          }),
        }))
        .filter((g) => g.items.length > 0);
    }, [query, groups]);

    const flatItems = useMemo(
      () => filtered.flatMap((g) => g.items),
      [filtered],
    );

    useEffect(() => {
      setActiveIndex(0);
    }, [query]);

    useEffect(() => {
      if (open) {
        const id = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(id);
      }
    }, [open]);

    useEffect(() => {
      if (!open) {
        setQuery('');
        setActiveIndex(0);
      }
    }, [open]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex((prev) =>
              prev < flatItems.length - 1 ? prev + 1 : 0,
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveIndex((prev) =>
              prev > 0 ? prev - 1 : flatItems.length - 1,
            );
            break;
          case 'Enter':
            e.preventDefault();
            if (flatItems[activeIndex]) {
              onSelect(flatItems[activeIndex]);
              onClose();
            }
            break;
          case 'Escape':
            e.preventDefault();
            onClose();
            break;
        }
      },
      [flatItems, activeIndex, onSelect, onClose],
    );

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
      },
      [onClose],
    );

    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      },
      [onClose],
    );

    useEffect(() => {
      if (!open) return;
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, handleEscape]);

    if (!open) return null;

    let itemCounter = 0;

    return createPortal(
      <div
        ref={ref}
        className={cn(styles.overlay, className)}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        {...props}
      >
        <div className={styles.panel} role="listbox" aria-label="Commands">
          <div className={styles.searchWrapper}>
            <input
              ref={inputRef}
              type="text"
              className={styles.search}
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-activedescendant={
                flatItems[activeIndex]
                  ? `cmd-item-${flatItems[activeIndex].id}`
                  : undefined
              }
              aria-label="Search commands"
            />
          </div>
          <div className={styles.results}>
            {flatItems.length === 0 ? (
              <div className={styles.empty} role="status">
                {emptyMessage}
              </div>
            ) : (
              filtered.map((group) => (
                <div
                  key={group.id}
                  className={styles.group}
                  role="group"
                  aria-label={group.label}
                >
                  <div className={styles.groupLabel}>{group.label}</div>
                  {group.items.map((item) => {
                    const currentIndex = itemCounter++;
                    const isActive = currentIndex === activeIndex;
                    return (
                      <div
                        key={item.id}
                        id={`cmd-item-${item.id}`}
                        className={cn(
                          styles.item,
                          isActive && styles.itemActive,
                        )}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          onSelect(item);
                          onClose();
                        }}
                        onMouseEnter={() =>
                          setActiveIndex(currentIndex)
                        }
                      >
                        {item.icon && (
                          <span
                            className={styles.itemIcon}
                            aria-hidden="true"
                          >
                            {item.icon}
                          </span>
                        )}
                        <span className={styles.itemLabel}>
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <kbd className={styles.shortcut}>
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

CommandPalette.displayName = 'CommandPalette';
