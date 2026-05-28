import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from '../Kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Basic: Story = { args: { children: 'Ctrl+S' } };
export const Mac: Story = { args: { children: '⌘+C' } };
export const Composite: Story = { args: { children: 'Ctrl+Shift+Z' } };
