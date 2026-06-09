import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from '../Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    content: {
      variant: 'info',
      title: 'Information',
      message: 'This is an informational toast message.',
    },
  },
};

export const Success: Story = {
  args: {
    content: {
      variant: 'success',
      title: 'Success',
      message: 'Your changes have been saved successfully.',
    },
  },
};

export const Error: Story = {
  args: {
    content: {
      variant: 'error',
      title: 'Error',
      message: 'Something went wrong. Please try again.',
    },
  },
};

export const WithCustomDuration: Story = {
  args: {
    content: {
      variant: 'warning',
      title: 'Warning',
      message: 'This toast will auto-dismiss after 5 seconds.',
    },
    dismiss: {
      dismissible: true,
      autoDismiss: 5000,
      onDismiss: () => alert('Toast dismissed!'),
    },
  },
};

export const Dismissible: Story = {
  args: {
    content: {
      variant: 'info',
      title: 'Dismissible Toast',
      message: 'Click the × button to dismiss this toast.',
    },
    dismiss: {
      dismissible: true,
      onDismiss: () => alert('Toast dismissed!'),
    },
  },
};
