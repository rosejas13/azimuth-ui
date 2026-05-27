import type { Meta, StoryObj } from '@storybook/react';
import { ErrorPage } from './ErrorPage';
import { Button } from '@/primitives/Button/Button';

const meta: Meta<typeof ErrorPage> = {
  title: 'Components/ErrorPage',
  component: ErrorPage,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Default404: Story = {};

export const ServerError: Story = {
  args: {
    status: 500,
    title: 'Server error',
    description: 'An unexpected error occurred. Please try again later.',
  },
};

export const CustomAction: Story = {
  args: {
    status: 403,
    title: 'Access denied',
    description: 'You do not have permission to view this page.',
    action: <Button variant="primary">Go to Home</Button>,
  },
};
