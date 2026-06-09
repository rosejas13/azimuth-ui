import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '../ScrollArea';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  args: {
    orientation: 'vertical',
    style: {
      height: 200,
      width: 300,
      border: '1px solid var(--azimuth-color-border)',
      borderRadius: 'var(--azimuth-radius)',
    },
    children: (
      <div style={{ padding: 'var(--azimuth-space-md)' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 var(--azimuth-space-sm)' }}>
            Item {i + 1} — vertical scrolling content that overflows the
            container.
          </p>
        ))}
      </div>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    style: {
      height: 100,
      width: 300,
      border: '1px solid var(--azimuth-color-border)',
      borderRadius: 'var(--azimuth-radius)',
    },
    children: (
      <div
        style={{
          display: 'flex',
          gap: 'var(--azimuth-space-md)',
          padding: 'var(--azimuth-space-md)',
          whiteSpace: 'nowrap',
        }}
      >
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            style={{
              flex: '0 0 auto',
              width: 120,
              height: 60,
              background: 'var(--azimuth-color-surface-hover)',
              borderRadius: 'var(--azimuth-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--azimuth-color-text-secondary)',
              fontSize: 'var(--azimuth-fs-sm)',
            }}
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};

export const BothOrientations: Story = {
  args: {
    orientation: 'both',
    style: {
      height: 250,
      width: 300,
      border: '1px solid var(--azimuth-color-border)',
      borderRadius: 'var(--azimuth-radius)',
    },
    children: (
      <div style={{ width: 600, padding: 'var(--azimuth-space-md)' }}>
        {Array.from({ length: 15 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 var(--azimuth-space-sm)' }}>
            Row {i + 1} — this content is wider than the container and also tall
            enough to scroll vertically.
          </p>
        ))}
      </div>
    ),
  },
};

export const HideScrollbar: Story = {
  args: {
    orientation: 'vertical',
    hideScrollbar: true,
    style: {
      height: 200,
      width: 300,
      border: '1px solid var(--azimuth-color-border)',
      borderRadius: 'var(--azimuth-radius)',
    },
    children: (
      <div style={{ padding: 'var(--azimuth-space-md)' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} style={{ margin: '0 0 var(--azimuth-space-sm)' }}>
            Item {i + 1} — scrollbar is hidden but scrolling still works.
          </p>
        ))}
      </div>
    ),
  },
};
