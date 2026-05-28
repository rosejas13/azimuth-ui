import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../Checkbox';

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={() => setChecked(!checked)} label="Accept terms" />;
}

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { label: 'Unchecked' },
};

export const Checked: Story = {
  render: () => <CheckboxDemo />,
};

export const Indeterminate: Story = {
  args: { label: 'Indeterminate', indeterminate: true, checked: false },
  parameters: { docs: { description: { story: 'Indeterminate state requires the `indeterminate` prop. Clicking toggles checked.' } } },
};
