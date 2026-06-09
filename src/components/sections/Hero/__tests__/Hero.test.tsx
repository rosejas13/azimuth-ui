import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('renders title', () => {
    render(<Hero title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Hero title="Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<Hero title="Title" description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders primary action button', () => {
    render(
      <Hero title="Title" primaryAction={{ label: 'Primary', href: '#' }} />,
    );
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('renders secondary action button', () => {
    render(
      <Hero
        title="Title"
        secondaryAction={{ label: 'Secondary', href: '#' }}
      />,
    );
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('renders with backgroundImage', () => {
    const { container } = render(
      <Hero title="Title" backgroundImage="https://example.com/bg.jpg" />,
    );
    const section = container.firstChild as HTMLElement;
    expect(section.style.backgroundImage).toContain('example.com/bg.jpg');
  });

  it('split layout renders media', () => {
    render(
      <Hero
        title="Title"
        layout="split"
        media={{ src: 'https://example.com/img.jpg', alt: 'Test image' }}
      />,
    );
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Hero title="Title" className="custom-hero" />,
    );
    expect(container.firstChild).toHaveClass('custom-hero');
  });

  it('applies section id', () => {
    const { container } = render(<Hero title="Title" id="hero-section" />);
    expect(container.firstChild).toHaveAttribute('id', 'hero-section');
  });

  it('variant applies correct class', () => {
    const { container } = render(<Hero title="Title" variant="dark" />);
    expect(container.firstChild).toHaveClass('dark');
  });
});
