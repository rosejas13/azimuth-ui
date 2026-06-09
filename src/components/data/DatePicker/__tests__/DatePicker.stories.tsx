import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '../DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    label: 'Start date',
    value: new Date(2026, 5, 15),
    error: 'Please select a valid date',
  },
};

export const WithMinMax: Story = {
  args: {
    label: 'Travel date',
    value: new Date(2026, 5, 15),
    minDate: new Date(2026, 5, 1),
    maxDate: new Date(2026, 5, 20),
  },
};
