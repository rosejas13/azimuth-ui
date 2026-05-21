'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './Tabs.module.css';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  tabs: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  /** @default 'underline' */
  variant?: 'underline' | 'pills' | 'buttons';
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      defaultTab,
      activeTab: controlledTab,
      onChange,
      variant = 'underline',
      className,
      ...props
    },
    ref,
  ) => {
    const id = useId();
    const isControlled = controlledTab !== undefined;
    const firstEnabledTab = tabs.find((t) => !t.disabled)?.id ?? tabs[0]?.id ?? '';
    const initialTab = controlledTab ?? defaultTab ?? firstEnabledTab;

    const [internalTab, setInternalTab] = useState(initialTab);
    const activeId = isControlled ? controlledTab : internalTab;

    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const panelRef = useRef<HTMLDivElement>(null);

    const selectTab = useCallback(
      (tabId: string) => {
        const tab = tabs.find((t) => t.id === tabId);
        if (!tab || tab.disabled) return;

        if (!isControlled) {
          setInternalTab(tabId);
        }
        onChange?.(tabId);
      },
      [isControlled, onChange, tabs],
    );

    useEffect(() => {
      if (!isControlled) {
        if (!tabs.some((t) => t.id === internalTab && !t.disabled)) {
          const enabled = tabs.find((t) => !t.disabled);
          if (enabled) {
            setInternalTab(enabled.id);
          }
        }
      }
    }, [tabs, internalTab, isControlled]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const enabledTabs = tabs.filter((t) => !t.disabled);
        const currentIndex = enabledTabs.findIndex((t) => t.id === activeId);

        let nextIndex = -1;

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            nextIndex = currentIndex <= 0 ? enabledTabs.length - 1 : currentIndex - 1;
            break;
          case 'ArrowRight':
            e.preventDefault();
            nextIndex = currentIndex >= enabledTabs.length - 1 ? 0 : currentIndex + 1;
            break;
          case 'Home':
            e.preventDefault();
            nextIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            nextIndex = enabledTabs.length - 1;
            break;
          default:
            return;
        }

        if (nextIndex >= 0 && nextIndex < enabledTabs.length) {
          const nextTab = enabledTabs[nextIndex];
          selectTab(nextTab.id);
          tabRefs.current.get(nextTab.id)?.focus();
        }
      },
      [activeId, selectTab, tabs],
    );

    const activeTabData = tabs.find((t) => t.id === activeId);

    return (
      <div
        ref={ref}
        className={cn(styles.tabs, styles[variant], className)}
        {...props}
      >
        <div role="tablist" className={styles.tabList}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            const tabId = `${id}-tab-${tab.id}`;
            const panelId = `${id}-panel-${tab.id}`;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) {
                    tabRefs.current.set(tab.id, el);
                  } else {
                    tabRefs.current.delete(tab.id);
                  }
                }}
                id={tabId}
                type="button"
                role="tab"
                className={cn(
                  styles.tab,
                  isActive && styles.tabActive,
                  tab.disabled && styles.tabDisabled,
                )}
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                disabled={tab.disabled}
                onClick={() => selectTab(tab.id)}
                onKeyDown={handleKeyDown}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        {activeTabData && (
          <div
            ref={panelRef}
            id={`${id}-panel-${activeTabData.id}`}
            role="tabpanel"
            className={styles.tabPanel}
            aria-labelledby={`${id}-tab-${activeTabData.id}`}
            tabIndex={0}
          >
            {activeTabData.content}
          </div>
        )}
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';
