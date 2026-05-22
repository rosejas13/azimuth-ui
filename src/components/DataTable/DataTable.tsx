'use client';

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useState,
  useCallback,
  useMemo,
  useId,
  useRef,
  useEffect,
} from 'react';
import { cn } from '@/utils/cn';
import { Loader } from '@/components/Loader';
import { Table } from '@/components/Table';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  title: string;
  /** @default false */
  sortable?: boolean;
  /** @default true */
  searchable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T>
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  /** @default 'No data available' */
  emptyMessage?: string;
  pageSize?: number;
  /** @default 10 */
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  /** @default false */
  searchable?: boolean;
  /** @default 'Search...' */
  searchPlaceholder?: string;
  searchColumns?: string[];
  /** @default false */
  searchColumnSelector?: boolean;
  actions?: React.ReactNode;
  /** @default false */
  editable?: boolean;
  onEdit?: (row: T, index: number) => void;
  onRowClick?: (row: T, index: number) => void;
  onSearch?: (query: string) => void;
  /** @default false */
  loading?: boolean;
  error?: string;
}

type SortDirection = 'asc' | 'desc';

interface SortState {
  key: string;
  direction: SortDirection;
}

interface IndexedRow<T> {
  row: T;
  index: number;
}

function getCellValue(row: unknown, key: string): string {
  const value = (row as Record<string, unknown>)[key];
  if (value === null || value === undefined) return '';
  return String(value);
}

