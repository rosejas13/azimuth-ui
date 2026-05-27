import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

function RadioDemo() {
  const [value, setValue] = useState('option1');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Radio name="radio-group" value="option1" checked={value === 'option1'} onChange={() => setValue('option1')} label="Option 1" />
      <Radio name="radio-group" value="option2" checked={value === 'option2'} onChange={() => setValue('option2')} label="Option 2" />
      <Radio name="radio-group" value="option3" checked={value === 'option3'} onChange={() => setValue('option3')} label="Option 3" />
    </div>
  );
}

const meta: Meta<typeof Radio> = {
  title: 'Primitives/Radio',
  component: Radio,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Unchecked: Story = {
  args: { label: 'Unchecked' },
};

export const Checked: Story = {
  render: () => <RadioDemo />,
};
