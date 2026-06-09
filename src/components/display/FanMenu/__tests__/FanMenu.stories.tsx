import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FanMenu } from '../FanMenu';

const meta: Meta<typeof FanMenu> = {
  title: 'Components/FanMenu',
  component: FanMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FanMenu>;

const defaultOptions = [
  { key: 'edit', label: 'Edit', onClick: () => console.log('Edit') },
  { key: 'share', label: 'Share', onClick: () => console.log('Share') },
  { key: 'delete', label: 'Delete', onClick: () => console.log('Delete') },
  {
    key: 'settings',
    label: 'Settings',
    onClick: () => console.log('Settings'),
  },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
        <FanMenu
          options={defaultOptions}
          open={open}
          onOpenChange={setOpen}
          direction="up"
        />
      </div>
    );
  },
};

export const DirectionDown: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
        <FanMenu
          options={defaultOptions}
          open={open}
          onOpenChange={setOpen}
          direction="down"
        />
      </div>
    );
  },
};

export const DirectionRight: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
        <FanMenu
          options={defaultOptions}
          open={open}
          onOpenChange={setOpen}
          direction="right"
        />
      </div>
    );
  },
};

export const CustomTrigger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
        <FanMenu
          options={defaultOptions}
          open={open}
          onOpenChange={setOpen}
          direction="up"
          trigger={<span style={{ fontSize: 20 }}>☰</span>}
        />
      </div>
    );
  },
};
