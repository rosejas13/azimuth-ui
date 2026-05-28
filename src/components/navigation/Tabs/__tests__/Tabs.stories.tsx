import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '../Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const defaultTabs = [
  { id: 'tab1', label: 'Tab 1', content: <p>Content for tab 1.</p> },
  { id: 'tab2', label: 'Tab 2', content: <p>Content for tab 2.</p> },
  { id: 'tab3', label: 'Tab 3', content: <p>Content for tab 3.</p> },
];

export const Underline: Story = {
  args: { tabs: defaultTabs, variant: 'underline' },
};

export const Pills: Story = {
  args: { tabs: defaultTabs, variant: 'pills' },
};

export const Buttons: Story = {
  args: { tabs: defaultTabs, variant: 'buttons' },
};
