import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from '../TextArea';

function TextAreaDemo() {
  const [value, setValue] = useState('');
  return <TextArea label="Bio" value={value} onChange={setValue} />;
}

function CharCountDemo() {
  const [value, setValue] = useState('');
  return (
    <TextArea
      label="Bio"
      subtitle="Tell us about yourself"
      value={value}
      onChange={setValue}
      maxLength={200}
      showCharCount
    />
  );
}

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    subtitle: 'Provide a brief description',
    placeholder: 'Type here...',
  },
};

export const Error: Story = {
  args: {
    label: 'Message',
    error: 'Message is required',
    placeholder: 'Type here...',
  },
};

export const CharCount: Story = {
  render: () => <CharCountDemo />,
};

export const Demo: Story = {
  render: () => <TextAreaDemo />,
};
