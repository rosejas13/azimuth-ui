import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
    removable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Neutral: Story = { args: { children: 'React', variant: 'neutral' } };
export const Accent: Story = { args: { children: 'TypeScript', variant: 'accent' } };
export const Success: Story = { args: { children: 'Approved', variant: 'success' } };
export const Removable: Story = {
  args: { children: 'Click X', variant: 'neutral', removable: true, onRemove: () => {} },
};
