import type { Meta, StoryObj } from '@storybook/react';
import { ActivityFeed } from '../ActivityFeed';
import type { ActivityEvent } from '../ActivityFeed';

const sampleEvents: ActivityEvent[] = [
  {
    id: '1',
    title: 'Deployed to production',
    description: 'Version 3.2.1 is now live on all instances.',
    timestamp: '2m ago',
    type: 'success',
  },
  {
    id: '2',
    title: 'Build completed',
    description: 'All 1,247 tests passed.',
    timestamp: '1h ago',
    type: 'info',
  },
  {
    id: '3',
    title: 'PR #142 merged',
    description: 'feat: add user profile avatars',
    timestamp: '3h ago',
    link: { label: 'View PR', href: '/pr/142' },
  },
  {
    id: '4',
    title: 'Deploy failed',
    description: 'Container exited with code 1.',
    timestamp: '5h ago',
    type: 'danger',
  },
  {
    id: '5',
    title: 'Disk usage warning',
    description: 'Volume /data is at 87% capacity.',
    timestamp: '8h ago',
    type: 'warning',
  },
  {
    id: '6',
    title: 'New team member',
    description: 'Alex joined the engineering team.',
    timestamp: '1d ago',
    type: 'default',
  },
];

const meta: Meta<typeof ActivityFeed> = {
  title: 'Components/ActivityFeed',
  component: ActivityFeed,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const Default: Story = {
  args: {
    events: sampleEvents,
  },
};

export const WithShowMore: Story = {
  args: {
    events: sampleEvents,
    maxVisible: 3,
    hasMore: true,
  },
};

export const Empty: Story = {
  args: {
    events: [],
    emptyMessage: 'No recent activity to display.',
  },
};
