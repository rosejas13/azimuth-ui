import type { Meta, StoryObj } from '@storybook/react';
import { Flyout } from '../Flyout';
import { Button } from '../../../input/Button';

const meta: Meta<typeof Flyout> = {
  title: 'Components/Flyout',
  component: Flyout,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Flyout>;

export const Default: Story = {
  args: {
    trigger: <Button>Hover me</Button>,
    content: (
      <div style={{ padding: 'var(--azimuth-space-sm)' }}>Flyout content</div>
    ),
    openDelay: 0,
    closeDelay: 0,
  },
};

export const WithCustomPlacement: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--azimuth-space-lg)',
        padding: '40px',
      }}
    >
      <Flyout
        trigger={<Button>Top</Button>}
        side="top"
        content={
          <div style={{ padding: 'var(--azimuth-space-sm)' }}>
            Top flyout content
          </div>
        }
        openDelay={0}
        closeDelay={0}
      />
      <Flyout
        trigger={<Button>Bottom</Button>}
        side="bottom"
        content={
          <div style={{ padding: 'var(--azimuth-space-sm)' }}>
            Bottom flyout content
          </div>
        }
        openDelay={0}
        closeDelay={0}
      />
      <Flyout
        trigger={<Button>Left</Button>}
        side="left"
        content={
          <div style={{ padding: 'var(--azimuth-space-sm)' }}>
            Left flyout content
          </div>
        }
        openDelay={0}
        closeDelay={0}
      />
      <Flyout
        trigger={<Button>Right</Button>}
        side="right"
        content={
          <div style={{ padding: 'var(--azimuth-space-sm)' }}>
            Right flyout content
          </div>
        }
        openDelay={0}
        closeDelay={0}
      />
    </div>
  ),
};

export const WithArrow: Story = {
  args: {
    trigger: <Button>Hover for tooltip</Button>,
    content: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--azimuth-space-sm)',
        }}
      >
        <span style={{ color: 'var(--azimuth-color-primary)' }}>→</span>
        <span>More details available</span>
      </div>
    ),
    side: 'right',
    openDelay: 0,
    closeDelay: 0,
  },
};

export const Disabled: Story = {
  args: {
    trigger: <Button>Hover me (disabled)</Button>,
    content: (
      <div style={{ padding: 'var(--azimuth-space-sm)' }}>
        This should not appear
      </div>
    ),
    openDelay: 999999,
    closeDelay: 0,
  },
};
