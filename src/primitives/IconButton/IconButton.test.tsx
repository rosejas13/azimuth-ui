import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders with icon', () => {
    render(<IconButton icon={<span data-testid="icon" />} aria-label="Close" />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('sets aria-label', () => {
    render(<IconButton icon={<span />} aria-label="Delete" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('applies variant', () => {
    render(<IconButton icon={<span />} aria-label="Edit" variant="primary" />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('primary');
  });

  it('forwards click handler', async () => {
    let clicked = false;
    render(<IconButton icon={<span />} aria-label="Test" onClick={() => { clicked = true; }} />);
    screen.getByRole('button').click();
    expect(clicked).toBe(true);
  });

  it('can be disabled', () => {
    render(<IconButton icon={<span />} aria-label="Disabled" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
