import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Navbar } from './Navbar';

const ITEMS = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'contact', label: 'Contact', href: '/contact' },
];

describe('Navbar', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1024);
    window.dispatchEvent(new Event('resize'));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders logo', () => {
    render(<Navbar logo="Azimuth" items={ITEMS} />);
    expect(screen.getByText('Azimuth')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar logo="Azimuth" items={ITEMS} />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('marks active item', () => {
    render(<Navbar logo="Azimuth" items={ITEMS} activeKey="about" />);
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders actions slot', () => {
    render(
      <Navbar
        logo="Azimuth"
        items={ITEMS}
        actions={<button>Theme</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument();
  });

  it('shows hamburger on mobile', () => {
    vi.stubGlobal('innerWidth', 400);
    window.dispatchEvent(new Event('resize'));

    render(<Navbar logo="Azimuth" items={ITEMS} />);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('opens mobile drawer on hamburger click', async () => {
    vi.stubGlobal('innerWidth', 400);
    window.dispatchEvent(new Event('resize'));

    const user = userEvent.setup();
    render(<Navbar logo="Azimuth" items={ITEMS} />);
    await user.click(screen.getByLabelText('Open menu'));

    expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument();
  });

  it('closes mobile drawer on X click', async () => {
    vi.stubGlobal('innerWidth', 400);
    window.dispatchEvent(new Event('resize'));

    const user = userEvent.setup();
    render(<Navbar logo="Azimuth" items={ITEMS} />);
    await user.click(screen.getByLabelText('Open menu'));

    const closeBtn = screen.getByRole('button', { name: 'Close drawer' });
    await user.click(closeBtn);

    expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument();
  });

  it('has navigation aria label', () => {
    render(<Navbar logo="Azimuth" items={ITEMS} />);
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Navbar logo="Azimuth" items={ITEMS} className="my-nav" />,
    );
    expect(container.firstChild).toHaveClass('my-nav');
  });
});
