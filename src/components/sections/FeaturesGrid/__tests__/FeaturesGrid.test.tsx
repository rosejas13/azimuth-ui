import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeaturesGrid } from '../FeaturesGrid';

const mockFeatures = [
  {
    icon: '⚡',
    title: 'Fast Performance',
    description: 'Optimized for speed.',
  },
  { title: 'Reliable', description: 'Built to last.' },
  {
    icon: '🔒',
    title: 'Secure by Default',
    description: 'Enterprise-grade security.',
  },
];

describe('FeaturesGrid', () => {
  it('renders title', () => {
    render(<FeaturesGrid features={mockFeatures} title="Features" />);
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <FeaturesGrid
        features={mockFeatures}
        title="Title"
        subtitle="Our Capabilities"
      />,
    );
    expect(screen.getByText('Our Capabilities')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <FeaturesGrid
        features={mockFeatures}
        title="Title"
        description="What we offer"
      />,
    );
    expect(screen.getByText('What we offer')).toBeInTheDocument();
  });

  it('renders all features with correct count', () => {
    render(<FeaturesGrid features={mockFeatures} />);
    expect(screen.getByText('Fast Performance')).toBeInTheDocument();
    expect(screen.getByText('Reliable')).toBeInTheDocument();
    expect(screen.getByText('Secure by Default')).toBeInTheDocument();
    expect(screen.getAllByRole('heading')).toHaveLength(3);
  });

  it('renders feature icons as aria-hidden', () => {
    render(<FeaturesGrid features={mockFeatures} />);
    const icons = document.querySelectorAll('[aria-hidden="true"]');
    expect(icons).toHaveLength(2);
  });

  it('renders without header when no title, subtitle, or description', () => {
    const { container } = render(<FeaturesGrid features={mockFeatures} />);
    const header = container.querySelector('header');
    expect(header).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FeaturesGrid features={mockFeatures} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies section id', () => {
    const { container } = render(
      <FeaturesGrid features={mockFeatures} id="features-grid" />,
    );
    expect(container.firstChild).toHaveAttribute('id', 'features-grid');
  });

  it('applies variant class', () => {
    const { container } = render(
      <FeaturesGrid features={mockFeatures} variant="dark" />,
    );
    expect(container.firstChild).toHaveClass('dark');
  });

  it('renders correct column class for columns=2', () => {
    const { container } = render(
      <FeaturesGrid features={mockFeatures} columns={2} />,
    );
    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toBeInTheDocument();
  });

  it('handles empty features array', () => {
    const { container } = render(<FeaturesGrid features={[]} />);
    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<FeaturesGrid features={mockFeatures} />);
    expect(screen.getByText('Optimized for speed.')).toBeInTheDocument();
    expect(screen.getByText('Built to last.')).toBeInTheDocument();
    expect(screen.getByText('Enterprise-grade security.')).toBeInTheDocument();
  });

  it('renders as section element', () => {
    const { container } = render(<FeaturesGrid features={mockFeatures} />);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });
});
