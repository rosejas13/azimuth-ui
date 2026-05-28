import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../Select';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
];

function SelectDemo() {
  const [value, setValue] = useState('');
  return (
    <Select
      label={{ text: 'Favorite fruit', subtitle: 'Pick one' }}
      options={fruitOptions}
      placeholder="Select a fruit..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: { options: fruitOptions, placeholder: 'Select a fruit...' },
};

export const WithLabelAndSubtitle: Story = {
  args: { label: { text: 'Favorite fruit', subtitle: 'Pick one' }, options: fruitOptions, placeholder: 'Select a fruit...' },
};

export const SizeSm: Story = {
  args: { label: { text: 'Size SM' }, size: 'sm', options: fruitOptions, placeholder: 'Select...' },
};

export const SizeMd: Story = {
  args: { label: { text: 'Size MD' }, size: 'md', options: fruitOptions, placeholder: 'Select...' },
};

export const SizeLg: Story = {
  args: { label: { text: 'Size LG' }, size: 'lg', options: fruitOptions, placeholder: 'Select...' },
};

export const Error: Story = {
  args: { label: { text: 'Favorite fruit', error: 'Please select a fruit' }, options: fruitOptions, placeholder: 'Select...' },
};

export const Demo: Story = {
  render: () => <SelectDemo />,
};
