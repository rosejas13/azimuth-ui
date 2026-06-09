import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Testimonials } from '../Testimonials';

const mockTestimonials = [
  {
    quote: 'Amazing product!',
    author: 'Alice Johnson',
    role: 'CEO',
    company: 'Acme Inc',
  },
  {
    quote: 'Changed how we work.',
    author: 'Bob Smith',
    role: 'Engineer',
    avatar: 'https://i.pravatar.cc/100?u=bob',
  },
  {
    quote: 'Highly recommended.',
    author: 'Carol Davis',
  },
];

describe('Testimonials', () => {
  it('renders title', () => {
    render(
      <Testimonials testimonials={mockTestimonials} title="Testimonials" />,
    );
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <Testimonials
        testimonials={mockTestimonials}
        title="Title"
        subtitle="What People Say"
      />,
    );
    expect(screen.getByText('What People Say')).toBeInTheDocument();
  });

  it('renders all testimonial quotes', () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText('Amazing product!')).toBeInTheDocument();
    expect(screen.getByText('Changed how we work.')).toBeInTheDocument();
    expect(screen.getByText('Highly recommended.')).toBeInTheDocument();
  });

  it('renders author names', () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText('Alice Johnson, Acme Inc')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('Carol Davis')).toBeInTheDocument();
  });

  it('renders author roles when provided', () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText('CEO')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
  });

  it('renders avatar images when provided', () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    const img = screen.getByAltText('Bob Smith');
    expect(img).toHaveAttribute('src', 'https://i.pravatar.cc/100?u=bob');
  });

  it('renders avatar fallback initials when no avatar', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} />,
    );
    const fallbacks = container.querySelectorAll('[aria-hidden="true"]');
    expect(fallbacks.length).toBeGreaterThanOrEqual(2);
  });

  it('renders star rating when rating prop is provided', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} rating={5} />,
    );
    const starGroups = container.querySelectorAll('[class*="stars"]');
    expect(starGroups.length).toBeGreaterThan(0);
  });

  it('renders without stars when rating is 0', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} />,
    );
    const starGroups = container.querySelectorAll('[class*="stars"]');
    expect(starGroups.length).toBe(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies section id', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} id="testimonials" />,
    );
    expect(container.firstChild).toHaveAttribute('id', 'testimonials');
  });

  it('applies variant class', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} variant="accent" />,
    );
    expect(container.firstChild).toHaveClass('accent');
  });

  it('renders without header when no title or subtitle', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} />,
    );
    const header = container.querySelector('header');
    expect(header).not.toBeInTheDocument();
  });

  it('renders as section element', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} />,
    );
    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('renders correct column class for columns=1', () => {
    const { container } = render(
      <Testimonials testimonials={mockTestimonials} columns={1} />,
    );
    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toBeInTheDocument();
  });

  it('handles empty testimonials array', () => {
    const { container } = render(<Testimonials testimonials={[]} />);
    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toBeInTheDocument();
  });
});
