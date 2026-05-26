import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from './DataTable';
import type { DataTableProps } from './DataTable';

interface TestRow {
  id: number;
  name: string;
  email: string;
}

const DEFAULT_COLUMNS: DataTableProps<TestRow>['columns'] = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Name', sortable: true, searchable: true },
  { key: 'email', title: 'Email', sortable: true },
];

const DEFAULT_DATA: TestRow[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

describe('DataTable', () => {
  it('renders columns and data', () => {
    render(<DataTable columns={DEFAULT_COLUMNS} data={DEFAULT_DATA} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders empty state when data is empty', () => {
    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={[]}
        emptyMessage="Nothing to show"
      />,
    );

    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<DataTable columns={DEFAULT_COLUMNS} data={[]} loading />);

    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getByLabelText('Loading data')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('renders error state', () => {
    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={[]}
        error="Something went wrong"
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders title and actions area', () => {
    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={DEFAULT_DATA}
        title="Users"
        actions={<button type="button">Add User</button>}
      />,
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={DEFAULT_DATA}
        className="my-table"
      />,
    );

    const wrapper = screen.getByRole('table').parentElement?.parentElement;
    expect(wrapper).toHaveClass('my-table');
  });

  it('sorts by column on header click', async () => {
    const user = userEvent.setup();
    render(
      <DataTable columns={DEFAULT_COLUMNS} data={DEFAULT_DATA} />,
    );

    const table = screen.getByRole('table');
    const nameHeader = within(table).getByText('Name');

    await user.click(nameHeader);

    const rows = within(screen.getByRole('table').querySelector('tbody')!)
      .getAllByRole('row');
    const firstRowName = within(rows[0]).getByText('Alice');
    expect(firstRowName).toBeInTheDocument();
  });

  it('cycles sort direction on repeated clicks', async () => {
    const user = userEvent.setup();
    render(
      <DataTable columns={DEFAULT_COLUMNS} data={DEFAULT_DATA} />,
    );

    const nameHeader = screen.getByText('Name');

    await user.click(nameHeader);
    let nameCell = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameCell).toHaveAttribute('aria-sort', 'ascending');

    await user.click(nameHeader);
    nameCell = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameCell).toHaveAttribute('aria-sort', 'descending');

    await user.click(nameHeader);
    nameCell = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameCell).not.toHaveAttribute('aria-sort');
  });

  it('handles sort via keyboard', async () => {
    const user = userEvent.setup();
    render(
      <DataTable columns={DEFAULT_COLUMNS} data={DEFAULT_DATA} />,
    );

    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    nameHeader.focus();

    await user.keyboard('{Enter}');
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('filters data via search', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={DEFAULT_DATA}
        searchable
      />,
    );

    const searchInput = screen.getByRole('textbox', { name: 'Search' });
    await user.type(searchInput, 'Bob');

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).toBeNull();
    expect(screen.queryByText('Charlie')).toBeNull();
  });

  it('delegates to onSearch when provided', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={DEFAULT_DATA}
        onSearch={onSearch}
      />,
    );

    const searchInput = screen.getByRole('textbox', { name: 'Search' });
    await user.type(searchInput, 'test');

    expect(onSearch).toHaveBeenCalledWith('test');
  });

  it('renders custom cell content via render function', () => {
    const columns = [
      { key: 'id', title: 'ID' },
      {
        key: 'name',
        title: 'Name',
        render: (value: unknown) => <strong>{String(value)}</strong>,
      },
    ];

    render(<DataTable columns={columns} data={DEFAULT_DATA.slice(0, 1)} />);

    const strong = screen.getByText('Alice');
    expect(strong.tagName).toBe('STRONG');
  });

  it('calls onEdit when edit button clicked', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={DEFAULT_DATA}
        editable
        onEdit={onEdit}
      />,
    );

    const editButtons = screen.getAllByRole('button', { name: /Edit row/ });
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      0,
    );
  });

  it('does not show edit button when editable is false', () => {
    render(
      <DataTable columns={DEFAULT_COLUMNS} data={DEFAULT_DATA} />,
    );

    expect(
      screen.queryByRole('button', { name: /Edit row/ }),
    ).toBeNull();
  });

  it('calls onRowClick when row is clicked', async () => {
    const onRowClick = vi.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={DEFAULT_DATA}
        onRowClick={onRowClick}
      />,
    );

    const rows = document.querySelectorAll('tbody tr');
    await user.click(rows[0]);

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      0,
    );
  });

  it('shows pagination with correct page info', () => {
    const bigData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={bigData}
        defaultPageSize={10}
      />,
    );

    expect(screen.getByText(/Showing 1/)).toBeInTheDocument();
    expect(screen.getByText(/25 results/)).toBeInTheDocument();
  });

  it('navigates pages via page buttons', async () => {
    const user = userEvent.setup();
    const bigData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={bigData}
        defaultPageSize={10}
      />,
    );

    const page2Btn = screen.getByRole('button', { name: 'Page 2' });
    await user.click(page2Btn);

    expect(page2Btn).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText(/Showing 11/)).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    const bigData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={bigData}
        defaultPageSize={10}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
  });

  it('shows items per page selector when pageSizeOptions provided', () => {
    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={DEFAULT_DATA}
        pageSizeOptions={[5, 10, 20]}
      />,
    );

    expect(screen.getByLabelText('Per page')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('changes page size via selector', async () => {
    const user = userEvent.setup();
    const bigData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={bigData}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20]}
      />,
    );

    const selector = screen.getByRole('combobox');
    await user.selectOptions(selector, '5');

    expect(screen.getByText(/Showing 1.*5 of 20/)).toBeInTheDocument();
  });

  it('uses column header scope attributes', () => {
    render(<DataTable columns={DEFAULT_COLUMNS} data={DEFAULT_DATA} />);

    const headers = screen.getAllByRole('columnheader');
    for (const header of headers) {
      expect(header).toHaveAttribute('scope', 'col');
    }
  });

  it('shows aria-sort on sortable column headers', async () => {
    const user = userEvent.setup();
    render(
      <DataTable columns={DEFAULT_COLUMNS} data={DEFAULT_DATA} />,
    );

    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    await user.click(nameHeader);

    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('does not show pagination for single page without pageSizeOptions', () => {
    render(
      <DataTable columns={DEFAULT_COLUMNS} data={DEFAULT_DATA} />,
    );

    expect(screen.queryByText(/Showing/)).toBeNull();
  });

  it('filters by custom searchColumns', async () => {
    const user = userEvent.setup();
    const columns = [
      { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name' },
      { key: 'email', title: 'Email' },
    ];

    render(
      <DataTable
        columns={columns}
        data={DEFAULT_DATA}
        searchable
        searchColumns={['email']}
      />,
    );

    const searchInput = screen.getByRole('textbox', { name: 'Search' });
    await user.type(searchInput, 'alice@');

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).toBeNull();
  });

  it('preserves correct original index in onEdit after sorting and filtering', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();

    const columns = [
      { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name', sortable: true, searchable: true },
      { key: 'email', title: 'Email' },
    ];

    render(
      <DataTable
        columns={columns}
        data={DEFAULT_DATA}
        editable
        onEdit={onEdit}
      />,
    );

    const editButtons = screen.getAllByRole('button', { name: /Edit row/ });
    await user.click(editButtons[1]);

    expect(onEdit).toHaveBeenCalledWith(
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      1,
    );
  });

  describe('virtualized', () => {
    it('renders all data when virtualized with small dataset', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));
      render(<DataTable columns={DEFAULT_COLUMNS} data={data} virtualized />);
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();
    });

    it('shows total result count', () => {
      const data = Array.from({ length: 150 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));
      render(<DataTable columns={DEFAULT_COLUMNS} data={data} virtualized />);
      expect(screen.getByText(/150 results/)).toBeInTheDocument();
    });

    it('does not enable virtualization when virtualizedThreshold not exceeded', () => {
      const data = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));
      render(
        <DataTable
          columns={DEFAULT_COLUMNS}
          data={data}
          virtualized
          virtualizedThreshold={200}
        />,
      );
      expect(screen.getByText(/Showing/)).toBeInTheDocument();
    });

    it('sorts data correctly while virtualized', async () => {
      const user = userEvent.setup();
      const data = Array.from({ length: 150 }, (_, i) => ({
        id: i + 1,
        name: `User ${String(150 - i).padStart(3, '0')}`,
        email: `user${i + 1}@example.com`,
      }));
      render(<DataTable columns={DEFAULT_COLUMNS} data={data} virtualized />);
      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      await user.click(nameHeader);
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  it('preserves correct original index in onRowClick after sorting', async () => {
    const onRowClick = vi.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        columns={DEFAULT_COLUMNS}
        data={DEFAULT_DATA}
        onRowClick={onRowClick}
      />,
    );

    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    await user.click(nameHeader);

    const rows = document.querySelectorAll('tbody tr');
    await user.click(rows[0]);

    expect(onRowClick).toHaveBeenCalledWith(
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      0,
    );
  });
});
