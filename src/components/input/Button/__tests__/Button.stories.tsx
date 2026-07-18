import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'link', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Primary Button', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Secondary Button', variant: 'secondary' },
};

export const Tertiary: Story = {
  args: { children: 'Tertiary Button', variant: 'tertiary' },
};

export const Link: Story = {
  args: { children: 'Link Button', variant: 'link' },
};

export const Danger: Story = {
  args: { children: 'Danger Button', variant: 'danger' },
};

export const Small: Story = { args: { children: 'Small', size: 'sm' } };

export const Large: Story = { args: { children: 'Large', size: 'lg' } };

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
};

export const WithIcon: Story = {
  args: { children: 'Add Item', icon: <span>+</span> },
};

export const IconOnly: Story = {
  args: { icon: <span>X</span>, variant: 'secondary', 'aria-label': 'Close' },
};

export const AsChildLink: Story = {
  args: {
    asChild: true,
    variant: 'primary',
    children: <a href="/test">Start Your Project</a>,
  },
};
