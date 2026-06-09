import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from '../FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {};

export const WithAcceptedTypes: Story = {
  args: {
    accept: 'image/*,.pdf',
    multiple: true,
  },
};

export const SingleFile: Story = {
  args: {
    multiple: false,
  },
};

export const WithMaxSize: Story = {
  args: {
    maxSize: 5,
    accept: '.jpg,.png,.gif',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
