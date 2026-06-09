import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from '../ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Display/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    title: 'Wireless Headphones',
    price: '$79.99',
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    rating: 4,
    reviewCount: 128,
    image: 'https://placehold.co/600x400?text=Headphones',
    badge: 'New',
  },
};

export const OnSale: Story = {
  args: {
    title: 'Smart Watch',
    price: '$149.99',
    originalPrice: '$249.99',
    description: 'Fitness tracker with heart rate monitor and GPS.',
    rating: 3,
    reviewCount: 56,
    badge: 'Sale',
    ctaLabel: 'Shop Now',
  },
};
