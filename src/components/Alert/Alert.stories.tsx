import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'alert'],
    },
    dismissible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = { args: { title: 'Information', children: 'A new version is available.', variant: 'info' } };
export const Success: Story = { args: { title: 'Success!', children: 'Your changes have been saved.', variant: 'success' } };
export const Warning: Story = { args: { title: 'Warning', children: 'Your session will expire in 5 minutes.', variant: 'warning' } };
export const Error: Story = { args: { title: 'Error', children: 'Failed to save changes.', variant: 'alert' } };
export const Dismissible: Story = {
  args: { title: 'Dismiss me', children: 'Click the close button.', variant: 'info', dismissible: true, onDismiss: () => {} },
};
