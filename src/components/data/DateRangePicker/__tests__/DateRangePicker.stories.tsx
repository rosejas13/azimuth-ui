import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from '../DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Select date range',
  },
};

export const WithMinMaxDates: Story = {
  args: {
    minDate: new Date(2026, 5, 1),
    maxDate: new Date(2026, 5, 20),
  },
};

export const WithTime: Story = {
  args: {
    includeTime: true,
  },
};