function DataTableInner<T>(
  {
    title,
    columns,
    data,
    emptyMessage = 'No data available',
    pageSize: controlledPageSize,
    defaultPageSize = 10,
    pageSizeOptions,
    searchable = false,
    searchPlaceholder = 'Search...',
    searchColumns,
    searchColumnSelector = false,
    actions,
    editable = false,
    onEdit,
    onRowClick,
    onSearch,
    loading = false,
    error,
    className,
    ...props
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const id = useId();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchColumns, setSelectedSearchColumns] = useState<Set<string>>(new Set(['all']));
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const columnDropdownRef = useRef<HTMLDivElement>(null);
  const [sortState, setSortState] = useState<SortState | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const isPageSizeControlled = controlledPageSize !== undefined;
  const [internalPageSize, setInternalPageSize] = useState(
    controlledPageSize ?? defaultPageSize,
  );
  const currentPageSize = isPageSizeControlled ? controlledPageSize : internalPageSize;

  const allSearchableCols = useMemo(() => {
    if (searchColumns) return searchColumns;
    return columns.filter((c) => c.searchable !== false).map((c) => c.key);
  }, [columns, searchColumns]);

  const searchableCols = useMemo(() => {
    if (onSearch) return [];
    if (selectedSearchColumns.has('all')) return allSearchableCols;
    return allSearchableCols.filter((c) => selectedSearchColumns.has(c));
  }, [onSearch, selectedSearchColumns, allSearchableCols]);

  const allRows: IndexedRow<T>[] = useMemo(
    () => data.map((row, i) => ({ row, index: i })),
    [data],
  );

  const filteredRows = useMemo(() => {
    if (onSearch) return allRows;
    if (!searchQuery.trim()) return allRows;
    const q = searchQuery.toLowerCase();
    return allRows.filter(({ row }) =>
      searchableCols.some((key) => {
        const val = getCellValue(row, key).toLowerCase();
        return val.includes(q);
      }),
    );
  }, [allRows, searchQuery, searchableCols, onSearch]);

  const sortedRows = useMemo(() => {
    if (!sortState) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = getCellValue(a.row, sortState.key);
      const bVal = getCellValue(b.row, sortState.key);
      const comparison = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredRows, sortState]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / currentPageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * currentPageSize;
    return sortedRows.slice(start, start + currentPageSize);
  }, [sortedRows, safeCurrentPage, currentPageSize]);

  const startIndex = sortedRows.length === 0 ? 0 : (safeCurrentPage - 1) * currentPageSize + 1;
  const endIndex = Math.min(safeCurrentPage * currentPageSize, sortedRows.length);

  const handleSort = useCallback(
    (key: string) => {
      setSortState((prev) => {
        if (!prev || prev.key !== key) {
          return { key, direction: 'asc' as const };
        }
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' as const };
        }
        return null;
      });
      setCurrentPage(1);
    },
    [],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      setSearchQuery(q);
      setCurrentPage(1);
      onSearch?.(q);
    },
    [onSearch],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const size = Number(e.target.value);
      if (!isPageSizeControlled) {
        setInternalPageSize(size);
      }
      setCurrentPage(1);
    },
    [isPageSizeControlled],
  );

  const handleRowClick = useCallback(
    (rowIndex: number) => {
      if (!onRowClick) return;
      const { row, index } = paginatedRows[rowIndex];
      onRowClick(row, index);
    },
    [onRowClick, paginatedRows],
  );

  const handleEdit = useCallback(
    (rowIndex: number) => {
      if (!onEdit) return;
      const { row, index } = paginatedRows[rowIndex];
      onEdit(row, index);
    },
    [onEdit, paginatedRows],
  );

  const showSearch = searchable || onSearch !== undefined;
  const showColumnSelector = searchColumnSelector && showSearch && !onSearch;
  const hasHeader = !!(title || showSearch || actions);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(e.target as Node)) {
        setShowColumnDropdown(false);
      }
    }
    if (showColumnDropdown) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showColumnDropdown]);

  function toggleSearchColumn(columnKey: string) {
    setSelectedSearchColumns((prev) => {
      const next = new Set(prev);
      if (columnKey === 'all') {
        if (next.has('all')) {
          next.clear();
        } else {
          next.clear();
          next.add('all');
        }
      } else {
        next.delete('all');
        if (next.has(columnKey)) next.delete(columnKey);
        else next.add(columnKey);
        if (next.size === 0) next.add('all');
      }
      return next;
    });
  }

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  const showPagination =
    totalPages > 1 || (pageSizeOptions && pageSizeOptions.length > 0);

  if (loading) {
    return (
      <div ref={ref} className={cn(styles.wrapper, className)} {...props}>
        {hasHeader && (
          <div className={styles.header}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.headerActions}>
              {showSearch && (
                <>
                  <input
                    type="text"
                    className={styles.search}
                    placeholder={searchPlaceholder}
                    disabled
                    aria-label="Search"
                  />
                  {showColumnSelector && (
                    <button className={cn(styles.columnSelectBtn)} disabled aria-label="Search columns">
                      All columns ▼
                    </button>
                  )}
                </>
              )}
              {actions}
            </div>
          </div>
        )}
        <div className={styles.loadingState} role="status" aria-label="Loading data">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={ref} className={cn(styles.wrapper, className)} {...props}>
        {hasHeader && (
          <div className={styles.header}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.headerActions}>
              {showSearch && (
                <>
                  <input
                    type="text"
                    className={styles.search}
                    placeholder={searchPlaceholder}
                    disabled
                    aria-label="Search"
                  />
                  {showColumnSelector && (
                    <button className={cn(styles.columnSelectBtn)} disabled aria-label="Search columns">
                      All columns ▼
                    </button>
                  )}
                </>
              )}
              {actions}
            </div>
          </div>
        )}
        <div className={styles.errorState} role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn(styles.wrapper, className)} {...props}>
      {hasHeader && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.headerActions}>
              {showSearch && (
                <>
                  <input
                    type="text"
                    className={styles.search}
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search"
                  />
                  {showColumnSelector && (
                    <div ref={columnDropdownRef} className={styles.columnDropdown}>
                      <button
                        className={cn(styles.columnSelectBtn, showColumnDropdown && styles.columnSelectOpen)}
                        onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                        aria-label="Select columns to search"
                      >
                        {selectedSearchColumns.has('all') ? 'All columns' : `${selectedSearchColumns.size} column(s)`} ▼
                      </button>
                      {showColumnDropdown && (
                        <div className={styles.columnDropdownMenu}>
                          <label className={styles.columnOption}>
                            <input type="checkbox" checked={selectedSearchColumns.has('all')} onChange={() => toggleSearchColumn('all')} />
                            All
                          </label>
                          {allSearchableCols.map((key) => {
                            const col = columns.find((c) => c.key === key);
                            return (
                              <label key={key} className={styles.columnOption}>
                                <input type="checkbox" checked={selectedSearchColumns.has(key)} onChange={() => toggleSearchColumn(key)} />
                                {col?.title ?? key}
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              {actions}
            </div>
        </div>
      )}

      {paginatedRows.length > 0 ? (
        <>
          <div className={styles.scrollWrapper}>
            <Table striped hoverable={!!onRowClick}>
              <Table.Head>
                <Table.Row>
                  {columns.map((col) => {
                    const isSortable = col.sortable ?? false;
                    const isActive = sortState?.key === col.key;
                    return (
                      <Table.HeadCell
                        key={col.key}
                        className={cn(isSortable && styles.thSortable)}
                        scope="col"
                        aria-sort={
                          isActive
                            ? sortState.direction === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : undefined
                        }
                        onClick={
                          isSortable ? () => handleSort(col.key) : undefined
                        }
                        onKeyDown={
                          isSortable
                            ? (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSort(col.key);
                                }
                              }
                            : undefined
                        }
                        tabIndex={isSortable ? 0 : undefined}
                      >
                        <span className={styles.thContent}>
                          {col.title}
                          {isSortable && (
                            <span
                              className={cn(
                                styles.sortIndicator,
                                isActive && styles.sortIndicatorActive,
                              )}
                              aria-hidden="true"
                            >
                              {isActive && sortState.direction === 'asc'
                                ? '\u25B2'
                                : '\u25BC'}
                            </span>
                          )}
                        </span>
                      </Table.HeadCell>
                    );
                  })}
                  {editable && (
                    <Table.HeadCell scope="col">
                      <span className="sr-only">Actions</span>
                    </Table.HeadCell>
                  )}
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {paginatedRows.map(({ row, index }, rowIndex) => (
                  <Table.Row
                    key={index}
                    className={cn(
                      onRowClick && styles.trClickable,
                    )}
                    onClick={
                      onRowClick
                        ? () => handleRowClick(rowIndex)
                        : undefined
                    }
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleRowClick(rowIndex);
                            }
                          }
                        : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    role={onRowClick ? 'button' : undefined}
                  >
                    {columns.map((col) => (
                      <Table.Cell key={col.key}>
                        {col.render
                          ? col.render((row as Record<string, unknown>)[col.key], row, index)
                          : getCellValue(row, col.key)}
                      </Table.Cell>
                    ))}
                    {editable && (
                      <Table.Cell>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(rowIndex);
                          }}
                          aria-label={`Edit row ${index + 1}`}
                        >
                          {'\u270E'}
                        </button>
                      </Table.Cell>
                    )}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          {showPagination && (
            <div className={styles.pagination}>
              <div className={styles.resultsInfo}>
                Showing {startIndex}&ndash;{endIndex} of {sortedRows.length}{' '}
                results
              </div>

              <div className={styles.paginationControls}>
                {pageSizeOptions && pageSizeOptions.length > 0 && (
                  <div className={styles.pageSizeSelector}>
                    <label
                      className={styles.pageSizeLabel}
                      htmlFor={`${id}-page-size`}
                    >
                      Per page
                    </label>
                    <select
                      id={`${id}-page-size`}
                      className={styles.pageSizeSelect}
                      value={currentPageSize}
                      onChange={handlePageSizeChange}
                    >
                      {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={styles.pageNumbers}>
                  <button
                    type="button"
                    className={cn(
                      styles.pageBtn,
                      safeCurrentPage <= 1 && styles.pageBtnDisabled,
                    )}
                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                    disabled={safeCurrentPage <= 1}
                    aria-label="Previous page"
                  >
                    {'\u2039'}
                  </button>
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={cn(
                        styles.pageBtn,
                        page === safeCurrentPage && styles.pageBtnActive,
                      )}
                      onClick={() => handlePageChange(page)}
                      aria-current={
                        page === safeCurrentPage ? 'page' : undefined
                      }
                      aria-label={`Page ${page}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={cn(
                      styles.pageBtn,
                      safeCurrentPage >= totalPages && styles.pageBtnDisabled,
                    )}
                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                    disabled={safeCurrentPage >= totalPages}
                    aria-label="Next page"
                  >
                    {'\u203A'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState} role="status">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export const DataTable = forwardRef(DataTableInner) as (<T>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement) & { displayName?: string };

DataTable.displayName = 'DataTable';
