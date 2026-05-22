import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BreadcrumbPageHeader } from './BreadcrumbPageHeader';

const baseBreadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile' },
];

describe('BreadcrumbPageHeader', () => {
  it('renders breadcrumbs', () => {
    render(
      <BreadcrumbPageHeader
        title="Page Title"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders title as h1', () => {
    render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    const heading = screen.getByRole('heading', { name: 'Dashboard' });
    expect(heading.tagName).toBe('H1');
  });

  it('renders description when provided', () => {
    render(
      <BreadcrumbPageHeader
        title="Dashboard"
        description="Overview of your account"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    expect(screen.getByText('Overview of your account')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    expect(
      screen.queryByText('Overview of your account'),
    ).not.toBeInTheDocument();
  });

  it('renders actions slot when provided', () => {
    render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
        actions={<button type="button">Edit</button>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('does not render actions container when no actions provided', () => {
    const { container } = render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    const actionsDiv = container.querySelector('[class*="actions"]');
    expect(actionsDiv).toBeNull();
  });

  it('renders children content when provided', () => {
    render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      >
        <p>Additional content below</p>
      </BreadcrumbPageHeader>,
    );

    expect(screen.getByText('Additional content below')).toBeInTheDocument();
  });

  it('does not render content container when no children', () => {
    const { container } = render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    const contentDiv = container.querySelector('[class*="content"]');
    expect(contentDiv).toBeNull();
  });

  it('renders as a header element', () => {
    const { container } = render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    expect(container.firstElementChild?.tagName).toBe('HEADER');
  });

  it('applies custom className', () => {
    const { container } = render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
        className="custom-header"
      />,
    );

    expect(container.firstChild).toHaveClass('custom-header');
  });

  it('renders breadcrumb links for items with href', () => {
    render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');

    const settingsLink = screen.getByRole('link', { name: 'Settings' });
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('renders non-link breadcrumb for item without href', () => {
    render(
      <BreadcrumbPageHeader
        title="Dashboard"
        breadcrumbs={baseBreadcrumbs}
      />,
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Profile' }),
    ).not.toBeInTheDocument();
  });
});
