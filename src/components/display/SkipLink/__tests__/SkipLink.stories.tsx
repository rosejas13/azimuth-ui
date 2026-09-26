import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from '../SkipLink';

const meta: Meta<typeof SkipLink> = {
  title: 'Components/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div>
        <Story />
        <main id="main-content" style={{ padding: 'var(--azimuth-space-md)' }}>
          <p>Main content — Tab twice to move focus to the skip link target.</p>
        </main>
      </div>
    ),
  ],
};

export const CustomText: Story = {
  args: {
    children: 'Skip to main navigation',
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <main id="main-content" style={{ padding: 'var(--azimuth-space-md)' }}>
          <p>Main content — Tab twice to move focus to the skip link target.</p>
        </main>
      </div>
    ),
  ],
};
