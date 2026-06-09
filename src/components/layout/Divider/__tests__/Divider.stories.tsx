import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from '../Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = { args: {} };

export const WithLabel: Story = {
  render: () => (
    <div>
      <p>Content above the divider</p>
      <Divider />
      <p>Content below the divider</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: 80 }}
    >
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Center</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};
