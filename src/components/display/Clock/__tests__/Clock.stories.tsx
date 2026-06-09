import type { Meta, StoryObj } from '@storybook/react';
import { Clock } from '../Clock';

const meta: Meta<typeof Clock> = {
  title: 'Components/Clock',
  component: Clock,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Clock>;

export const Default: Story = {
  args: {
    mode: 'clock',
    format: '24h',
    size: 'md',
  },
};

export const TwelveHourFormat: Story = {
  args: {
    mode: 'clock',
    format: '12h',
    size: 'md',
  },
};

export const Stopwatch: Story = {
  args: {
    mode: 'stopwatch',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    mode: 'clock',
    format: '24h',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    mode: 'clock',
    format: '24h',
    size: 'lg',
  },
};
