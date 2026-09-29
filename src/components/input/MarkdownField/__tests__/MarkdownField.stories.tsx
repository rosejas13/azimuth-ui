import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownField } from '../MarkdownField';

function ControlledDemo() {
  const [value, setValue] = useState(
    '# Release notes\n\n- shipped **preview**\n- fixed `parse` loop',
  );
  return (
    <MarkdownField
      label="Notes"
      subtitle="Markdown supported: headings, lists, code, links"
      value={value}
      onChange={setValue}
    />
  );
}

const meta: Meta<typeof MarkdownField> = {
  title: 'Components/MarkdownField',
  component: MarkdownField,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['write', 'preview', 'split'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownField>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Write in **markdown**…',
  },
};

export const Preview: Story = {
  args: {
    label: 'Description',
    mode: 'preview',
    value:
      '# Heading\n\nA paragraph with **bold**, *italic*, `code`, and a [link](https://example.com).\n\n- one\n- two\n\n> quoted\n\n```\nconst x = 1;\n```',
  },
};

export const Split: Story = {
  args: {
    label: 'Description',
    mode: 'split',
    value: '# Split view\n\nEdit left, preview right.',
  },
};

export const NoToolbar: Story = {
  args: {
    label: 'Description',
    toolbar: false,
    value: 'Plain editor, no toolbar.',
  },
};

export const Error: Story = {
  args: {
    label: 'Description',
    error: 'Description is required',
  },
};

export const CharCount: Story = {
  args: {
    label: 'Description',
    maxLength: 200,
    showCharCount: true,
    value: '## Hello',
  },
};

export const Demo: Story = {
  render: () => <ControlledDemo />,
};
