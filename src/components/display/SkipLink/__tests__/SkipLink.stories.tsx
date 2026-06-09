import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from '../SkipLink';

const meta: Meta<typeof SkipLink> = {
  title: 'Components/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    children: 'Skip to main navigation',
  },
};
