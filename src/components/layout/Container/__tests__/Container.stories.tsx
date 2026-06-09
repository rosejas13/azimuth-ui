import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '../Container';

const meta: Meta<typeof Container> = {
  title: 'Components/Container',
  component: Container,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <div
        style={{
          background: 'var(--color-surface-2)',
          padding: '2rem',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
        }}
      >
        Container content
      </div>
    ),
  },
};

export const WithMultipleChildren: Story = {
  render: () => (
    <Container>
      <div
        style={{
          background: 'var(--color-surface-2)',
          padding: '1rem',
          borderRadius: 'var(--radius-md) 0 0 0',
        }}
      >
        Section A
      </div>
      <div
        style={{
          background: 'var(--color-surface-1)',
          padding: '1rem',
          borderRadius: '0 var(--radius-md) 0 0',
        }}
      >
        Section B
      </div>
      <div
        style={{
          background: 'var(--color-surface-3)',
          padding: '1rem',
          borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        }}
      >
        Section C
      </div>
    </Container>
  ),
};
