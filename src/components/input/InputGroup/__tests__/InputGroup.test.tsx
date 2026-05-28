import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputGroup } from '../InputGroup';

describe('InputGroup', () => {
  it('renders children', () => {
    render(
      <InputGroup>
        <input type="text" placeholder="First" />
        <input type="text" placeholder="Second" />
      </InputGroup>,
    );
    expect(screen.getByPlaceholderText('First')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Second')).toBeInTheDocument();
  });

  it('applies role group', () => {
    render(
      <InputGroup>
        <button type="button">A</button>
        <button type="button">B</button>
      </InputGroup>,
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <InputGroup className="my-group">
        <input type="text" placeholder="Input" />
      </InputGroup>,
    );
    const group = screen.getByRole('group');
    expect(group.className).toContain('my-group');
  });

  it('passes additional props', () => {
    render(
      <InputGroup data-testid="my-group">
        <input type="text" placeholder="Input" />
      </InputGroup>,
    );
    expect(screen.getByTestId('my-group')).toBeInTheDocument();
  });

  it('handles empty children', () => {
    const { container } = render(<InputGroup />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with buttons', () => {
    render(
      <InputGroup>
        <button type="button">Left</button>
        <input type="text" placeholder="Middle" />
        <button type="button">Right</button>
      </InputGroup>,
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Middle')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });
});
