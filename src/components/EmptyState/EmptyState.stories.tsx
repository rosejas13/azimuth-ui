import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../../primitives/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Basic: Story = {
  args: {
    title: 'No items found',
    description: 'Try adjusting your search or filter to find what you\'re looking for.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <span style={{ fontSize: 32 }}>📂</span>,
    title: 'No projects yet',
    description: 'Create your first project to get started.',
  },
};

export const WithAction: Story = {
  args: {
    icon: <span style={{ fontSize: 32 }}>📂</span>,
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    action: <Button>Create Project</Button>,
  },
};

export const Minimal: Story = {
  args: {
    title: 'Nothing here',
  },
};
