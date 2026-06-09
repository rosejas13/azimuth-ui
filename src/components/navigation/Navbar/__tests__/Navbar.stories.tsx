import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../Navbar';
import { Button } from '../../../input/Button';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    branding: { logo: <strong>Azimuth</strong>, href: '/' },
    nav: {
      items: [
        { key: 'home', label: 'Home', href: '/' },
        { key: 'docs', label: 'Docs', href: '/docs' },
        { key: 'components', label: 'Components', href: '/components' },
        { key: 'blog', label: 'Blog', href: '/blog' },
      ],
      activeKey: 'home',
    },
  },
};

export const WithActions: Story = {
  args: {
    branding: { logo: <strong>MyApp</strong> },
    nav: {
      items: [
        { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
        { key: 'projects', label: 'Projects', href: '/projects' },
        { key: 'team', label: 'Team', href: '/team' },
      ],
      activeKey: 'dashboard',
    },
    actions: <Button size="sm">Sign Out</Button>,
  },
};

export const WithActiveItem: Story = {
  args: {
    branding: { logo: <strong>Docs</strong> },
    nav: {
      items: [
        { key: 'overview', label: 'Overview', href: '/overview' },
        {
          key: 'quickstart',
          label: 'Quickstart',
          href: '/quickstart',
          active: true,
        },
        { key: 'guides', label: 'Guides', href: '/guides' },
        { key: 'api', label: 'API', href: '/api' },
      ],
    },
  },
};
