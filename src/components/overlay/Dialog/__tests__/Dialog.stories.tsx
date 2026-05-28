import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dialog } from '../Dialog';
import { Button } from '../../../input/Button';

function DialogDemo(props: Partial<React.ComponentProps<typeof Dialog>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog {...props} visible={{ open, onClose: () => setOpen(false) }} />
    </>
  );
}

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Info: Story = {
  render: () => (
    <DialogDemo content={{ title: "Information", description: "This is an info dialog.", variant: "info" }} />
  ),
};

export const Warning: Story = {
  render: () => (
    <DialogDemo
      content={{ title: "Warning", description: "Are you sure you want to proceed?", variant: "warning" }}
      actions={{ confirm: { label: "Proceed" } }}
    />
  ),
};

export const Danger: Story = {
  render: () => (
    <DialogDemo
      content={{ title: "Delete Item", description: "This action cannot be undone.", variant: "danger" }}
      actions={{ confirm: { label: "Delete" } }}
    />
  ),
};

export const WithCustomBody: Story = {
  render: () => {
    return <CustomBodyDemo />;
  },
};

function CustomBodyDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Custom Dialog</Button>
      <Dialog visible={{ open, onClose: () => setOpen(false) }} content={{ title: "Custom Content" }}>
        <div style={{ padding: '16px 0' }}>
          <p>This dialog has custom body content instead of a description.</p>
          <p>You can put any React nodes here.</p>
        </div>
      </Dialog>
    </>
  );
}
