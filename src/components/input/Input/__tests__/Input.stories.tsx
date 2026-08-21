import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../Input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'left', 'inner'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Text: Story = {
  args: { label: 'Username', placeholder: 'Enter username' },
};
export const Email: Story = {
  args: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
};
export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: '••••••••' },
};
export const WithSubtitle: Story = {
  args: { label: 'Email', subtitle: "We'll never share your email." },
};
export const WithError: Story = {
  args: { label: 'Username', error: 'Username is taken' },
};
export const NumberWithSteppers: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    stepper: true,
    defaultValue: 50,
    min: 0,
    max: 100,
  },
};
export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true, placeholder: 'Cannot edit' },
};
export const WithCharCount: Story = {
  args: {
    label: 'Bio',
    maxLength: 40,
    showCharCount: true,
    defaultValue: 'Short bio',
  },
};
export const WithSuggestions: Story = {
  args: {
    label: 'Fruit',
    suggestions: { options: ['Apple', 'Banana', 'Avocado'] },
  },
};
export const ObjectLabel: Story = {
  args: {
    label: {
      text: 'Work email',
      subtitle: 'Use your company address.',
      required: true,
    },
    type: 'email',
    placeholder: 'you@company.com',
  },
};
export const InnerLabel: Story = {
  args: { label: 'Search', labelPosition: 'inner', placeholder: 'Type here' },
};
export const ExtraLarge: Story = {
  args: {
    label: 'Project name',
    size: 'xl',
    placeholder: 'Something memorable',
  },
};
export const ExtraLargeInner: Story = {
  args: {
    label: 'Project name',
    size: 'xl',
    labelPosition: 'inner',
    placeholder: 'Something memorable',
  },
};
