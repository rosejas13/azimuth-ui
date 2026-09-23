import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ConfirmDialog } from '../ConfirmDialog';
import { Button } from '@/components/input/Button';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Overlay/ConfirmDialog',
  component: ConfirmDialog,
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete partner
      </Button>
      <ConfirmDialog
        visible={{ open, onClose: () => setOpen(false) }}
        title="Delete partner?"
        message="Deletes take effect when you press Save all."
        confirmLabel="Delete"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

function WarnDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Leave form</Button>
      <ConfirmDialog
        visible={{ open, onClose: () => setOpen(false) }}
        title="Unsaved changes"
        message="Leave without saving?"
        severity="warn"
        confirmLabel="Leave"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const Danger: Story = { render: () => <ConfirmDialogDemo /> };
export const Warn: Story = { render: () => <WarnDemo /> };
