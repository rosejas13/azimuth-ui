import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AddressInput } from '../AddressInput';
import type { AddressSuggestion, AddressValue } from '../AddressInput';

const SUGGESTIONS: AddressSuggestion[] = [
  {
    label: '1600 Amphitheatre Pkwy, Mountain View, CA 94043',
    value: {
      line1: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      postalCode: '94043',
      country: 'United States',
    },
  },
  {
    label: '1600 Court Pl, Denver, CO 80202',
    value: {
      line1: '1600 Court Pl',
      city: 'Denver',
      state: 'CO',
      postalCode: '80202',
      country: 'United States',
    },
  },
];

function MultiDemo() {
  const [address, setAddress] = useState<AddressValue | undefined>();
  return (
    <AddressInput
      value={address}
      onChange={setAddress}
      label="Business address"
      subtitle="Where is the work site located?"
      required
    />
  );
}

function SingleDemo() {
  const [address, setAddress] = useState<AddressValue | undefined>();
  return (
    <AddressInput
      layout="single"
      value={address}
      onChange={setAddress}
      label="Search for an address"
      placeholder="Start typing an address..."
      suggestions={{ options: SUGGESTIONS, onSelect: (s) => console.log(s) }}
    />
  );
}

const meta: Meta<typeof AddressInput> = {
  title: 'Primitives/AddressInput',
  component: AddressInput,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'radio', options: ['single', 'multi'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof AddressInput>;

export const Multi: Story = {
  render: () => <MultiDemo />,
};

export const Single: Story = {
  render: () => <SingleDemo />,
};

export const Error: Story = {
  args: {
    label: 'Business address',
    error: 'We could not verify this address. Check the postal code.',
  },
};
