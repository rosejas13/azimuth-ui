import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SlideSheet } from './SlideSheet';
import { Button } from '@/primitives/Button/Button';

const meta: Meta<typeof SlideSheet> = {
  title: 'Components/SlideSheet',
  component: SlideSheet,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SlideSheet>;

function BottomDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Bottom Sheet</Button>
      <SlideSheet open={open} onClose={() => setOpen(false)} title="Bottom Sheet">
        <p>This is a bottom sheet with content.</p>
      </SlideSheet>
    </>
  );
}

function LeftDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Left Sheet</Button>
      <SlideSheet open={open} onClose={() => setOpen(false)} side="left" title="Side Panel">
        <p>This is a left-side panel.</p>
      </SlideSheet>
    </>
  );
}

function RightDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Right Sheet</Button>
      <SlideSheet open={open} onClose={() => setOpen(false)} side="right" title="Side Panel">
        <p>This is a right-side panel.</p>
      </SlideSheet>
    </>
  );
}

export const Bottom: Story = { render: () => <BottomDemo /> };
export const Left: Story = { render: () => <LeftDemo /> };
export const Right: Story = { render: () => <RightDemo /> };
