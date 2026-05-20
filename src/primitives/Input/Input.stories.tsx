import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Text: Story = { args: { label: 'Username', placeholder: 'Enter username' } };
export const Email: Story = { args: { label: 'Email', type: 'email', placeholder: 'you@example.com' } };
export const Password: Story = { args: { label: 'Password', type: 'password', placeholder: '••••••••' } };
export const WithSubtitle: Story = { args: { label: 'Email', type: 'email', subtitle: "We'll never share your email." } };
export const WithError: Story = { args: { label: 'Username', error: 'Username is taken' } };
export const NumberWithSteppers: Story = { args: { label: 'Quantity', type: 'number', showSteppers: true, min: 0, max: 100, defaultValue: 50 } };
export const Disabled: Story = { args: { label: 'Disabled', disabled: true, placeholder: 'Cannot edit' } };
