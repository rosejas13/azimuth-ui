import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup } from '../InputGroup';
import { Input } from '../../Input/Input';
import { Button } from '../../Button/Button';

const meta: Meta<typeof InputGroup> = {
  title: 'Components/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: () => (
    <InputGroup>
      <Input placeholder="First name" />
      <Input placeholder="Last name" />
    </InputGroup>
  ),
};

export const WithLeftAddon: Story = {
  render: () => (
    <InputGroup>
      <Button
        variant="secondary"
        disabled
        style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}
      >
        https://
      </Button>
      <Input placeholder="example.com" style={{ borderRadius: 0 }} />
    </InputGroup>
  ),
};

export const WithRightAddon: Story = {
  render: () => (
    <InputGroup>
      <Input
        placeholder="Search..."
        style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}
      />
      <Button style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
        &#128269;
      </Button>
    </InputGroup>
  ),
};

export const WithBothAddons: Story = {
  render: () => (
    <InputGroup>
      <Button
        variant="secondary"
        disabled
        style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}
      >
        $
      </Button>
      <Input type="number" placeholder="0.00" style={{ borderRadius: 0 }} />
      <Button
        variant="secondary"
        disabled
        style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
      >
        USD
      </Button>
    </InputGroup>
  ),
};
