import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from '../VisuallyHidden';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Primitives/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  args: {
    children: 'This text is hidden visually but available to screen readers.',
  },
};
