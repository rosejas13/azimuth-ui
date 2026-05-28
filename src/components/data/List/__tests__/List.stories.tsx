import type { Meta, StoryObj } from '@storybook/react';
import { List } from '../List';

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    ordered: { control: 'boolean' },
    bulleted: { control: 'boolean' },
    spacing: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof List>;

export const Unordered: Story = {
  args: {
    children: (
      <>
        <List.Item>First item</List.Item>
        <List.Item>Second item</List.Item>
        <List.Item>Third item</List.Item>
      </>
    ),
  },
};

export const Ordered: Story = {
  args: {
    ordered: true,
    children: (
      <>
        <List.Item>First step</List.Item>
        <List.Item>Second step</List.Item>
        <List.Item>Third step</List.Item>
      </>
    ),
  },
};

export const Bulleted: Story = {
  args: {
    bulleted: true,
    children: (
      <>
        <List.Item>Apples</List.Item>
        <List.Item>Bananas</List.Item>
        <List.Item>Cherries</List.Item>
      </>
    ),
  },
};

export const SpacingVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Sm</div>
        <List spacing="sm">
          <List.Item>Item one</List.Item>
          <List.Item>Item two</List.Item>
          <List.Item>Item three</List.Item>
        </List>
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Md</div>
        <List spacing="md">
          <List.Item>Item one</List.Item>
          <List.Item>Item two</List.Item>
          <List.Item>Item three</List.Item>
        </List>
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Lg</div>
        <List spacing="lg">
          <List.Item>Item one</List.Item>
          <List.Item>Item two</List.Item>
          <List.Item>Item three</List.Item>
        </List>
      </div>
    </div>
  ),
};
