import type { Meta, StoryObj } from '@storybook/react';
import { PricingTable } from '../PricingTable';

const meta: Meta<typeof PricingTable> = {
  title: 'Sections/PricingTable',
  component: PricingTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PricingTable>;

const baseTiers = [
  {
    name: 'Starter',
    price: '$19/mo',
    description: 'Everything you need to get started.',
    features: [
      '1 project',
      '10GB storage',
      'Basic analytics',
      'Community support',
    ],
    cta: { label: 'Get Started', href: '/signup' },
  },
  {
    name: 'Pro',
    price: '$49/mo',
    description: 'For growing teams and businesses.',
    features: [
      'Unlimited projects',
      '100GB storage',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
    ],
    highlighted: true,
    badge: 'Popular',
    cta: { label: 'Get Pro', href: '/signup' },
  },
  {
    name: 'Enterprise',
    price: '$149/mo',
    description: 'For large organizations with advanced needs.',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
    ],
    cta: { label: 'Contact Sales', onClick: () => {} },
  },
];

export const Default: Story = {
  args: {
    title: 'Simple, Transparent Pricing',
    subtitle: 'Plans',
    description:
      'Choose the plan that fits your needs. Upgrade or downgrade at any time.',
    tiers: baseTiers,
  },
};

export const DarkVariant: Story = {
  args: {
    title: 'Enterprise Pricing',
    subtitle: 'Plans',
    tiers: baseTiers,
    variant: 'dark',
  },
};

export const AccentVariant: Story = {
  args: {
    title: 'Choose Your Plan',
    tiers: baseTiers,
    variant: 'accent',
  },
};
