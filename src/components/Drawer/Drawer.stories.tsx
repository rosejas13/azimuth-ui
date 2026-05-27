import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from '../../primitives/Button';

function DrawerDemo(props: Partial<React.ComponentProps<typeof Drawer>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer {...props} open={open} onClose={() => setOpen(false)}>
        <p>Drawer content goes here.</p>
      </Drawer>
    </>
  );
}

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Left: Story = {
  render: () => <DrawerDemo side="left" title="Left Drawer" />,
};

export const Right: Story = {
  render: () => <DrawerDemo side="right" title="Right Drawer" />,
};

export const WithFooter: Story = {
  render: () => {
    return <FooterDemo />;
  },
};

function FooterDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Drawer with Footer"
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </div>
        }
      >
        <p>Drawer content with a footer containing actions.</p>
      </Drawer>
    </>
  );
}
