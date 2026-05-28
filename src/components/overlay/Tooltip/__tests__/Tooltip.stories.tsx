import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '../Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  args: { content: 'Simple tooltip', children: <span>Hover me</span> },
};

export const PositionTop: Story = {
  args: { content: 'Tooltip on top', position: 'top', children: <span>Hover me</span> },
};

export const PositionBottom: Story = {
  args: { content: 'Tooltip on bottom', position: 'bottom', children: <span>Hover me</span> },
};

export const PositionLeft: Story = {
  args: { content: 'Tooltip on left', position: 'left', children: <span>Hover me</span> },
};

export const PositionRight: Story = {
  args: { content: 'Tooltip on right', position: 'right', children: <span>Hover me</span> },
};

export const LongContent: Story = {
  args: {
    content: 'This is a much longer tooltip that contains detailed information about the element being hovered.',
    children: <span>Hover me</span>,
  },
};

export const CustomDelay: Story = {
  args: {
    content: 'Appears after 1 second',
    delay: 1000,
    children: <span>Hover me</span>,
  },
};
