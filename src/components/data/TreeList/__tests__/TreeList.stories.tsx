import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TreeList } from '../TreeList';
import type { TreeNode } from '../TreeList';

const flatData: TreeNode[] = [
  { id: '1', label: 'Documents' },
  { id: '2', label: 'Images' },
  { id: '3', label: 'Music' },
  { id: '4', label: 'Videos' },
];

const nestedData: TreeNode[] = [
  {
    id: '1',
    label: 'Documents',
    children: [
      { id: '1-1', label: 'Work', children: [{ id: '1-1-1', label: 'Reports' }, { id: '1-1-2', label: 'Timesheets' }] },
      { id: '1-2', label: 'Personal', children: [{ id: '1-2-1', label: 'Taxes' }, { id: '1-2-2', label: 'Recipes' }] },
    ],
  },
  {
    id: '2',
    label: 'Media',
    children: [
      { id: '2-1', label: 'Photos' },
      { id: '2-2', label: 'Videos' },
    ],
  },
];

const meta: Meta<typeof TreeList> = {
  title: 'Components/TreeList',
  component: TreeList,
  tags: ['autodocs'],
  argTypes: {
    showLines: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TreeList>;

export const Simple: Story = {
  args: {
    data: flatData,
  },
};

export const Nested: Story = {
  render: () => {
    const [expanded] = useState<string[]>(['1', '1-1']);
    return <TreeList data={nestedData} defaultExpanded={expanded} />;
  },
};

export const WithLines: Story = {
  render: () => {
    const [expanded] = useState<string[]>(['1', '1-1']);
    return <TreeList data={nestedData} defaultExpanded={expanded} showLines />;
  },
};

export const DisabledNodes: Story = {
  render: () => {
    const disabledData: TreeNode[] = [
      { id: '1', label: 'Documents', disabled: true, children: [{ id: '1-1', label: 'Reports' }] },
      { id: '2', label: 'Images' },
      { id: '3', label: 'Music', disabled: true },
    ];
    const [expanded] = useState<string[]>(['1']);
    return <TreeList data={disabledData} defaultExpanded={expanded} />;
  },
};
