import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginSignup } from '../LoginSignup';
import type { AuthProvider } from '../LoginSignup';

const providers: AuthProvider[] = [
  { id: 'google', label: 'Google', icon: <span>G</span> },
  { id: 'github', label: 'GitHub', icon: <span>GH</span>, color: '#333' },
];

describe('LoginSignup', () => {
  it('renders login view by default', () => {
    render(<LoginSignup />);
    expect(screen.getByRole('form', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
  });

  it('renders signup view', async () => {
    const user = userEvent.setup();
    render(<LoginSignup />);
    await user.click(screen.getByRole('tab', { name: 'Sign up' }));
    expect(screen.getByRole('form', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders with defaultView="signup"', () => {
    render(<LoginSignup defaultView="signup" />);
    expect(screen.getByRole('form', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('calls onLogin with form data on submit', async () => {
    const onLogin = vi.fn();
    const user = userEvent.setup();
    render(<LoginSignup auth={{ onLogin }} />);
    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByLabelText('Remember me'));
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    expect(onLogin).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'secret',
      remember: true,
    });
  });

  it('calls onSignup with form data on submit', async () => {
    const onSignup = vi.fn();
    const user = userEvent.setup();
    render(<LoginSignup defaultView="signup" auth={{ onSignup }} />);
    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Email'), 'john@test.com');
    await user.type(screen.getByLabelText('Password'), 'pass');
    await user.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(onSignup).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@test.com',
      password: 'pass',
    });
  });

  it('switches to reset view and back', async () => {
    const user = userEvent.setup();
    render(<LoginSignup />);
    await user.click(screen.getByRole('button', { name: 'Forgot password?' }));
    expect(screen.getByRole('form', { name: 'Reset password' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '← Back to log in' }));
    expect(screen.getByRole('form', { name: 'Log in' })).toBeInTheDocument();
  });

  it('calls onResetPassword on reset submit', async () => {
    const onResetPassword = vi.fn();
    const user = userEvent.setup();
    render(<LoginSignup auth={{ onResetPassword }} />);
    await user.click(screen.getByRole('button', { name: 'Forgot password?' }));
    await user.type(screen.getByLabelText('Email'), 'reset@test.com');
    await user.click(
      screen.getByRole('button', { name: 'Send reset link' }),
    );
    expect(onResetPassword).toHaveBeenCalledWith({
      email: 'reset@test.com',
    });
  });

  it('displays error message', () => {
    render(<LoginSignup status={{ error: 'Invalid credentials' }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('disables submit button when loading', () => {
    render(<LoginSignup status={{ loading: true }} />);
    expect(screen.getByRole('button', { name: 'Log in' })).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    render(<LoginSignup status={{ loading: true }} />);
    const button = screen.getByRole('button', { name: 'Log in' });
    expect(button.querySelector('[class*="spinner"]')).toBeInTheDocument();
  });

  it('renders provider buttons', () => {
    render(<LoginSignup social={{ providers }} />);
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'GitHub' }),
    ).toBeInTheDocument();
  });

  it('calls onProviderAuth when clicking a provider', async () => {
    const onProviderAuth = vi.fn();
    const user = userEvent.setup();
    render(
      <LoginSignup social={{ providers, onProviderAuth }} />,
    );
    await user.click(screen.getByRole('button', { name: 'Google' }));
    expect(onProviderAuth).toHaveBeenCalledWith('google');
  });

  it('does not render providers section when empty', () => {
    render(<LoginSignup />);
    expect(screen.queryByText('Or continue with')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <LoginSignup className="my-auth" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('my-auth');
  });

  it('toggle tabs have correct aria attributes', () => {
    render(<LoginSignup />);
    const loginTab = screen.getByRole('tab', { name: 'Log in' });
    const signupTab = screen.getByRole('tab', { name: 'Sign up' });
    expect(loginTab).toHaveAttribute('aria-selected', 'true');
    expect(signupTab).toHaveAttribute('aria-selected', 'false');
  });

  it('hides tabs in reset view', () => {
    render(<LoginSignup defaultView="reset" />);
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });
});
