import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Kbd } from '../Kbd';

describe('Kbd', () => {
  it('renders children', () => {
    render(<Kbd>Ctrl</Kbd>);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
  });

  it('renders a kbd element', () => {
    render(<Kbd>Enter</Kbd>);
    const el = screen.getByText('Enter');
    expect(el.tagName).toBe('KBD');
  });

  it('applies custom className', () => {
    render(<Kbd className="my-kbd">⌘</Kbd>);
    expect(screen.getByText('⌘')).toHaveClass('my-kbd');
  });

  it('passes additional props', () => {
    render(<Kbd data-testid="kbd-key">A</Kbd>);
    expect(screen.getByTestId('kbd-key')).toBeInTheDocument();
  });
});
