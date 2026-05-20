import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('renders a textarea element', () => {
    render(<TextArea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<TextArea label="Bio" />);
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<TextArea label="Bio" required />);
    const label = screen.getByText('Bio');
    expect(label.className).toContain('required');
  });

  it('shows error message with role alert', () => {
    render(<TextArea label="Bio" error="Too short" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Too short');
  });

  it('applies aria-invalid when error present', () => {
    render(<TextArea error="Bad" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('is disabled', () => {
    render(<TextArea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<TextArea className="my-textarea" />);
    expect(document.querySelector('.my-textarea')).toBeInTheDocument();
  });

  it('fires onChange', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<TextArea onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders subtitle', () => {
    render(<TextArea label="Bio" subtitle="Tell us about yourself" />);
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
  });

  it('shows character count when maxLength and showCharCount provided', () => {
    render(<TextArea label="Bio" maxLength={100} showCharCount value="Hello" />);
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('does not show character count when showCharCount is false', () => {
    render(<TextArea label="Bio" maxLength={100} value="Hello" />);
    expect(screen.queryByText('5/100')).toBeNull();
  });

  it('applies size class', () => {
    render(<TextArea size="lg" />);
    expect(document.querySelector('.lg')).toBeInTheDocument();
  });

  it('renders rows attribute', () => {
    render(<TextArea rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });
});
