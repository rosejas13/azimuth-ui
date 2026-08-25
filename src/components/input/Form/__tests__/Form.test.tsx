import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Form } from '../Form';
import { Input } from '../../Input/Input';
import { InputGroup } from '../../InputGroup/InputGroup';
import { Select } from '../../Select/Select';
import { DatePicker } from '../../../data/DatePicker/DatePicker';
import { Toggle } from '../../Toggle/Toggle';
import { useForm } from '../../../../hooks/useForm';
import { z } from 'zod';
import { useState } from 'react';

describe('Form', () => {
  it('renders a form element', () => {
    render(
      <Form>
        <Form.Field label="Name">
          <input type="text" />
        </Form.Field>
      </Form>,
    );
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(
      <Form>
        <Form.Field label="Email">
          <input type="email" />
        </Form.Field>
      </Form>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <Form>
        <Form.Field label="Name" required>
          <input type="text" />
        </Form.Field>
      </Form>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator by default', () => {
    render(
      <Form>
        <Form.Field label="Name">
          <input type="text" />
        </Form.Field>
      </Form>,
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders help text', () => {
    render(
      <Form>
        <Form.Field label="Password" helpText="Min 8 characters">
          <input type="password" />
        </Form.Field>
      </Form>,
    );
    expect(screen.getByText('Min 8 characters')).toBeInTheDocument();
  });

  it('renders error message with role alert', () => {
    render(
      <Form>
        <Form.Field label="Email" error="Invalid email">
          <input type="email" />
        </Form.Field>
      </Form>,
    );
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Invalid email');
  });

  it('does not show help text when error exists', () => {
    render(
      <Form>
        <Form.Field
          label="Email"
          helpText="Enter your email"
          error="Invalid email"
        >
          <input type="email" />
        </Form.Field>
      </Form>,
    );
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('calls onSubmit with form data on submit', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field label="Name">
          <input type="text" name="name" defaultValue="John" />
        </Form.Field>
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByText('Submit'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({ name: 'John' });
  });

  it('prevents default form submission', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field label="Name">
          <input type="text" name="name" />
        </Form.Field>
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByText('Submit'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('handles multiple form fields', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <Form onSubmit={handleSubmit}>
        <Form.Field label="Name">
          <input type="text" name="name" defaultValue="Jane" />
        </Form.Field>
        <Form.Field label="Email">
          <input type="email" name="email" defaultValue="jane@test.com" />
        </Form.Field>
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByText('Submit'));
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Jane',
      email: 'jane@test.com',
    });
  });

  it('does not throw when onSubmit is undefined', async () => {
    const user = userEvent.setup();
    render(
      <Form>
        <Form.Field label="Name">
          <input type="text" name="name" defaultValue="Test" />
        </Form.Field>
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByText('Submit'));
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('renders children inside Form.Field', () => {
    render(
      <Form>
        <Form.Field label="Name">
          <input type="text" data-testid="name-input" />
        </Form.Field>
      </Form>,
    );
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
  });

  it('applies custom className to Form', () => {
    render(
      <Form className="custom-form">
        <Form.Field label="Name">
          <input type="text" />
        </Form.Field>
      </Form>,
    );
    expect(document.querySelector('.custom-form')).toBeInTheDocument();
  });

  it('applies custom className to Form.Field', () => {
    render(
      <Form>
        <Form.Field label="Name" className="custom-field" data-testid="field">
          <input type="text" />
        </Form.Field>
      </Form>,
    );
    expect(screen.getByTestId('field')).toHaveClass('custom-field');
  });

  it('applies spacing classes', () => {
    const { rerender } = render(
      <Form spacing="sm">
        <Form.Field label="Name">
          <input type="text" />
        </Form.Field>
      </Form>,
    );
    expect(document.querySelector('form')).toHaveClass('spacingSm');

    rerender(
      <Form spacing="lg">
        <Form.Field label="Name">
          <input type="text" />
        </Form.Field>
      </Form>,
    );
    expect(document.querySelector('form')).toHaveClass('spacingLg');
  });

  it('uses md spacing by default', () => {
    render(
      <Form>
        <Form.Field label="Name">
          <input type="text" />
        </Form.Field>
      </Form>,
    );
    expect(document.querySelector('form')).toHaveClass('spacingMd');
  });

  it('renders without label', () => {
    render(
      <Form>
        <Form.Field>
          <input type="text" data-testid="unlabeled-input" />
        </Form.Field>
      </Form>,
    );
    expect(screen.getByTestId('unlabeled-input')).toBeInTheDocument();
  });

  it('renders Form displayName correctly', () => {
    expect(Form.displayName).toBe('Form');
  });

  it('renders Form.Field displayName correctly', () => {
    expect(Form.Field.displayName).toBe('Form.Field');
  });

  it('inherits labelPosition to child inputs as the default', () => {
    render(
      <Form labelPosition="left">
        <Input label="First Name" />
        <Input label="Last Name" labelPosition="top" />
      </Form>,
    );
    const defaulted = screen
      .getByLabelText('First Name')
      .closest('[class*="wrapper"]');
    const overridden = screen
      .getByLabelText('Last Name')
      .closest('[class*="wrapper"]');
    expect(defaulted?.className).toContain('wrapperHorizontal');
    expect(overridden?.className).not.toContain('wrapperHorizontal');
  });

  it('inherits size down to a nested InputGroup and Select', () => {
    render(
      <Form size="sm">
        <InputGroup>
          <Input label="Nested" />
          <Select label="Country" options={[{ value: 'us', label: 'US' }]} />
        </InputGroup>
      </Form>,
    );
    const input = screen.getByLabelText('Nested').closest('[class*="wrapper"]');
    const select = screen
      .getByLabelText('Country')
      .closest('[class*="wrapper"]');
    expect(input?.className).toContain('sm');
    expect(select?.className).toContain('sm');
  });

  it('inherits xl size and inner labelPosition to child inputs', () => {
    render(
      <Form size="xl" labelPosition="inner">
        <Input label="Project" />
      </Form>,
    );
    const input = screen.getByLabelText('Project');
    const wrapper = input.closest('[class*="wrapper"]');
    expect(wrapper?.className).toMatch(/xl/);
    expect(wrapper?.className).toContain('wrapperInnerLabel');
  });
});

describe('Form.Field auto-wiring', () => {
  const schema = z.object({
    email: z.string().email(),
    username: z.string().min(3, 'At least 3 characters'),
  });

  it('injects value/onChange from the form hook by name and submits typed values', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    function Harness() {
      const form = useForm({
        schema,
        defaultValues: { email: '', username: '' },
        onSubmit,
      });
      return (
        <Form form={form}>
          <Form.Field name="email">
            <Input placeholder="email" />
          </Form.Field>
          <Form.Field name="username">
            <Input placeholder="username" />
          </Form.Field>
          <button type="submit">go</button>
        </Form>
      );
    }
    render(<Harness />);
    await user.type(screen.getByPlaceholderText('email'), 'jas@example.com');
    await user.type(screen.getByPlaceholderText('username'), 'abc');
    await user.click(screen.getByText('go'));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'jas@example.com', username: 'abc' }),
    );
  });

  it('falls back to the lowercased label as the field key', async () => {
    const user = userEvent.setup();
    function Harness() {
      const form = useForm({
        schema: z.object({ email: z.string() }),
        defaultValues: { email: '' },
      });
      return (
        <Form form={form}>
          <Form.Field label="Email">
            <Input placeholder="email" />
          </Form.Field>
        </Form>
      );
    }
    render(<Harness />);
    const input = screen.getByPlaceholderText('email');
    expect(input).toHaveValue('');
    await user.type(input, 'x');
    expect(input).toHaveValue('x');
  });

  it('reveals the validation error after blur via touched marking', async () => {
    const user = userEvent.setup();
    function Harness() {
      const form = useForm({
        schema: z.object({
          username: z.string().min(3, 'At least 3 characters'),
        }),
        defaultValues: { username: '' },
      });
      return (
        <Form form={form}>
          <Form.Field name="username">
            <Input placeholder="username" />
          </Form.Field>
        </Form>
      );
    }
    render(<Harness />);
    const input = screen.getByPlaceholderText('username');
    await user.type(input, 'ab');
    await user.tab();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'At least 3 characters',
    );
  });

  it('respects explicit value/onChange on the child (opt-out)', async () => {
    const user = userEvent.setup();
    function Harness() {
      const form = useForm({
        schema,
        defaultValues: { email: 'from-form', username: '' },
      });
      const [local, setLocal] = useState('local');
      return (
        <Form form={form}>
          <Form.Field name="email">
            <Input placeholder="email" value={local} onChange={setLocal} />
          </Form.Field>
        </Form>
      );
    }
    render(<Harness />);
    const input = screen.getByPlaceholderText('email');
    expect(input).toHaveValue('local');
    await user.type(input, '!');
    expect(input).toHaveValue('local!');
  });

  it('injects checked for boolean controls like Toggle', async () => {
    const user = userEvent.setup();
    let submitted: unknown;
    function Harness() {
      const form = useForm({
        schema: z.object({ notify: z.boolean() }),
        defaultValues: { notify: false },
        onSubmit: (v) => {
          submitted = v;
        },
      });
      return (
        <Form form={form}>
          <Form.Field name="notify">
            <Toggle label="Notify me" />
          </Form.Field>
          <button type="submit">go</button>
        </Form>
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole('switch'));
    await user.click(screen.getByText('go'));
    expect(submitted).toEqual({ notify: true });
  });
});

