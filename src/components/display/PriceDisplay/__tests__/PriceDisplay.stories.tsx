import type { Meta, StoryObj } from '@storybook/react';
import { PriceDisplay } from '../PriceDisplay';

const meta: Meta<typeof PriceDisplay> = {
  title: 'Display/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof PriceDisplay>;

export const Default: Story = {
  args: {
    price: 29.99,
    currency: '$',
  },
};

export const SalePrice: Story = {
  args: {
    price: 19.99,
    originalPrice: 39.99,
    currency: '$',
    suffix: '/ea',
  },
};
