import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

export const WithSelectedDate: Story = {
  args: {
    defaultValue: new Date(2026, 5, 15),
  },
};

export const WithMinMaxDates: Story = {
  args: {
    minDate: new Date(2026, 5, 1),
    maxDate: new Date(2026, 5, 20),
  },
};

export const WithWeekNumbers: Story = {
  args: {
    showWeekNumbers: true,
  },
};
