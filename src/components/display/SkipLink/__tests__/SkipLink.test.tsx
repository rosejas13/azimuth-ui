import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { SkipLink } from '../SkipLink';

describe('SkipLink', () => {
  it('renders with default text', () => {
    render(<SkipLink />);
    expect(screen.getByText('Skip to content')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(<SkipLink>Skip navigation</SkipLink>);
    expect(screen.getByText('Skip navigation')).toBeInTheDocument();
  });

  it('sets href attribute', () => {
    render(<SkipLink />);
    expect(screen.getByText('Skip to content')).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('accepts custom href', () => {
    render(<SkipLink href="#content" />);
    expect(screen.getByText('Skip to content')).toHaveAttribute(
      'href',
      '#content',
    );
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<SkipLink ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('applies CSS module class', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to content');
    expect(link.getAttribute('class')).toBeTruthy();
  });

  it('is visible on focus', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to content');
    link.focus();
    expect(document.activeElement).toBe(link);
  });

  it('applies custom className', () => {
    render(<SkipLink className="my-skip" />);
    expect(screen.getByText('Skip to content')).toHaveClass('my-skip');
  });

  it('passes additional props', () => {
    render(<SkipLink data-testid="skip-link" />);
    expect(screen.getByTestId('skip-link')).toBeInTheDocument();
  });
});
