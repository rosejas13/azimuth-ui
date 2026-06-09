import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from '../KPICard';

const meta: Meta<typeof KPICard> = {
  title: 'Components/KPICard',
  component: KPICard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'success', 'warning', 'danger'],
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral', undefined],
    },
  },
};

export default meta;
type Story = StoryObj<typeof KPICard>;

export const Default: Story = {
  args: {
    value: '$12.4K',
    label: 'Revenue',
  },
};

export const WithTrendUp: Story = {
  args: {
    value: '85%',
    label: 'Conversion Rate',
    trend: 'up',
    trendValue: '+12.5%',
    description:
      'Weekly average conversion rate improvement across all channels.',
  },
};

export const WithTrendDown: Story = {
  args: {
    value: '2.3%',
    label: 'Bounce Rate',
    trend: 'down',
    trendValue: '-0.8%',
    variant: 'danger',
    description: 'Site-wide bounce rate has decreased this month.',
  },
};

export const Interactive: Story = {
  args: {
    value: '1,234',
    label: 'Active Users',
    trend: 'up',
    trendValue: '+18%',
    onClick: () => alert('Card clicked'),
  },
};
