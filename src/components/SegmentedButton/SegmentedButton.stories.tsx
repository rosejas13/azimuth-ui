import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SegmentedButton } from './SegmentedButton';

function SegmentedButtonDemo({
  options = [],
  size,
  fullWidth,
}: Partial<React.ComponentProps<typeof SegmentedButton>>) {
  const [value, setValue] = useState('day');
  return (
    <SegmentedButton
      options={options}
      value={value}
      onChange={setValue}
      size={size}
      fullWidth={fullWidth}
    />
  );
}

const meta: Meta<typeof SegmentedButton> = {
  title: 'Components/SegmentedButton',
  component: SegmentedButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SegmentedButton>;

const defaultOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export const Default: Story = {
  render: () => <SegmentedButtonDemo options={defaultOptions} />,
};

export const WithIcons: Story = {
  render: () => (
    <SegmentedButtonDemo
      options={[
        { value: 'list', label: 'List', icon: <span>☰</span> },
        { value: 'grid', label: 'Grid', icon: <span>⊞</span> },
        { value: 'card', label: 'Card', icon: <span>▦</span> },
      ]}
    />
  ),
};

export const FullWidth: Story = {
  render: () => (
    <SegmentedButtonDemo
      options={[
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
        { value: 'c', label: 'Option C' },
      ]}
      fullWidth
    />
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SegmentedButtonDemo options={defaultOptions} size="sm" />
      <SegmentedButtonDemo options={defaultOptions} size="md" />
      <SegmentedButtonDemo options={defaultOptions} size="lg" />
    </div>
  ),
};
