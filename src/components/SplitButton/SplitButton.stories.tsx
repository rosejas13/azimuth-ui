import type { Meta, StoryObj } from '@storybook/react';
import { SplitButton } from './SplitButton';

const meta: Meta<typeof SplitButton> = {
  title: 'Components/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

const defaultOptions = [
  { key: 'edit', label: 'Edit', onClick: () => console.log('Edit') },
  { key: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate') },
  { key: 'share', label: 'Share', onClick: () => console.log('Share') },
];

export const Primary: Story = {
  args: {
    label: 'Actions',
    onClick: () => console.log('Primary action'),
    options: defaultOptions,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Actions',
    onClick: () => console.log('Primary action'),
    options: defaultOptions,
    variant: 'secondary',
  },
};

export const WithDangerOption: Story = {
  args: {
    label: 'Manage',
    onClick: () => console.log('Manage'),
    options: [
      { key: 'view', label: 'View Details', onClick: () => console.log('View') },
      { key: 'archive', label: 'Archive', onClick: () => console.log('Archive') },
      { key: 'delete', label: 'Delete', onClick: () => console.log('Delete'), danger: true },
    ],
  },
};
