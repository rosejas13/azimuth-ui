import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from '../Pagination';

function PaginationDemo({ totalPages = 5, showFirstLast, size }: Partial<React.ComponentProps<typeof Pagination>>) {
  const [page, setPage] = useState(1);
  return (
    <Pagination
      currentPage={page}
      totalPages={totalPages ?? 5}
      onPageChange={setPage}
      showFirstLast={showFirstLast}
      size={size}
    />
  );
}

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => <PaginationDemo totalPages={5} />,
};

export const ManyPages: Story = {
  render: () => <PaginationDemo totalPages={20} />,
};

export const WithFirstLast: Story = {
  render: () => <PaginationDemo totalPages={20} showFirstLast />,
};

export const SizeSm: Story = {
  render: () => <PaginationDemo totalPages={5} size="sm" />,
};
