import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DropdownList } from './DropdownList';

const meta: Meta<typeof DropdownList> = {
  title: 'Components/DropdownList',
  component: DropdownList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownList>;

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
];

function DefaultDemo() {
  const [value, setValue] = useState<string | string[]>('');
  return <DropdownList options={options} value={value} onChange={setValue} />;
}

function WithLabelDemo() {
  const [value, setValue] = useState<string | string[]>('');
  return <DropdownList options={options} value={value} onChange={setValue} label="Choose an option" />;
}

function SearchableDemo() {
  const [value, setValue] = useState<string | string[]>('');
  return <DropdownList options={options} value={value} onChange={setValue} searchable />;
}

function ErrorDemo() {
  const [value, setValue] = useState<string | string[]>('');
  return <DropdownList options={options} value={value} onChange={setValue} error="Please select an option" />;
}

export const Default: Story = { render: () => <DefaultDemo /> };
export const WithLabel: Story = { render: () => <WithLabelDemo /> };
export const Searchable: Story = { render: () => <SearchableDemo /> };
export const Error: Story = { render: () => <ErrorDemo /> };
