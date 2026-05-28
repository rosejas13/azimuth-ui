import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '../Toggle';

function ToggleDemo() {
  const [checked, setChecked] = useState(false);
  return <Toggle checked={checked} onChange={() => setChecked(!checked)} label="Enable notifications" />;
}

const meta: Meta<typeof Toggle> = {
  title: 'Primitives/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Off: Story = {
  args: { label: 'Airplane mode' },
};

export const On: Story = {
  render: () => <ToggleDemo />,
};

export const SizeSm: Story = {
  args: { label: 'Small toggle', size: 'sm', defaultChecked: true },
};

export const SizeMd: Story = {
  args: { label: 'Medium toggle', size: 'md', defaultChecked: true },
};

export const SizeLg: Story = {
  args: { label: 'Large toggle', size: 'lg', defaultChecked: true },
};
