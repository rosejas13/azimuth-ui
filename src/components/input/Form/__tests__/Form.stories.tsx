import type { Meta, StoryObj } from '@storybook/react';
import { Form } from '../Form';
import { Input } from '../../Input/Input';
import { Button } from '../../Button/Button';
import { Stack } from '../../../layout/Stack';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => (
    <Form onSubmit={(data) => console.log(data)}>
      <Stack>
        <Form.Field label="Full Name" required>
          <Input placeholder="Enter your name" />
        </Form.Field>
        <Form.Field
          label="Email"
          required
          helpText="We'll never share your email."
        >
          <Input type="email" placeholder="you@example.com" />
        </Form.Field>
        <Form.Field label="Message">
          <Input placeholder="Your message" />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Stack>
    </Form>
  ),
};

export const WithErrors: Story = {
  render: () => (
    <Form onSubmit={(data) => console.log(data)}>
      <Stack>
        <Form.Field
          label="Username"
          required
          error="Username is already taken."
        >
          <Input placeholder="Choose a username" />
        </Form.Field>
        <Form.Field
          label="Email"
          required
          error="Please enter a valid email address."
        >
          <Input type="email" placeholder="you@example.com" />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Stack>
    </Form>
  ),
};

export const CompactSpacing: Story = {
  render: () => (
    <Form spacing="sm" onSubmit={(data) => console.log(data)}>
      <Stack>
        <Form.Field label="Search">
          <Input placeholder="Search..." />
        </Form.Field>
        <Button size="sm" type="submit">
          Search
        </Button>
      </Stack>
    </Form>
  ),
};

export const WithHelpText: Story = {
  render: () => (
    <Form onSubmit={(data) => console.log(data)}>
      <Stack>
        <Form.Field
          label="Password"
          required
          helpText="Must be at least 8 characters."
        >
          <Input type="password" placeholder="••••••••" />
        </Form.Field>
        <Form.Field
          label="Confirm Password"
          required
          helpText="Re-enter your password."
        >
          <Input type="password" placeholder="••••••••" />
        </Form.Field>
        <Button type="submit">Create Account</Button>
      </Stack>
    </Form>
  ),
};
