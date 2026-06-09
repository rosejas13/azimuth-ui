import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from '../PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  argTypes: {
    defaultCountry: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  args: {
    label: 'Phone number',
    defaultCountry: 'US',
  },
};

export const WithError: Story = {
  args: {
    label: 'Phone number',
    defaultCountry: 'GB',
    error: 'Please enter a valid phone number',
  },
};

export const WithHelpText: Story = {
  args: {
    label: 'Phone number',
    defaultCountry: 'US',
    helpText: 'Enter your number including area code',
  },
};
