import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MapDisplay } from './MapDisplay';

describe('MapDisplay', () => {
  it('renders iframe when src provided', () => {
    render(<MapDisplay src="https://maps.example.com" />);
    expect(screen.getByTitle('Map')).toBeInTheDocument();
    expect(screen.getByTitle('Map').tagName).toBe('IFRAME');
  });

  it('renders placeholder grid when no src', () => {
    const { container } = render(<MapDisplay />);
    const grid = container.querySelector('[class*="placeholderGrid"]');
    expect(grid).toBeInTheDocument();
  });

  it('renders title as accessible name', () => {
    render(<MapDisplay title="World Map" />);
    expect(screen.getByLabelText('World Map')).toBeInTheDocument();
  });

  it('respects height and width props', () => {
    const { container } = render(
      <MapDisplay height="500px" width="80%" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.height).toBe('500px');
    expect(root.style.width).toBe('80%');
  });

  it('shows placeholder with grid pattern', () => {
    const { container } = render(<MapDisplay />);
    const grid = container.querySelector('[class*="placeholderGrid"]');
    expect(grid).toBeInTheDocument();
    const compassRose = container.querySelector('[class*="compassRose"]');
    expect(compassRose).toBeInTheDocument();
  });

  it('renders markers when provided', () => {
    const markers = [
      { position: { lat: 40.7128, lng: -74.006 }, label: 'NYC', color: '#ff0000' },
      { position: { lat: 34.0522, lng: -118.2437 }, label: 'LA' },
    ];
    render(<MapDisplay markers={markers} />);
    expect(screen.getByLabelText('NYC')).toBeInTheDocument();
    expect(screen.getByLabelText('LA')).toBeInTheDocument();
  });

  it('toggles interactivity', () => {
    const { container: interactive } = render(
      <MapDisplay src="https://maps.example.com" interactive={true} />,
    );
    expect(interactive.querySelector('iframe')).toBeInTheDocument();

    const { container: staticContainer } = render(
      <MapDisplay src="https://maps.example.com" interactive={false} />,
    );
    expect(staticContainer.querySelector('img')).toBeInTheDocument();
  });

  it('renders compass rose elements', () => {
    const { container } = render(<MapDisplay />);
    expect(screen.getByText('N')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText('W')).toBeInTheDocument();
    const compassLines = container.querySelector('[class*="compassLines"]');
    expect(compassLines).toBeInTheDocument();
  });
});
