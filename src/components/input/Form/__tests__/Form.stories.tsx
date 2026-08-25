import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { Form } from '../Form';
import { useForm } from '../../../../hooks/useForm';
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

const signupSchema = z.object({
  email: z.string().email('Enter a valid email'),
  username: z.string().min(3, 'At least 3 characters'),
});

/**
 * Fully controlled wiring: useForm owns values + validation, inputs stay
 * standard controlled azimuth components. Errors stay hidden until a field
 * is touched (blur) or the form is submitted.
 */
export const WithUseForm: Story = {
  render: () => {
    const form = useForm({
      schema: signupSchema,
      defaultValues: { email: '', username: '' },
      onSubmit: (values) => {
        console.log('submitted', values);
      },
    });

    return (
      // <Form form={form}> routes submits through handleSubmit and feeds
      // form.errors to Form.Field (matched by label, case-insensitive)
      <Form form={form}>
        <Stack>
          <Form.Field label="email">
            <Input
              placeholder="you@example.com"
              value={form.values.email}
              onChange={(v) => form.setValue('email', v)}
              onBlur={() => form.setTouched('email')}
            />
          </Form.Field>
          <Form.Field label="username">
            <Input
              placeholder="Choose a username"
              value={form.values.username}
              onChange={(v) => form.setValue('username', v)}
              onBlur={() => form.setTouched('username')}
            />
          </Form.Field>
          <Stack direction="horizontal" justify="between" align="center">
            <Button type="submit" disabled={!form.isValid || form.isSubmitting}>
              {form.isSubmitting ? 'Signing up…' : 'Sign up'}
            </Button>
            <Button variant="secondary" onClick={() => form.reset()}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Form>
    );
  },
};
