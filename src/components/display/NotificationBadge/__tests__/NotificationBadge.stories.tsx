import type { Meta, StoryObj } from '@storybook/react';
import { NotificationBadge } from '../NotificationBadge';

const meta: Meta<typeof NotificationBadge> = {
  title: 'Components/NotificationBadge',
  component: NotificationBadge,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['accent', 'danger', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationBadge>;

export const CountBadge: Story = {
  args: {
    count: 5,
    children: 'Inbox',
  },
};

export const LargeCount: Story = {
  args: {
    count: 150,
    children: 'Inbox',
  },
};

export const DotMode: Story = {
  args: {
    dot: true,
    children: 'Inbox',
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <NotificationBadge count={3} color="accent">
        Accent
      </NotificationBadge>
      <NotificationBadge count={3} color="danger">
        Danger
      </NotificationBadge>
      <NotificationBadge count={3} color="neutral">
        Neutral
      </NotificationBadge>
    </div>
  ),
};
