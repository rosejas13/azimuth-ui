import type { Meta, StoryObj } from '@storybook/react';
import { ResizablePanel } from '../ResizablePanel';

const meta: Meta<typeof ResizablePanel> = {
  title: 'Components/ResizablePanel',
  component: ResizablePanel,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResizablePanel>;

const panelStyle: React.CSSProperties = {
  padding: 'var(--azimuth-space-lg)',
  background: 'var(--azimuth-color-surface)',
  height: '100%',
  boxSizing: 'border-box',
  overflow: 'auto',
};

export const Default: Story = {
  args: {
    direction: 'horizontal',
    style: {
      height: '300px',
      border: '1px solid var(--azimuth-color-border)',
      borderRadius: 'var(--azimuth-radius-md)',
    },
    children: [
      <div key="a" style={panelStyle}>
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          Panel A
        </strong>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Drag the divider to resize.
        </p>
      </div>,
      <div
        key="b"
        style={{
          ...panelStyle,
          background:
            'var(--azimuth-color-surface-alt, var(--azimuth-color-bg))',
        }}
      >
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          Panel B
        </strong>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Content on the right side.
        </p>
      </div>,
    ],
  },
};

export const VerticalSplit: Story = {
  args: {
    direction: 'vertical',
    style: {
      height: '400px',
      border: '1px solid var(--azimuth-color-border)',
      borderRadius: 'var(--azimuth-radius-md)',
    },
    children: [
      <div key="top" style={panelStyle}>
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          Top Panel
        </strong>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Drag the divider up or down.
        </p>
      </div>,
      <div
        key="bottom"
        style={{
          ...panelStyle,
          background:
            'var(--azimuth-color-surface-alt, var(--azimuth-color-bg))',
        }}
      >
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          Bottom Panel
        </strong>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Content on the bottom.
        </p>
      </div>,
    ],
  },
};

export const WithMinSizes: Story = {
  args: {
    direction: 'horizontal',
    minSize: 100,
    style: {
      height: '300px',
      border: '1px solid var(--azimuth-color-border)',
      borderRadius: 'var(--azimuth-radius-md)',
    },
    children: [
      <div key="a" style={panelStyle}>
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          Panel A
        </strong>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Minimum 100px.
        </p>
      </div>,
      <div
        key="b"
        style={{
          ...panelStyle,
          background:
            'var(--azimuth-color-surface-alt, var(--azimuth-color-bg))',
        }}
      >
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          Panel B
        </strong>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Minimum 100px.
        </p>
      </div>,
    ],
  },
};

export const CustomInitialSize: Story = {
  args: {
    direction: 'horizontal',
    defaultSizes: [70, 30],
    style: {
      height: '300px',
      border: '1px solid var(--azimuth-color-border)',
      borderRadius: 'var(--azimuth-radius-md)',
    },
    children: [
      <div key="a" style={panelStyle}>
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          Panel A (70%)
        </strong>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Wider panel by default.
        </p>
      </div>,
      <div
        key="b"
        style={{
          ...panelStyle,
          background:
            'var(--azimuth-color-surface-alt, var(--azimuth-color-bg))',
        }}
      >
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          Panel B (30%)
        </strong>
        <p
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Narrower panel.
        </p>
      </div>,
    ],
  },
};
