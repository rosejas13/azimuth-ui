'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './DataFilterBar.module.css';

/** A single filter definition describing an available column filter. */
export interface FilterDefinition {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: Array<{ label: string; value: string }>;
}

/** A currently active filter value. */
export interface ActiveFilter {
  id: string;
  value: string;
}

/** Sort configuration with field and direction. */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/** Props for the DataFilterBar component. */
export interface DataFilterBarProps extends ComponentPropsWithoutRef<'div'> {
  /** Available filter definitions shown as dropdowns. */
  filters?: FilterDefinition[];
  /** Currently active filters displayed as chips. */
  activeFilters?: ActiveFilter[];
  /** Called when active filters change. */
  onFilterChange?: (filters: ActiveFilter[]) => void;
  /** Current sort configuration. */
  sort?: SortConfig;
  /** Called when sort configuration changes. */
  onSortChange?: (sort: SortConfig | undefined) => void;
  /** Available sort field options. */
  sortFields?: Array<{ label: string; value: string }>;
  /** Search text value. */
  search?: string;
  /** Called when search text changes. */
  onSearchChange?: (search: string) => void;
  /** Total result count displayed on the right. */
  resultCount?: number;
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="4.5" />
      <line x1="9.5" y1="9.5" x2="13" y2="13" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 5.25 L7 8.75 L10.5 5.25" />
    </svg>
  );
}

function SortAscIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 9 L7 5 L9.5 9" />
    </svg>
  );
}

function SortDescIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 5 L7 9 L9.5 5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="2" y1="2" x2="8" y2="8" />
      <line x1="8" y1="2" x2="2" y2="8" />
    </svg>
  );
}

/** A horizontal filter bar for data tables. Provides search input, filter dropdowns, sort controls, active filter chips, and result count display. */
export const DataFilterBar = forwardRef<HTMLDivElement, DataFilterBarProps>(
  (
    {
      filters,
      activeFilters: controlledFilters,
      onFilterChange,
      sort: controlledSort,
      onSortChange,
      sortFields,
      search: controlledSearch,
      onSearchChange,
      resultCount,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalSearch, setInternalSearch] = useState('');
    const [internalFilters, setInternalFilters] = useState<ActiveFilter[]>([]);
    const [internalSort, setInternalSort] = useState<SortConfig | undefined>();

    const currentSearch =
      controlledSearch !== undefined ? controlledSearch : internalSearch;
    const currentFilters =
      controlledFilters !== undefined ? controlledFilters : internalFilters;
    const currentSort =
      controlledSort !== undefined ? controlledSort : internalSort;

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (controlledSearch === undefined) {
          setInternalSearch(value);
        }
        onSearchChange?.(value);
      },
      [controlledSearch, onSearchChange],
    );

    const updateFilters = useCallback(
      (next: ActiveFilter[]) => {
        if (controlledFilters === undefined) {
          setInternalFilters(next);
        }
        onFilterChange?.(next);
      },
      [controlledFilters, onFilterChange],
    );

    const handleFilterSelect = useCallback(
      (filterId: string, value: string) => {
        const existing = currentFilters.find((f) => f.id === filterId);
        let next: ActiveFilter[];
        if (value === '') {
          next = currentFilters.filter((f) => f.id !== filterId);
        } else if (existing) {
          next = currentFilters.map((f) =>
            f.id === filterId ? { id: filterId, value } : f,
          );
        } else {
          next = [...currentFilters, { id: filterId, value }];
        }
        updateFilters(next);
      },
      [currentFilters, updateFilters],
    );

    const handleRemoveFilter = useCallback(
      (filterId: string) => {
        const next = currentFilters.filter((f) => f.id !== filterId);
        updateFilters(next);
      },
      [currentFilters, updateFilters],
    );

    const handleSortFieldChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === '') {
          if (controlledSort === undefined) {
            setInternalSort(undefined);
          }
          onSortChange?.(undefined);
        } else {
          const next: SortConfig = { field: value, direction: 'asc' };
          if (controlledSort === undefined) {
            setInternalSort(next);
          }
          onSortChange?.(next);
        }
      },
      [controlledSort, onSortChange],
    );

    const handleSortDirectionToggle = useCallback(() => {
      if (!currentSort) return;
      const next: SortConfig = {
        field: currentSort.field,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
      };
      if (controlledSort === undefined) {
        setInternalSort(next);
      }
      onSortChange?.(next);
    }, [currentSort, controlledSort, onSortChange]);

    return (
      <div
        ref={ref}
        className={cn(styles.bar, className)}
        role="toolbar"
        aria-label="Filter controls"
        {...props}
      >
        <div className={styles.controlsRow}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>
              <SearchIcon />
            </span>
            <input
              type="search"
              className={styles.searchInput}
              value={currentSearch}
              onChange={handleSearchChange}
              placeholder="Search..."
              aria-label="Search"
            />
          </div>

          {filters?.map((filter) => (
            <div key={filter.id} className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={
                  currentFilters.find((f) => f.id === filter.id)?.value ?? ''
                }
                onChange={(e) => handleFilterSelect(filter.id, e.target.value)}
                aria-label={filter.label}
              >
                <option value="">All {filter.label}</option>
                {filter.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className={styles.selectChevron}>
                <ChevronDownIcon />
              </span>
            </div>
          ))}

          {sortFields && sortFields.length > 0 && (
            <div className={styles.sortGroup}>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={currentSort?.field ?? ''}
                  onChange={handleSortFieldChange}
                  aria-label="Sort by"
                >
                  <option value="">Sort by...</option>
                  {sortFields.map((sf) => (
                    <option key={sf.value} value={sf.value}>
                      {sf.label}
                    </option>
                  ))}
                </select>
                <span className={styles.selectChevron}>
                  <ChevronDownIcon />
                </span>
              </div>
              {currentSort && (
                <button
                  type="button"
                  className={styles.sortDirectionBtn}
                  onClick={handleSortDirectionToggle}
                  aria-label={`Sort ${currentSort.direction === 'asc' ? 'ascending' : 'descending'}`}
                >
                  {currentSort.direction === 'asc' ? (
                    <SortAscIcon />
                  ) : (
                    <SortDescIcon />
                  )}
                </button>
              )}
            </div>
          )}

          {resultCount !== undefined && (
            <span className={styles.resultCount}>
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {currentFilters.length > 0 && (
          <div className={styles.chipsRow}>
            {currentFilters.map((af) => {
              const def = filters?.find((f) => f.id === af.id);
              return (
                <span key={af.id} className={styles.chip}>
                  <span className={styles.chipLabel}>
                    {def?.label ?? af.id}: {af.value}
                  </span>
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={() => handleRemoveFilter(af.id)}
                    aria-label={`Remove ${def?.label ?? af.id} filter`}
                  >
                    <XIcon />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

DataFilterBar.displayName = 'DataFilterBar';
