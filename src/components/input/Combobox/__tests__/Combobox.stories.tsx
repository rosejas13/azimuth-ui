import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox } from '../Combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
];

function ComboboxDemo(override: Partial<React.ComponentProps<typeof Combobox>>) {
  const [value, setValue] = useState('');
  return (
    <Combobox
      selection={{ value, onChange: setValue, onSelect: (v) => { setValue(''); setValue(v); } }}
      data={{ options }}
      {...override}
    />
  );
}

export const Default: Story = { render: () => <ComboboxDemo /> };

export const WithLabel: Story = {
  render: () => <ComboboxDemo label="Choose a fruit" />,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ComboboxDemo label="Small" size="sm" />
      <ComboboxDemo label="Medium" size="md" />
      <ComboboxDemo label="Large" size="lg" />
    </div>
  ),
};

export const Error: Story = {
  render: () => <ComboboxDemo error="Please select a valid option" />,
};
