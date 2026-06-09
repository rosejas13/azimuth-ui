import type { Meta, StoryObj } from '@storybook/react';
import { SimpleChart } from '../SimpleChart';

const meta: Meta<typeof SimpleChart> = {
  title: 'Components/SimpleChart',
  component: SimpleChart,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SimpleChart>;

export const BarChart: Story = {
  args: {
    chart: {
      type: 'bar',
      data: [
        { label: 'Jan', value: 120 },
        { label: 'Feb', value: 200 },
        { label: 'Mar', value: 150 },
        { label: 'Apr', value: 80 },
        { label: 'May', value: 270 },
      ],
    },
  },
};

export const LineChart: Story = {
  args: {
    chart: {
      type: 'line',
      data: [
        { label: 'Mon', value: 40 },
        { label: 'Tue', value: 80 },
        { label: 'Wed', value: 60 },
        { label: 'Thu', value: 120 },
        { label: 'Fri', value: 90 },
      ],
    },
  },
};

export const PieChart: Story = {
  args: {
    chart: {
      type: 'pie',
      data: [
        { label: 'Chrome', value: 45 },
        { label: 'Firefox', value: 25 },
        { label: 'Safari', value: 20 },
        { label: 'Edge', value: 10 },
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    chart: {
      data: [],
    },
  },
};

export const CustomColors: Story = {
  args: {
    chart: {
      type: 'bar',
      data: [
        { label: 'Q1', value: 100 },
        { label: 'Q2', value: 150 },
        { label: 'Q3', value: 200 },
        { label: 'Q4', value: 180 },
      ],
      colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'],
    },
  },
};

export const HorizontalBar: Story = {
  args: {
    chart: {
      type: 'bar',
      horizontal: true,
      data: [
        { label: 'Design', value: 30 },
        { label: 'Development', value: 50 },
        { label: 'QA', value: 20 },
      ],
    },
  },
};

export const WithAxisLabels: Story = {
  args: {
    chart: {
      type: 'bar',
      data: [
        { label: 'Product A', value: 240 },
        { label: 'Product B', value: 180 },
        { label: 'Product C', value: 320 },
      ],
    },
    display: {
      xLabel: 'Products',
      yLabel: 'Revenue ($K)',
    },
  },
};
