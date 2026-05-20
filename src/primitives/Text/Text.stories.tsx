import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'lg', 'base', 'sm', 'xs'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'accent'],
    },
    variant: {
      control: 'select',
      options: ['display', 'mono'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Heading1: Story = { args: { children: 'Heading 1', size: 'h1' } };
export const Heading2: Story = { args: { children: 'Heading 2', size: 'h2' } };
export const Heading3: Story = { args: { children: 'Heading 3', size: 'h3' } };
export const Body: Story = { args: { children: 'The quick brown fox jumps over the lazy dog.', size: 'base' } };
export const Secondary: Story = { args: { children: 'Secondary text', color: 'secondary' } };
export const Muted: Story = { args: { children: 'Muted text', color: 'muted', size: 'sm' } };
export const Mono: Story = { args: { children: 'const x = 42;', variant: 'mono', size: 'sm' } };
