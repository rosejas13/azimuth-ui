import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const defaultItems = [
  { id: '1', title: 'Panel 1', content: <p>Panel content here</p> },
  { id: '2', title: 'Panel 2', content: <p>Panel content here</p> },
  { id: '3', title: 'Panel 3', content: <p>Panel content here</p> },
];

export const Default: Story = {
  args: { items: defaultItems },
};

export const Bordered: Story = {
  args: { items: defaultItems, variant: 'bordered' },
};

export const MultipleOpen: Story = {
  args: { items: defaultItems, multiple: true },
};
