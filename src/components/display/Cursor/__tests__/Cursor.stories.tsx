import type { Meta, StoryObj } from '@storybook/react';
import { Cursor } from '../Cursor';

const meta: Meta<typeof Cursor> = {
  title: 'Components/Cursor',
  component: Cursor,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Cursor>;

export const Default: Story = {
  args: {
    cursor: 'default',
    children: 'Hover over this text to see the default cursor.',
  },
};

export const Pointer: Story = {
  args: {
    cursor: 'pointer',
    children: 'This looks clickable.',
  },
};

export const NotAllowed: Story = {
  args: {
    cursor: 'not-allowed',
    children: 'This action is not allowed.',
  },
};

export const TextCursor: Story = {
  args: {
    cursor: 'text',
    children: 'You can select text here.',
  },
};

export const Grab: Story = {
  args: {
    cursor: 'grab',
    children: 'You can grab this.',
  },
};

export const Crosshair: Story = {
  args: {
    cursor: 'crosshair',
    children: 'Crosshair target area.',
  },
};
