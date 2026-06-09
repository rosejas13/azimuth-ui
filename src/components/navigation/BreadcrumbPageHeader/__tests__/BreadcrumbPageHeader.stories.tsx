import type { Meta, StoryObj } from '@storybook/react';
import { BreadcrumbPageHeader } from '../BreadcrumbPageHeader';
import { Button } from '../../../input/Button';

const meta: Meta<typeof BreadcrumbPageHeader> = {
  title: 'Components/BreadcrumbPageHeader',
  component: BreadcrumbPageHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BreadcrumbPageHeader>;

export const Default: Story = {
  args: {
    title: 'Settings',
    description: 'Manage your account settings and preferences.',
    breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Account' }],
  },
};

export const WithActions: Story = {
  args: {
    title: 'Team Members',
    description: 'Manage who has access to your workspace.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Team' },
    ],
    actions: <Button size="sm">Invite Member</Button>,
  },
};

export const DeepNested: Story = {
  args: {
    title: 'API Keys',
    description: 'Create and manage API keys for programmatic access.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Developer', href: '/settings/developer' },
      { label: 'API Keys' },
    ],
    actions: (
      <>
        <Button variant="secondary" size="sm">
          Revoke All
        </Button>
        <Button size="sm">Create Key</Button>
      </>
    ),
  },
};
