import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from '../Menu';
import { Button } from '../../../input/Button';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  args: {
    trigger: <Button variant="secondary">Actions</Button>,
    items: [
      { key: 'edit', label: 'Edit' },
      { key: 'duplicate', label: 'Duplicate' },
      { key: 'export', label: 'Export' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    trigger: <Button variant="secondary">Options</Button>,
    items: [
      { key: 'view', label: 'View', icon: <span>&#128065;</span> },
      { key: 'edit', label: 'Edit', icon: <span>&#9998;</span> },
      { key: 'share', label: 'Share', icon: <span>&#128228;</span> },
    ],
  },
};

export const WithDangerAndDisabled: Story = {
  args: {
    trigger: <Button variant="secondary">Manage</Button>,
    items: [
      { key: 'edit', label: 'Edit' },
      { key: 'rename', label: 'Rename' },
      { key: 'sep1', label: '', separator: true },
      { key: 'move', label: 'Move to...', disabled: true },
      { key: 'sep2', label: '', separator: true },
      { key: 'delete', label: 'Delete', danger: true },
    ],
  },
};

export const SideRight: Story = {
  args: {
    side: 'right',
    trigger: <Button variant="secondary">Right Menu</Button>,
    items: [
      { key: 'profile', label: 'View Profile' },
      { key: 'settings', label: 'Settings' },
      { key: 'sep1', label: '', separator: true },
      { key: 'logout', label: 'Logout', danger: true },
    ],
  },
};

export const ContextMenu: Story = {
  args: {
    triggerMode: 'context',
    trigger: (
      <div
        style={{ padding: '1rem', border: '1px dashed #888', borderRadius: 4 }}
      >
        Right-click here
      </div>
    ),
    items: [
      { key: 'edit', label: 'Edit', icon: <span>&#9998;</span> },
      { key: 'copy', label: 'Copy', icon: <span>&#128203;</span> },
      { key: 'sep1', label: '', separator: true },
      { key: 'delete', label: 'Delete', danger: true },
    ],
  },
};
