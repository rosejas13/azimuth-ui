import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesGrid } from '../FeaturesGrid';

const meta: Meta<typeof FeaturesGrid> = {
  title: 'Sections/FeaturesGrid',
  component: FeaturesGrid,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeaturesGrid>;

const defaultFeatures = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Lightning Fast',
    description:
      'Optimized rendering pipeline ensures sub-second load times even with complex data sets and large document volumes.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: 'Enterprise Security',
    description:
      'End-to-end encryption, role-based access control, and SOC 2 compliance built into every deployment.',
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Flexible Customization',
    description:
      'Extend and customize every layer with plugins, themes, and a comprehensive API surface.',
  },
];

export const Default: Story = {
  args: {
    title: 'Built for Modern Teams',
    subtitle: 'Features',
    description:
      'Everything you need to build, deploy, and scale your applications — all in one platform.',
    features: defaultFeatures,
  },
};

export const FourColumns: Story = {
  args: {
    title: 'Four Column Layout',
    subtitle: 'Grid',
    features: [
      ...defaultFeatures,
      {
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
        title: 'Real-time Sync',
        description:
          'Collaborate with your team in real time with instant updates and live cursors.',
      },
    ],
    columns: 4,
  },
};

export const DarkVariant: Story = {
  args: {
    title: 'Dark Mode',
    subtitle: 'Features',
    description:
      'A dark-themed features grid perfect for landing pages with a bold aesthetic.',
    features: defaultFeatures,
    variant: 'dark',
  },
};
