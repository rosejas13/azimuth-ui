import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PricingTable } from '../PricingTable';

const mockTiers = [
  {
    name: 'Starter',
    price: '$19/mo',
    description: 'For small teams.',
    features: ['1 project', '10GB storage'],
    cta: { label: 'Get Started', href: '/start' },
  },
  {
    name: 'Pro',
    price: '$49/mo',
    description: 'For growing teams.',
    features: ['Unlimited projects', '100GB storage', 'Priority support'],
    highlighted: true,
    badge: 'Popular',
    cta: { label: 'Get Pro', href: '/pro' },
  },
  {
    name: 'Enterprise',
    price: '$149/mo',
    features: ['Everything in Pro', 'Custom integrations', 'SLA'],
    cta: { label: 'Contact Sales', onClick: () => {} },
  },
];

describe('PricingTable', () => {
  it('renders title', () => {
    render(<PricingTable tiers={mockTiers} title="Pricing" />);
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <PricingTable
        tiers={mockTiers}
        title="Title"
        subtitle="Plans & Pricing"
      />,
    );
    expect(screen.getByText('Plans & Pricing')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <PricingTable
        tiers={mockTiers}
        title="Title"
        description="Choose your plan"
      />,
    );
    expect(screen.getByText('Choose your plan')).toBeInTheDocument();
  });

  it('renders all tier names', () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('renders tier prices', () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText('$19/mo')).toBeInTheDocument();
    expect(screen.getByText('$49/mo')).toBeInTheDocument();
    expect(screen.getByText('$149/mo')).toBeInTheDocument();
  });

  it('renders tier descriptions when provided', () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText('For small teams.')).toBeInTheDocument();
    expect(screen.getByText('For growing teams.')).toBeInTheDocument();
  });

  it('renders feature lists for all tiers', () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText('1 project')).toBeInTheDocument();
    expect(screen.getByText('10GB storage')).toBeInTheDocument();
    expect(screen.getByText('Unlimited projects')).toBeInTheDocument();
    expect(screen.getByText('Priority support')).toBeInTheDocument();
  });

  it('renders badge on highlighted tier', () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('renders CTA as link when href is provided', () => {
    render(<PricingTable tiers={mockTiers} />);
    const link = screen.getByText('Get Started').closest('a');
    expect(link).toHaveAttribute('href', '/start');
  });

  it('renders CTA as button when onClick is provided', () => {
    render(<PricingTable tiers={mockTiers} />);
    expect(screen.getByText('Contact Sales')).toBeInTheDocument();
  });

  it('calls onClick when CTA button is clicked', () => {
    const onClick = vi.fn();
    const tiers = [
      {
        name: 'Test',
        price: '$0',
        features: [],
        cta: { label: 'Click Me', onClick },
      },
    ];
    render(<PricingTable tiers={tiers} />);
    const button = screen.getByText('Click Me');
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PricingTable tiers={mockTiers} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies section id', () => {
    const { container } = render(
      <PricingTable tiers={mockTiers} id="pricing-table" />,
    );
    expect(container.firstChild).toHaveAttribute('id', 'pricing-table');
  });

  it('applies variant class', () => {
    const { container } = render(
      <PricingTable tiers={mockTiers} variant="dark" />,
    );
    expect(container.firstChild).toHaveClass('dark');
  });

  it('renders without header when no title, subtitle, or description', () => {
    const { container } = render(<PricingTable tiers={mockTiers} />);
    const header = container.querySelector('header');
    expect(header).not.toBeInTheDocument();
  });

  it('renders as section element', () => {
    const { container } = render(<PricingTable tiers={mockTiers} />);
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('renders monthly/annual note for each tier', () => {
    render(<PricingTable tiers={mockTiers} />);
    const notes = screen.getAllByText('Billed monthly or annually');
    expect(notes).toHaveLength(3);
  });
});
