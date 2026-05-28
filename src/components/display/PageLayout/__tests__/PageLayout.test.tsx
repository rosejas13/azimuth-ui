import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
      <PageLayout
        sidebar={<div>Right sidebar</div>}
        sidebarPosition="right"
      >
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
    const layout = screen.getByText('Content').closest('[class*="sidebarRight"]');
    expect(layout).toBeTruthy();
  });
});
