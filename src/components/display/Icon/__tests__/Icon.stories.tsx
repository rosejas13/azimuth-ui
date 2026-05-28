import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../Icon';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = { args: { children: '★', size: 'md' } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon size="sm">★</Icon>
      <Icon size="md">★</Icon>
      <Icon size="lg">★</Icon>
      <Icon size="xl">★</Icon>
      <Icon size="xl2">★</Icon>
    </div>
  ),
};

export const CustomSvg: Story = {
  args: {
    children: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
};
