import type { Meta, StoryObj } from '@storybook/react';
import { TextBox } from '../TextBox';

const meta: Meta<typeof TextBox> = {
  title: 'Components/TextBox',
  component: TextBox,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['plain', 'code'] },
  },
};

export default meta;
type Story = StoryObj<typeof TextBox>;

export const Plain: Story = {
  args: {
    children:
      'This is a plain text box. It renders content with standard text styling.',
  },
};

export const Code: Story = {
  args: {
    variant: 'code',
    children:
      'const greeting = "Hello, World!";\nconsole.log(greeting);',
  },
};

export const LongContent: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
};
