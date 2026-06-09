import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from '../Footer';

const meta: Meta<typeof Footer> = {
  title: 'Sections/Footer',
  component: Footer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    brand: {
      name: 'Azimuth',
      description:
        'A modern platform for building, deploying, and scaling applications.',
    },
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '/features' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Integrations', href: '/integrations' },
          { label: 'Changelog', href: '/changelog' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Blog', href: '/blog' },
          { label: 'Careers', href: '/careers' },
          { label: 'Press', href: '/press' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Documentation', href: '/docs' },
          { label: 'Help Center', href: '/help' },
          { label: 'API Reference', href: '/api' },
          { label: 'Status', href: '/status' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Cookie Policy', href: '/cookies' },
        ],
      },
    ],
    socialLinks: [
      { label: 'Twitter', href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
    copyright: '© 2024 Azimuth. All rights reserved.',
    newsletterText: 'Stay up to date with our latest news.',
  },
};

export const Dark: Story = {
  args: {
    ...Default.args,
    variant: 'dark',
  },
};

export const Minimal: Story = {
  args: {
    brand: { name: 'Azimuth' },
    copyright: '© 2024 Azimuth. All rights reserved.',
  },
};
