import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders a nav with breadcrumb label', () => {
    render(<Breadcrumbs items={[{ label: 'Home', href: '/' }]} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
  });

  it('renders all items as links except the last', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Details' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Details' })).toBeNull();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('marks the last item with aria-current', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Current' },
        ]}
      />,
    );

    const current = screen.getByText('Current');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('renders separators between items', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Current' },
        ]}
        separator=">"
      />,
    );

    const separators = screen.getAllByText('>');
    expect(separators).toHaveLength(2);
  });

  it('renders a single item without separators', () => {
    render(<Breadcrumbs items={[{ label: 'Home' }]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('/')).toBeNull();
  });

  it('truncates with ellipsis when maxItems is set', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      label: `Page ${i + 1}`,
      href: `/page/${i + 1}`,
    }));

    render(<Breadcrumbs items={items} maxItems={4} />);

    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('Page 9')).toBeInTheDocument();
    expect(screen.getByText('Page 10')).toBeInTheDocument();
    expect(screen.queryByText('Page 2')).toBeNull();
    expect(screen.queryByText('Page 5')).toBeNull();
  });

  it('does not truncate when items fit within maxItems', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Current' },
        ]}
        maxItems={5}
      />,
    );

    expect(screen.queryByText('...')).toBeNull();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'Home' }]}
        className="custom-breadcrumbs"
      />,
    );

    expect(screen.getByRole('navigation')).toHaveClass('custom-breadcrumbs');
  });

  it('renders without href on intermediate items', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'No Link' },
          { label: 'Current' },
        ]}
      />,
    );

    expect(screen.getByText('No Link')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'No Link' })).toBeNull();
  });

  it('renders children alongside items', () => {
    render(
      <Breadcrumbs items={[{ label: 'Home' }]}>
        <li data-testid="extra">Extra</li>
      </Breadcrumbs>,
    );

    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });
});
