import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DataFilterBar } from '../DataFilterBar';
import type { FilterDefinition } from '../DataFilterBar';

const mockFilters: FilterDefinition[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { label: 'Tech', value: 'tech' },
      { label: 'Design', value: 'design' },
    ],
  },
];

describe('DataFilterBar', () => {
  it('renders search input', () => {
    render(<DataFilterBar />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders filter dropdowns from definitions', () => {
    render(<DataFilterBar filters={mockFilters} />);
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('renders active filter chips', () => {
    render(
      <DataFilterBar
        filters={mockFilters}
        activeFilters={[{ id: 'status', value: 'active' }]}
      />,
    );
    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    expect(screen.getByText('Status: active')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<DataFilterBar onSearchChange={onSearchChange} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'hello');
    expect(onSearchChange).toHaveBeenCalledWith('hello');
  });

  it('calls onFilterChange when selecting a filter value', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <DataFilterBar filters={mockFilters} onFilterChange={onFilterChange} />,
    );

    const statusSelect = screen.getByLabelText('Status');
    await user.selectOptions(statusSelect, 'active');
    expect(onFilterChange).toHaveBeenCalledWith([
      { id: 'status', value: 'active' },
    ]);
  });

  it('removes filter when chip remove is clicked', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <DataFilterBar
        filters={mockFilters}
        activeFilters={[{ id: 'status', value: 'active' }]}
        onFilterChange={onFilterChange}
      />,
    );

    const removeBtn = screen.getByLabelText('Remove Status filter');
    await user.click(removeBtn);
    expect(onFilterChange).toHaveBeenCalledWith([]);
  });

  it('renders sort dropdown when sortFields provided', () => {
    render(
      <DataFilterBar
        sortFields={[
          { label: 'Name', value: 'name' },
          { label: 'Date', value: 'date' },
        ]}
      />,
    );
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
  });

  it('calls onSortChange when sort field selected', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataFilterBar
        sortFields={[
          { label: 'Name', value: 'name' },
          { label: 'Date', value: 'date' },
        ]}
        onSortChange={onSortChange}
      />,
    );

    const sortSelect = screen.getByLabelText('Sort by');
    await user.selectOptions(sortSelect, 'name');
    expect(onSortChange).toHaveBeenCalledWith({
      field: 'name',
      direction: 'asc',
    });
  });

  it('toggles sort direction', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataFilterBar
        sort={{ field: 'name', direction: 'asc' }}
        sortFields={[{ label: 'Name', value: 'name' }]}
        onSortChange={onSortChange}
      />,
    );

    const directionBtn = screen.getByLabelText('Sort ascending');
    await user.click(directionBtn);
    expect(onSortChange).toHaveBeenCalledWith({
      field: 'name',
      direction: 'desc',
    });
  });

  it('displays result count', () => {
    render(<DataFilterBar resultCount={42} />);
    expect(screen.getByText('42 results')).toBeInTheDocument();
  });

  it('displays singular result count for 1', () => {
    render(<DataFilterBar resultCount={1} />);
    expect(screen.getByText('1 result')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<DataFilterBar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('clears sort when "Sort by..." is selected', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataFilterBar
        sort={{ field: 'name', direction: 'asc' }}
        sortFields={[{ label: 'Name', value: 'name' }]}
        onSortChange={onSortChange}
      />,
    );

    const sortSelect = screen.getByLabelText('Sort by');
    await user.selectOptions(sortSelect, '');
    expect(onSortChange).toHaveBeenCalledWith(undefined);
  });

  it('supports controlled search value', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<DataFilterBar search="initial" onSearchChange={onSearchChange} />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('initial');

    await user.type(input, 'x');
    expect(onSearchChange).toHaveBeenCalledWith('initialx');
  });
});
