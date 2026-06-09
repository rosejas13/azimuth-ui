import type { Meta, StoryObj } from '@storybook/react';
import { PageLayout } from '../PageLayout';

const meta: Meta<typeof PageLayout> = {
  title: 'Components/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
  args: {
    children: (
      <div
        style={{
          padding: 'var(--azimuth-space-lg)',
          background: 'var(--azimuth-color-surface)',
          minHeight: '300px',
        }}
      >
        <h2 style={{ margin: 0, fontFamily: 'var(--azimuth-font-heading)' }}>
          Main Content
        </h2>
        <p style={{ color: 'var(--azimuth-color-text-secondary)' }}>
          This is the default page layout with just main content area.
        </p>
      </div>
    ),
  },
};

export const WithSidebar: Story = {
  args: {
    sidebar: (
      <div style={{ padding: 'var(--azimuth-space-md)' }}>
        <h3
          style={{
            margin: '0 0 var(--azimuth-space-sm)',
            fontFamily: 'var(--azimuth-font-heading)',
          }}
        >
          Sidebar
        </h3>
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--azimuth-space-xs)',
          }}
        >
          <span
            style={{
              color: 'var(--azimuth-color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Dashboard
          </span>
          <span
            style={{
              color: 'var(--azimuth-color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Settings
          </span>
          <span
            style={{
              color: 'var(--azimuth-color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Profile
          </span>
        </nav>
      </div>
    ),
    children: (
      <div style={{ padding: 'var(--azimuth-space-lg)', minHeight: '400px' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--azimuth-font-heading)' }}>
          Main Content
        </h2>
        <p style={{ color: 'var(--azimuth-color-text-secondary)' }}>
          Page with a left sidebar.
        </p>
      </div>
    ),
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    topNav: (
      <div
        style={{
          padding: 'var(--azimuth-space-sm) var(--azimuth-space-md)',
          background: 'var(--azimuth-color-surface)',
          borderBottom: '1px solid var(--azimuth-color-border)',
        }}
      >
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          My App
        </strong>
      </div>
    ),
    footer: (
      <div
        style={{
          padding: 'var(--azimuth-space-md)',
          textAlign: 'center',
          color: 'var(--azimuth-color-text-muted)',
          fontSize: 'var(--azimuth-fs-sm)',
        }}
      >
        &copy; 2026 My App. All rights reserved.
      </div>
    ),
    children: (
      <div style={{ padding: 'var(--azimuth-space-lg)', minHeight: '300px' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--azimuth-font-heading)' }}>
          Main Content
        </h2>
        <p style={{ color: 'var(--azimuth-color-text-secondary)' }}>
          Page with top navigation and footer.
        </p>
      </div>
    ),
  },
};

export const FullLayout: Story = {
  args: {
    topNav: (
      <div
        style={{
          padding: 'var(--azimuth-space-sm) var(--azimuth-space-md)',
          background: 'var(--azimuth-color-surface)',
          borderBottom: '1px solid var(--azimuth-color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <strong style={{ fontFamily: 'var(--azimuth-font-heading)' }}>
          My App
        </strong>
        <span
          style={{
            color: 'var(--azimuth-color-text-secondary)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          user@example.com
        </span>
      </div>
    ),
    sidebar: (
      <div style={{ padding: 'var(--azimuth-space-md)' }}>
        <h3
          style={{
            margin: '0 0 var(--azimuth-space-sm)',
            fontFamily: 'var(--azimuth-font-heading)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          Navigation
        </h3>
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--azimuth-space-xs)',
          }}
        >
          <span
            style={{
              color: 'var(--azimuth-color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Dashboard
          </span>
          <span
            style={{
              color: 'var(--azimuth-color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Analytics
          </span>
          <span
            style={{
              color: 'var(--azimuth-color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Settings
          </span>
        </nav>
      </div>
    ),
    footer: (
      <div
        style={{
          padding: 'var(--azimuth-space-md)',
          textAlign: 'center',
          color: 'var(--azimuth-color-text-muted)',
          fontSize: 'var(--azimuth-fs-sm)',
        }}
      >
        &copy; 2026 My App. All rights reserved.
      </div>
    ),
    children: (
      <div style={{ padding: 'var(--azimuth-space-lg)', minHeight: '300px' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--azimuth-font-heading)' }}>
          Dashboard
        </h2>
        <p style={{ color: 'var(--azimuth-color-text-secondary)' }}>
          Welcome to the full layout experience.
        </p>
      </div>
    ),
  },
};
