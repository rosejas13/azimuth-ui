import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Form } from '../Form';

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
        <Form.Field label="Email" helpText="Enter your email" error="Invalid email">
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
});
