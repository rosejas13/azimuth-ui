import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextBox } from '../TextBox';

describe('TextBox', () => {
  it('has region role', () => {
    render(<TextBox>Content</TextBox>);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<TextBox>Hello world</TextBox>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders plain variant by default', () => {
    const { container } = render(<TextBox>Content</TextBox>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders code variant', () => {
    const { container } = render(<TextBox variant="code">const x = 1;</TextBox>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders plain variant explicitly', () => {
    const { container } = render(<TextBox variant="plain">Notes</TextBox>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TextBox className="my-box">Content</TextBox>);
    const el = screen.getByText('Content');
    expect(el).toHaveClass('my-box');
  });

  it('renders HTML content', () => {
    render(
      <TextBox>
        <strong>Bold</strong> text
      </TextBox>,
    );
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