describe('self-registering fields (bare inputs with name)', () => {
  const schema = z.object({
    email: z.string().email(),
    notify: z.boolean(),
    when: z.date(),
  });

  it('wires a bare Input by name and submits typed values', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    function Harness() {
      const form = useForm({
        schema,
        defaultValues: {
          email: '',
          notify: false,
          when: new Date(2026, 0, 15),
        },
        onSubmit,
      });
      return (
        <Form form={form}>
          <Input name="email" placeholder="email" />
          <Toggle name="notify" label="Notify" />
          <button type="submit">go</button>
        </Form>
      );
    }
    render(<Harness />);
    await user.type(screen.getByPlaceholderText('email'), 'a@b.co');
    await user.click(screen.getByRole('switch'));
    await user.click(screen.getByText('go'));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'a@b.co', notify: true }),
    );
  });

  it('wires a bare DatePicker by name', () => {
    const onSubmit = vi.fn();
    function Harness() {
      const form = useForm({
        schema: z.object({ when: z.date() }),
        defaultValues: { when: new Date(2026, 0, 15) },
        onSubmit,
      });
      return (
        <Form form={form}>
          <DatePicker name="when" />
          <button type="submit">go</button>
        </Form>
      );
    }
    render(<Harness />);
    expect(screen.getByDisplayValue('January 15, 2026')).toBeInTheDocument();
  });

  it('stays inert without the form prop', () => {
    render(
      <Form>
        <Input name="email" placeholder="email" />
      </Form>,
    );
    const input = screen.getByPlaceholderText('email');
    expect(input).not.toHaveAttribute('value');
  });
});
