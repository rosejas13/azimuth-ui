import type { Meta, StoryObj } from '@storybook/react';
import { SectionView } from '../SectionView';

const meta: Meta<typeof SectionView> = {
  title: 'Components/SectionView',
  component: SectionView,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SectionView>;

export const Default: Story = {
  args: {
    title: 'Section Title',
    children: (
      <div
        style={{
          color: 'var(--azimuth-color-text-secondary)',
          fontSize: 'var(--azimuth-fs-sm)',
        }}
      >
        This content is revealed when the section is expanded. Click the header
        to toggle visibility.
      </div>
    ),
  },
};

export const Expanded: Story = {
  args: {
    title: 'Pre-expanded Section',
    defaultExpanded: true,
    children: (
      <div>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
            margin: 0,
          }}
        >
          This section starts open by default. Click the header to collapse it.
        </p>
      </div>
    ),
  },
};

export const Controlled: Story = {
  args: {
    title: 'Controlled Section',
    expanded: true,
    children: (
      <div>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
            margin: 0,
          }}
        >
          This section is controlled externally via the <code>expanded</code>{' '}
          prop.
        </p>
      </div>
    ),
  },
};
