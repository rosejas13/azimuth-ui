import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../Footer';

const mockBrand = {
  name: 'Azimuth',
  description: 'A modern platform for building applications.',
};

const mockColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Help Center', href: '/help' },
    ],
  },
];

const mockSocialLinks = [
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'GitHub', href: 'https://github.com' },
];

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer brand={mockBrand} />);
    expect(screen.getByText('Azimuth')).toBeInTheDocument();
  });

  it('renders brand description', () => {
    render(<Footer brand={mockBrand} />);
    expect(
      screen.getByText('A modern platform for building applications.'),
    ).toBeInTheDocument();
  });

  it('renders column titles and links', () => {
    render(<Footer columns={mockColumns} />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer copyright="© 2024 Azimuth. All rights reserved." />);
    expect(
      screen.getByText('© 2024 Azimuth. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('renders newsletter text', () => {
    render(<Footer newsletterText="Stay up to date" />);
    expect(screen.getByText('Stay up to date')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Footer className="custom-footer" />);
    expect(container.firstChild).toHaveClass('custom-footer');
  });

  it('applies section id', () => {
    const { container } = render(<Footer id="footer-section" />);
    expect(container.firstChild).toHaveAttribute('id', 'footer-section');
  });

  it('applies variant class', () => {
    const { container } = render(<Footer variant="dark" />);
    expect(container.firstChild).toHaveClass('dark');
  });

  it('renders as footer element', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild?.nodeName).toBe('FOOTER');
  });

  it('renders without optional props', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
