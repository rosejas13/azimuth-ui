import type { Meta, StoryObj } from '@storybook/react';
import { Meter } from '../Meter';

const meta: Meta<typeof Meter> = {
  title: 'Components/Meter',
  component: Meter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Meter>;

export const DiskUsage: Story = {
  args: {
    value: 96,
    label: 'Disk usage',
    low: 90,
    high: 95,
  },
};

export const ScoreWithValue: Story = {
  args: {
    value: 7,
    min: 0,
    max: 10,
    label: 'Lighthouse score',
    showValue: true,
  },
};

export const Plain: Story = {
  args: {
    value: 42,
    label: 'Storage used',
  },
};
