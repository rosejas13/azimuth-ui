import type { Meta, StoryObj } from '@storybook/react';
import { QuantityStepper } from '../QuantityStepper';

const meta: Meta<typeof QuantityStepper> = {
  title: 'Input/QuantityStepper',
  component: QuantityStepper,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof QuantityStepper>;

export const Default: Story = {
  args: {
    label: 'Qty',
    defaultValue: 1,
  },
};

export const WithMax: Story = {
  args: {
    defaultValue: 3,
    max: 5,
    min: 1,
    label: 'Tickets',
  },
};
