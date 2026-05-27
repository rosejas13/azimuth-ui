import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';
import type { TimelineItem } from './Timeline';

const defaultItems: TimelineItem[] = [
  { id: '1', title: 'Application submitted', description: 'Your application has been received.' },
  { id: '2', title: 'Under review', description: 'A reviewer is evaluating your submission.' },
  { id: '3', title: 'Decision pending', description: 'Final approval is in progress.' },
];

const datedItems: TimelineItem[] = [
  { id: '1', title: 'Application submitted', description: 'Your application has been received.', date: '2025-01-15' },
  { id: '2', title: 'Under review', description: 'A reviewer is evaluating your submission.', date: '2025-01-20' },
  { id: '3', title: 'Approved', description: 'Your application has been approved.', date: '2025-02-01' },
];

const iconItems: TimelineItem[] = [
  { id: '1', title: 'Order placed', description: 'Your order has been placed successfully.', date: '2 min ago', icon: <span>🛒</span>, color: '#3b82f6' },
  { id: '2', title: 'Processing', description: 'Your order is being prepared.', date: '5 min ago', icon: <span>📦</span>, color: '#f59e0b' },
  { id: '3', title: 'Shipped', description: 'Your order has been shipped.', date: '1 hour ago', icon: <span>🚚</span>, color: '#10b981' },
  { id: '4', title: 'Delivered', description: 'Your order has been delivered.', date: '2 hours ago', icon: <span>✅</span>, color: '#6366f1' },
];

const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'alternating'] },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const DefaultItems: Story = {
  args: {
    items: defaultItems,
  },
};

export const WithDates: Story = {
  args: {
    items: datedItems,
  },
};

export const Alternating: Story = {
  args: {
    items: datedItems,
    variant: 'alternating',
  },
};

export const WithIconsAndColors: Story = {
  args: {
    items: iconItems,
  },
};
