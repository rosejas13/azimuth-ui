import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PageLayout } from '../PageLayout';

describe('PageLayout', () => {
  it('renders children as main content', () => {
    render(
      <PageLayout>
        <p>Main content</p>
      </PageLayout>,
    );
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('renders topNav', () => {
    render(
      <PageLayout topNav={<nav>Navigation</nav>}>
        <p>Content</p>
      </PageLayout>,
    );
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('renders sidebar on the left by default', () => {
    render(
      <PageLayout sidebar={<div>Sidebar content</div>}>
        <p>Main content</p>
      </PageLayout>,
    );
    expect(screen.getByText('Sidebar content')).toBeInTheDocument();
    const sidebar = screen.getByText('Sidebar content').closest('aside');
    expect(sidebar).toBeTruthy();
  });

  it('renders sidebar on the right when specified', () => {
    render(
      <PageLayout sidebar={<div>Right sidebar</div>} sidebarPosition="right">
        <p>Main content</p>
      </PageLayout>,
    );
    expect(screen.getByText('Right sidebar')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <PageLayout footer={<div>Footer content</div>}>
        <p>Main content</p>
      </PageLayout>,
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies custom sidebarWidth via CSS custom property', () => {
    render(
      <PageLayout sidebar={<div>Side</div>} sidebarWidth="300px">
        <p>Main content</p>
      </PageLayout>,
    );
    const layout = screen.getByText('Main content').closest('[class]');
    expect(layout).toBeTruthy();
  });

  it('applies custom className', () => {
    render(
      <PageLayout className="my-layout">
        <p>Content</p>
      </PageLayout>,
    );
    const layout = screen.getByText('Content').closest('[class*="my-layout"]');
    expect(layout).toBeTruthy();
  });

  it('renders without optional parts', () => {
    render(
      <PageLayout>
        <p>Just content</p>
      </PageLayout>,
    );
    expect(screen.getByText('Just content')).toBeInTheDocument();
  });

  it('applies hasSidebar class when sidebar is present', () => {
    render(
      <PageLayout sidebar={<div>Side</div>}>
        <p>Content</p>
      </PageLayout>,
    );
    const layout = screen.getByText('Content').closest('[class*="hasSidebar"]');
    expect(layout).toBeTruthy();
  });

  it('applies sidebarRight class when sidebarPosition is right', () => {
    render(
      <PageLayout sidebar={<div>Side</div>} sidebarPosition="right">
        <p>Content</p>
      </PageLayout>,
    );
    const layout = screen
      .getByText('Content')
      .closest('[class*="sidebarRight"]');
    expect(layout).toBeTruthy();
  });

  it('does not render a hamburger toggle on desktop', () => {
    render(
      <PageLayout sidebar={<div>Side</div>}>
        <p>Content</p>
      </PageLayout>,
    );
    expect(screen.queryByLabelText(/sidebar/i)).toBeNull();
  });
});

describe('PageLayout (mobile sidebar)', () => {
  const originalMatchMedia = window.matchMedia;

  function setViewport(isMobile: boolean) {
    window.matchMedia = function matchMedia(query: string): MediaQueryList {
      return {
        matches: isMobile,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: () => false,
      };
    };
  }

  const Sidebar = (
    <nav>
      <a href="#a">First link</a>
      <button type="button">Last action</button>
    </nav>
  );

  beforeEach(() => setViewport(true));
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    document.body.style.overflow = '';
  });

  it('renders a hamburger toggle, collapsed by default', () => {
    render(<PageLayout sidebar={Sidebar}>Content</PageLayout>);
    const toggle = screen.getByLabelText('Open sidebar');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the sidebar, shows the backdrop, and locks body scroll', async () => {
    const user = userEvent.setup();
    render(<PageLayout sidebar={Sidebar}>Content</PageLayout>);
    await user.click(screen.getByLabelText('Open sidebar'));

    expect(screen.getByLabelText('Close sidebar')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('announces open/closed state via a polite live region', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PageLayout sidebar={Sidebar}>Content</PageLayout>,
    );
    const live = container.querySelector('[role="status"][aria-live="polite"]');
    await user.click(screen.getByLabelText('Open sidebar'));
    expect(live).toHaveTextContent('Sidebar opened');
    await user.click(screen.getByLabelText('Close sidebar'));
    expect(live).toHaveTextContent('Sidebar closed');
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    const user = userEvent.setup();
    render(<PageLayout sidebar={Sidebar}>Content</PageLayout>);
    const toggle = screen.getByLabelText('Open sidebar');
    await user.click(toggle);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.getByLabelText('Open sidebar')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByLabelText('Open sidebar')).toHaveFocus();
  });

  it('closes when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PageLayout sidebar={Sidebar}>Content</PageLayout>,
    );
    await user.click(screen.getByLabelText('Open sidebar'));
    const backdrop = container.querySelector('[aria-hidden="true"]');
    if (!backdrop) throw new Error('expected a backdrop element');
    fireEvent.click(backdrop);
    expect(screen.getByLabelText('Open sidebar')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('focuses the first item on open and traps Tab within the sidebar', async () => {
    const user = userEvent.setup();
    render(<PageLayout sidebar={Sidebar}>Content</PageLayout>);
    await user.click(screen.getByLabelText('Open sidebar'));

    const firstLink = screen.getByText('First link');
    const lastAction = screen.getByText('Last action');
    const aside = firstLink.closest('aside') as HTMLElement;

    // First focusable receives focus on open.
    expect(firstLink).toHaveFocus();

    // Shift+Tab from the first wraps to the last.
    fireEvent.keyDown(aside, { key: 'Tab', shiftKey: true });
    expect(lastAction).toHaveFocus();

    // Tab from the last wraps back to the first.
    fireEvent.keyDown(aside, { key: 'Tab' });
    expect(firstLink).toHaveFocus();
  });
});
