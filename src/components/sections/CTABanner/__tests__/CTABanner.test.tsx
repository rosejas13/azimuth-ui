import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CTABanner } from '../CTABanner';

describe('CTABanner', () => {
  const defaultAction = { label: 'Get Started', href: '#' };

  it('renders title', () => {
    render(<CTABanner title="Call to Action" primaryAction={defaultAction} />);
    expect(screen.getByText('Call to Action')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <CTABanner
        title="Title"
        description="This is a description"
        primaryAction={defaultAction}
      />,
    );
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<CTABanner title="Title" primaryAction={defaultAction} />);
    expect(screen.queryByText('description')).not.toBeInTheDocument();
  });

  it('renders primary action as link when href provided', () => {
    render(
      <CTABanner
        title="Title"
        primaryAction={{ label: 'Primary', href: '/get-started' }}
      />,
    );
    const link = screen.getByText('Primary').closest('a');
    expect(link).toHaveAttribute('href', '/get-started');
  });

  it('renders secondary action when provided', () => {
    render(
      <CTABanner
        title="Title"
        primaryAction={{ label: 'Primary', href: '#' }}
        secondaryAction={{ label: 'Secondary', href: '/learn' }}
      />,
    );
    const link = screen.getByText('Secondary').closest('a');
    expect(link).toHaveAttribute('href', '/learn');
  });

  it('does not render secondary action when not provided', () => {
    render(<CTABanner title="Title" primaryAction={defaultAction} />);
    expect(screen.queryByText('Secondary')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CTABanner
        title="Title"
        primaryAction={defaultAction}
        className="custom-cta"
      />,
    );
    expect(container.firstChild).toHaveClass('custom-cta');
  });

  it('applies section id', () => {
    const { container } = render(
      <CTABanner
        title="Title"
        primaryAction={defaultAction}
        id="cta-section"
      />,
    );
    expect(container.firstChild).toHaveAttribute('id', 'cta-section');
  });

  it('applies variant class', () => {
    const { container } = render(
      <CTABanner title="Title" primaryAction={defaultAction} variant="dark" />,
    );
    expect(container.firstChild).toHaveClass('dark');
  });

  it('renders primary action as button when onClick provided', () => {
    const onClick = vi.fn();
    render(
      <CTABanner title="Title" primaryAction={{ label: 'Click', onClick }} />,
    );
    const button = screen.getByText('Click');
    expect(button.tagName).toBe('BUTTON');
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as section element', () => {
    const { container } = render(
      <CTABanner title="Title" primaryAction={defaultAction} />,
    );
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });
});
