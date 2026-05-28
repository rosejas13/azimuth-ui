import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { children: 'New', variant: 'neutral' } };
export const Accent: Story = { args: { children: 'Featured', variant: 'accent' } };
export const Success: Story = { args: { children: 'Done', variant: 'success' } };
export const Warning: Story = { args: { children: 'Pending', variant: 'warning' } };
export const Danger: Story = { args: { children: 'Failed', variant: 'danger' } };
export const Info: Story = { args: { children: 'Info', variant: 'info' } };
