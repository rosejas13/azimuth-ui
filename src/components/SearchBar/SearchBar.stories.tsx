import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';

function SearchBarDemo() {
  const [value, setValue] = useState('');
  return <SearchBar value={value} onChange={(e) => setValue(e.target.value)} onSearch={(q) => console.log('search:', q)} />;
}

function SuggestionDemo() {
  const [value, setValue] = useState('');
  return (
    <SearchBar
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSearch={(q) => console.log('search:', q)}
      suggestions={['React', 'Vue', 'Svelte']}
    />
  );
}

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  render: () => <SearchBarDemo />,
};

export const WithSuggestions: Story = {
  render: () => <SuggestionDemo />,
};

export const ClearableDisabled: Story = {
  args: { clearable: false, placeholder: 'Search without clear...' },
};

export const Demo: Story = {
  render: () => <SearchBarDemo />,
};
