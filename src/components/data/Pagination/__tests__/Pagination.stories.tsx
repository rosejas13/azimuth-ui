import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from '../Pagination';

function PaginationDemo({
  totalPages = 5,
  showFirstLast,
  size,
}: Partial<React.ComponentProps<typeof Pagination>>) {
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

/**
 * Pagination renders its own page buttons — it does not accept a JSX array
 * prop. To paginate custom JSX elements, slice the data yourself and pair the
 * slice with the nav component, as shown here.
 */
function ElementsPaginationDemo() {
  const names = [
    'Apple',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew',
  ];
  const perPage = 3;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(names.length / perPage);
  const visible = names.slice((page - 1) * perPage, page * perPage);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ul>
        {visible.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export const WithElementArrays: Story = {
  render: () => <ElementsPaginationDemo />,
};
