import type { Meta, StoryObj } from '@storybook/react';
import { DateTimePicker } from '../DateTimePicker';

const meta: Meta<typeof DateTimePicker> = {
  title: 'Components/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {};

export const WithSeconds: Story = {
  args: {
    display: {
      showSeconds: true,
    },
  },
};

export const WithConstraints: Story = {
  args: {
    constraints: {
      minDate: new Date(2026, 5, 1),
      maxDate: new Date(2026, 5, 20),
    },
  },
};

export const WithCustomSteps: Story = {
  args: {
    constraints: {
      hourStep: 2,
      minuteStep: 15,
    },
  },
};
