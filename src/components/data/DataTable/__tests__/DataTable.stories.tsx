import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '../DataTable';
import type { DataTableColumn } from '../DataTable';

const sampleData: Record<string, unknown>[] = [
  { name: 'Alice', email: 'alice@example.com', role: 'Engineer', active: true },
  { name: 'Bob', email: 'bob@example.com', role: 'Designer', active: true },
  {
    name: 'Charlie',
    email: 'charlie@example.com',
    role: 'Manager',
    active: false,
  },
  { name: 'Diana', email: 'diana@example.com', role: 'Engineer', active: true },
  { name: 'Eve', email: 'eve@example.com', role: 'Designer', active: false },
];

const defaultColumns = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role' },
  { key: 'active', title: 'Active' },
] as DataTableColumn<unknown>[];

const sortableColumns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role', sortable: true },
  { key: 'active', title: 'Active', sortable: true },
] as DataTableColumn<unknown>[];

const customColumns = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email' },
  {
    key: 'role',
    title: 'Role',
    sortable: true,
    render: (value) => (
      <span style={{ color: 'var(--azimuth-color-accent)', fontWeight: 600 }}>
        {String(value)}
      </span>
    ),
  },
  {
    key: 'active',
    title: 'Status',
    render: (value) => (
      <span
        style={{
          color: value
            ? 'var(--azimuth-color-success-text)'
            : 'var(--azimuth-color-error-text)',
        }}
      >
        {value ? 'Active' : 'Inactive'}
      </span>
    ),
  },
] as DataTableColumn<unknown>[];

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    data: {
      columns: defaultColumns,
      data: sampleData,
    },
  },
};

export const WithSorting: Story = {
  args: {
    data: {
      columns: sortableColumns,
      data: sampleData,
    },
  },
};

export const WithCustomColumns: Story = {
  args: {
    data: {
      columns: customColumns,
      data: sampleData,
    },
  },
};

export const Empty: Story = {
  args: {
    data: {
      columns: defaultColumns,
      data: [],
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
