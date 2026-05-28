import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../Card';
import { Text } from '../../Text';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    expandable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  args: {
    header: <Text weight="semibold">Basic Card</Text>,
    children: <Text element={{ size: 'sm' }} color="secondary">A basic card with header and body content.</Text>,
  },
};

export const Expandable: Story = {
  args: {
    header: <Text weight="semibold">Expandable Card</Text>,
    expandable: true,
    children: <Text element={{ size: 'sm' }} color="secondary">Click the toggle to expand or collapse this content.</Text>,
  },
};

export const WithFooter: Story = {
  args: {
    header: <Text weight="semibold">Card with Footer</Text>,
    children: <Text element={{ size: 'sm' }} color="secondary">Card body content.</Text>,
    footer: <Text element={{ size: 'xs' }} color="muted">Footer content</Text>,
  },
};
