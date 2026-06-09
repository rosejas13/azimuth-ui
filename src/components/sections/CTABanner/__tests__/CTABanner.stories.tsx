import type { Meta, StoryObj } from '@storybook/react';
import { CTABanner } from '../CTABanner';

const meta: Meta<typeof CTABanner> = {
  title: 'Sections/CTABanner',
  component: CTABanner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CTABanner>;

export const Default: Story = {
  args: {
    title: 'Ready to Get Started?',
    description:
      'Join thousands of teams already using Azimuth to build, deploy, and scale their applications.',
    primaryAction: { label: 'Get Started', href: '#' },
    secondaryAction: { label: 'Learn More', href: '#' },
  },
};

export const WithSecondary: Story = {
  args: {
    title: 'Start Your Free Trial',
    description: 'No credit card required. Full access for 14 days.',
    primaryAction: { label: 'Start Trial', href: '#' },
    secondaryAction: { label: 'Talk to Sales', href: '#' },
  },
};

export const DarkVariant: Story = {
  args: {
    title: 'Built for Scale',
    description: 'Enterprise-grade infrastructure that grows with you.',
    primaryAction: { label: 'Explore Enterprise', href: '#' },
    variant: 'dark',
  },
};
