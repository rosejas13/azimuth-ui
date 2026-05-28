import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OTPInput } from '../OTPInput';

function OTPDemo() {
  const [value, setValue] = useState('');
  return <OTPInput value={value} onChange={setValue} />;
}

const meta: Meta<typeof OTPInput> = {
  title: 'Components/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    length: { control: { type: 'number', min: 3, max: 8 } },
  },
};

export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
  render: () => <OTPDemo />,
};

export const Error: Story = {
  args: { value: '123', error: true },
};

export const Disabled: Story = {
  args: { value: '456', disabled: true },
};

export const SizeSm: Story = {
  args: { value: '78', size: 'sm' },
};

export const SizeMd: Story = {
  args: { value: '90', size: 'md' },
};

export const SizeLg: Story = {
  args: { value: '12', size: 'lg' },
};
