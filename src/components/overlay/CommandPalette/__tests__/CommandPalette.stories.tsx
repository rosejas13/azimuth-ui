import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CommandPalette } from '../CommandPalette';
import type { CommandGroup } from '../CommandPalette';
import { Button } from '../../../input/Button';

const sampleGroups: CommandGroup[] = [
  {
    id: 'navigation',
    label: 'Navigation',
    items: [
      {
        id: 'home',
        label: 'Go to Home',
        shortcut: '⌘⇧H',
        keywords: ['dashboard'],
      },
      {
        id: 'settings',
        label: 'Open Settings',
        shortcut: '⌘,',
        keywords: ['preferences'],
      },
      { id: 'profile', label: 'View Profile', shortcut: '⌘⇧P' },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      {
        id: 'new',
        label: 'New File',
        shortcut: '⌘N',
        keywords: ['create', 'add'],
      },
      { id: 'save', label: 'Save', shortcut: '⌘S', keywords: ['write'] },
      {
        id: 'export',
        label: 'Export',
        shortcut: '⌘⇧E',
        keywords: ['download'],
      },
    ],
  },
];

const groupedGroups: CommandGroup[] = [
  {
    id: 'recent',
    label: 'Recent',
    items: [
      { id: 'r1', label: 'Project Alpha' },
      { id: 'r2', label: 'Report Q2' },
      { id: 'r3', label: 'Meeting Notes' },
    ],
  },
  {
    id: 'favorites',
    label: 'Favorites',
    items: [
      { id: 'f1', label: 'Dashboard', shortcut: '⌘1' },
      { id: 'f2', label: 'Inbox', shortcut: '⌘2' },
      { id: 'f3', label: 'Calendar', shortcut: '⌘3' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    items: [
      { id: 't1', label: 'Search', shortcut: '⌘F' },
      { id: 't2', label: 'Format', shortcut: '⌘⇧F' },
      { id: 't3', label: 'Lint', shortcut: '⌘⌥L' },
    ],
  },
];

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        groups={sampleGroups}
        onSelect={(item) => {
          console.log('Selected:', item.label);
          setOpen(false);
        }}
      />
    </>
  );
}

function GroupedCommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Grouped Palette</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        groups={groupedGroups}
        onSelect={(item) => {
          console.log('Selected:', item.label);
          setOpen(false);
        }}
      />
    </>
  );
}

function CustomPlaceholderDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Custom Placeholder</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        groups={sampleGroups}
        placeholder="Type a command or search..."
        emptyMessage="No matching commands"
        onSelect={(item) => {
          console.log('Selected:', item.label);
          setOpen(false);
        }}
      />
    </>
  );
}

function NoResultsDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open No Results Palette</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        groups={sampleGroups}
        onSelect={(item) => {
          console.log('Selected:', item.label);
          setOpen(false);
        }}
      />
    </>
  );
}

const meta: Meta<typeof CommandPalette> = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  render: () => <CommandPaletteDemo />,
};

export const WithGroupedCommands: Story = {
  render: () => <GroupedCommandPaletteDemo />,
};

export const CustomPlaceholder: Story = {
  render: () => <CustomPlaceholderDemo />,
};

export const NoResults: Story = {
  render: () => <NoResultsDemo />,
};
