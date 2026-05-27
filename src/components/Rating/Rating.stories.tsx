import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Empty: Story = { args: { value: 0 } };

export const Rated: Story = { args: { value: 3 } };

export const MaxTen: Story = { args: { value: 7, max: 10 } };

export const Disabled: Story = { args: { value: 4, disabled: true } };

function InteractiveDemo() {
  const [value, setValue] = useState(2);
  return <Rating value={value} onChange={setValue} />;
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
