import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '../Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Neutral: Story = {
  args: { children: 'Label', variant: 'neutral' },
};
export const Accent: Story = {
  args: { children: 'Featured', variant: 'accent' },
};
export const Success: Story = {
  args: { children: 'Approved', variant: 'success' },
};
export const Warning: Story = {
  args: { children: 'Pending', variant: 'warning' },
};
export const Danger: Story = {
  args: { children: 'Blocked', variant: 'danger' },
};
export const Info: Story = { args: { children: 'Updated', variant: 'info' } };
export const Selected: Story = {
  args: { children: 'Selected', selected: true },
};
export const Deletable: Story = {
  args: { children: 'Remove me', deletable: true },
};
export const WithAvatar: Story = {
  args: {
    children: 'Jane Smith',
    variant: 'accent',
    avatar: '👤',
  },
};

export const Interactive: Story = {
  args: { children: 'Toggle me', onClick: () => {} },
};

export const InteractiveSelected: Story = {
  args: { children: 'Selected toggle', onClick: () => {}, selected: true },
};

export const InteractiveStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Chip onClick={() => {}}>Default</Chip>
      <Chip onClick={() => {}} selected>
        Selected
      </Chip>
      <Chip onClick={() => {}} aria-disabled="true">
        Disabled
      </Chip>
      <Chip onClick={() => {}} deletable onDelete={() => {}}>
        Deletable
      </Chip>
    </div>
  ),
};
