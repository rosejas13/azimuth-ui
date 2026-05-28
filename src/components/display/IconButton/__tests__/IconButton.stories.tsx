import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Primitives/IconButton',
  component: IconButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

const icon = (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="4" fill="currentColor" />
  </svg>
);

export const Primary: Story = {
  args: { icon, 'aria-label': 'Primary action', variant: 'primary' },
};

export const Secondary: Story = {
  args: { icon, 'aria-label': 'Secondary action', variant: 'secondary' },
};

export const Tertiary: Story = {
  args: { icon, 'aria-label': 'Tertiary action', variant: 'tertiary' },
};

export const Danger: Story = {
  args: { icon, 'aria-label': 'Danger action', variant: 'danger' },
};
