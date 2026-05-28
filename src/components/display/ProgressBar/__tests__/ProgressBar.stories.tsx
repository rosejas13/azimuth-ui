import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '../ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'accent', 'success', 'warning', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Determinate: Story = { args: { value: 60 } };

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <ProgressBar value={75} color="primary" />
      <ProgressBar value={75} color="accent" />
      <ProgressBar value={75} color="success" />
      <ProgressBar value={75} color="warning" />
      <ProgressBar value={75} color="danger" />
    </div>
  ),
};

export const Indeterminate: Story = { args: { indeterminate: true } };
export const WithPercentage: Story = { args: { value: 60, showPercentage: true } };
