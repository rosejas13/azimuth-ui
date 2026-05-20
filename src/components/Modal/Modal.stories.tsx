import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../../primitives/Button';
import { Input } from '../../primitives/Input';
import { Stack } from '../../layout/Stack';

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit Profile"
        subtitle="Update your personal information"
        footer={
          <Stack direction="horizontal" justify="end" spacing="sm">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save Changes</Button>
          </Stack>
        }
      >
        <Stack spacing="md">
          <Input label="Full Name" defaultValue="John Doe" />
          <Input label="Email" type="email" defaultValue="john@example.com" />
        </Stack>
      </Modal>
    </>
  );
}

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Demo: Story = {
  render: () => <ModalDemo />,
};
