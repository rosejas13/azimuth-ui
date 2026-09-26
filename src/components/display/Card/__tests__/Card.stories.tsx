import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../Card';
import { Text } from '../../Text';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    expandable: { control: 'boolean' },
    hoverable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  args: {
    header: <Text weight="semibold">Basic Card</Text>,
    children: (
      <Text size="sm" color="secondary">
        A basic card with header and body content.
      </Text>
    ),
  },
};

export const Expandable: Story = {
  args: {
    header: <Text weight="semibold">Expandable Card</Text>,
    expandable: true,
    children: (
      <Text size="sm" color="secondary">
        Click the toggle to expand or collapse this content.
      </Text>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    header: <Text weight="semibold">Card with Footer</Text>,
    children: (
      <Text size="sm" color="secondary">
        Card body content.
      </Text>
    ),
    footer: (
      <Text size="xs" color="muted">
        Footer content
      </Text>
    ),
  },
};

export const HoverableFalse: Story = {
  args: {
    header: <Text weight="semibold">Card (hoverable={false})</Text>,
    hoverable: false,
    children: (
      <Text size="sm" color="secondary">
        A basic card with header and body content. No hover styles applied.
      </Text>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: 'Card with Actions',
    children: (
      <Text size="sm" color="secondary">
        Actions render in a subtle row pinned under the body.
      </Text>
    ),
    actions: (
      <>
        <button type="button">Cancel</button>
        <button type="button">Save</button>
      </>
    ),
  },
};

export const CompactTitle: Story = {
  args: {
    title: 'Compact Card',
    titleSize: 'sm',
    children: (
      <Text size="sm" color="secondary">
        A compact card with a smaller title for dense sections.
      </Text>
    ),
  },
};

export const SectionCard: Story = {
  args: {
    title: 'Section header',
    titleSize: 'sm',
    children: (
      <Text size="sm" color="secondary">
        13px section header with right-aligned controls in the action row.
      </Text>
    ),
    actions: <button type="button">Edit section</button>,
  },
};
