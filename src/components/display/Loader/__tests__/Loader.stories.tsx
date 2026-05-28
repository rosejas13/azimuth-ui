import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from '../Loader';

const meta: Meta<typeof Loader> = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['circle', 'bar'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const CircleSmall: Story = { args: { size: 'sm' } };
export const CircleMedium: Story = { args: { size: 'md' } };
export const CircleLarge: Story = { args: { size: 'lg' } };
export const Bar: Story = { args: { variant: 'bar', label: 'Loading...' } };
