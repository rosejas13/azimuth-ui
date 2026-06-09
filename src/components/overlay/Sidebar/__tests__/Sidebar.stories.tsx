import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sidebar } from '../Sidebar';
import type { SidebarItem } from '../Sidebar';
import { Button } from '../../../input/Button';

const baseItems: SidebarItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊', badge: 3 },
  { key: 'inbox', label: 'Inbox', icon: '📬', badge: 12 },
  { key: 'analytics', label: 'Analytics', icon: '📈' },
  {
    key: 'settings',
    label: 'Settings',
    icon: '⚙️',
    children: [
      { key: 'profile', label: 'Profile' },
      { key: 'security', label: 'Security' },
      { key: 'notifications', label: 'Notifications', badge: 5 },
    ],
  },
  { key: 'help', label: 'Help & Support', icon: '❓' },
];

const containerStyle: React.CSSProperties = {
  display: 'flex',
  height: '420px',
  border: '1px solid var(--azimuth-color-border)',
  borderRadius: 'var(--azimuth-radius)',
  overflow: 'hidden',
};

const contentAreaStyle: React.CSSProperties = {
  flex: 1,
  padding: 'var(--azimuth-space-lg)',
  background: 'var(--azimuth-color-bg)',
};

const headerEl = (
  <div style={{ fontWeight: 600, fontSize: 'var(--azimuth-fs-sm)' }}>
    My App
  </div>
);
const footerEl = (
  <Button variant="secondary" size="sm">
    Logout
  </Button>
);

function SidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('dashboard');
  return (
    <div style={containerStyle}>
      <Sidebar
        items={baseItems}
        activeKey={activeKey}
        onSelect={setActiveKey}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        header={headerEl}
        footer={footerEl}
      />
      <div style={contentAreaStyle}>
        <p style={{ color: 'var(--azimuth-color-text-secondary)' }}>
          Selected: {activeKey}
        </p>
      </div>
    </div>
  );
}

function RightSidebarDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('dashboard');
  return (
    <div style={{ ...containerStyle, flexDirection: 'row-reverse' }}>
      <Sidebar
        items={baseItems}
        activeKey={activeKey}
        onSelect={setActiveKey}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        header={headerEl}
        footer={footerEl}
        style={{
          borderRight: 'none',
          borderLeft: '1px solid var(--azimuth-color-border)',
        }}
      />
      <div style={contentAreaStyle}>
        <p style={{ color: 'var(--azimuth-color-text-secondary)' }}>
          Selected: {activeKey}
        </p>
      </div>
    </div>
  );
}

function OverlayModeDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('dashboard');
  return (
    <div style={{ ...containerStyle, position: 'relative' }}>
      <div style={contentAreaStyle}>
        <p style={{ color: 'var(--azimuth-color-text-secondary)' }}>
          Content behind overlay sidebar
        </p>
        <p
          style={{
            color: 'var(--azimuth-color-text-muted)',
            fontSize: 'var(--azimuth-fs-sm)',
          }}
        >
          The sidebar overlays this content with absolute positioning.
        </p>
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        <Sidebar
          items={baseItems}
          activeKey={activeKey}
          onSelect={setActiveKey}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          header={headerEl}
          footer={footerEl}
          style={{
            boxShadow: 'var(--azimuth-shadow-lg)',
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}

function WithCustomWidthDemo() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState('dashboard');
  return (
    <div style={containerStyle}>
      <Sidebar
        items={baseItems}
        activeKey={activeKey}
        onSelect={setActiveKey}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        header={headerEl}
        footer={footerEl}
        style={{ width: collapsed ? '80px' : '300px' }}
      />
      <div style={contentAreaStyle}>
        <p style={{ color: 'var(--azimuth-color-text-secondary)' }}>
          Selected: {activeKey}
        </p>
      </div>
    </div>
  );
}

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const LeftSidebar: Story = {
  render: () => <SidebarDemo />,
};

export const RightSidebar: Story = {
  render: () => <RightSidebarDemo />,
};

export const OverlayMode: Story = {
  render: () => <OverlayModeDemo />,
};

export const WithCustomWidth: Story = {
  render: () => <WithCustomWidthDemo />,
};
