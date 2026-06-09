import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '../Container';

function SampleContent() {
  return (
    <div
      style={{
        background: 'var(--azimuth-color-primary-subtle)',
        padding: '2rem',
        borderRadius: 'var(--azimuth-radius-md)',
        textAlign: 'center',
        color: 'var(--azimuth-color-primary)',
        fontWeight: 600,
      }}
    >
      Container content
    </div>
  );
}

const meta: Meta<typeof Container> = {
  title: 'Components/Container',
  component: Container,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: <SampleContent />,
    size: 'lg',
  },
};

export const Narrow: Story = {
  args: {
    children: <SampleContent />,
    size: 'sm',
  },
};

export const Wide: Story = {
  args: {
    children: <SampleContent />,
    size: 'xl',
  },
};
