import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '../AspectRatio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  args: {
    children: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--azimuth-color-surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        16 / 9
      </div>
    ),
  },
};

export const Square: Story = {
  args: {
    ratio: 1,
    children: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--azimuth-color-surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        1 / 1
      </div>
    ),
  },
};

export const Portrait: Story = {
  args: {
    ratio: 3 / 4,
    children: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--azimuth-color-surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        3 / 4
      </div>
    ),
  },
};

export const Ultrawide: Story = {
  args: {
    ratio: 21 / 9,
    children: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--azimuth-color-surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        21 / 9
      </div>
    ),
  },
};

export const WithMaxWidth: Story = {
  args: {
    maxWidth: '400px',
    children: (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'var(--azimuth-color-surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        16 / 9 (max 400px)
      </div>
    ),
  },
};
