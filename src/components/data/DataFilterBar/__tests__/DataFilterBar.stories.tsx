import type { Meta, StoryObj } from '@storybook/react';
import { DataFilterBar } from '../DataFilterBar';

const meta: Meta<typeof DataFilterBar> = {
  title: 'Components/DataFilterBar',
  component: DataFilterBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataFilterBar>;

export const Default: Story = {};

export const WithFilters: Story = {
  args: {
    filters: [
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
          { label: 'Marketing', value: 'marketing' },
        ],
      },
    ],
    activeFilters: [{ id: 'status', value: 'active' }],
    sortFields: [
      { label: 'Name', value: 'name' },
      { label: 'Date', value: 'date' },
    ],
    sort: { field: 'date', direction: 'desc' },
  },
};

export const WithSortAndResults: Story = {
  args: {
    sortFields: [
      { label: 'Name', value: 'name' },
      { label: 'Date', value: 'date' },
      { label: 'Status', value: 'status' },
    ],
    sort: { field: 'name', direction: 'asc' },
    resultCount: 128,
  },
};
