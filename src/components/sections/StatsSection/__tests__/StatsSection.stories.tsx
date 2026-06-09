import type { Meta, StoryObj } from '@storybook/react';
import { StatsSection } from '../StatsSection';

const meta: Meta<typeof StatsSection> = {
  title: 'Sections/StatsSection',
  component: StatsSection,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  args: {
    title: 'By the Numbers',
    subtitle: 'Key metrics that define our impact',
    stats: [
      { value: '10K', label: 'Active Users' },
      { value: '99.9', label: 'Uptime', suffix: '%' },
      { value: '24/7', label: 'Support Coverage' },
    ],
  },
};

export const Accent: Story = {
  args: {
    title: 'Platform Reach',
    subtitle: 'Our global footprint keeps growing',
    variant: 'accent',
    columns: 4,
    stats: [
      { value: '50', label: 'Countries', suffix: '+' },
      { value: '1M', label: 'Requests', suffix: '+' },
      { value: '99.9', label: 'Uptime', suffix: '%' },
      { value: '250', label: 'Team Members', suffix: '+' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    title: 'Impact Snapshot',
    stats: [
      { value: '12', label: 'Years', suffix: '+', icon: '📈' },
      { value: '500', label: 'Projects', suffix: '+', icon: '🚀' },
      { value: '98', label: 'Satisfaction', suffix: '%', icon: '⭐' },
    ],
  },
};
